---
layout: post
title: "Analyzing and building predictive models for e-mails"
date: 2017-04-15
lang: en 
ref: ml-emails
description: Exploration data analysis and some machine learning approaches to deal with e-mails.
---

I worked as a volunteer coordinator for <a href="codeclubbrasil.org">Code Club Brazil</a> for 3 years. The most tedious part of it was about dealing with the e-mails, since they used to demand information that was available in our site, and, mainly, they would ask something really usual but each one in a different way, then every e-mail needed a lot of attention even if we usually used the same small set of already written answers.

So i decided to take a look at the data and see what could be done for it.

<figure  align="center">
	<a href="images/word_cloud.png">
		<img  style="width:400px;margin:10px" src="images/word_cloud.png"/>
	</a>
	<figcaption>Word Cloud</figcaption>
</figure>


<!-- <img src="images/word_cloud.png"/> -->

1. [Data](#data)
2. [Exploratory Data Analysis](#exploratory)
3. [Reasoning about the problem](#problem)
4. [A simple model](#simple)
5. [What about unsupervised learning?](#unsupervised)

### Data <a name="data"></a>
The data was collect from Code Club Brazil's e-mail inbox, totaling 972 messages. The messages are all in brazilian Portuguese. E-mails from applications and social media weren't included. The dataset was organized with two text fields: subject and message. The other fields are manually assigned labels, being the presence of a label an indicator of a certain kind of doubt. We have twelve of such labels.

When we have multiple labels that can apply to a single example, we call it a multi-label problem. It's different than a multi-class problem, when classes are exclusive: a certain hand-written digit cannot be "1" and "3" at the same time, for example. But an e-mail could contain a question about subject A and B. 

Thoughts about which kind of problem it is and different ways of approaching it will be discussed later.

### Exploratory Data Analysis <a name="data"></a>
	
