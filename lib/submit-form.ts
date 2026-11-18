import { startTransition, type FormEvent } from "react";

/**
 * Sends a form to its server action and leaves the customer's answers in place.
 * React clears a form after its action finishes, even when the server has only
 * asked for one field to be corrected, so the submit is handled here instead.
 */
export function submitKeepingAnswers(
  event: FormEvent<HTMLFormElement>,
  action: (data: FormData) => void,
) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  startTransition(() => action(data));
}
