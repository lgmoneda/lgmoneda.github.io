---
layout: post
title: "The pessimist and the optmistic view of bias in Machine Learning"
date: 2019-02-17
lang: en
ref: bias
author: moneda
description: On how different bias in ML has been perceived
---


Recently I have faced two different views on Machine Learning bias. The first one I'd argue it's over pessimistic: "A.I. Could Worsen Health Disparities" [^fn1]. The three points made could be considered bad data science practices. One shouldn't judge it though, since data science is a pretty new field in the industry and the community is yet learning about its unknown unknowns. 

## Could AI worsen disparities?

The fact we're applying AI on Health is only relevant because it's a critical application, it doesn't offer novel challenges. Three arguments are provided:

> The first is a training problem. A.I. must learn to diagnose disease on large data sets, and if that data doesn’t include enough patients from a particular background, it won’t be as reliable for them. Evidence from other fields suggests this isn’t just a theoretical concern. A recent study found that some facial recognition programs incorrectly classify less than 1 percent of light-skinned men but more than one-third of dark-skinned women. What happens when we rely on such algorithms to diagnose melanoma on light versus dark skin?

A model try to minimize errors without concerns of what are the examples provided. It means that for a model it's useful to be good on the majority class for categorical features. So if you have a majority examples of white people and only a few from black ones in a dataset, if the model predicts accurately for the white ones, you won't notice on your aggregated metrics. 

What could one do for this case? 

We call these categorical features "sensitive groups". So one should identify the sensitive groups on the problem he's working on and validate and monitor accordingly to them. It means you should split your metric for them. Just filter your validation set for each one of the groups and calculate your performance metrics, so you know how good is your model for every group you care about. 

Also, after deploying your model, you can also monitor it's performance for each group.

But what if the metrics are different? You can return to the modeling phase and give those examples more importance. Since the model will try harder to predict them right, it'll probably have a lower accuracy overall. 

> Second, because A.I. is trained on real-world data, it risks incorporating, entrenching and perpetuating the economic and social biases that contribute to health disparities in the first place. Again, evidence from other fields is instructive. A.I. programs used to help judges predict which criminals are most likely to reoffend have shown troubling racial biases, as have those designed to help child protective services decide which calls require further investigation. In medicine, unchecked A.I. could create self-fulfilling prophesies that confirm our pre-existing biases, especially when used for conditions with complex trade-offs and high degrees of uncertainty. If, for example, poorer patients do worse after organ transplantation or after receiving chemotherapy for end-stage cancer, machine learning algorithms may conclude such patients are less likely to benefit from further treatment — and recommend against it.

The point about the model incorporating human bias because the training examples come from human judge can be split:

1. Yes, it does happen, biased data produces biased models;
2. If you don't worry about human bias and you don't fight it, why would you bother if it's a human or a machine acting biased?;
3. One should know it exists to not claim ridiculous things like "a model can't be biased because it's math".

In my opinion, for biased data you have to focus on the output and not on the input. Though it's not a consensus what fairness in ML means, monitoring output and the action it's going to take is all you can do to not be surprised by its results. Of course, you can't avoid all the possible awful results, but you can monitor the sensitive groups performance. 

> Finally, even ostensibly fair, neutral A.I. has the potential to worsen disparities if its implementation has disproportionate effects for certain groups. Consider a program that helps doctors decide whether a patient should go home or to a rehab facility after knee surgery. It’s a decision imbued with uncertainty but has real consequences: Evidence suggests discharge to an institution is associated with higher costs and higher risk of readmission. If an algorithm incorporates residence in a low-income neighborhood as a marker for poor social support, it may recommend minority patients go to nursing facilities instead of receive home-based physical therapy. Worse yet, a program designed to maximize efficiency or lower medical costs might discourage operating on those patients altogether.

Here it's about actions taken using the model prediction having different effects for different groups. You can build more complex policies when using a model output and include variable costs and benefits depending on other characteristics available at action time. 

## The optimistic

After my comments it may be clear that I'm more on the optimistic side. However, on its Blog, Coursera tone looks they may have overlooked it a little. 

> Coursera’s experience underscores the fact that although there is no silver bullet for avoiding algorithmic bias, it’s also not too complicated a problem to fix, either. In fact, it’s more a matter of awareness than a difficult engineering problem to solve, and it begins with the knowledge that artificial intelligence is by no means perfect. According to Bakthavachalam, data scientists must avoid treating machine learning algorithms as black boxes because “if you don’t know what’s going on under the hood, it’s hard to imagine and diagnose issues.”

It's not that simple to know everything that happens under the hood. Also, you may not even know what you would have to look under the hood! 

At the end, we're in an exciting time of fairness definition for ML applications and everybody should share metrics, concepts and monitoring tips to ensure we're not hurting.

## Bibliography

[^fn1]: Khullar, Dhruv. New York times. [A.I. Could Worsen Health Disparities](https://www.nytimes.com/2019/01/31/opinion/ai-bias-healthcare.html)
[^fn2]: Coursera Blog. [Not All Data Is Created Equal](https://blog.coursera.org/ds-academy-not-all-data-is-created-equal/?utm_campaign=DSblog_02112019&utm_medium=social&utm_source=tw)

