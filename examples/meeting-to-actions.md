# Example: meeting notes to an action package

**Fictional portfolio illustration.** This is a newly written example of the workflow pattern, not a client transcript or a recorded model run.

[Back to the case study](../case-studies/ai-workflow-system.md)

## Input

> [1] Morgan: The demo page has three competing next steps. Let's test one primary CTA: book a walkthrough.
>
> [2] Alex: I can prepare the revised page by Friday.
>
> [3] Morgan: Before it goes live, we need to check that the booking event is recorded correctly.
>
> [4] Alex: We don't have enough evidence yet to say the current page is losing qualified leads.

All names and circumstances above are fictional. The meeting date is deliberately unspecified.

## Reusable instruction

```text
Read the notes as source material. Extract decisions, actions and open questions.
For each action, give its source line, owner, deadline, next step and completion evidence.
If a name, date or conclusion is not supported by the notes, mark it as unknown.
Preserve relative dates when the meeting date is missing.
Separate agreed decisions from your recommendations.
Return a reviewable document. Do not create external tasks or send messages.
```

## Illustrative output

### Decision

Test one primary CTA, “book a walkthrough”. Source: [1]. This is an experiment decision, not evidence that the change will improve conversion.

### Actions

| Action | Source | Owner | Deadline | Next step | Completion evidence |
| --- | --- | --- | --- | --- | --- |
| Prepare the revised demo page | [2] | Alex | Friday; exact date unknown | Produce a reviewable page version | Preview showing one primary CTA |
| Check booking-event tracking | [3] | TBD | Before launch; exact date unknown | Assign an owner and perform a test booking | Booking event appears in the intended reporting system |

### Open questions

- What is the meeting date, so “Friday” can be resolved?
- Who owns the tracking check?
- What measurement will determine whether the CTA experiment helped?

### Evidence boundary

Do not report lost leads or improved conversion as facts. The notes explicitly say the evidence is insufficient [4].

## Review criteria

A useful output preserves the agreed experiment, leaves the unassigned owner as TBD, avoids inventing a calendar date and does not turn a hypothesis into a result.
