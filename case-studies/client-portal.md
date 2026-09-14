# Client GTM Portal

**[Open the public demo](https://portal.fortegrowth.co/demo)** · [Back to portfolio](../README.md)

## The problem

A client needs to understand what is happening this week, what needs their input and how delivery is progressing. A portal can bring those questions into one place instead of requiring someone to reconstruct the answer from separate updates.

## The product

The public demo presents a fictional client workspace with five views:

| View | The question it helps answer |
| --- | --- |
| This Step | What is the current priority, and what do I need to do? |
| Sprint Progress | Where are we in the delivery plan? |
| Metrics | Where can I inspect performance? |
| Campaigns | Where can I review campaign activity? |
| Deliverables | Where can I find the work being delivered? |

The landing view includes a 16-step sprint plan, progress, client actions and a next check-in. The demo is explicitly labelled **synthetic data** and **read-only**. Its displayed figures are illustrative, not evidence of client performance.

## My contribution

My work at Forte includes building client GTM hubs that connect insight, campaigns, sales assets and delivery. This portal is a concrete example of that work and my use of AI-assisted development to turn a commercial process into an interface.

The source repository records ongoing development, including campaign-source reconciliation and manifest-driven client onboarding. These changes show the kind of operational detail behind the interface; the demo alone does not verify production reliability or every integration.

## Product decisions worth discussing

- **Start with the next action.** The initial view puts this step's priority and client actions ahead of a broad dashboard.
- **Show progress in context.** A step belongs to a larger sprint rather than appearing as an isolated task.
- **Separate public demonstration from live delivery.** Fictional data lets someone inspect the experience without seeing a client workspace.

## Technical context

The private source includes a TypeScript workspace, a React front end, an Express API and a PostgreSQL/Drizzle data layer. It also contains Notion and HeyReach integration code. These are implementation details, not a claim that every feature is exercised in the public demo.

## What the evidence supports

The live demo demonstrates the interface and delivery model. The private source provides implementation context. I am not claiming a measured improvement in retention, revenue or hours saved from this portal.
