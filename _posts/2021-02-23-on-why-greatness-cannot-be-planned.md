---
layout: post
title: "On \"Why greatness cannot be planned\" and how data science happens in the industry"
date: 2021-02-23
lang: en
ref: greatness-not-planned
comments: true
author: moneda
description: The core concepts from the book and an analysis on how they could be applied in a company using Data Science
image: ../../../images/greatness/fleur-SE2zTdS1MNo-unsplash.png
---

## Index

1. [Introduction](#introduction)
2. [Core ideas](#core-ideas)
    - [The myth of the objective](#the-myth-of-objective)
    - [Be a treasury hunter](#be-a-treasury-hunter)
3. [How does it apply in a company?](#how-does-it-apply-to-a-company)
4. [How much of innovation is expected from a company?](#how-much-of-innovation-is-expected-from-a-company)
5. [Creating an environment for innovation in a company](#creating-an-environment-for-innovation-in-a-company)
6. [Conclusion](#conclusion)
7. [References](#references)

## Introduction

After facing the "Why greatness cannot be planned: the myth of the objective" [^fn1] link for the third time in a Twitter thread about AI research, I finally decided to read it. Though the book brings a general message, since the authors are AI researches themselves, many examples come from the field and there's a case study about it.

<div align="center">
<figure>
	<a href="../../../images/greatness/cover.jpg">
		<img  style="width:250px;margin:10px" src="../../../images/greatness/cover.jpg"/>
	</a>
</figure>
</div>

But my main interest was about AI in a company, and that's the thing I've reflected during the reading. Since I've felt provoked, uncomfortable and challenged during the read, I feel I had something to learn from it. Here I share the book concepts and my thoughts.


## Core ideas

### The myth of the objective

Objectives are harmful, especially when we talk about ambitious goals. The authors do accepted the usefulness for simple or nearly to be achieved goals.

The book brings a recurrent example about [PicBreeder](http://picbreeder.org/), a site where users can mix images and the most interesting results come from unplanned paths after different users start from other users' results.

The main allegory used is about stepping stones in a river. The path to ambitious goals is not clear and visible, we can only go from one stepping stones to the other, and that's when we start using objectives.

<div align="center">
<figure>
	<a href="../../../images/greatness/homer.jpg">
		<img  style="width:250px;margin:10px" src="../../../images/greatness/homer.jpg"/>
	</a>
	<figcaption>To find Homer, one shouldn't look for Homer. Source: PicBreeder</figcaption>
</figure>
</div>

Objectives supposedly help to guide, give people's direction. It's the success compass. You define a couple of objective metrics and then you can monitor them to know if you're progressing.

The argument is that it's a false compass. A breakthrough is not preceded by something as important or similar. It includes a disruption. Though cars are faster than horses, cars are not faster horses, which is a classical example.

The authors, Lehman (2011) [^fn2], did AI research on this by changing the objective function of an agent to look for novelty instead of a metric of how close it is from the objective. For a agent in a small maze trying to find its way out, their results show how the novelty search could improve the performance of achieving a goal by not directly optimizing to achieving it. In more complex cases the novelty search struggle, but the argument is that if objective based agents can't win in a simple problem, what is its chance in a complex one?

Because of these pieces of evidence, objective is framed as a discovery killer, a false guide to great ambitions, something to avoid at all cost, in which consists the book's paradox: great achievements become less likely when we define objective, to make it more likely to do it, it's needed to not define it.

### Be a treasury hunter

The escape from the previous scenario is to be a treasury hunter. First, we accepted there's no single search algorithm that can find, following Wolpert (1995) [^fn3] no free lunch theorem.

And the algorithm for treasury hunt is to follow novelty and interestingness. Past is a guide for novelty, because we know how things were before. Novelty then can be a guide for interestingness, since we are explaining regions people were not there and it can lead to unknown things. So it means potential. Deviate from the past.

For the treasure hunt consensus can be harmful. The way to go is by separating people from each other, in a way people only interact by taking off from where someone else left. While many might have their own objective, the system as a whole end up lacking a unified objective because people's objectives differ. One should provide stepping stones to the others.

We should search for everything and anything that's valuable without looking for something in particular.

> Not knowing where we're going is the way of the information accumulation, it's the treasury hunter, it's the stepping stones collector, it's the path to everywhere and nowhere, it's the tunnel to the future.
>
> -- <cite> Stanley, Kenneth O., Lehman, Joel; Why greatness cannot be planned</cite>

And this is hard!

The path to innovation is not a naive from worse to better. You need to be prepared to experience other ordering. And novelty depends on what we have seen before, it doesn't progress from bad to good, but from simple to Complex.

## How does it apply in a company?

Objectives would work for extremely short-term and visible goals, but this can be horrible! Companies are accustomed to defining Objective Key Results (OKRs) to guide its team to the right direction, and I guess this one of the most harmful things you can do with a team if not done properly.

Here's an example: let's say our OKR is to grow 50% this year.

If the company is already kind of growing, but when the team assume the current growth rate and the objective it gets reasonably below, the natural thing to do is to improve the current process, make incremental changes.

Do you have an ML model in this process? Make a better next version. Do you do marketing campaigns? Make them more effective, improve conversion.

Back to the cars and horses example, an OKR of a 10% faster transport would most likely make people focus on how to make horses 10% better than trying to find a completely different way of doing it.

And this is the trap that make Data Science and Machine Learning people always prioritize the next version of a model involved in an important OKR.

But notice that having an impossible OKR is not a solution! Because it's exactly the worse case: an ambitious goal. This is another case an OKR is going to be misleading.

As highlighted by the authors, one of the main reasons we end up sticking to objectives in general is a fear of risk. Those allocating resources don't want so much risk so resources get wasted in incremental projects.

## How much of innovation is expected from a company?

For a company, innovation might mean revealing a nearly stepping stone no one realized it was there. But if it's a nearby thing, it's more likely other players will follow the same way at pretty much the same time.

It's easy to see that companies can't keep collecting stepping stones indefinitely. In fact, it sounds like a cool definition for Startups. But by not collecting any at all, or not being able to communicating them from small groups to other groups inside the company, it's just waiting to a new player disrupt it and get pushed out of the market.

But instead of proposing a balance, which is something the authors argue it's very natural, we can think about how to do a minimal of short-term objectives to enable ambitious achievements.

## Creating an environment for innovation in a company

So here's the list of things we need:

- Clear business constraints (they don't need to be OKRs)
- A good understanding of the past and the present
- Educated people to know what interestingness means in their field and the company context
- Make everyone's stepping stones visible to everybody
- Make room for disagreement, controversy
- No uniform performance assessment

My suggestions are purely investigative, personal and things I'd love to try - and I hope I can experience some of them and write about this subject again.

### Clear business constraints

People will naturally have it in their minds when looking to the most interesting path. If you're working with fraud, you know you can't let too many cases to happen, otherwise you're out of business.

So instead of having metrics as objectives via OKRs, a team must have a few constraints to keep the business profitable. Which means stop pushing to improve the metric, like: "Prevent 90% of the fraudsters. Now 92%, then 94%...", and just define the minimum acceptable value: "we need to operate blocking at least 90% of the fraud cases".

It doesn't mean you can't have a list of important metrics you monitor daily or weekly. You will keep it. It's just not your goal to move it, though you'll if you succeed on the treasury hunt.

Though the authors tell us we don't need to constraint to avoid meaningless options, that the impossibility of taking most of the options is enough to make the stepping stones behaviors that actually work, here I'm considering constraints the "business impossibilities" that might not be clear to everybody, like "we can't survive with this cash flow".

### A good understand of the past and the present

To be able to compare past and present to a next step to evaluate how novel and interesting it is, people need to understand past and present. And this is sometimes hard in a company.

In academia, it's part of the PhD training to review the bibliography, in a company people are at most onboard in a brief period with high level information.

So Documentation, accessibility and an effort to make the company's journey clear and show how was the process of collecting the stepping stones to get to where you are is essential.

As a data scientist, I enjoy and enforce the creation of different artifacts during model creation. Research phase is also documented with short takeaways.

### Educate people to know what interestingness means

It's expected you're hiring Data Scientists and Machine Learning Engineers with a great basic knowledge to know what is novelty in ML. So hiring well and educating people to a point they can see other teams' presentations and identify the stepping stones they are offering to them.

But then there's the business side of it. How could someone knows that doing a certain process with a certain model had and effect X and X is interesting? I think here we get really close to the trap of defining an objective. I'd set this as a general vision, principles, or values.

So if customer satisfaction is a company core value, things relate to it get more interesting. Remember what was considered an interesting outcome for PicBreeder: images about things humans consider interesting. So in a company it's the same thing, the sense about interesting should come from : things this company considers interesting.

At the same time, there was no particular objective on PicBreeder, and the same thing goes for company: it shouldn't define it.

### Make everyone's stepping stones visible to everybody

If there's something valuable in having different areas, groups and people looking to different aspects of a business is the divergence search it provides to the whole system. But then **it needs to be communicated**.

It's needed to have an efficient system to share interesting results. And this is completely different from the company wide communications talking about the current stage of the OKRs, on going projects stages, and deployed solutions, because any of those things is offering stepping stones, they are executive summaries.

It's for sure a challenge to communicate in the right level and don't overwhelm. But if a group get attained to novelty and interestingness, they can filter their communication to focus on this. Think about your last project. Now try to list the surprising results and novel stuff from it. There'll be only a few, it's a way shorter thing to spread than communicating the whole project.

The teams I working on both influenced and took certain paths influenced by other teams. It's very common DS people can identify it during an 1-2h presentation, but it won't scale. You can't attend many 1h project presentations hopping to get something new.

It needs to be something like a novelty-tweet thing.

### Make room for disagreement

Consensus was stated as harmful, and if there's something management looks in a company is consensus from stakeholders by informing and giving visibility on their teams objectives. So we don't just define them, but we make them converge to upper management view of importance.

So a company should be made of controversy. You shouldn't feel comfortable with everything your direct reports are doing, but at least a few people in the company are! And then you should let it go this way instead of negotiating something in the middle.

The same things goes about your discovery path and your manager, until you get to the point you shouldn't have consensus even from the company board.

### No uniform performance assessment

Performance management should balance stepping stones collections and impact. If we already have the common behavior of the resources owner not wanting to take risks, and we combine to motivating everyone else in the company to not risk also, then the whole thing is doomed.

Drive impact is easier following objectives, short-term, or even... nearby innovation, which is desired.

But if we don't incentive stepping stones collections, how could anyone reach nearby innovation by use its own or getting from the others?

If you balance novelty and impact, then we could at least collect a few new interesting facts, while delivering some short-term stuff or executing innovation enabled by previous stepping stones.

Enforcing uniform assessment will make people converge, it undermines future discovery, people can't  explore new ways.

It's needed to give people back their intuition, autonomy, and creativity.

Performance Management is not the problem, but using a standard metric for it to pursue ambitious objectives. A good way of doing it is to assess where you are in respect to where you were instead of where you want to be.

## Conclusion

It was certainly an interesting reading! I couldn't stop thinking about how I'd change things in my work environment to give it a chance. From the suggested things, some are hard to imagine in place, others are closer to local decisions I'd be very open to try.

## References

[^fn1]: Stanley, K. O., & Lehman, J., Why greatness cannot be planned: the myth of the objective (2015), : Springer.
[^fn2]: Lehman, J., & Stanley, K. O., Abandoning objectives: evolution through the search for novelty alone, Evolutionary computation, 19(2), 189–223 (2011).
[^fn3]: Wolpert, D. H., Macready, W. G., & others, , No free lunch theorems for search (1995).

Preview image by [@yer_a_wizard](https://unsplash.com/@yer_a_wizard).
