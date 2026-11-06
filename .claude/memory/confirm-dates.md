---
name: confirm-dates
description: "State the exact calendar date when scheduling from relative words like \"mai\" near midnight"
metadata:
  node_type: memory
  type: feedback
  originSessionId: e70a3818-d758-444d-825d-02ec29df620c
  modified: 2026-10-29T02:45:13.830Z
---

When the user says "sáng mai"/"tomorrow" late at night, resolve it from the user's point of view (they haven't slept yet = the next calendar morning may be "today" by the clock) and state the exact date (e.g. "9:00 ngày 29/10") before scheduling anything.

**Why:** On 2026-10-29 ~00:10 I scheduled 7 posts for 30/10 when the user meant 29/10; posts didn't appear and had to be rescheduled.
**How to apply:** Any scheduling (FB scheduled posts, Task Scheduler) — echo the absolute date/time and let it be corrected before sending.
