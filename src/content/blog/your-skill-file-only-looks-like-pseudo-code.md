---
title: "Your Skill File Only Looks Like Pseudo-Code"
description: "Your skill file is a spec written in sentences, and specs are mostly ambiguous. The reason that's survivable for humans — and silent for agents — is the part nobody writes down."
pubDate: "Sep 17, 2026"
ogCategory: "Field Note · Content Systems"
---

**TL;DR**

- **What it's about:** A skill file is a spec written in sentences, and sentences are ambiguous. One case study of a cancelled project found nine in ten of its requirements ambiguous and only one of its 40 worst defects traced back to that — because the developers asked questions. Models don't ask; they guess.
- **What to do differently:** Write the file like a spec: name the one output, add a check the agent can run, put a wrong example next to the right one, state the non-goals. Then read the questions your agent does ask — each marks a hole.
- **The key takeaway:** The model doesn't guess because it's weak. It guesses because the file left the decision open — and it will resolve that on its own, silently, and differently after your next model swap.

I built a skill file last week that turns my raw notes into X posts. Plain English: here's the material, here's how I sound, here's what to kill. The first run came back off — a little know-it-all, too insider for someone with no context, comparing tools when the subject was the work.

So I did what everybody does: I added rules. Four more lines by the end of the day, each one written because a draft came back wrong. They cost me a day of reading bad drafts.

Then I stopped looking at the drafts and looked at the file. Every line is a sentence, and every sentence leaves something open. I'd been calling those instructions. They're closer to a spec — and there's fifty years of research on specs written in sentences.

## A spec can be nine-tenths ambiguous and still work

In 2010, two researchers at the University of Amsterdam published a case study of a software project cancelled after 21 man-years ([REFSQ 2010](https://link.springer.com/chapter/10.1007/978-3-642-14192-8_21)). It died in acceptance testing with more than a hundred blocking issues, so they started with the requirements — the plain-language statements of what the system had to do.

Of the 102 they sampled, human reviewers flagged nine in ten as ambiguous. An automated parser flagged more. Not "vague in places" — formally ambiguous, readable two or more ways.

Then they root-caused the 40 biggest issues. Exactly one traced back to ambiguity, and it was cheap: a performance target that said batch jobs "should be completed within a reasonable time frame."

Ambiguity was everywhere and it wasn't the killer, because the people building from those documents coped: they asked, argued it out, got a ruling. A spec in prose doesn't work because the prose is precise. It works because there's a human at the other end of it, closing the gaps out loud.

## The model doesn't ask

There's no meeting when the reader is a model.

Su and Cardie tested it in [*Knowing but Not Showing*](https://arxiv.org/abs/2605.25284) (2026). Ask a model to judge its own ambiguity and it often gets it right. Put the same ambiguous question to it normally and it answers anyway: answer rates above 95%, and 80–95% of responses were pure answers — no clarification, no refusal. The most clarification-happy family asked about 5% of the time, and only with no context supplied.

Then the detail that should bother you more: with background passages in play, models ask *fewer* clarifying questions, on ambiguous and unambiguous questions alike. More context, more confidence, less checking.

Nothing in my pipeline stopped to ask what counts as insider. It picked the most plausible reading.

## Ambiguity fails twice: silently, and unstably

Yang et al., [*What Prompts Don't Say*](https://arxiv.org/abs/2505.13360), measured underspecified prompts directly.

Models cover for you: they infer the requirements you didn't state 41.1% of the time by default. That sounds helpful until the second finding — underspecified prompts are **twice as likely to regress** when the model or the prompt changes, with accuracy drops past 20%. The behavior you liked was never in your spec. It was in that model's guess on that day.

So a model swap changes the output without changing the file. I run the same files across a few models depending on cost, and I'd been reading those differences as model personality.

The same paper kills the obvious fix. Specifying everything doesn't reliably help — models have limited instruction-following, and requirements you pile on can conflict. What moved the number was treating it as requirements work: find the unstated requirement, state it, check it.

And it isn't only about taste. Larbi et al., [*When Prompts Go Wrong*](https://arxiv.org/abs/2507.20439) (2025), mutated two coding benchmarks' descriptions into the messy versions real people write — ambiguous, incomplete, contradictory. Ambiguous descriptions cost 25–30% of accuracy, and across the three categories the drop reached 20–40 points. The ugly part is the failure mode: the model still handed back code that ran, and 60–90% of the code that compiled was semantically wrong.

It doesn't error out. It finishes, and it's wrong. That's the shape of a skill file that needs edits every time, next to the hands-off one that comes back clean.

## Write the file like a spec

Four moves, all cheap.

**Name the one output.** Not "draft a post" — "one post, 400–900 words, ends on the unresolved beat." Every format decision you leave out, the model decides.

**Add the check.** Give it something it can run against its own output to know it's done. "Does this look good?" is not a check.

**Put the wrong example next to the right one.** My "no insider context" rule only landed when I attached a bad line and a good one.

**State the non-goals.** What must this never produce? And which rule wins when two collide? Contradictory requirements get followed anyway, and they produce the worst output.

Then the cheapest move of all: read the questions your agent does ask you. Each one is a location.

My file still has sentences in it. The difference now is that when a draft comes back wrong, I look for the open decision instead of adding another rule. The rule I add costs a day to discover. The decision I should have written down costs a minute.
