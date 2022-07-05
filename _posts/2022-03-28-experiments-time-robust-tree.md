---
layout: post
title: "Time Robust Tree experiments on real datasets"
date: 2022-06-13
lang: en
ref: trtexp
comments: true
author: moneda
description: Applying an ensemble of Time Robust Trees on real datasets and comparing it to a Random Forest
image: ../../../images/trtexp/genews_performance_overtime.png
tags: machine-learning research
---

## Index

1. [Introduction](#introduction)
2. [Experiments](#experiments)
    1. [Setup](#setup)
    2. [Performance](#performance)
	3. [The domain classifier](#the-domain-classifier)
    4. [Temporal views](#temporal-views)
	5. [The hyper-parameters effect](#the-hyper-parameters-effect)
	6. [Feature importance](#feature-importance)
	<!-- 4. [When and how to use it](#when-and-how-to-use-it) -->
4. [Conclusion](#conclusion)

## Introduction

This post contains a practical application of the Time Robust tree (TRT). To understand the model motivation, please read [Introducing the Time Robust Tree - invariance in Machine Learning #3](http://lgmoneda.github.io/2021/12/03/introducing-time-robust-tree.html) or "Time Robust Trees: Using Temporal Invariance to Improve Generalization"[^fn1]. Most of our interest in this work is to reflect on dataset shift and generalization. However, in an industry setting, the Time Robust Forest (TRF), the ensemble version of the TRT, can offer an exciting challenger for settings one cannot retrain a model constantly.

We will explore some real-world datasets and compare the TRF to a Random Forest (RF). All the data and code for the experiments are [available](https://github.com/lgmoneda/time-robust-tree-paper), just as the base package [time-robust-forest](https://github.com/lgmoneda/time-robust-forest).


## The experiments 
### Setup 

To validate the approach, seven public datasets in which a timestamp information and a reasonable time range are available were selected [^fn2] [^fn3] [^fn4] [^fn5] [^fn6] [^fn7] [^fn8].

We split every dataset into two time periods: training and holdout. Then training period data is split randomly between training and test. We use the Time Robust Forest python package for both benchmark and challenger.

The benchmark has all training examples with the same $$T_{period}$$, which is a particular case the TRF becomes a regular Random Forest. The challenger uses yearly or year-monthly segments.

The hyper-parameter optimization uses an approach we identify as Environment K-Fold, which we explain in a previous [post](http://lgmoneda.github.io/2021/12/03/introducing-time-robust-tree.html). 

### Performance 

The first evidence we look for is a simple difference in performance. We hypothesize the TRF will not suffer as much as the RF to keep its performance in future unseen data, which we simulate with the Holdout set. 

In the table below, it is possible to see the TRF did better in the holdout in three opportunities, while it is similar in two and loses in the other two. 

This aggregated result is interesting, but looking further can help us understand how the TRF operates. 

<table class="styled-table" style="margin-left:auto;margin-right:auto;width:681px">
    <thead>
        <tr>
            <th style="text-align:center">Dataset</th>
			<th style="text-align:center">Data split</th>
			<th style="text-align:center">Volume</th>
			<th style="text-align:center">Time range</th>
			<th style="text-align:center">RF</th>
			<th style="text-align:center">TRF</th>
			<th style="text-align:center">TRF-RF</th>			
        </tr>
    </thead>
    <tbody>
	
	        <tr>
            <td rowspan="3">GE News</td>
            <td style="text-align:center;font-size:18px">Train</td>
			<td style="text-align:center;font-size:18px">21k</td>
			<td style="text-align:center;font-size:18px">2015-2018</td>
			<td style="text-align:center;font-size:18px"><b>.927</b></td>
			<td style="text-align:center;font-size:18px">.865</td>
			<td style="text-align:center;font-size:18px">-.062</td>
        </tr>
		<tr>
            <td style="text-align:center;font-size:18px">Test</td>
			<td style="text-align:center;font-size:18px"> 5k</td>
			<td style="text-align:center;font-size:18px"> 2015-2018</td>
			<td style="text-align:center;font-size:18px"><b>.879</b></td>
			<td style="text-align:center;font-size:18px">.839</td>
			<td style="text-align:center;font-size:18px"> -.040</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">58k</td>
		<td style="text-align:center;font-size:18px">2019-2021</td>
		<td style="text-align:center;font-size:18px">.805</td>
		<td style="text-align:center;font-size:18px"><b>.821</b></td>
		<td style="text-align:center;font-size:18px;background-color:#286748;color:white"><b>.017</b></td>
        </tr>
		
        <tr>
            <td rowspan="3">Kickstarter</td>
            <td style="text-align:center;font-size:18px">Train</td>
			<td style="text-align:center;font-size:18px">98k</td>
			<td style="text-align:center;font-size:18px">2010-2013</td>
			<td style="text-align:center;font-size:18px"><b>.736</b></td>
			<td style="text-align:center;font-size:18px">.717</td>
			<td style="text-align:center;font-size:18px">-.019</td>
        </tr>
		<tr>
            <td style="text-align:center;font-size:18px">Test</td>
			<td style="text-align:center;font-size:18px"> 24k</td>
			<td style="text-align:center;font-size:18px"> 2010-2013</td>
			<td style="text-align:center;font-size:18px"><b>.705</b></td>
			<td style="text-align:center;font-size:18px">.701</td>
			<td style="text-align:center;font-size:18px"> -.004</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">254k</td>
		<td style="text-align:center;font-size:18px">2014-2017</td>
		<td style="text-align:center;font-size:18px">.647</td>
		<td style="text-align:center;font-size:18px"><b>.661</b></td>
		<td style="text-align:center;font-size:18px;background-color:#286748;color:white"><b>.014</b></td>
        </tr>


		
		<tr>
        <td rowspan="3">20 News</td>
        <td style="text-align:center;font-size:18px">Train</td>
		<td style="text-align:center;font-size:18px">8k</td>
		<td style="text-align:center;font-size:18px">-</td>
		<td style="text-align:center;font-size:18px"><b>.939</b></td>
		<td style="text-align:center;font-size:18px">.869</td>
		<td style="text-align:center;font-size:18px">-.070</td>
        </tr>
		<tr>
        <td style="text-align:center;font-size:18px">Test</td>
		<td style="text-align:center;font-size:18px"> 2k</td>
		<td style="text-align:center;font-size:18px">-</td>
		<td style="text-align:center;font-size:18px"><b>.867</b></td>
		<td style="text-align:center;font-size:18px">.828</td>
		<td style="text-align:center;font-size:18px"> -.039</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">8k</td>
		<td style="text-align:center;font-size:18px">-</td>
		<td style="text-align:center;font-size:18px">.768</td>
		<td style="text-align:center;font-size:18px"><b>.774</b></td>
		<td style="text-align:center;font-size:18px;background-color:#286748;color:white"><b>.006</b></td>
        </tr>
		
		<tr>
        <td rowspan="3">Animal Shelter</td>
        <td style="text-align:center;font-size:18px">Train</td>
		<td style="text-align:center;font-size:18px">75k</td>
		<td style="text-align:center;font-size:18px">2014-2017</td>
		<td style="text-align:center;font-size:18px"><b>.814</b></td>
		<td style="text-align:center;font-size:18px">.803</td>
		<td style="text-align:center;font-size:18px">-.011</td>
        </tr>
		<tr>
        <td style="text-align:center;font-size:18px">Test</td>
		<td style="text-align:center;font-size:18px"> 19k</td>
		<td style="text-align:center;font-size:18px">2014-2017</td>
		<td style="text-align:center;font-size:18px"><b>.792</b></td>
		<td style="text-align:center;font-size:18px">.790</td>
		<td style="text-align:center;font-size:18px"> -.002</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">61k</td>
		<td style="text-align:center;font-size:18px">2018-2021</td>
		<td style="text-align:center;font-size:18px"><b>.791</b></td>
		<td style="text-align:center;font-size:18px">.791</td>
		<td style="text-align:center;font-size:18px;background-color:goldenrod;color:white"><b>.000</b></td>
        </tr>
		
		<tr>
        <td rowspan="3">Olist</td>
        <td style="text-align:center;font-size:18px">Train</td>
		<td style="text-align:center;font-size:18px">41k</td>
		<td style="text-align:center;font-size:18px">2017</td>
		<td style="text-align:center;font-size:18px"><b>.799</b></td>
		<td style="text-align:center;font-size:18px">.695</td>
		<td style="text-align:center;font-size:18px">-.104</td>
        </tr>
		<tr>
        <td style="text-align:center;font-size:18px">Test</td>
		<td style="text-align:center;font-size:18px"> 10k</td>
		<td style="text-align:center;font-size:18px">2017</td>
		<td style="text-align:center;font-size:18px"><b>.664</b></td>
		<td style="text-align:center;font-size:18px">.641</td>
		<td style="text-align:center;font-size:18px"> -.023</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">62k</td>
		<td style="text-align:center;font-size:18px">2018</td>
		<td style="text-align:center;font-size:18px"><b>.635</b></td>
		<td style="text-align:center;font-size:18px">.635</td>
		<td style="text-align:center;font-size:18px;background-color:goldenrod;color:white"><b>.000</b></td>
        </tr>		
		
		<tr>
        <td rowspan="3">Chicago Crime</td>
        <td style="text-align:center;font-size:18px">Train</td>
		<td style="text-align:center;font-size:18px">100k</td>
		<td style="text-align:center;font-size:18px">2001-2010</td>
		<td style="text-align:center;font-size:18px"><b>.936</b></td>
		<td style="text-align:center;font-size:18px">.909</td>
		<td style="text-align:center;font-size:18px">-.027</td>
        </tr>
		<tr>
        <td style="text-align:center;font-size:18px">Test</td>
		<td style="text-align:center;font-size:18px"> 61k</td>
		<td style="text-align:center;font-size:18px">2001-2010</td>
		<td style="text-align:center;font-size:18px"><b>.904</b></td>
		<td style="text-align:center;font-size:18px">.899</td>
		<td style="text-align:center;font-size:18px"> -.005</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">90k</td>
		<td style="text-align:center;font-size:18px">2011-2017</td>
		<td style="text-align:center;font-size:18px"><b>.905</b></td>
		<td style="text-align:center;font-size:18px">.902</td>
		<td style="text-align:center;font-size:18px;background-color:#bf483f;color:white"><b>-.003</b></td>
        </tr>		
		
		<tr>
        <td rowspan="3">Building Permits</td>
        <td style="text-align:center;font-size:18px">Train</td>
		<td style="text-align:center;font-size:18px">90k</td>
		<td style="text-align:center;font-size:18px">2013-2015</td>
		<td style="text-align:center;font-size:18px"><b>.990</b></td>
		<td style="text-align:center;font-size:18px">.984</td>
		<td style="text-align:center;font-size:18px">-.006</td>
        </tr>
		<tr>
        <td style="text-align:center;font-size:18px">Test</td>
		<td style="text-align:center;font-size:18px">22k</td>
		<td style="text-align:center;font-size:18px">2013-2015</td>
		<td style="text-align:center;font-size:18px"><b>.974</b></td>
		<td style="text-align:center;font-size:18px">.972</td>
		<td style="text-align:center;font-size:18px"> -.002</td>
        </tr>
		<tr>
		<td style="text-align:center;font-size:18px">Holdout</td>
		<td style="text-align:center;font-size:18px">193k</td>
		<td style="text-align:center;font-size:18px">2011-2017</td>
		<td style="text-align:center;font-size:18px"><b>.977</b></td>
		<td style="text-align:center;font-size:18px">.973</td>
		<td style="text-align:center;font-size:18px;background-color:#bf483f;color:white"><b>-.004</b></td>
        </tr>				
		
    </tbody>
</table>



<!-- \begin{table} -->
<!--   \caption[Data volume, period, and results for every real-world dataset using RF and TRF]{Performance results. When comparing the AUC in the holdout from the TRF to the RF, the benchmark gets better performance on three cases. However, the difference between challenger and benchmark in the holdout always drops compared to the same difference in the test.} -->
<!--   \vspace{\baselineskip} -->
<!--   \label{table:experiments_summary} -->
<!--   \centering -->
<!--   \begin{tabular}{lcccccc} -->
<!--     \toprule -->
<!--     \hfil \ Dataset & \ Data split & \ Volume & \ Time range & RF & TRF & $\Delta$ TRF-RF\\ -->
<!--      \midrule -->
<!--   Kickstarter & Train    & 98k  & 2010-2013    &\textbf{.736} &.717 & -.019 \\ -->
<!--   Kickstarter & Test     & 24k  & 2010-2013    &\textbf{.705} &.701 & -.004 \\ -->
<!--   Kickstarter & Holdout  & 254k & 2014-2017    &.647 & \textbf{.661} & .014  \\ -->
<!--    \midrule -->
<!--   GE News & Train     & 21k & 2015-2018    &\textbf{.927} &.865 & -.062 \\ -->
<!--   GE News & Test     & 5k & 2015-2018    &\textbf{.879} &.839 & -.040 \\ -->
<!--   GE News & Holdout  & 58k & 2019-2021   &.805&\textbf{.821} & .017 \\ -->
<!--  \midrule -->
<!--   20 News & Train    & 8k & -    & \textbf{.939}  & .869 & -.070 \\ -->
<!--   20 News & Test     & 2k & -    &\textbf{.867} &.828 & -.039 \\ -->
<!--   20 News & Holdout  & 8k & -    &.768 &\textbf{.774} & .006 \\ -->
<!--  \midrule -->
<!--   Animal Shelter & Train    & 75k & 2014-2017    &\textbf{.814} & .803 & -.011 \\ -->
<!--   Animal Shelter & Test     & 19k & 2014-2017    &\textbf{.792} &.790 & -.002 \\ -->
<!--   Animal Shelter & Holdout  & 61k & 2018-2021    &\textbf{.791} &.791 & .000 \\ -->
<!--  \midrule -->
<!--   Olist & Train    & 41k & 2017    &\textbf{.799} &.695 & -.104 \\ -->
<!--   Olist & Test     & 10k & 2017    &\textbf{.664} &.641 & -.023 \\ -->
<!--   Olist & Holdout  & 62k & 2018    &\textbf{.635} &.635 & .000 \\ -->
<!--  \midrule -->
<!--   Chicago Crime & Train    & 100k & 2001-2010    &\textbf{.936} & .909 & -.027 \\ -->
<!--   Chicago Crime & Test     & 61k & 2001-2010    &\textbf{.904} & .899 & -.005 \\ -->
<!--   Chicago Crime & Holdout  & 90k & 2011-2017    &\textbf{.905} & .902 & -.003 \\ -->
<!--  \midrule -->
<!--   Building Permits & Train    & 90k & 2013-2015    &\textbf{.990} &.984 & -.006 \\ -->
<!--   Building Permits & Test     & 22k & 2013-2015    &\textbf{.974} &.972 & -.002 \\ -->
<!--   Building Permits & Holdout  & 193k & 2016-2017    &\textbf{.977} &.973 & -.004 \\ -->
<!--     \bottomrule -->
<!-- \end{tabular} -->
<!-- \vspace{\baselineskip} -->
<!-- \end{table} -->


### The domain classifier 

In the previous table, it is possible to verify that the cases where TRF is an exciting challenger are the ones in which the benchmark has problems performing in the holdout as well as in the test. We train a domain classifier using the holdout as the target to clarify the evidence under scenarios the future data changes the most. The higher the AUC, the more significant the difference between test and holdout in that dataset. As seen in the figure below, the results show that the TRF performed better in the datasets with a more remarkable shift between training and holdout data.

<div align="center">
<figure>
	<a href="../../../images/trtexp/domain_classifier_regression.jpg" name="Domain classifier">
		<img  style="width:550px;margin:10px" src="../../../images/trtexp/domain_classifier_regression.jpg"/>
	</a>
		<figcaption>Domain classifier performance by the delta improvement in the TRF. The greater the difference between the source and target data, translated by a high AUC for the domain classifier, the greater the benefit of learning invariant relationships to generalize to future unseen data.</figcaption>
</figure>
</div>

### Temporal views

The hypothesis is that TRF would be able to learn more stable relationships, which would exclude spurious relationships. These relationships would not degrade as quickly as the others. We have a hint from the aggregated performance metric from the previous table, but we want to see it over time.

The most interesting case is the GE News. Notice how the curve shape is different during the holdout. In the other cases, the parallel shift seems to be evidence of a different model capacity. Still, if the setup is close enough to normal model development, the results put the TRF as a reasonable challenger for the RF. 


<div align="center">
<figure>
	<a href="../../../images/trtexp/genews_performance_overtime.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/genews_performance_overtime.png"/>
	</a>
		<figcaption>(a) GE News</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/kickstarter_test_holdout_auc_years_square.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/kickstarter_test_holdout_auc_years_square.png"/>
	</a>
		<figcaption>(b) Kickstarter</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/20news_pycaret_aggregate_opt_square.jpg" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/20news_pycaret_aggregate_opt_square.jpg"/>
	</a>
		<figcaption>(c) 20 News</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/animal_shelter_test_holdout_auc_years_square.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/animal_shelter_test_holdout_auc_years_square.png"/>
	</a>
		<figcaption>(d) Animal Shelter</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/olist_test_holdout_auc_years_square.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/olist_test_holdout_auc_years_square.png"/>
	</a>
		<figcaption>(e) Olist</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/chicago_crime_test_holdout_auc_years_square.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/chicago_crime_test_holdout_auc_years_square.png"/>
	</a>
		<figcaption>(f) Chicago Crime</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/building_permits_test_holdout_auc_years_square.png" name="Domain classifier">
		<img  style="width:650px;margin:10px" src="../../../images/trtexp/building_permits_test_holdout_auc_years_square.png"/>
	</a>
		<figcaption>(g) Building Permits</figcaption>
</figure>
</div>


### The hyper-parameters effect 

Though we optimize both of the models with a similar procedure, the chances are that hyper-parameters can produce misleading results. The parameter we care about the most on the TRF is the minimum number of examples from each period. In the RF, the similar parameter is the minimum number of examples to split. To verify how this parameter influenced the results, we fixed all the others and let this one change.

As we can see in the images below, it was a matter of parametrization in the Kickstarter case, while in GE News, it was not. The dashed lines represent the TRF, while the green curves are about the holdout sets. We can see the RF has the power to solve the Kickstarter with a higher holdout performance, while in GE News, the dashed green curve goes to a level the continuous one does not reach.

<div align="center">
<figure>
	<a href="../../../images/trtexp/kick_params.png" name="Domain classifier">
		<img  style="width:450px;margin:10px" src="../../../images/trtexp/kick_params.png"/>
	</a>
		<figcaption>(a) Kickstarter</figcaption>
</figure>
</div>

<div align="center">
<figure>
	<a href="../../../images/trtexp/ge_news_params.png" name="Domain classifier">
		<img  style="width:450px;margin:10px" src="../../../images/trtexp/ge_news_params.png"/>
	</a>
		<figcaption>(b) GE News</figcaption>
</figure>
</div>

### Feature importance

If the TRF was to select stable relationships, we expect that the features would assume different importance. However, in terms of the order, there was little difference. The only pattern we could identify was that the TRF concentrated importance on the top features in the cases it outperformed the RF. 

In the table below, we can see the feature importance of the GE News dataset. Notice how importance the TRF concentrates on the top features and how the importance quickly decreases as we go to the less important ones. 


<table class="styled-table" style="margin-left:auto;margin-right:auto;width:681px">
    <thead>
        <tr>
            <th colspan="2" style="text-align:center">RF</th>
			<th colspan="2" style="text-align:center">TRF</th>
        </tr>
		<tr>
            <th style="text-align:center">Feature</th>
			<th style="text-align:center">Importance</th>
            <th style="text-align:center">Feature</th>
			<th style="text-align:center">Importance</th>			
        </tr>
    </thead>
    <tbody>
	
		<tr>
        <td style="text-align:center;font-size:18px">atleta</td>
		<td style="text-align:center;font-size:18px">0.043446</td>
		<td style="text-align:center;font-size:18px">atleta</td>
		<td style="text-align:center;font-size:18px">0.090731</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">cada</td>
		<td style="text-align:center;font-size:18px">0.034933</td>
		<td style="text-align:center;font-size:18px">sabe</td>
		<td style="text-align:center;font-size:18px">0.036755</td>
        </tr>				
		
 		<tr>
        <td style="text-align:center;font-size:18px">partidas</td>
		<td style="text-align:center;font-size:18px">0.019544</td>
		<td style="text-align:center;font-size:18px">cada</td>
		<td style="text-align:center;font-size:18px">0.034831</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">primeiro</td>
		<td style="text-align:center;font-size:18px">0.014367</td>
		<td style="text-align:center;font-size:18px">partidas</td>
		<td style="text-align:center;font-size:18px">0.021660</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">sabe</td>
		<td style="text-align:center;font-size:18px">0.012230</td>
		<td style="text-align:center;font-size:18px">lateral</td>
		<td style="text-align:center;font-size:18px">0.016985</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">dia</td>
		<td style="text-align:center;font-size:18px">0.010441</td>
		<td style="text-align:center;font-size:18px">chegar</td>
		<td style="text-align:center;font-size:18px">0.015238</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">cinco</td>
		<td style="text-align:center;font-size:18px">0.009303</td>
		<td style="text-align:center;font-size:18px">dia</td>
		<td style="text-align:center;font-size:18px">0.012248</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">lateral</td>
		<td style="text-align:center;font-size:18px">0.006325</td>
		<td style="text-align:center;font-size:18px">cinco</td>
		<td style="text-align:center;font-size:18px">0.011322</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">video</td>
		<td style="text-align:center;font-size:18px">0.006182</td>
		<td style="text-align:center;font-size:18px">camisa</td>
		<td style="text-align:center;font-size:18px">0.006628</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">rodrigo</td>
		<td style="text-align:center;font-size:18px">0.005493</td>
		<td style="text-align:center;font-size:18px">precisa</td>
		<td style="text-align:center;font-size:18px">0.006192</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">defesa</td>
		<td style="text-align:center;font-size:18px">0.004620</td>
		<td style="text-align:center;font-size:18px">globoesport</td>
		<td style="text-align:center;font-size:18px">0.004892</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">globoesporte</td>
		<td style="text-align:center;font-size:18px">0.004507</td>
		<td style="text-align:center;font-size:18px">defesa</td>
		<td style="text-align:center;font-size:18px">0.004150</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">precisa</td>
		<td style="text-align:center;font-size:18px">0.004204</td>
		<td style="text-align:center;font-size:18px">todos</td>
		<td style="text-align:center;font-size:18px">0.003037</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">momento</td>
		<td style="text-align:center;font-size:18px">0.003925</td>
		<td style="text-align:center;font-size:18px">possível</td>
		<td style="text-align:center;font-size:18px">0.002211</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">treinador</td>
		<td style="text-align:center;font-size:18px">0.003699</td>
		<td style="text-align:center;font-size:18px">lesão</td>
		<td style="text-align:center;font-size:18px">0.001797</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">camisa</td>
		<td style="text-align:center;font-size:18px">0.003505</td>
		<td style="text-align:center;font-size:18px">video</td>
		<td style="text-align:center;font-size:18px">0.001595</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">hoje</td>
		<td style="text-align:center;font-size:18px">0.003442</td>
		<td style="text-align:center;font-size:18px">vitória</td>
		<td style="text-align:center;font-size:18px">0.001177</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">difícil</td>
		<td style="text-align:center;font-size:18px">0.003328</td>
		<td style="text-align:center;font-size:18px">dentro</td>
		<td style="text-align:center;font-size:18px">0.000943</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">possível</td>
		<td style="text-align:center;font-size:18px">0.003327</td>
		<td style="text-align:center;font-size:18px">neste</td>
		<td style="text-align:center;font-size:18px">0.000874</td>
        </tr>				
		
		<tr>
        <td style="text-align:center;font-size:18px">todos</td>
		<td style="text-align:center;font-size:18px">0.003132</td>
		<td style="text-align:center;font-size:18px">nova</td>
		<td style="text-align:center;font-size:18px">0.000581</td>
        </tr>				
		
    </tbody>
</table>	

## Conclusion

In most cases, the TRF looks like regularization since it has worse training performance and a better holdout result. In these cases, the shape of the curve in the holdout is similar for the RF and the TRF. However, it might be the case that in most datasets, the low number of features does not enable it to find stability from a particular source. The most interesting case is also the one with the highest number of features, which is GE News. The interestingness of this case is that it provides evidence that phenomena we want to predict could be composed of many concepts, which change at different rates as time passes. At the same time, models cannot capture this nuance and tend to focus on simple and spurious relationships. 

Nonetheless, the domain classifier points to a simple way to find a reason to try the TRF for a particular problem, and its performance does not lose by far in the cases it loses to the RF. 



## References

[^fn1]: Moneda, L., Mauá, D. (2022). Time Robust Trees: Using Temporal Invariance to Improve Generalization
[^fn2]: Moneda, L.: Globo esporte news dataset (2020), version 18. Retrieved March 31, 2021, from https://www.kaggle.com/lgmoneda/ge-soccer-clubs-news
[^fn3]: Chicago, C.: Chicagocrime-bigquerydataset(2021), version 1. Retrieved March 13, 2021 from https://www.kaggle.com/chicago/chicago-crime 
[^fn4]: Daoud, J.: Animal shelter dataset (2021), version 1. Retrieved March 13, 2021, from https://www.kaggle.com/jackdaoud/animal-shelter-analytics 
[^fn5]: Mouill, M.: Kickstarter projects dataset (2018), version 7. Retrieved March 13, 2021, from https://www.kaggle.com/kemical/kickstarter-projects?select=ks-projects-201612.csv 
[^fn6]: Shastry, A.: Sanfrancisco building permits dataset (2018), version 7. Retrieved March 13, 2021, from https://www.kaggle.com/aparnashastry/building-permit-applications-data 
[^fn7]: Sionek, A.: Brazilian e-commerce public dataset by olist (2019), version 7. Retrieved March 13, 2021, from https://www.kaggle.com/olistbr/brazilian-ecommerce
[^fn8]: Mitchell, T.: 20 Newsgroup dataset (1996). They are retrieved from sklearn.
