---
title: "The First Hour Is the Whole Cold-Email Reply"
description: "A reply to your cold email is worth the most in the minutes after it lands. The approval gate you built to keep a human in the loop is the delay."
socialTitle: "The First Hour Is the Whole Cold-Email Reply"
ogCategory: "Field Note · Content Systems"
pubDate: "Sep 12, 2026"
---

**TL;DR**

- **What it's about:** I had my agent draft replies to my cold-email campaign into the mailbox, and I approve them by tapping Send from my phone. I had the problem filed as review burden. The data files it as a clock problem: a reply is worth the most in the minutes right after it lands, and the approval gate runs on my pocket, not the server.
- **What to do differently:** run two lanes. Let the agent send the replies whose answer is already known — "yes, here's the link" and the standard pricing question — immediately, from copy you approved in advance. Keep the human gate for the judgment calls. Then log first-touch latency, because the drafts-only flow measured everything except the clock.
- **The key takeaway:** the review step you're trying to make less burdensome is the step costing you the lead. For a reply with a known answer, speed beats a second opinion.

I mapped the cold-email reply queue with my agent this week. The design was clean: watch the campaign mailbox, classify each reply — interested, question, not-now, not-interested, bounce — write a correctly threaded draft into Drafts, and I send it from my phone. No new interface, no SMTP credentials anywhere near the agent, and a human stays as the last check before anything leaves. Then I went looking for what that last check costs.

## The clock starts when their reply lands

The best-documented number in lead response is also the oldest. In 2007, MIT's James Oldroyd and InsideSales.com [analyzed 15,000+ web-generated leads and 100,000+ call attempts](https://www.onecavo.com/wp-content/uploads/2015/11/MIT-InsideSales.com_Lead-Response-Management.pdf), then sliced the first three hours into five-minute segments. The decay isn't a slope. Calling a lead five minutes after it arrives versus thirty minutes makes you 100 times more likely to even reach them, and 21 times more likely to qualify them. Five minutes against ten: contact odds fall five-fold, qualification odds four-fold. Across the whole first hour, contact odds drop more than 10× and qualification odds drop more than 6×.

That was phone calls on inbound leads. The shape carries, because the mechanism is the same one sitting in your inbox: intent decays while you're doing something else.

## Most companies aren't in the first hour

HBR [ran the audit](https://hbr.org/2011/03/the-short-life-of-online-sales-leads) that makes the point stick. It fired test leads at 2,241 U.S. companies. Thirty-seven percent responded within an hour. Sixteen percent took between one and 24 hours. Twenty-four percent took more than a day. And 23% never responded at all. The average response time, among the firms that bothered, was 42 hours.

The payoff was in qualification: firms that contacted a lead within the first hour were nearly seven times as likely to qualify it as firms that waited even one more hour — and more than 60 times as likely as firms that waited a day or longer.

## Your gate is the delay

Here's the part that landed for me. I built the drafts-only, no-SMTP queue precisely so a human stays in the loop. That human is me, on a phone, between other things. So the design doesn't remove latency; it pins latency to my attention. That's how the 42-hour average happens — not from one slow decision, but from a thousand ordinary ones, each an afternoon late.

And the burden I was trying to reduce isn't what costs the lead. The wait is.

## Two lanes, not a better review screen

The change isn't a faster approval interface. It's routing.

Lane one: replies with a known answer. "Interested — what's next?" "What does it cost?" "Send me details." The agent sends those itself, immediately, from copy I've already read and approved. Same words I'd type at 9pm, minus the nine hours. That clears the first-hour problem for most of the pile, because most cold-email replies are one of a few questions.

Lane two: everything that needs a decision — a specific objection, an edge case, a real "tell me about your situation." The agent drafts, I approve, and it can wait until morning. Those threads are the ones where a considered answer is the whole point.

Then instrument it. Log when the reply lands and when the first real message goes out, per lane, per week. The drafts-only design measured everything except that. If your first-touch median is measured in hours, you've built a 42-hour company with nicer templates.

One bound, stated once: the 2007 study measured contact and qualification on calls to inbound leads, not email close rates. A fast reply is not a fast close. The direction is well established; the exact multipliers belong to that dataset, not yours.

Write the three pre-approved replies tonight and wire the auto-send lane to the interested and pricing buckets. You can't control how many people reply. You can control whether the reply waits for you.
