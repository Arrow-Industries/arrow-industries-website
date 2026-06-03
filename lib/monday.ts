"use server";

/* ============================================================================
   Monday.com — best-effort candidate sync for the Careers form.

   This module NEVER throws to its caller and NEVER blocks a submission. If
   anything is missing or fails, it logs and returns. The form/email flow is
   the source of truth; Monday is a convenience mirror.

   ENVIRONMENT VARIABLES
   ---------------------
   MONDAY_API_TOKEN   (required)  Personal/API v2 token. Sent verbatim in the
                                  Authorization header.
   MONDAY_BOARD_ID    (required)  Numeric id of the board to create items on.
   MONDAY_GROUP_ID    (optional)  Group id within the board (e.g. "topics").
                                  If omitted, Monday drops the item in the
                                  board's default group.
   MONDAY_COLUMN_MAP  (optional)  JSON object mapping our logical field keys to
                                  Monday column ids, e.g.
                                    {"email":"email_1","mobile":"phone","role":"text7"}
                                  Recognised logical keys:
                                    fullName, mobile, email, suburb, role,
                                    industryExperience, yearsExperience,
                                    workRights, licenceClass, forklift,
                                    tradeQualified, weldingTickets, readDrawings,
                                    drugAlcohol, availability, whyHire, message,
                                    score, category, attachmentNames
                                  Unknown keys are ignored. If unset/invalid, we
                                  omit column_values so item creation still works
                                  on ANY board, and ALL data is captured in an
                                  Update (post) on the new item instead.
   ============================================================================ */

const MONDAY_API_URL = "https://api.monday.com/v2";

export interface MondayCandidatePayload {
  fullName: string;
  mobile: string;
  email: string;
  suburb: string;
  role: string;
  industryExperience: string;
  yearsExperience: string;
  workRights: string;
  licenceClass: string;
  forklift: string;
  tradeQualified: string;
  weldingTickets: string;
  readDrawings: string;
  drugAlcohol: string;
  availability: string;
  whyHire: string;
  message: string;
  score: number;
  category: string;
  attachmentNames: string[];
}

function dash(v: string) {
  return v && v.length > 0 ? v : "—";
}

/** Build a Monday GraphQL JSON-string for column_values from MONDAY_COLUMN_MAP. */
function buildColumnValues(payload: MondayCandidatePayload): string | null {
  const raw = process.env.MONDAY_COLUMN_MAP;
  if (!raw) return null;

  let map: Record<string, string>;
  try {
    map = JSON.parse(raw);
  } catch (err) {
    console.warn("[monday] MONDAY_COLUMN_MAP is not valid JSON — ignoring:", err);
    return null;
  }
  if (!map || typeof map !== "object") return null;

  // Logical values, all stringified so they drop into text / long-text columns
  // safely. Users mapping to typed columns (email/phone/etc.) should map with
  // care — plain text is accepted by text columns.
  const values: Record<string, string> = {
    fullName: payload.fullName,
    mobile: payload.mobile,
    email: payload.email,
    suburb: payload.suburb,
    role: payload.role,
    industryExperience: payload.industryExperience,
    yearsExperience: payload.yearsExperience,
    workRights: payload.workRights,
    licenceClass: payload.licenceClass,
    forklift: payload.forklift,
    tradeQualified: payload.tradeQualified,
    weldingTickets: payload.weldingTickets,
    readDrawings: payload.readDrawings,
    drugAlcohol: payload.drugAlcohol,
    availability: payload.availability,
    whyHire: payload.whyHire,
    message: payload.message,
    score: String(payload.score),
    category: payload.category,
    attachmentNames: payload.attachmentNames.join(", "),
  };

  const columnValues: Record<string, string> = {};
  for (const [logicalKey, columnId] of Object.entries(map)) {
    if (typeof columnId !== "string" || !columnId) continue;
    if (!(logicalKey in values)) continue;
    const v = values[logicalKey];
    if (v && v.length > 0) columnValues[columnId] = v;
  }

  if (Object.keys(columnValues).length === 0) return null;
  return JSON.stringify(columnValues);
}

/** A complete, human-readable dump of the candidate for the item Update. */
function buildUpdateBody(payload: MondayCandidatePayload): string {
  return [
    "New job application (via website careers form)",
    "",
    `Score: ${payload.score} — ${payload.category}`,
    "(Reviewers may add +10 manually for a strong written response.)",
    "",
    "— Personal —",
    `Name: ${dash(payload.fullName)}`,
    `Mobile: ${dash(payload.mobile)}`,
    `Email: ${dash(payload.email)}`,
    `Suburb: ${dash(payload.suburb)}`,
    "",
    "— Role —",
    `Role of interest: ${dash(payload.role)}`,
    `Industry experience: ${dash(payload.industryExperience)}`,
    `Years experience: ${dash(payload.yearsExperience)}`,
    "",
    "— Qualifications & tickets —",
    `Australian work rights: ${dash(payload.workRights)}`,
    `Driver licence class: ${dash(payload.licenceClass)}`,
    `Forklift licence: ${dash(payload.forklift)}`,
    `Trade qualified: ${dash(payload.tradeQualified)}`,
    `Welding tickets: ${dash(payload.weldingTickets)}`,
    `Can read fabrication drawings: ${dash(payload.readDrawings)}`,
    `Can pass drug & alcohol test: ${dash(payload.drugAlcohol)}`,
    "",
    "— Availability —",
    `Availability / start date: ${dash(payload.availability)}`,
    "",
    "— Why should we hire you? —",
    dash(payload.whyHire),
    "",
    "— Additional notes —",
    dash(payload.message),
    "",
    "— Resume / attachments —",
    payload.attachmentNames.length > 0
      ? payload.attachmentNames.map((n) => `• ${n}`).join("\n")
      : "—",
  ].join("\n");
}

async function mondayRequest(
  token: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<unknown> {
  const res = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await res.json()) as {
    data?: Record<string, unknown>;
    errors?: unknown;
    error_message?: string;
  };

  if (!res.ok || json.errors || json.error_message) {
    throw new Error(
      `Monday API error (${res.status}): ${JSON.stringify(
        json.errors ?? json.error_message ?? json,
      )}`,
    );
  }
  return json.data;
}

/**
 * Best-effort: create a Monday item for the candidate and attach a full update.
 * Env-gated; never throws.
 */
export async function createMondayCandidate(
  payload: MondayCandidatePayload,
): Promise<void> {
  const token = process.env.MONDAY_API_TOKEN;
  const boardId = process.env.MONDAY_BOARD_ID;

  if (!token || !boardId) {
    console.warn("[monday] not configured — skipping");
    return;
  }

  try {
    const groupId = process.env.MONDAY_GROUP_ID;
    const columnValues = buildColumnValues(payload);
    const itemName = `${payload.fullName || "Applicant"} — ${
      payload.role || "Role unspecified"
    }`;

    // 1) create_item — group_id and column_values are optional.
    const createItemMutation = `
      mutation CreateItem(
        $boardId: ID!
        $groupId: String
        $itemName: String!
        $columnValues: JSON
      ) {
        create_item(
          board_id: $boardId
          group_id: $groupId
          item_name: $itemName
          column_values: $columnValues
        ) {
          id
        }
      }
    `;

    const createData = (await mondayRequest(token, createItemMutation, {
      boardId,
      groupId: groupId || null,
      itemName,
      columnValues: columnValues || null,
    })) as { create_item?: { id?: string } } | undefined;

    const itemId = createData?.create_item?.id;
    if (!itemId) {
      console.error("[monday] create_item returned no id — skipping update");
      return;
    }

    // 2) create_update — full plain-text dump so nothing is lost even with no
    //    column mapping configured.
    const createUpdateMutation = `
      mutation CreateUpdate($itemId: ID!, $body: String!) {
        create_update(item_id: $itemId, body: $body) {
          id
        }
      }
    `;

    await mondayRequest(token, createUpdateMutation, {
      itemId,
      body: buildUpdateBody(payload),
    });
  } catch (err) {
    console.error("[monday] createMondayCandidate failed:", err);
    return;
  }
}
