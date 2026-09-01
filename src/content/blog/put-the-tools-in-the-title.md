---
title: "Put the Tools in the Title"
description: "Same story, two subreddits, two titles — and the post with a broken body won. On distribution surfaces the title is the product: name the tools, pass the one-second test, and spend your review budget there."
socialTitle: "Put the Tools in the Title"
ogCategory: "Field Note · Content Systems"
pubDate: "Sep 1, 2026"
---

Same story, two subreddits, two titles. The post that won shipped with a broken body — leftover LLM instruction text sitting at the top, telling readers to "post a comment of stuff." The clean post finished second. The difference was the title, and it's the cheapest distribution fix I've found in months.

I posted my Discord-versus-Telegram writeup to the Hermes and OpenClaw communities this morning. Same source material, same day, both versions produced by my pipeline from the same flagship post (full three-setup breakdown here: https://engineering.kenmazaika.com/blog/discord-vs-telegram-agentic-work/). The r/hermesagent post was titled "Telegram was easier to set up. Three setups later, my agent lives on Discord." The r/OpenClaw post was titled "Thread per project, file for the long stuff: how I organize my OpenClaw agent home."

The first one took off. The second got traction and stopped there.

And here's the part I keep coming back to: the first one is the one that shipped broken. The LLM had left its own instructions in the body — "post a comment of stuff" — and I only caught it after it was live. I fixed it, and it still outperformed the clean post. Exact engagement numbers I'm not publishing; Reddit's API is login-walled and I'm not scraping my own posts [UNVERIFIED]. The direction was unambiguous.

That's not an argument for shipping broken posts. It's the cleanest demonstration I've had of where distribution actually happens. On Reddit, the reader's entire pre-click decision is the title, the subreddit, and a thumbnail. The body only matters after the click. The winning title did the selling before anyone read a word: it named the actual subject — Telegram, Discord — and made a claim. The reader could tell in one second whether it was for them. "I use Telegram and I use Hermes. This post is for me."

The losing title named the workflow instead. "Thread per project, file for the long stuff" is accurate — and forgettable to a stranger skimming a feed. That's the whole difference, and it's the same thing that keeps getting recommended to me about every post I ship: put the tool name in the title.

To be fair, two variables changed at once. The Hermes subreddit is smaller and more active than the OpenClaw one, so community dynamics did some of the work. I'm not going to pretend this was a controlled experiment. But the mechanism is real, and it's repeatable.

The formula that keeps working: your tool, the other side of the comparison, and the subtool when it matters. Hermes and OpenClaw. Telegram and Discord. Tool names are the vocabulary your reader already thinks in. Put them in the title and the skimmer self-identifies — that's the click, and the upvote, and the comment. Leave them out and the reader has to do work to figure out if the post is for them. On a feed, nobody does that work.

The one-second test: read your title cold and ask whether you can tell, within a second, who it's for and what it's about. My losing title fails it. The winning one passes on the first syllable.

The same principle carries to the blog, because the tool-named title is also the search term — "Telegram Discord," "Hermes OpenClaw." One line pulls double duty: it wins the skim and it's what people actually type into Google. Google's own docs say the title is often the primary reason someone clicks a result, and descriptive titles with natural keywords beat vague ones. Don't stuff the title with every keyword you can fit — that reads as spam to humans and search engines alike, and it stops self-identifying. Name the tools once, in the natural order.

Here's the part that matters if you run an agent pipeline: my pipeline wrote both bodies, and both were fine. The body was never the variable. When your factory produces every variant, the highest-leverage edit a human makes is the title — one line that decides whether the other six hundred words ever get read. So I've stopped spending review effort polishing variant bodies and started spending it on titles. That's the workflow change this experiment paid for.

Next post you ship anywhere: write the title first, name the tools, run the one-second test. Then let the pipeline do the rest.
