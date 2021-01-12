---
layout: post
title: "Spurious correlation, machine learning and causality"
date: 2021-01-12
lang: en
ref: spurious-correlation
comments: true
author: moneda
description: Definitions and the many faces around the spurious correlation term.
image: ../../../images/spurious/x-mutant.jpg
---

## Index

1. [Introduction](#introduction)
2. [Pearson tying spurious correlation to causation](#pearson-tying-spurious-correlation-to-causation)
3. [Spuriousness as a transient state, a nonsense relationship](#spuriousness-as-a-transient-state-a-nonsense-relationship)
4. [Reichenbach’s common cause principle](#reichenbachs-common-cause-principle)
5. [Pearl, a precise causal interpretation and a general framework to spot spuriousness](#pearl-a-precise-causal-interpretation-and-a-general-framework-to-spot-spuriousness)
6. [How does it impact Machine Learning?](#how-does-it-impact-machine-learning)
7. [Environments](#environments)
8. [Causal relationships can still suffer from bias](#causal-relationships-can-still-suffer-from-bias)
9. [How does concept drift fit?](#how-does-concept-drift-fit)
10. [Conclusion](#conclusion)
## Introduction

When we look to the definition of spurious correlation as something not genuine or counterfeit, and the way we informally use it in the data science community it sounds quite right, but when we put the many contexts in which we apply this term, its definition becomes blur, which makes the whole discussion of the different challenges under the "spuriousness" term difficult.

In the "Wy should I trust you?" by Ribeiro (2016) [^fn20], model inputs that introduce spurious correlations are contrasted with features that are informative in the real world. Then the Wolf Vs Husky classifier example is presented and, though it's not directly said, the snow is seemed as a spurious correlation, which is also called "undesired correlation" in the article.

<div align="center">
<figure>
	<a href="../../../images/spurious/husky.jpg">
		<img  style="width:600px;margin:10px" src="../../../images/spurious/husky.jpg"/>
	</a>
</figure>
</div>

In this example we classify as a bad model one that mostly or exclusively uses the "snow" to split the classes. So here we tie the spurious correlation definition to a specific task, model, dataset, or even a combination of them. In this direction, spuriousness become a relative concept instead of an absolute definition about two variables.


As Léon Bottou says on the ["Learning Representations Using Causal Invariance"](https://www.youtube.com/watch?v=yFXPU2lMNdk) presentation, though it's a bad model, it's statistically right in this static image dataset. And that's the problem: it's working as intended, but it's wrong.

Let's take a look in another spurious correlation case.

We all end up at some point laughting about the correlations presented by the famous collection in "Spurious correlation" [^fn3]. We feel confident as something so ridiculous would never fool our validation strategy. But what if we have the following split?

<div align="center">
<figure>
	<a href="../../../images/spurious/spurious-site.jpg">
		<img  style="width:600px;margin:10px" src="../../../images/spurious/spurious-site.jpg"/>
	</a>
</figure>
</div>

Still! We would certainly say it's nonsense, temporary and an extreme coincidence. Well, it's easy to spot it in a two-variable scenario, but it might become hard as the number of variables involved grow.

One last example to illustrate the discussion. I've organized a dataset containing news about Brazilian soccer clubs from 2015 and I update it monthly.

In an NLP task to identify what is the club-subject the author is talking about using the words contained on it, we'll find a lot of cases like the one below: a player can transfer to a new club and change how his name is associated with it. Is it the feature about this player spurious?

<div align="center">
<figure>
	<a href="../../../images/spurious/guerrero.jpg">
		<img  style="width:600px;margin:10px" src="../../../images/spurious/guerrero.jpg"/>
	</a>
</figure>
</div>

Here the correlation is for sure not an accident, but it's transient. It's clear a specific club is not defined by a specific player: they come and go, we still recognize it as the same club.

Let's go through previous discussions and definitions about spurious correlation to be able to get a better grasp on spuriousness and manage these cases.

## Pearson tying spurious correlation to causation

For someone known for the "Pearson correlation", funnily, Pearson [^fn2] starts from a causation definition before he states the importance of this wider association type called correlation, which ranges from absolute independence to complete dependence.

> If the unit A be always preceded, accompanied or followed by B, and without A, B does not take place, then we are accustomed to speak of a causal relationship between A and B
>
> -- <cite>Pearson [^fn8]</cite>

Then, having the notions of causation and correlation, Pearson defines the spurious correlation.

> Causation is correlation, except when correlation is spurious, when correlation is not causation.
>
> -- <cite>Pearson [^fn2]</cite>

So from everything that's associated, when it's not via a causal relationship, it's a spurious association. For Pearson correlation is powerful because, though it's not always causation, sometimes it is! And now people were equipped with the power of estimating this association factor.

## Spuriousness as a transient state, a nonsense relationship


Yule (1926) [^fn4] presents the kind of relationship we consider funny and nonsense.

> ... But what one feels about such a correlation is, not that it must be interpreted in terms of some very indirect catena of causation, but that is has no meaning at all; that in non-technical terms it is simply a fluke, and if we had or could have experience of the two variables over a much longer period of time we could not find any appreciable correlation between them
>
> -- <cite>Yule [^fn4]</cite>

The fact it's nonsense make us associate it to a transient relationship - otherwise, a persistent "strange correlation" would push humanity to research it until it's not nonsense.

The Husky and club news examples don't seem to fit here. While the correlation between US spending on science and Suicides does fit.

Yule (1926) characterizes this case as a result of small samples in a period which is shorter than the needed to give us the true correlation.

Though the discussion in the article and the examples from Spurious Correlation website are about this exact case - time series in a reasonably short time - it's not that rare this kind of nonsense correlation happens in large tabular data. If we take the parallel of something that happens by chance and that we would probably not keep observing as time passes by, there are features which  correlate with the target in supervised learning even if shuffled. A fact that enabled feature selection procedures like Permutation Importance (Pimp) [^fn9].


## Reichenbach's common cause principle

Reichenbach (1956) [^fn11] introduces a third variable to define causality on his common cause principle, extracted from Peters (2017) [^fn15]:

_If two random variables_  $$X$$  _and_ $$Y$$ _are statistically dependent_ $$(Y \not \perp \!\!\! \not \perp X)$$ _then exists a third variable_ $$Z$$ _that causally influences both. (As a special case,_ $$Z$$ _may coincide with either_ $$X$$ _or_ $$Y$$_.) Furthermore, this variable_ $$Z$$ _screens_ $$X$$ _and_ $$Y$$ _from each other in the sense that given_ $$Z$$_, they become independent,_ $$X \perp \!\!\! \perp Y$$.

So this third variable $$Z$$, also known as confounder when not in the special case, now becomes a source of a spurious correlation.

A classical example of the common cause is the observed correlation between ice cream consumption ($$X$$) and crime rate ($$Y$$), which is confounded by day temperature ($$Z$$). So in the summer, when it's hot, people consume more ice cream, but they are also occupying more public spaces and more prone to crimes.

We represent it in the following causal directed acyclic graph (DAG), a graphical representation where causes are connected to effects by an arrow.

<div align="center">
<figure>
	<a href="../../../images/spurious/ice-cream-dag.jpg">
		<img  style="width:450px;margin:10px" src="../../../images/spurious/ice-cream-dag.jpg"/>
	</a>
	<figcaption>Resources from clipartmax.</figcaption>
</figure>
</div>

See how now it's part of the causal structure that define the phenomena involving $$X$$, $$Y$$ and $$Z$$, which does not sound well with the *non-sense* view of spuriousness - we can come up with a little story to explain it. We are not talking about something we observe by chance, but $$Z$$ would cause this confusion about $$X$$ and $$Y$$ under every circumstance.

Notice this principle does not cover other source of non-causal association between $$X$$ and $$Y$$ which is not related to a common cause, but by conditioning in a common effect, which creates selection bias.

## Pearl, a precise causal interpretation and a general framework to spot spuriousness

As noted by Simon (1954) [^fn10], the spurious correlation problem need a "precise and operationally meaningful definition of causality". Reinchenbach (1956) [^fn11] took it further from Pearson's definition, then Pearl (2009) [^fn5] introduced the context to make it more general and precise and a whole set of results and operational tools for causality.


We can define the spurious association with temporal information (the option for the temporal is due to not being necessary to prove spuriousness in both directions):

_Two variable_ $$X$$ _and_ $$Y$$ _are spuriously associated if they are dependent in some context_ $$S$$, _if_ $$X$$ _preceeds_ $$Y$$_, and if there exist a variable_ $$Z$$ _satisfying_:

$$
\newcommand{\indep}{\perp \!\!\! \perp}
\newcommand{\dep}{\not \perp \!\!\! \not \perp}
$$

$$
\begin{align}
\begin{split}
{}& (Z \indep Y \mid S) \\
{}& (Z \dep X \mid S) \\
\end{split}
\end{align}
$$

Context here means a set of variables at specific values - which includes the empty set.

We can extend from this definition that every relationship that leaks from a non-causal path, which is known as the Backdoor path, is a spurious association. A non-causal path is every path in a causal DAG we can connect two nodes (variables) disrespecting the arrow directions. Just as we could do connecting ice cream and robbery in the previous example.

So here it's a persistent problem arising from the same source, but the correlation itself would vary.

## How does it impact Machine Learning?

While backdoor path is a curse for causal inference, it's a glory for predictive tasks in Machine Learning. It's usually the case we don't have access to direct effects, so any "leakage" coming from any direction is a signal and a model can use it to predict the most likely outcome.

But it's a cheap glory, as endless limitations arises from this.

There are numerous drawbacks assigned to this behavior, like the ones pointed in the Husky from introduction. A similar one comes from Beery (2018) [^fn24], but with cows and grass, and camels and sand.

Arjovsky et al. (2019) [^fn25] discuss the implications in ML before offering a new framework to deal with it, which I'll cover in a future post.

> Intuitively, a correlation is spurious when we do not expect it to hold in the future in the same manner as it held in the past.  In other words, spurious correlations do not appear to be stable properties.
>
> -- <cite>Arjovsky et al. [^fn25]</cite>

But this stability is not only in respect to the future. A dataset can be generated by different data generating process, like the methodology of collection. Imagine a healthcare dataset collected from different hospitals, or in different countries. Or a computer vision dataset with pictures taken from different cameras.

This breaks one of the most important assumptions for the Empirical Risk Minimization paradigm in supervised learning: train and test come from an i.i.d sample from the sample distribution.

> the i.i.d. assumption is the great lie of machine learning.
>
> -- <cite>Zoubin Ghahramani [^fn21]</cite>

In a past presentation about Validation, the process to verify if a certain model generalizes, I warned about something I've learned from real-life applications: $$X$$ is mutant!

<div align="center">
<figure>
	<a href="../../../images/spurious/x-mutant.jpg">
		<img  style="width:250px;margin:10px" src="../../../images/spurious/x-mutant.jpg"/>
	</a>
	<figcaption><a href="https://lgmoneda.github.io/resources/presentations/validation.pdf">Source</a></figcaption>
</figure>
</div>

In this same presentation some methods to validate were presented, like splitting the data between training-past and testing-future, so one could assess how dependent on spurious relations from the specific contexts presents in the past the machine learning model is.

As Arjovsky et al. (2019) [^fn25] states: shuffling data is something that we do, not something Nature does.

The authors bring yet another caveat of how ML is impacted: in over-parameterized models, like Neural Networks. The procedure that we are used to train it is going to prefer the solutions with the smallest capacity, a measure of the representational power of a model. This makes these models prefer simple rules instead of complex relationships, and it might be the case this simple rule is spurious, like associating the green color to recognize cows instead of a full profile of its shape.

Notice this is one of the sources of overfitting, a situation our model has learned the idiosyncrasies of the training set and fails to generalize. It's not the only source, since it's easy to show one can use a very complex model to learn sample by sample from a training set and fail to generalize in a test set which was indeed sampled from the same distribution from train.

## Environments

To make the discussion about the relationship between machine learning and spurious correlation more
interesting, we bring two other concepts into play: intervention and environment (or context).

We need to define intervention because it's needed to define environments.

An intervention consists in replacing one or more of the equations presents in a Structure Equation Model (SEM). It's basically changing the causal relationship between the variables of our problem. A /valid intervention/ is one that does not destroy too much the causal relationship involving $$Y$$, the variable of interest we're trying to predict.

Then the set of environments $$\epsilon_{all}$$ is composed by all the possible cases generated by all possible valid interventions in a SEM as long as the interventions keep the graph acyclic, it doesn't change $$\mathbb{E}[Y \mid Pa(Y)]$$ and the variance $$V[Y \mid Pa(A)]$$ if finite.

To exemplify, we use the same illustrative case from Arjovsky et at (2019) [^fn25]:

<div align="center">
<figure>
	<a href="../../../images/spurious/arjovsky-2019-example.png">
		<img  style="width:250px;margin:10px" src="../../../images/spurious/arjovsky-2019-example.png"/>
	</a>
</figure>
</div>

This is the causal graph that represents the following Structured Equation Model (SEM):

$$
\begin{align}
\begin{split}
X_1 {}& \leftarrow \mathbb{N}(0, \sigma^2) \\
Y {}& \leftarrow X_1 + \mathbb{N}(0, \sigma^2)  \\
X_2 {}& \leftarrow Y + \mathbb{N}(0, 1)  \\
\end{split}
\end{align}
$$

The $$\sigma^2$$ is the thing we can vary to represent different environments. Imagine we could have some environments in the training data ($$\epsilon_{tr} = \{\text{replace } \sigma^2 \text{ by } 10, \text{replace } \sigma^2 \text{ by } 20\}$$).

Then the authors show how the linear model built with this data can be different depending on the variables we use and the environment $$e$$ when we want to predict $$\hat{Y}^{e} = X_1^e \hat{\alpha}_1 + X_2^e \hat{\alpha}_2$$:

- Regress using $$X_1^e$$ and obtain $$\hat{\alpha}_1 = 1$$ and $$\hat{\alpha}_2 = 0$$
- Regress using $$X_2^e$$ and obtain $$\hat{\alpha}_1 = 0$$ and $$\hat{\alpha}_2 = \sigma(e)/(\sigma(e) + \frac{1}{2})$$
- Regress using $$X_1^e$$ and obtain $$\hat{\alpha}_1 = 1/(\sigma(e) + 1)$$ and $$\hat{\alpha}_2 = \sigma(e)/(\sigma(e) + 1)$$

See how only the first case give us an invariant estimator, since the other two options depend on $$e$$. And that's how spurious correlations related to idiosyncrasies from the environments available in training will affect the true relationship and make this model likely bad for unseen environments, which we all expect to encounter when deploying a model in real life.

Notice your model would do a pretty good job in a traditional validation schema. If you pool together all the data, shuffle, get a random sample to train and another to test, train and validate, you wouldn't be surprised by anything. Your model would be using the specific correlations present in the training environments to do good in other samples from these same training environments. However, this won't be the case in production. And it would be better to have learned the invariant estimator from case 1, even if it means a higher test set error, because it's the best model to face a real world scenario where the environment changes.

So here we can see how **the transient notion of spuriousness is contrasted with the invariance notion for causal**.

## Causal relationships can still suffer from bias

Even if we rely on the mechanism $$P( Y \mid X_1)$$, there are ways causal relationship can be infected. Introducing causal relationships into ML makes us take advantage of them, but it also brings all of its challenges, like hidden confounding and lack of identifiability.

Let's use a slightly modified example from the previous causal graph and make the environment explicit as something that defines $$X_1$$ and $$X_2$$.

<div align="center">
<figure>
	<a href="../../../images/spurious/env-example.png">
		<img  style="margin:10px" src="../../../images/spurious/env-example.png"/>
	</a>
</figure>
</div>

Someone or some process could filter examples based in the $$X_2$$ value, which opens a non-causal path between $$X_1$$ and $$Y$$. By doing so, even if you use only $$X_1$$ to estimate your model, it won't retrieve the invariant estimator. Even if we are able to control by the Environment, the selection bias might have compromised the positivity ($$P(X_1 \mid \text{Environment}) > 0$$) and make it impossible to estimate the real relationship between $$X_1$$ and $$Y$$.

## How does concept drift fit?

There are many things under the dataset shift or concept drift definition. Here we'll expose only two concepts, the virtual concept drift and the real concept drift.

- Virtual concept drift: $$P(X)$$ changes;
- Real concept drift: $$P(y \mid X)$$ changes;

Basically, in the virtual, the input distribution change. In the real, a mechanism, the way we map inputs to outputs, changes. These concepts are illustrated by Kadam (2019) [^fn22]:

<div align="center">
<figure>
	<a href="../../../images/spurious/concept-drift.jpg">
		<img  style="width:450px;margin:10px" src="../../../images/spurious/concept-drift.jpg"/>
	</a>
</figure>
</div>

When the virtual concept drift happens, there's little to worry. You might want to review the policy you have built on top of the model, since the distribution of input cases has changed and the previous decision-making process can imply different things. Your model aggregated metric is different in a sample with such different mix of examples.

There's nothing causal or anti-causal in the inputs' distribution.

When we are estimating $$\hat{Y}$$, we're interested on its mechanism. In the examples above, we saw the mechanism of interest was $$P(Y \mid X_1)$$. So even if a real concept drift happens to $$P(X_2 \mid Y)$$, it shouldn't be a problem if we have learned the invariant predictor. So here's another downside of using spurious correlations: it exposes you to changes in components you shouldn't even been using.

As said, we don't let intervention to be made in the variable of interest ($$Y$$) to be considered a new environment. In this case, it's a sole concept drift problem and the model needs to be retrained to learn the new concept.

After all the definitions, we can get back to the third example from the introduction, the one about players and clubs. It's the trickiest. It might be the case we shouldn't expect the term $$P( Club \mid \text{Specific Player})$$ to be invariant, because it's not a causal mechanism when we draw the DAG for this specific case. Even if it's the case, there's a chance a "social phenomena" suffers more of real concept drift and it's far from the invariance expected for physical laws. Here we might be obligated to do a trade-off between including more causal terms prone to real concept drift to have a better performance in the short term - as changes in the environment can be related, for example, the series of interventions that define the next environments might change first the relationship with player A and Club X, then of the player B, and so on.

## Conclusion

In order to describe spurious correlation we end up talking a lot about causality, prediction problems from Machine Learning, environments and concept drift.

One very special property was identified: Invariance, which is really cool and deserves a particular discussion.

It should be clear spurious correlations are a way more harmful problem than the cheerful examples we use to illustrate it suggest, which always sound far from the day-to-day application.

Since causality is tied to the spuriousness, part of Machine Learning development seems to go through it.

---


[^fn2]: Aldrich, J., & others, [Correlations genuine and spurious in pearson and yule](https://projecteuclid.org/download/pdf_1/euclid.ss/1177009870), Statistical science, 10(4), 364–376 (1995).
[^fn3]: [Tyler Virgen, Spurious Correlations website](https://www.tylervigen.com/spurious-correlations)
[^fn4]: Yule, G. U., Why do we sometimes get nonsense-correlations between time-series?--a study in sampling and the nature of time-series, Journal of the royal statistical society, 89(1), 1–63 (1926), page 4.
[^fn5]: Pearl, J., Causality (2009), Cambridge, UK: Cambridge University Press.
[^fn8]: Pearson, K., On a form of spurious correlation which may arise when indices are useed in the measurement of organs, In , Royal Soc., London, Proc. (pp. 489–502) (1897).
[^fn9]: Altmann, André, Tolocsi, Laura, Sander, O., & Lengauer, T., Permutation importance: a corrected feature importance measure, Bioinformatics, 26(10), 1340–1347 (2010)
[^fn10]: Simon, H. A., Spurious correlation: a causal interpretation, Journal of the American Statistical Association, 49(267), 467–479 (1954).
[^fn11]: Reichenbach, H., & Reichenbach, M., The direction of time, ed (1956)
[^fn12]: Alcorn, M. A., Li, Q., Gong, Z., Wang, C., Mai, L., Ku, W., & Nguyen, A., Strike (with) a pose: neural networks are easily fooled by strange poses of familiar objects, In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 4845–4854) (2019).
[^fn13]: Eykholt, K., Evtimov, I., Fernandes, E., Li, B., Rahmati, A., Xiao, C., Prakash, A., …, Robust physical-world attacks on deep learning visual classification, In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 1625–1634) (2018).
[^fn15]: Peters, J., Janzing, D., & Schlkopf, B., Elements of causal inference: foundations and learning algorithms (2017), : The MIT Press.
[^fn20]: Ribeiro, M. T., Singh, S., & Guestrin, C., Why should i trust you?" explaining the predictions of any classifier, In , Proceedings of the 22nd ACM SIGKDD international conference on knowledge discovery and data mining (pp. 1135–1144) (2016).
[^fn21]: [Panel of Workshop on Advances in Approximate Bayesian Inference (AABI) 2017](https://www.youtube.com/watch?v=x1UByHT60mQ&feature=youtu.be&t=37m34s)
[^fn22]: Kadam, S., A survey on classification of concept drift with stream data, , (),  (2019).
[^fn24]: Beery, S., Horn, G. v., & Perona, P., Recognition in terra incognita (2018).
[^fn25]: Arjovsky, M., Bottou, L., Gulrajani, I., & Lopez-Paz, D., Invariant Risk Minimization (2019).
