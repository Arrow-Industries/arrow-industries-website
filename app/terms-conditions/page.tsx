import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions for the Supply of Goods and Services",
  description:
    "Arrow Industries & Co terms and conditions for the supply of goods and services. Samaro Pty Ltd t/a Arrow Industries & Co.",
  path: "/terms-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Legal"
        heading="Terms & Conditions of Supply"
        body={`Arrow Industries & Co — Samaro Pty Ltd, ABN ${site.abn}.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms-conditions" },
        ]}
      />

      <section className="bg-ink py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-base leading-relaxed text-mute">

            {/* Issuer block */}
            <div className="mb-12 border border-line bg-ink-2 p-6 text-sm">
              <p className="font-display text-base font-bold text-bone">
                {site.tradingName}
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
                <dt className="text-mute">ABN</dt>
                <dd className="text-bone">{site.abn}</dd>
                <dt className="text-mute">Address</dt>
                <dd className="text-bone">
                  {site.address.line1}, {site.address.suburb}{" "}
                  {site.address.state} {site.address.postcode}
                </dd>
                <dt className="text-mute">Phone</dt>
                <dd className="text-bone">
                  <a href={site.phoneHref} className="hover:text-accent-text">
                    {site.phone}
                  </a>
                </dd>
                <dt className="text-mute">Email</dt>
                <dd className="text-bone">
                  <a href={site.emailHref} className="hover:text-accent-text">
                    {site.email}
                  </a>
                </dd>
              </dl>
            </div>

            {/* 1. Definitions */}
            <Section number="1" heading="Definitions">
              <P>In these terms and conditions:</P>
              <Definitions
                items={[
                  ["ACL", "means the Australian Consumer Law, set out in Schedule 2 of the Competition and Consumer Act 2010 (Cth)."],
                  ["Accepted Quotation", "means a Quotation which You have accepted in accordance with clause 4."],
                  ["Business Day", "means a day which is not a Saturday, Sunday or public holiday in Melbourne, Victoria."],
                  ["Consumer", "has the meaning given to it in section 3 of the ACL."],
                  ["Consequential Loss", "means any loss, damage or costs incurred by a party or any other person that is indirect or consequential, as well as loss of revenue; loss of income; loss of business; loss of profits; loss of production; loss of or damage to goodwill or credit; loss of business reputation, future reputation or publicity; loss of use; loss of interest; losses arising from claims by third parties; loss of or damage to credit rating; loss of anticipated savings and/or loss or denial of opportunity."],
                ]}
              />

              <Definition term="Confidential Information">
                <P>means:</P>
                <ListA
                  items={[
                    "each Quotation;",
                    "any information which is learned or acquired by a party in the performance of an Accepted Quotation; and",
                    "any information which is designated by the disclosing party as confidential or the other party knows or ought to know is confidential.",
                  ]}
                />
              </Definition>

              <Definition term="Force Majeure Event">
                <P>means an event beyond a party&rsquo;s reasonable control, including:</P>
                <ListA
                  start={4}
                  items={[
                    "an act of God, fire, flood, earthquake, natural disaster;",
                    "war, revolution, riots;",
                    "strike or other industrial action;",
                    "pandemic, epidemic;",
                    "any inability to source raw materials or labour; or",
                    "a government restraint.",
                  ]}
                />
              </Definition>

              <Definitions
                items={[
                  ["Goods", "means the goods to be supplied (if any) and their corresponding specifications (if any) as set out in an Accepted Quotation."],
                  ["Insolvency Event", "means a party becomes or threatens to become insolvent or bankrupt or enter into a compromise or arrangement with creditors or any form of external administration or is unable to pay its debts as and when they become due."],
                ]}
              />

              <Definition term="Intellectual Property Rights">
                <P>means:</P>
                <ListA
                  items={[
                    "inventions, discoveries and novel designs, whether or not registered or registrable as patents or designs, including developments or improvements of equipment, products, technology, processes, methods or techniques;",
                    "copyright (including future copyright) throughout the world in all literary works, artistic works, computer software and any other works or subject matter in which copyright subsists and may in the future subsist;",
                    "trade and service marks (whether registered or unregistered), business names, trade names, domain names, logos and get-up; and",
                    "proprietary rights under the Circuit Layouts Act 1989 (Cth).",
                  ]}
                />
              </Definition>

              <Definitions
                items={[
                  ["PPSA", "means the Personal Property Securities Act 2009 (Cth) and its regulations, any statutory instruments or binding determinations made under any of them and considerations, amendments, re-enactments, or replacements of any of them."],
                  ["Price", "means the price to be paid for the Goods and/or Services as set out in an Accepted Quotation."],
                  ["Services", "means the services to be supplied (if any) and their corresponding specifications (if any) as set out in an Accepted Quotation."],
                  ["Quotation", "means a written quotation which We provide to You which sets out the cost, scope and specifications of the Goods and/or Services to be supplied."],
                  ["Terms and Conditions", "means clauses 1 to 20 of these Terms and Conditions."],
                  ["We, Us or Our", "means Samaro Pty Ltd ACN 109 797 033, trading as Arrow Industries & Co."],
                  ["You or Your", "means the legal entity or individual who wishes to procure Goods and/or Services from Us as specified in a Quotation."],
                ]}
              />
            </Section>

            {/* 2. ACL */}
            <Section number="2" heading="ACL">
              <P>
                The ACL provides Consumers with a number of consumer guarantees that
                cannot be excluded or limited. These Terms and Conditions are therefore
                subject to, and will not apply to the extent that they limit or exclude,
                such consumer guarantees or any other rights which You may have under
                law which are not capable of being excluded (<B>Non-Excludable Rights</B>).
              </P>
            </Section>

            {/* 3. Priority */}
            <Section number="3" heading="Priority">
              <Subsection number="3.1" heading="Terms and Conditions">
                <ClauseA items={[
                  "If there is any inconsistency between the Terms and Conditions and an Accepted Quotation, the terms of the Accepted Quotation will prevail.",
                  "For clarity, any document which You provide to Us (including any purchase order) which purports to govern the provision of the Goods and/or Services or which incorporates any other terms and conditions will be of no effect unless expressly agreed in writing by both parties.",
                ]} />
              </Subsection>
            </Section>

            {/* 4. Supply */}
            <Section number="4" heading="Supply">
              <Subsection number="4.1" heading="Issuing a quotation">
                <ClauseA items={[
                  "You can request a Quotation from Us any time You wish to engage Us to provide You with Goods and/or Services.",
                  <>Each Quotation We issue is open and valid for <B>30 (thirty)</B> days from the date of the Quotation (or for any other longer period of time stated on the Quotation) (<B>Quotation Validity Period</B>).</>,
                  "A Quotation that is not accepted within the Quotation Validity Period is deemed to have expired and is no longer able to be accepted, unless We otherwise agree in writing.",
                  "A verbal estimate that We provide to You is not a Quotation for the purposes of this clause 4 and will not be binding on Us.",
                ]} />
              </Subsection>

              <Subsection number="4.2" heading="Acceptance">
                <ClauseA items={[
                  <>You may accept a Quotation by providing Us notice in writing at any time within the Quotation Validity Period. Any accepted Quotation will become an &ldquo;<B>Accepted Quotation</B>&rdquo; for the purposes of these Terms and Conditions. Once a Quotation becomes an Accepted Quotation (subject to these Terms and Conditions) We will provide the Goods and/or Services in accordance with any Accepted Quotation and these Terms and Conditions.</>,
                  "Unless otherwise specified on the Quotation, subject to this clause, Quotations are valid from 30 days of issue. We reserve the right to withdraw, amend, or modify a Quotation at any time prior to the Quotation becoming an Accepted Quotation. This will only occur in circumstances where the cost to Us of supplying the Goods and/or Services has increased such that it is not commercially viable for Us to complete the Quotation at the initial cost. If We do so, We will notify You in writing of such withdrawal, amendment or modification.",
                  "These Terms and Conditions are expressly incorporated into each Quotation and Accepted Quotation.",
                ]} />
              </Subsection>
            </Section>

            {/* 5. Price */}
            <Section number="5" heading="Price">
              <ClauseA items={[
                "Prices specified in the Quotation are exclusive of GST, unless stated otherwise.",
                <>
                  We reserve the right to charge additional fees for any special requests or changes You request and which We agree to after the Quotation becomes an Accepted Quotation, including in circumstances such as:
                  <ListI items={[
                    "where You request expedited delivery; or",
                    "where You request changes to the Goods and/or Services to be supplied after acceptance of the Quotation.",
                  ]} />
                </>,
                "For the avoidance of doubt, while We will seek to accommodate any special requests or changes, We are not liable to You if We are unable to accept any such special requests or changes to an Accepted Quotation, in which case the Goods and/or Services will be supplied in accordance with the initial Accepted Quotation. For the avoidance of doubt, We will not apply any additional fees unless agreed to by You in a revised Accepted Quotation.",
              ]} />
            </Section>

            {/* 6. Payment */}
            <Section number="6" heading="Payment">
              <Subsection number="6.1" heading="Deposit">
                <ClauseA items={[
                  "We may ask You to pay a deposit, which will be set out in the Quotation.",
                  <>
                    A deposit paid under clause 6.1(a) is non-refundable if You change Your mind and decide not to proceed with the order set out in the Accepted Quotation (including where You request changes or modifications to an Accepted Quotation which We are unable to accommodate, and You decide to cancel the order), unless:
                    <ListI items={[
                      "We have not incurred any costs in connection with the Accepted Quotation on the date that You notify Us that You do not wish to proceed (in which case We will provide You with a full refund of the deposit); or",
                      "the costs We have already incurred to fulfil the Accepted Quotation can reasonably be used in Our business for another purpose (for example, where We have procured parts which We can sell to another customer) (in which case, We will provide You with a pro rata refund reflecting those costs that We can use elsewhere).",
                    ]} />
                  </>,
                  "If a deposit is payable, We will not progress works on the Goods and/or Services until receipt of the deposit. As such, delayed payment of the deposit may lead to delays in the provision of the Goods and/or Services.",
                ]} />
              </Subsection>

              <Subsection number="6.2" heading="Payment Terms — Cash on Delivery (COD)">
                <ClauseA items={[
                  <>We will issue You with a tax invoice for the Goods and/or Services set out in the Accepted Quotation no less than <B>5 (five)</B> Business Days prior to the date for delivery / supply set out in the Accepted Quotation.</>,
                  "Unless otherwise specified in the Accepted Quotation, You must pay the Price as set out in the tax invoice issued under clause 6.2(a) no less than 48 hours before the date for delivery / supply set out in the Accepted Quotation. We will not provide the Goods and/or perform the Services until payment is made in full.",
                ]} />
              </Subsection>

              <Subsection number="6.3" heading="Payment Terms — 30 Days from Invoice Date (Net 30)">
                <ClauseA items={[
                  "We will issue the Customer with a tax invoice for the Goods and/or Services supplied.",
                  <>Unless otherwise agreed by us in writing, the Customer must pay each invoice <B>within thirty (30) days from the invoice date</B> (&ldquo;Net 30&rdquo;).</>,
                  <>The Customer acknowledges that Net 30 trading terms apply <B>only</B> where we have approved the Customer for a credit account in writing.</>,
                  <>If the Customer does not have an approved credit account, payment must be made <B>in full prior to dispatch or supply</B> (including COD where applicable).</>,
                  "We may suspend or refuse supply at any time if any invoice is overdue.",
                ]} />
              </Subsection>

              <Subsection number="6.4" heading="Payment Terms — 30 Days End of Month (30 EOM)">
                <ClauseA items={[
                  "We will issue the Customer with a tax invoice for the Goods and/or Services supplied.",
                  <>Unless otherwise agreed by us in writing, the Customer must pay each invoice <B>within thirty (30) days from the end of the month in which the invoice is issued</B> (&ldquo;30 EOM&rdquo;).</>,
                  "The Customer acknowledges that 30 EOM trading terms apply only where we have approved the Customer for a credit account in writing.",
                  <>If the Customer does not have an approved credit account, payment must be made <B>in full prior to dispatch or supply</B> (including COD where applicable).</>,
                  "We may suspend or refuse supply at any time if any invoice is overdue.",
                ]} />
              </Subsection>

              <Subsection number="6.5" heading="Credit Accounts">
                <ClauseA items={[
                  "Any credit account is granted at our absolute discretion and may be varied, suspended or withdrawn at any time without notice.",
                  "We may impose a credit limit. The Customer must not exceed any credit limit without our written consent.",
                  "If the Customer exceeds its credit limit or any amount becomes overdue, we may suspend supply until all overdue amounts are paid in full.",
                  "If the Customer fails to pay any amount by the due date, we may, at our discretion and without notice, withdraw any approved credit terms and require all future orders to be paid on a Cash on Delivery (COD) basis.",
                ]} />
              </Subsection>

              <Subsection number="6.6" heading="Late Payment">
                <ClauseA items={[
                  <>If the Customer fails to pay any amount when due, we may charge interest on the overdue amount at <B>2% per month</B>, calculated daily from the due date until payment is received in full.</>,
                  "The Customer must pay all costs we incur in recovering overdue amounts, including legal costs (solicitor/client basis), collection agency fees and enforcement costs.",
                ]} />
              </Subsection>

              <Subsection number="6.7" heading="No Set-Off">
                <ClauseA items={[
                  "The Customer must pay all invoices in full without set-off, withholding or counterclaim.",
                ]} />
              </Subsection>

              <Subsection number="6.8" heading="Invoice Queries">
                <ClauseA items={[
                  <>The Customer must notify us in writing of any invoice query within <B>7 days</B> of the invoice date. If the Customer does not notify us within that period, the invoice will be deemed accepted.</>,
                ]} />
              </Subsection>
            </Section>

            {/* 7. Delivery */}
            <Section number="7" heading="Delivery">
              <ClauseA items={[
                "We will provide You with as much notice as possible if We believe there may be any delay in the date for delivery of the Goods and/or Services.",
                "The Accepted Quotation will include an indicative delivery date only. We will continue to inform You of any updated delivery date information via Your nominated email address or phone number.",
                "We may (acting reasonably) deliver the Goods or make the Goods available for pickup in separate instalments even if they appear in one Accepted Quotation.",
              ]} />
            </Section>

            {/* 8. Title and Risk */}
            <Section number="8" heading="Title and Risk">
              <ClauseA items={[
                "Risk in any Goods which We supply to You passes to You upon the delivery or collection of the Goods (as applicable).",
                "We will not be liable for any damage to the Goods once risk has passed to You, except for damage We cause.",
                <>
                  Title in any Goods which We supply to You passes:
                  <ListI items={[
                    "if You pay the price for the Goods prior to delivery or collection, on delivery or collection (as relevant);",
                    "if You pay the price for the Goods after delivery or collection, on receipt by Us of payment in full.",
                  ]} />
                </>,
                "All payments received from the Customer must be applied in accordance with section 14(6)(c) of the PPSA (as applicable).",
                <>
                  Until title passes to You, after You have taken delivery of the Goods, You must:
                  <ListI items={[
                    "store the Goods separately and clearly mark them as Arrow Industries' property;",
                    "not dispose of, sell, or transfer the Goods without Our prior written consent; and",
                    "not deal with the Goods in any way which suggests that You are the legal owner of the Goods.",
                  ]} />
                </>,
                <>
                  Until title passes to You:
                  <ListI items={[
                    "in addition to any rights We may have under Chapter 4 of the PPSA, We may at any time, demand the return of the Goods and shall be entitled without notice to You to enter Your premises where We suspect the Goods may be located in order to search for and remove the Goods without committing a trespass, even though they may be attached or annexed to other goods or land not of Our property;",
                    "for the purpose under clause 8(f)(i), You irrevocably licence Us to enter such premises, and undertake that You will procure any necessary authority to enter from any relevant person, and also indemnify Us from and against all Loss suffered or incurred by Us as a result of exercising Our rights under this clause, except to the extent that such Loss was directly caused by Our negligence;",
                    "if there is any inconsistency between Our rights under this clause 8(f) and Our rights under Chapter 4 of the PPSA, this clause 8(f) prevails to the extent permitted by law;",
                    "You acknowledge that and warrant that We have a security interest (for the purpose of the PPSA) in the Goods and You must do anything reasonably required by Us to enable Us to register Our security interest, with the priority We require and to maintain that registration; and",
                    "the security interest arising under this clause 8 attaches to the Goods when You obtain possession of the Goods and the parties confirm that they have not agreed that any security interest arising under this clause 8 attaches at any later time.",
                  ]} />
                </>,
              ]} />
            </Section>

            {/* 9. PPSA */}
            <Section number="9" heading="PPSA">
              <ClauseA items={[
                "Unless a contrary intention appears, words or expressions used in this clause 9 that are defined in the PPSA have the same meaning as given to them in the PPSA.",
                <>
                  If at any time We determine that the Accepted Quotation creates a security interest in Our favour over any personal property, We may apply for any registration, or give any notification, in connection with that security interest and You must promptly, upon Our request, do anything (including signing and producing documents, getting documents completed or signed, obtaining consents and supplying information) to:
                  <ListI items={[
                    "provide more effective security over the relevant personal property;",
                    <>
                      ensure that any such security interest in favour of Us:
                      <ListUpper items={[
                        "is at all times enforceable, perfected (including, where applicable, by control as well as by registration) and otherwise effective; and",
                        "ranks as a first priority security interest;",
                      ]} />
                    </>,
                    "enable Us to prepare and register a financial statement or a financing change statement or give any notification in connection with that security interest; and",
                    "enable Us to exercise any of Our rights or perform any of Our obligations in connection with any such security interest or under the PPSA.",
                  ]} />
                </>,
                "We do not need to give You any notice required under the PPSA (including a notice of a verification statement under section 157 of the PPS) unless the requirement for the notice cannot be excluded.",
                "Neither party will disclose to a person or entity that is not a party to these Terms and Conditions information of the kind mentioned in section 275(1) of the PPSA unless section 275(7) of the PPSA applies or that information is publicly available. The obligations of each party under this clause are in addition to the obligations of both parties under clause 14.",
              ]} />
            </Section>

            {/* 10. Insurance */}
            <Section number="10" heading="Insurance">
              <Subsection number="10.1" heading="Insurance of Goods">
                <P>You are responsible for insuring the Goods against loss, damage, or theft from the time risk passes to You under clause 8(a).</P>
              </Subsection>
              <Subsection number="10.2" heading="Insuring Your property left at Our premises">
                <ClauseA items={[
                  <>It is Your responsibility to ensure that any of Your goods or property (including any parts, chassis, vehicles or other items) left at Our premises (including for workmanship, repair, maintenance, or storage) (<B>Customer Property</B>) are fully insured against loss, damage, theft and fire.</>,
                  "We will not be liable for any damage, loss, or theft of Customer Property left on Our premises unless and to the extent that such damage is caused or contributed to by Our act or omission. We expect that You will make a claim under Your insurance if there is any damage, loss, or theft of Customer Property while on Our premises, unless such damage, loss or theft is caused or contributed to by Our act or omission.",
                  "For the avoidance of doubt, while We take all reasonable care to prevent any damage, loss or theft to Customer Property, We cannot prevent against trespass and events caused by third parties which lead to damage to Customer Property, and such matters will not be treated as Our act or omission for the purposes of clause 10.2(b).",
                  "We may ask You for proof of valid insurance coverage that complies with this clause 10.2 before You leave any Customer Property at Our premises.",
                ]} />
              </Subsection>
            </Section>

            {/* 11. Customer Property */}
            <Section number="11" heading="Customer Property">
              <P>You represent and warrant that any Customer Property that remains at Our premises, for any period of time:</P>
              <ListI items={[
                "is authorised to be left at Our premises;",
                "is in a reasonably safe condition for Us to carry out our Services;",
                "satisfies roadworthiness minimum standards (except where the Services We are asked to provide relate to the roadworthiness of Your Property);",
                "can be driven into different areas on Our premises (if applicable);",
                "does not have any leaks of any kind; and",
                "does not pose any health or safety risk to Us or any member of the public.",
              ]} />
              <P>You must reimburse Us on demand for any loss, liability, damage, cost, expense, fine or penalty We suffer or incur as a result of Your failure to comply with this clause, except to the extent caused or contributed to by Us or Our personnel.</P>

              <Subsection number="11.2" heading="Change of Mind returns">
                <P>Subject to any rights You may have under the ACL or any other Non-Excludable Rights, any claim by You for a refund, return or other remedy in relation to a change of mind return will be approved or rejected by Us in Our absolute discretion.</P>
              </Subsection>
            </Section>

            {/* 12. Limitation of Liability */}
            <Section number="12" heading="Limitation of Liability">
              <ClauseA items={[
                <>
                  Subject to clauses 2 and 12(b), Our liability for any loss suffered or incurred by You due to Our failure to comply with a consumer guarantee under Division 1 of Part 3-2 of the ACL (<B>Consumer Guarantee</B>), which arises out of or in connection with Our provision of Goods or Services to You:
                  <ListI items={[
                    <>
                      in the case of Goods, is limited to:
                      <ListUpper items={[
                        "the replacement of the Goods or the supply of equivalent goods;",
                        "the repair of the Goods;",
                        "the payment of the cost of replacing the Goods or of acquiring equivalent goods; or",
                        "the payment of the cost of having the Goods repaired;",
                      ]} />
                    </>,
                    <>
                      in the case of the Services, is limited to:
                      <ListUpper items={[
                        "the supplying of the Services again; or",
                        "the payment of the cost of having the Services supplied again; and",
                      ]} />
                    </>,
                  ]} />
                </>,
                <>
                  Our liability in respect of a breach of or a failure to comply with a Consumer Guarantee will not be limited in the way set out in clause 12(a) if:
                  <ListI items={[
                    <>the Supply supplied are goods or services &ldquo;of a kind ordinarily acquired for personal, domestic or household use or consumption&rdquo;, as that expression is used in section 64A of the ACL;</>,
                    <>it is not &ldquo;fair or reasonable&rdquo; for Us to rely on such limitation in accordance with section 64A(3) of the ACL; or</>,
                    "the relevant Consumer Guarantee is a guarantee pursuant to sections 51, 52 or 53 of the ACL.",
                  ]} />
                </>,
                "Subject to clause 2 neither party will be liable for Consequential Loss.",
                "Subject to clause 2, We shall have no liability to You for any loss You suffer or incur (other than through Our breach of a Consumer Guarantee in which case clause 12(a) will apply) in relation to the provision of Goods and/or Services by Us, except to the extent We cause or contribute to the loss.",
              ]} />
            </Section>

            {/* 13. Termination */}
            <Section number="13" heading="Termination of Accepted Quotations">
              <ClauseA items={[
                <>
                  Either Party (the <B>Non-Defaulting Party</B>) may terminate an Accepted Quotation immediately on the provision of written notice to the other party (the <B>Defaulting Party</B>) if:
                  <ListI items={[
                    <>the Defaulting Party fails to remedy a breach of that Accepted Quotation or these Terms and Conditions in respect of that Accepted Quotation within <B>10 (ten)</B> Business Days of being notified in writing of that breach by the Non-Defaulting Party; or</>,
                    "the Defaulting Party suffers an Insolvency Event.",
                  ]} />
                </>,
                <>
                  Where an Accepted Quotation is terminated under clause 13(a) or where otherwise permitted under these Terms and Conditions:
                  <ListI items={[
                    "You must pay Us the Price for all completed Goods and or Services provided to You prior to that termination which are not yet paid for;",
                    "You must be refunded any Price paid (including any deposit) for Goods and/or Services not yet provided to You prior to that termination; and",
                    "the accrued rights and responsibilities or the parties are not otherwise impacted.",
                  ]} />
                </>,
                "Despite clause 13(b)(ii), We reserve the right to keep any portion of the deposit which covers costs and expenses We have already incurred in respect of an Accepted Quotation up to the date of termination in circumstances where We terminate for Your breach.",
              ]} />
            </Section>

            {/* 14. Confidentiality */}
            <Section number="14" heading="Confidentiality">
              <ClauseA items={[
                <>Each party (<B>Non-Disclosing Party</B>) agrees not to disclose (or permit to be disclosed) or use any Confidential Information of the other party (<B>Disclosing Party</B>) without the prior written consent of the Disclosing Party.</>,
                <>
                  Clause 13(a) does not apply to the extent that the:
                  <ListI items={[
                    "disclosure was required to be made in order for the Non-Disclosing Party to perform its obligations under these Terms and Conditions or an Accepted Quotation;",
                    "disclosure is required by law or any government agency;",
                    "Confidential Information has become within the public domain (other than by breach of this clause); or",
                    "disclosure is made to a party's professional advisors.",
                  ]} />
                </>,
              ]} />
            </Section>

            {/* 15. Force Majeure */}
            <Section number="15" heading="Force Majeure">
              <ClauseA items={[
                "Neither party will be liable to the other for any failure or delay in the performance of its obligations under these Terms and Conditions or an Accepted Quotation where such failure or delay is due to a Force Majeure Event.",
                <>
                  If there is a Force Majeure Event, the affected party must:
                  <ListI items={[
                    "prove the existence of the Force Majeure event to the reasonable satisfaction of the other party; and",
                    "make every reasonable effort to minimise the impact of the Force Majeure Event; and",
                    "resume performance of its obligations under these Terms and Conditions and/or Accepted Quotation as soon as reasonably possible after cessation of the Force Majeure Event.",
                  ]} />
                </>,
                <>Either party may terminate an Accepted Quotation immediately by providing notice in writing to the other party if a Force Majeure Event continues to effect that Accepted Quotation for at least <B>2 (two) months</B>.</>,
              ]} />
            </Section>

            {/* 16. IP */}
            <Section number="16" heading="Intellectual Property">
              <ClauseA items={[
                "We remain the owner or licensee (as the case may be) of all Intellectual Property Rights We owned or used prior to the relevant Accepted Quotation.",
                "You remain the owner or licensee (as the case may be) of all Intellectual Property Rights You owned or used prior to the relevant Accepted Quotation.",
                "The parties agree that any Intellectual Property Rights created or developed under or in connection with the provision of Goods and/or Services under an Accepted Quotation are owned by Us, unless otherwise agreed in writing. For the avoidance of doubt, where We have created any design or drawings in connection with the provision of any Goods or Services, then the copyright in those designs and drawings remains vested in Us, and You may only use such Intellectual Property Rights to the extent necessary for You to derive the benefit of the Goods and/or Services which We supply.",
              ]} />
            </Section>

            {/* 17. Disputes */}
            <Section number="17" heading="Dispute Resolution">
              <ClauseA items={[
                <>If there is a dispute, controversy or claim under or in respect of these Terms and Conditions and/or an Accepted Quotation between the parties (<B>Dispute</B>), then within <B>5 (five)</B> Business Days of a party notifying the other party in writing of the Dispute, both parties must meet and use all reasonable endeavours acting in good faith to resolve the Dispute by joint discussions.</>,
                <>
                  If the Dispute is not settled within <B>15 (fifteen)</B> Business Days of notification under clause 16(a), the parties will (unless both parties agree in writing not to) submit the Dispute to mediation administered by the Australian Disputes Centre (or another mediation organisation agreed to by the parties), where:
                  <ListI items={[
                    "the mediator will be an independent person agreed between the parties or, failing agreement, a mediator will be appointed by the President of the Australian Disputes Centre; and",
                    "the costs of the mediator will be borne by both parties equally.",
                  ]} />
                </>,
                "A party may not start court proceedings in relation to a Dispute until it has exhausted the procedures in this clause, unless the party seeks injunctive or other interlocutory relief. For the avoidance of doubt, it is agreed that a party may start court proceedings in relation to a Dispute if the parties have agreed not to submit the Dispute to mediation in accordance with clause 16(b).",
              ]} />
            </Section>

            {/* 18. GST */}
            <Section number="18" heading="GST">
              <ClauseA items={[
                <>Words or expressions used in this clause 18 that are defined in the <i>A New Tax System (Goods and Services Tax) Act 1999</i> have the same meaning given to them in that Act.</>,
                "Unless otherwise stated, any amount specified in an Accepted Quotation as the consideration payable for any taxable supply does not include any GST payable in respect of that supply.",
                <>If a party makes a taxable supply under these Terms and Conditions and/or an Accepted Quotation (<B>Supplier</B>), then the recipient of the taxable supply (<B>Recipient</B>) must also pay, in addition to the consideration for that supply, the amount of GST payable in respect of the taxable supply at the time the consideration for the taxable supply is payable.</>,
                "Despite anything stated in this clause 18, the Recipient is not obliged under these Terms and Conditions and/or an Accepted Quotation to pay the amount of any GST payable until the Supplier provides it with a valid tax invoice for the taxable supply.",
                "If an adjustment event arises in relation to a taxable supply made by a Supplier under these Terms and Conditions and/or an Accepted Quotation, the amount paid or payable by the Recipient pursuant to clause 18(c) will be amended to reflect this and a payment will be made by the Recipient to the Supplier or vice versa as the case may be.",
                <>If a third party makes a taxable supply and these Terms and Conditions and/or an Accepted Quotation requires a party (<B>the Payer</B>) to pay for, reimburse or contribute to (<B>Pay</B>) any expense or liability incurred by the other party to that third party for that taxable supply, the amount the Payer must Pay will be the amount of the expense or liability plus the amount of any GST payable in respect thereof but reduced by the amount of any input tax credit to which the other party is entitled in respect of the expense or liability.</>,
              ]} />
            </Section>

            {/* 19. General */}
            <Section number="19" heading="General">
              <ClauseA items={[
                "Any Accepted Quotation may only be varied with the written agreement of both parties.",
                <>We may vary these Terms and Conditions unilaterally by notice in writing to You. Such altered Terms and Conditions will take effect 30 days after the variation is notified to You in writing (<B>Notice Period</B>) and will apply to all new Accepted Quotations which are accepted under clause 4.2 after the Notice Period ends. For clarity, any Accepted Quotation that is already on foot during or before the expiry of the Notice Period will be subject to the version of the Terms and Conditions which was in effect at the time the Accepted Quotation was accepted under clause 4.2.</>,
                "No waiver by a party of a breach of any obligation contained or implied in these Terms and Conditions or Accepted Quotation operates as a waiver of another breach of the same or of any other obligation contained or implied in these Terms and Conditions or Accepted Quotation.",
                "If the whole or any part of a provision of these Terms and Conditions or Accepted Quotation is void, unenforceable or illegal it is severed. The remainder of this Terms and Conditions or Accepted Quotation (as applicable) continues to have full force and effect.",
                "These Terms and Conditions are governed by the law of Victoria, Australia. Both parties submit to the jurisdiction of the courts of Victoria and waive any right to claim that those courts are inconvenient forums.",
                <>Any notice, demand, consent or approval (<B>Notice</B>) given under this Terms and Conditions or Accepted Quotation must be in writing, addressed and delivered to the other party as per the details in the associated Quotation (or as otherwise notified by that party to the other from time to time) and signed by or on behalf of the party giving the notice. Notices given under this Terms and Conditions or Accepted Quotation will be deemed to be received (in the case of prepaid post) on the fourth Business Day after the date of posting, (in the case of email) at the time sent (unless a delivery failure notification is received by the sender), or (if delivered by hand), at the time of delivery.</>,
                <>
                  The following clauses survive the conclusion or expiry of these Terms and Conditions and the termination or fulfilment of any Accepted Quotation:
                  <ListI items={[
                    "clause 11 (warranties);",
                    "clause 13 (confidentiality);",
                    "clause 16 (disputes); and",
                    "clause 18 (general).",
                  ]} />
                </>,
              ]} />
            </Section>

            {/* 20. Acknowledgement */}
            <Section number="20" heading="Acknowledgement and signing">
              <P>By signing below, You acknowledge that You have read and understood these Terms and Conditions and agree to be bound by them whenever engaging Us to provide You with Goods or Services.</P>
            </Section>

            {/* Footer note */}
            <div className="mt-16 border-t border-line pt-6 text-sm">
              <p>
                Questions about these terms can be directed to{" "}
                <a href={site.emailHref} className="text-accent-text hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ---------- Layout helpers ---------- */

function Section({
  number,
  heading,
  children,
}: {
  number: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-12 scroll-mt-24" id={`clause-${number}`}>
      <h2 className="font-display text-xl font-extrabold text-bone sm:text-2xl">
        <span className="text-accent">{number}.</span> {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed sm:text-base">
        {children}
      </div>
    </div>
  );
}

function Subsection({
  number,
  heading,
  children,
}: {
  number: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-base font-bold text-bone sm:text-lg">
        <span className="text-accent-text/80">{number}</span>{" "}
        <span className="ml-1">{heading}</span>
      </h3>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-bone">{children}</strong>;
}

function Definition({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p>
        <B>{term}</B>
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Definitions({ items }: { items: [string, string][] }) {
  return (
    <div className="space-y-3">
      {items.map(([term, def]) => (
        <p key={term}>
          <B>{term}</B> {def}
        </p>
      ))}
    </div>
  );
}

const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
const UPPER = ["A", "B", "C", "D", "E"];

function ClauseA({ items }: { items: ReactNode[] }) {
  return <ListA items={items} />;
}

function ListA({ items, start = 0 }: { items: ReactNode[]; start?: number }) {
  return (
    <ol className="mt-2 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-1">
          <span className="text-mute">({ALPHA[start + i]})</span>
          <div>{item}</div>
        </li>
      ))}
    </ol>
  );
}

function ListI({ items }: { items: ReactNode[] }) {
  return (
    <ol className="mt-2 space-y-2 pl-2">
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-1">
          <span className="text-mute">({ROMAN[i]})</span>
          <div>{item}</div>
        </li>
      ))}
    </ol>
  );
}

function ListUpper({ items }: { items: ReactNode[] }) {
  return (
    <ol className="mt-2 space-y-2 pl-2">
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-1">
          <span className="text-mute">({UPPER[i]})</span>
          <div>{item}</div>
        </li>
      ))}
    </ol>
  );
}
