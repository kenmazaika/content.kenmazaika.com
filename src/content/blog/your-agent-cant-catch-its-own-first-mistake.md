---
title: "Your Agent Can't Catch Its Own First Mistake"
description: "A pipeline's errors compound instead of averaging out, which makes the vague assumption at step one the most expensive line in the whole chain."
pubDate: "Sep 16, 2026"
ogCategory: "Field Note · Content Systems"
---

**TL;DR**

- **What it's about:** An agent pipeline doesn't average its step accuracies, it multiplies them — five steps running at 95% finish near 77% — so a small slip at the genesis is the one that compounds into a polished artifact you didn't ask for.
- **What to do differently:** Put the check at the step, not the finish line. Verify each intermediate artifact against the brief with a signal from outside the model, and stop asking the agent to catch its own mistakes — intrinsic self-correction makes reasoning worse, not better.
- **The key takeaway:** The first error is the expensive one, and an agent can't audit its way out of it by re-reading its own work.

Here's the failure I keep hitting with my content pipeline. I'll start a piece from a one-line idea, let the agent outline it, draft it, polish it — and the thing comes back clean. Good structure, tight sentences, sources attached. And it's about the wrong thing. The miss isn't in the writing. It's an assumption I let stand at the very first step, and every stage after it built on top without blinking. By the time I see the problem I'm not editing a draft, I'm rebuilding one.

That's the whole disease. The mistake happens early, but it *shows up* late, dressed as quality work.

## Accuracy multiplies, it doesn't average

Start with the arithmetic, because it explains everything downstream. A pipeline is a chain of steps, and each step has to be right for the whole thing to be right. If each step is right 95% of the time, five steps land right about 0.95^5 ≈ 77% of the time. Ten steps, ~60%. Twenty, ~36%.

This is how a pipeline that "mostly works" step by step still fails most of the time end to end — and why bolting on another step to fix a problem often just multiplies the odds against you. Reliability compounds in the direction you don't want. Every step you add is another factor that has to come up heads.

## The early error is the expensive one

Software engineering has been measuring this since the 1970s, and the numbers are ugly.

Barry Boehm's cost-of-change data ([summarized here](https://dzone.com/articles/real-cost-change-software)) found that a requirements mistake fixed while you're still writing requirements costs almost nothing. The same mistake caught after the system ships can cost [up to 100 times as much](https://dzone.com/articles/real-cost-change-software). In small projects the curve is gentler — closer to 1:4 — and the 100× cases are what Boehm calls architecture-breakers: one wrong fundamental assumption that survives all the way to production. The HP/IBM/Hughes/TRW studies land in the same place: purge an error at the start of construction and rework costs 10–100× less than fixing it at the end.

NIST put a dollar figure on the pattern in [its 2002 software-testing report](https://web.archive.org/web/20090610052743/http://www.nist.gov/public_affairs/releases/n02-10.htm): software bugs cost the U.S. economy $59.5B a year, **over half** of errors are typically found only downstream, and $22.2B of that is avoidable with earlier detection.

Read that again: the expensive part isn't the mistake. It's the distance it travels. An error near the top of the pipeline also has a wider blast radius, because everything below inherits it as a premise.

The curve flattens when you move detection earlier — that's what tests and continuous delivery actually buy you. The lever was never "work harder at the end."

## Your agent will not catch it for you

The obvious fix is to have the model review its own work before it hands off. The research says don't.

Huang et al., in [*Large Language Models Cannot Self-Correct Reasoning Yet*](https://arxiv.org/abs/2310.01798) (ICLR 2024), tested intrinsic self-correction — the model grading its own answer with no outside signal. It didn't help. On GSM8K, GPT-3.5 went from 75.9% correct to 74.7% after two rounds. Worse: when the model changed an answer, it flipped a *correct* one to wrong 8.8% of the time and fixed a wrong one only 7.6% of the time. It was more likely to break a right answer than to repair a bad one.

The reason sits underneath the pipeline problem. The model can't reliably tell when its own reasoning is wrong, so "check yourself" adds a step without adding information. Self-review is noise dressed as diligence.

## Check the step, not the output

So where does the check go? OpenAI's [*Let's Verify Step by Step*](https://arxiv.org/abs/2305.20050) ran the clean experiment. Same problems, two ways to judge them: outcome supervision (score only the final answer) versus process supervision (score each reasoning step). On MATH, the step-level verifier hit **78.2%**, the answer-level one **72.4%**, majority voting **69.6%**.

The gap has a mechanism. An outcome check rewards any chain that lands on the right answer — including one that got there for the wrong reasons. The error stays invisible because the answer looked fine. A step-level check finds *where* it went wrong, which is the only place you can actually fix it.

That's the move, and it's small: gate each handoff. In my pipeline that means a check at each seam — brief → outline → draft → final — that compares the intermediate artifact against the locked brief, using something outside the model. A fixed checklist. A rubric. The goal I wrote down before I started. Not "does this look good?" Look-good is outcome supervision for prose. The gate asks the narrower question: did this stage do the one thing the next stage is about to assume?

I've been circling this for a while as goal-locked intake plus a check at every stage. The research is why it is not optional. The gate is the cheapest place to be wrong, and it's the one check the model can't fake, because the answer comes from the brief instead of from the model's opinion of itself.

If your agent's output is somehow always a little off, stop auditing the end. Find the first step where the brief went vague, and put the check there.
