# Client GTM Portal

**[Explore the public demo](https://portal.fortegrowth.co/demo)** · [Back to portfolio](../README.md)

A delivery workspace connecting the next client action, a 16-step plan, campaign activity and performance reporting.

## The problem

A client needs to know what needs their attention, what has been delivered and what should change next. A team also needs to distinguish an agreed task from supporting context, and a real performance signal from missing or stale data.

My work at Forte combines founder discussions, customer hypotheses, GTM planning and AI-assisted implementation. The portal brings those activities into an interface people can inspect and use.

## A three-minute product walkthrough

The public demo uses **NovaForge Labs, a fictional company**, and is labelled **synthetic data / read-only**. Its figures are demonstration data, not client results. Reviewed on **26 September 2026**.

| Stop | What to inspect | Product decision |
| --- | --- | --- |
| **This Step** | Current priority, client actions, next check-in and step 9 of a 16-step plan | Lead with what the user needs to do next. |
| **Metrics / Last week** | Nine signals grouped into Reach, Engagement and Intent; current, previous and change | Connect activity to decisions while preserving different kinds of signal. |
| **Metrics / Conversion journey** | Independent milestones, explicitly not a nested funnel | Avoid implying that all events belong to one cohort or follow one ordered funnel. |
| **Metrics / All time** | “No previous period” and “Change unavailable” | Do not invent a comparison baseline. |
| **Campaigns** | Search, status filters, sorting and campaign-level activity | Connect the aggregate view to the work behind it. |
| **Deliverables** | Phase-grouped work with Complete, In Progress and Not Started states | Separate completed outputs from position in the sprint plan. |

## Product decisions worth discussing

### Start with the next action

The landing view foregrounds the current priority and client actions. Sprint Progress and Deliverables provide the wider context. Step 9 of 16 and 8 of 16 deliverables complete describe different things: position in a plan versus completed outputs.

### Reporting needs meaning, not just more numbers

The Metrics page groups nine signals:

- **Reach:** prospects added, connections sent, messaged leads.
- **Engagement:** tagged leads, accepted connections, replied leads.
- **Intent:** interested leads, calls proposed, meetings booked.

The conversion journey presents independent counts rather than a narrowing funnel. An acceptance recorded this week may relate to a request sent earlier. A period-based activity ratio is not automatically a cohort conversion rate.

The LinkedIn scorecard exposes current, previous and change. Campaign reporting provides detail, while meeting-source labels distinguish HeyReach, Cal.com and the combined total in the demo.

### Make uncertainty visible

Email is explicitly labelled “Not connected.” All-time reporting explicitly lacks a previous period. Neither state should be mistaken for zero performance.

The internal delivery interface also separates official tasks from supporting delivery context, exposes source freshness and provides a reconciliation queue for unmatched records. These capabilities were observed separately; they are **not exposed in the public demo**, and no client records are reproduced here.

## My contribution and collaboration

My contribution includes client GTM hubs, prioritised GTM plans and AI-assisted implementation. I work from founder discussions, research and customer hypotheses, connecting those inputs to campaigns, sales assets and delivery priorities.

Before Forte, I conducted 40+ user interviews per month at Sensor Tower and partnered with Product, Engineering and Marketing to turn findings and behavioural data into product improvements. That is the product practice I bring to this work.

This is a team business. The case study describes my contribution and the product decisions visible in the work; it does not claim sole authorship of the application.

## Technical context and release boundaries

Earlier source review identified a React/TypeScript front end, Express API, PostgreSQL/Drizzle data layer and Notion/HeyReach integration code. The current Replit sandbox's reporting notes aligned with the grouped KPI and independent-milestone views observed in the public demo.

A separate older Replit mockup showed a campaign message-thread change awaiting review. It is **not counted as a verified live feature**. An integration label or development note alone does not establish that every provider is connected or every workflow operates successfully.

## What I would measure next

These are proposed evaluation measures, not achieved results:

- Can a client identify the next action and status without a separate explanation?
- How quickly can someone find the deliverable behind an update?
- Can users distinguish unavailable data, stale data and a genuine zero?
- How often do context records need reconciliation, and how long do they remain unresolved?
- Does reporting help the team select and explain the next campaign change?

## Demo limitations and next improvements

The synthetic fixtures need more consistency: the sprint example is dated August while reporting periods reflect September, and one campaign's period-based acceptance ratio exceeds 100%. Before interpreting a ratio as conversion, the denominator and event/cohort definition need to be explicit. The activity log inspected was empty, so it is not evidence of populated message history.

These are opportunities for clearer explanation and future fixture improvements, not production client results. No uplift in revenue, retention or time saved is claimed. See [scope and evidence](../SCOPE.md).
