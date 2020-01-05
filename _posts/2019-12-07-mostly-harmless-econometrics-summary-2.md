---
layout: post
title: "Destrinchando a regressão, \"Mostly Harmless Econometrics\", cap 3"
date: 2019-12-01
lang: pt
ref: mostly-harmless-econometrics-ii
comments: true
description: Destrinchando a regressão - Resumo cap III do livro "Mostly Harmless Econometrics"
image: ../../../images/mostly_harmless_econometrics.jpg
---

Continuando com o resumo do livro [Mostly Harmless Econometrics](https://www.amazon.com/Mostly-Harmless-Econometrics-Empiricists-Companion-ebook/dp/B003TSELA0). A primeira parte pode ser lida [aqui](http://lgmoneda.github.io/2019/11/24/mostly-harmless-econometrics-summary.html). 

Escolhi o termo "destrinchando", pois neste capítulo são levantadas propriedades e criar uma intuição de como interpretar os resultados de uma regressão.

<div align="center">
<figure>
	<a href="../../../images/mostly_harmless_econometrics.jpg">
		<img  style="width:250px;margin:10px" src="../../../images/mostly_harmless_econometrics.jpg"/>
	</a>
</figure>
</div>


## Índice

1. [Fazendo regressões fazerem sentido (_Making regression make sense_)](#fazendo-regressões-fazerem-sentido)
2. [O ideal experimental (_The experimental ideal_)](#o-ideal-experimental-the-experimental-ideal)
    2. [O problema do viés de seleção (_The selection problem_)](#o-problema-do-viés-de-seleção-the-selection-problem))
    2. [Experimentos aleatórios resolvem o problema (_Random Assignment Solves the Selection Problem_)](#experimentos-aleatórios-resolvem-o-problema-random-assignment-solves-the-selection-problem)
	2. [Análise de regressão para experimentos (_Regression Analysis of experiments_)](#análise-de-regressão-para-experimentos-regression-analysis-of-experiments)

## Fazendo regressões fazerem sentido

Este capítulo é sobre explorar as propriedades da regressão para um melhor entendimento de o que exatamente estamos fazendo quando estimamos uma.

## Fundamentos

Neste começo se estuda os aspectos populacionais. O que isso quer dizer? Bem, muito da estatística é sobre o que podemos dizer sobre uma população com apenas uma amostra dos membros que fazem parte dela, ou seja, fazer inferência (descobrir algo) sobre o todo (população) a partir de uma parte dele (amostra).

Porém, neste começo vamos focar em propriedades populacionais da regressão e depois estender para os amostrais. O argumento de se começar estudando as propridades populacionais é que devemos entender bem o que cada conceito significa antes de começar a usar dados para estimá-los através de amostras.

### Relações em Economia e a função de expectativa condicional

A função de expectativa condicional (_conditional expectation function_, CEF) para uma varíavel dependente pode ser vista como a média da variável dependente, $$Y_{i}$$ condicionada em todas as covariáveis $$X_{i}$$, sendo estas um vetor $$kx1$$, com cada variável representada por $$x_{ik}$$, ou seja, ela pertence à um exemplo $$i$$ e é a késima variável das 1 até k que temos. Ou seja, $$\mathbb{E}[Y_{i} \mid X_{i}]$$, assim temos a variável dependente como função do nosso vetor $$X_{i}$$.

Como $$X_{i}$$ é um vetor de variáveis aleatórias, o CEF também é. 

Nós podemos calculá-lo para um valor fixo de $$X$$: $$\mathbb{E}[Y_{i} \mid X_{i}=x]$$. 

No caso de $$Y$$ contínua, a CEF é:

$$
\mathbb{E}[Y_{i} \mid X_{i}] = \int tf_{y}(t\mid X_{i}=x)dt
$$

Já no caso discreto, seria $$\sum tP(Y_{i}=t \mid X_{i}=x)$$.

Uma lei interessante é a **iteração da expectativa** (_Iterated expectation_), na qual a média não condicionar é igual à média não condicional do CEF:

$$
\mathbb{E}[Y_i}] = \mathbb{E}[\mathbb{E}[Y_{i} \mid X_{i}]]
$$

Algumas propriedades úteis para o estudo:

**Propriedade da decomposição**, onde podemos escrever $$Y_{I}$$ em termos da CEF e de $$\epsilon_{i}$$:

$$
Y_{i} = \mathbb{E}[Y_{i} \mid X_{i}] + \epsilon_{i}
$$

**Propriedade da previsão**: A CEF é a solução MMSE (_minimum mean squared error_, mínimo erro quadrático médio). Imagine que $$m(X_{i})$$ é qualquer função que use $$X_{i}$$, então:

$$
\mathbb{E}[Y_{i} \mid X_{i}] = argmin_{m(X)}\mathbb{E}[(Y_{i} - m(X_{i})^{2}]
$$

Então dizemos que o CEF é o preditor MMSE de $$Y_{i}$$ dado $$X_{i}$$.

**O teorema ANOVA (_Analysis of the variance_, análise da variância)**, que é a decomposição:

$$
V(Y_{i}) = V(\mathbb{E}[Y_{i} \mid X_{i}]) + \mathbb{E}[V(Y_{i} \mid X_{i})]
$$

Isso significa que a variância de $$Y_{i}$$ é a variância da CEF mais a variância do resíduo $$\epsilon_{i}$$.

Ok, a parte do resíduo não é tão direto de ver, a idéia é que como a variância de variável aleatória é $$V(X) = \mathbb{E}[(X - \mathbb{E}[X])^2]$$ e como por definição $$\mathbb{E}[\epsilon]=0$$, então $$V(\epsilon) = \mathbb{E[\epsilon^2]}$$, lembrando que a variância condicional de uma variável aleatória $$Y$$ dado $$X$$ é: $$V(Y \mid X) = \mathbb{E}[(Y - \mathbb{E}[Y \mid X]) \mid X]$$.

$$
\text{Considerando que: } \epsilon_{i} = Y_{i} - \mathbb{E}[Y_{i} \mid X_{i}]  \\

\text{Pela iteração da expectativa, temos que: } \mathbb{E}[\epsilon^2] = \mathbb{E}[\mathbb{E}[\epsilon^2 \mid X_{i}]] \\

\text{Pegando apenas o interior: } \mathbb{E}[\epsilon^2 \mid X] = \mathbb{E}[(Y_{i} - \mathbb{E}[Y_{i} \mid X_{i}])^2 \mid X_{i}] = V(Y_{i} \mid X_{i})\\

\text{Apenas adicionado a expectativa exterior: } \mathbb{E}[V(Y_{i} \mid X_{i})]

$$

No meu entendimento a intuição é: a variância de $$Y$$ só poderia estar no que usamos para explicá-la (a CEF) ou no que representa a porção inexplicada, $$\epsilon$$).

## asdas

