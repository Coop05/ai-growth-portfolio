# A shared AI workflow system for GTM work

[Inspect a meeting-to-actions example](../examples/meeting-to-actions.md) · [Inspect a content example](../examples/content-workflow.md) · [Back to portfolio](../README.md)

## The problem

When context lives in individual chats, people can ask similar questions and receive inconsistent answers. Instructions, company knowledge and useful feedback need a shared home if the team is going to reuse them.

## What I built

A shared Claude Code workspace for Forte's skills, directives, workflows and accumulated context. My work includes reusable AI-assisted workflows for research synthesis, meeting insights, documentation and campaign execution.

| Layer | Purpose |
| --- | --- |
| Shared context | Give a task the relevant background and approved facts |
| Skills and directives | Define how a type of work should be approached and reviewed |
| Workflows | Specify inputs, steps and expected outputs |
| Review | Check factual support, usefulness and suitability for delivery |
| Memory and documentation | Preserve feedback and decisions for later work |

## Two examples from the workflow design

**Content workflow:** meeting notes become a writing card, then review-ready LinkedIn drafts. Source facts and sensitivity checks come before drafting. Publishing is a separate human decision.

**Meeting-to-actions workflow:** notes become decisions, actions, owners, deadlines, risks and follow-ups. Each action includes source evidence and a completion criterion. Missing owners or dates remain unknown rather than being invented.

The examples in this public repository recreate those patterns with fictional material. They do not reproduce internal calls, client work or the full private instruction library.

## What makes the work useful

- A colleague can start from a defined workflow rather than a blank conversation.
- The output has a structure someone else can review and act on.
- Feedback has somewhere to go beyond the original chat.
- Suggestions and externally executed actions are distinguished explicitly.

## Status and limits

The source documents the content engine as a working module and includes a broader collection of workflow and execution components. Maturity differs by component. This portfolio does not claim that every workflow is autonomous or deployed, or that the entire system has been benchmarked.

The work demonstrates LLM application design, knowledge organisation and workflow orchestration. It is not a claim of training a foundation model or building an LLM inference platform.
