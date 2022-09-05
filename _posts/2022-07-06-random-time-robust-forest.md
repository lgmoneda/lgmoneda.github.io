---
layout: post
title: "A Random Time Robust Forest"
date: 2022-07-06
lang: en
ref: randomtrt
comments: true
author: moneda
description: Designing a random version of the Time Robust Forest learning algorithm
image: ../../../images/trtexp/genews_performance_overtime.png
tags: machine-learning research
---

## Index

1. [Introduction](#introduction)
2. [Randomizing the time segments](#randomizing-the-time-segments)
3. [Experiments](#experiments)
4. [Conclusion](#conclusion)

## Introduction

The [Time Robust Tree](http://lgmoneda.github.io/2021/12/03/introducing-time-robust-tree.html) (TRT) [^fn1] is a tree-based learning algorithm that uses timestamp information to learn splits that are optimal for time segments provided by the user, e.g., year. It means a split on a particular feature is only good if it works through all the years present in the data. The hypothesis is that splits that survive the time-test in the training set are more likely to survive it for future unseen periods. It was inspired by algorithms that explore invariance through environments to learn causal relationships. The test of time represents the invariance, while the time segments are the environments.

Something that bothered me while ensembling TRTs into a Time Robust Forest was the lack of randomization of its core design change: the time segmentation. In this post, I explore two alternatives to make it happen and test it on two datasets.

## Randomizing the time segments

The code is available in the [Time Robust Forest package](https://github.com/lgmoneda/time-robust-forest), where code snippets on how to use it can be found in the readme. The experiments' code was adapted from the previous design, and it is not that tidy, but they are available: [GE News](https://github.com/lgmoneda/lgmoneda.github.io/blob/master/images/randomtrt/ge_news_random_trf.ipynb), [Olist](https://github.com/lgmoneda/time-robust-tree-paper/blob/random-trt/experiments/_olist.ipynb).

### Enabling multiple time segments informed by the user

Previously, one could only inform a particular dataset segmentation considering the timestamp information. Either days, months, trimester, years, etc. The hypothesis is that mixing the invariance on different environment granularities can be more powerful. The model now accepts a set of columns representing different segmentations, and every new ensemble estimator will pick randomly from them.

The first practical advantage is ensembling the TRF with a Random Forest (RF) inside the same model since a segment column filled with 1s reproduces an RF. Beyond simply ensembling good models, one can have different availability of features through time. For example, a particular group of features did not exist three years ago. The current TRF does not deal well with these cases, but these features would be used in the RF estimators from the ensemble.

### Random segments

Alternatively, the user can set a maximum number of splits, and the model will order the data according to time, create all the possible segmentations and select randomly from this set for every estimator in the ensemble.

## Experiments

The design and optimal hyper-parameters from a [previous setting](blog post with experiments) were leveraged. The most important part is the data split: we first split using the time information. In-time set is for training and test, while out-of-time is for the holdout set. The same parameters were utilized, except for the number of estimators, which increased from 120 to 400 in all models. We will test the following models:

- Random Forest (benchmark): an RF, which is the TRF using a time column full of 1s;
- Time Robust Forest: a TRF using a single time column selected by the user;
- Random TRF (eng): a TRF using multiple time columns selected by the user;
- Random TRF (few): a TRF using a low value for maximum random segments;
- Random TRF (many): a TRF using a large value for maximum random segments;
- TRF + RF: a TRF using as time columns a time segment and a dummy column with no segment (RF);
<!-- - RF same min examples: a simplified benchmark since more periods force a higher number of minimum examples to split, we train an RF with minimum samples to split equally to the challenger number of segments multiplied by the challenger minimum examples to split parameter. -->
<!-- - RF Similar training error: a TRF we force to have a similar training error than the challengers to make sure regular simpler models wouldn't behave like the challenger; -->

### GE News

The dataset [^fn5] was expanded with more recent examples. In the table below, one of the Random TRF designs shows that the `eng(inerred)` could perform better than the previous challenger, which is the TRF. However, it was not explored how to select from the many options available for a Random TRF - would the Env K-folds select the best option? See the section "Hyper-parameter optimization" from this [post](http://127.0.0.1:4000/2021/12/03/introducing-time-robust-tree.html#the-algorithm).


<table class="styled-table" style="margin-left:auto;margin-right:auto;width:681px">
    <thead>
        <tr>
		<th style="text-align:center">Model</th>
            <th style="text-align:center">Train AUC</th>
			<th style="text-align:center">Test AUC</th>
			<th style="text-align:center">Holdout AUC</th>
        </tr>
    </thead>
	<tbody>
		<tr>
    <td>Random TRF (eng)</td>
    <td style="text-align:center;font-size:18px">.867</td>
	<td style="text-align:center;font-size:18px">.863</td>
	<td style="text-align:center;font-size:18px"><b>.825</b></td>
	</tr>
	<tr>
    <td>Challenger</td>
    <td style="text-align:center;font-size:18px">.870</td>
	<td style="text-align:center;font-size:18px">.866</td>
	<td style="text-align:center;font-size:18px">.822</td>
    </tr>
	<tr>
    <td>Random TRF (few)</td>
    <td style="text-align:center;font-size:18px">.899</td>
	<td style="text-align:center;font-size:18px">.889</td>
	<td style="text-align:center;font-size:18px">.822</td>
    </tr>
	<tr>
    <td>TRF + RF</td>
    <td style="text-align:center;font-size:18px">.905</td>
	<td style="text-align:center;font-size:18px">.893</td>
	<td style="text-align:center;font-size:18px">.821</td>
    </tr>
	<tr>
    <td>Benchmark</td>
    <td style="text-align:center;font-size:18px"><b>.919</b></td>
	<td style="text-align:center;font-size:18px"><b>.898</b></td>
	<td style="text-align:center;font-size:18px">.813</td>
    </tr>
		<tr>
    <td>Random TRF (many)</td>
    <td style="text-align:center;font-size:18px">.857</td>
	<td style="text-align:center;font-size:18px">.859</td>
	<td style="text-align:center;font-size:18px">.807</td>
    </tr>
</tbody>
</table>


When we observe the performance over time, we see that the `eng` option during the in-time period is a shift of what we have for the `challenger` (Time Robust Forest). Nonetheless, when the holdout starts, they start to behave slightly differently. We see them inverting which model is performing better, just as `challenger` did with `benchmark` previously.

<div align="center">
<figure>
	<a href="../../../images/randomtrt/all_models.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/randomtrt/all_models.png"/>
	</a>
		<figcaption>The engineered option shows a worse performance in the in time test, while it performs better in the out of time set, our holdout.</figcaption>
</figure>
</div>


#### Is it a matter of simplicity?

Most of my skepticism about the TRF comes from the fact its design could be simply pushing the model to be simpler. The simplicity would go against overfitting, and it would generalize better. Even considering that in all the previous experiments, the model development pipeline follows standard practices for both benchmark and challenger, I like to keep challenging it.

To keep getting evidence it is not the case, I took the opportunity to train two simpler versions of the benchmark. First, I multiply the minimum number of examples by the number of distinct periods in the challenger model since it is the volume of total data the TRF demands to keep growing deeper. In the second case, I've forced the benchmark to have a similar training performance compared to the challenger. I did it by changing the minimum examples to split and the maximum depth.

The results in the image below show it might explain part of it. The simplified versions worsened the benchmark in the holdout. However, the models converge to the same performance after some years. Nonetheless, the simplified benchmark behavior is still very different from what we observed in the challenger. I wonder if the challenger would also converge if we had more data. The period is not sufficiently long to provide enough environments for the TRF to learn and let a very long holdout.

<div align="center">
<figure>
	<a href="../../../images/randomtrt/simpler.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/randomtrt/simpler.png"/>
	</a>
		<figcaption>We train a benchmark with similar parameters and another in which we change the hyper-parameters to match the challenger's train performance. It shows the challengers perform well in the holdout due to something beyond being simpler.</figcaption>
</figure>
</div>


### Olist

The Olist dataset [^fn7] is not as voluminous as the GE News. We run ten bootstrap rounds to estimate model performance. I modified the previous optimal parameters by increasing the number of estimators from 140 to 240.

In the plot below, we can see the results for the test and holdout. As expected, when we ensemble the TRF with the RF, the test performance will go up. The same thing happens to the `few` case since it fragments the data guided by the time column, including the particular case of a single fragment. It is evidence the user should also control the minimum number of segments.

<div align="center">
<figure>
	<a href="../../../images/randomtrt/olist_test.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/randomtrt/olist_test.png"/>
	</a>
		<figcaption>There is a wild difference in test performance, which is in time data sampled randomly. However, the out of time performance is very similar.</figcaption>
</figure>
</div>

Since the performance in the holdout is very similar, we can zoom in. There is a lot of overlap in the intervals. However, it is interesting to notice how `benchmark`, `challenger`, `ensemble`, and `engineered` options are worse on average than `few` and `many`, which does not require expert knowledge on splitting the time information into meaningful segments.

<div align="center">
<figure>
	<a href="../../../images/randomtrt/olist_holdout.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/randomtrt/olist_holdout.png"/>
	</a>
		<figcaption>Zooming in on the holdout performance, we see the two options using the Randomg TRF offers a likely improvement. The result is not definite, but it is encouraging to keep exploring this direction.</figcaption>
</figure>
</div>


## Conclusion

The results are interesting in this minimal experimental setting. The GE News and the Olist dataset pointed to different approaches to creating the set of time segments to pick randomly from: engineered or randomly split. The GE dataset is large, but it needs to be challenged further. While the Olist results pretty much overlap. Segmenting the environment randomly goes against the idea of expert knowledge guiding the environment definition and assuming we'll have data about it. One alternative to random selection is to make it part of the learning process or use data to guide it. A domain classifier is an excellent option to segment data periods that differ significantly. If we want to learn this split, we need to do it based on a criterion that is not a training error. The higher the segmentation, the higher the total minimum examples of splitting needed, the shallower the tree, and the simpler the model, the higher the training error. Unsupervised learning might make sense here too. Considering data from a certain period, look at how similar the following data segments are and define if we should consider them the same or a different environment based on a threshold or statistical test.


## References

[^fn1]: Moneda, L., Mauá, D. (2022). Time Robust Trees: Using Temporal Invariance to Improve Generalization
[^fn5]: Moneda, L.: Globo esporte news dataset (2020), version 19. Retrieved July 11, 2022, from https://www.kaggle.com/lgmoneda/ge-soccer-clubs-news
<!-- [^fn3]: Chicago, C.: Chicagocrime-bigquerydataset(2021), version 1. Retrieved March 13, 2021 from https://www.kaggle.com/chicago/chicago-crime -->
<!-- [^fn4]: Daoud, J.: Animal shelter dataset (2021), version 1. Retrieved March 13, 2021, from https://www.kaggle.com/jackdaoud/animal-shelter-analytics -->
<!-- [^fn5]: Mouill, M.: Kickstarter projects dataset (2018), version 7. Retrieved March 13, 2021, from https://www.kaggle.com/kemical/kickstarter-projects?select=ks-projects-201612.csv -->
<!-- [^fn6]: Shastry, A.: Sanfrancisco building permits dataset (2018), version 7. Retrieved March 13, 2021, from https://www.kaggle.com/aparnashastry/building-permit-applications-data -->
[^fn7]: Sionek, A.: Brazilian e-commerce public dataset by olist (2019), version 7. Retrieved March 13, 2021, from https://www.kaggle.com/olistbr/brazilian-ecommerce
<!-- [^fn8]: Mitchell, T.: 20 Newsgroup dataset (1996). They are retrieved from sklearn. -->
