---
layout: post
title: "Judea Pearl's ladder of causation"
date: 2018-06-01
lang: en
ref: book-why
author: moneda
comments: true
description: If not curve fitting, what should I care about?
tags: machine-learning causality
---

After reading the already [famous interview] with Judea Pearl in which he claims that Deep Learning consists basically in "curve fitting", I became even more curious about his work and specially about how he would communicate it in a non-technical book.

## The ladder of causation

As a short intro to the concept of the causal ladder. Judea try to approach the question not by defining causality, but he tries to specify what kind of questions you can answer having a causal model.

For that, he defines what he calls "ladder of causation". The following table shows the definition of each step:

<div align="center">
<figure>
	<a href="../../../images/book-why/ladder-table.png">
		<img  style="width:750px;margin:10px" src="../../../images/book-why/ladder-table.png"/>
	</a>
	<figcaption></figcaption>
</figure>
</div>

As you can imagine, traditional machine learning lies on the first one. It just associates a bunch of variables ($$X$$) to an outome ($$y$$), without any additional information.

He highlights that the world is not made of dry facts (the kind of thing associated in step 1), but they are glued up by causal-effect explanations. And being able to imagine something that isn't a fact is a crucial ability to causal reasoning, since it's pretty much counterfactual estimation: you're trying to find out how something would be if the facts would have been different.

And there's more criticism about deep learning: it'd have succed, in fact, more in showing to us that some tasks we though were hard aren't indeed then it has contributed to machine intelligence.

The **Mini Turing Test** is a test defined by Pearl as a machine being able to answer causal questions about an encoded story, just as a human would be. It's mini because of two reasons: first, it does not require the machine to understand natural language nor being able to communicate using it and, second, the story encode can do in any convenient way to pass the test, the machine does not need to encode it itself.
