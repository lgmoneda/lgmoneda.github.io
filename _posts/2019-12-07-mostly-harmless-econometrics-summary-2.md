---
layout: post
title: "Destrinchando a regressão, \"Mostly Harmless Econometrics\", cap 3.1"
date: 2019-12-01
lang: pt
ref: mostly-harmless-econometrics-ii
author: moneda
comments: true
description: Destrinchando a regressão - Resumo do capítulo III, parte I, do livro "Mostly Harmless Econometrics"
image: ../../../images/mostly_harmless_econometrics.jpg
---

Continuando com o resumo do livro [Mostly Harmless Econometrics](https://www.amazon.com/Mostly-Harmless-Econometrics-Empiricists-Companion-ebook/dp/B003TSELA0). A primeira parte pode ser lida [aqui](http://lgmoneda.github.io/2019/11/24/mostly-harmless-econometrics-summary.html). 

Escolhi o termo "destrinchando", pois neste capítulo são levantadas propriedades para criar uma intuição de como interpretar os resultados de uma regressão.

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

Uma lei interessante é a **iteração da expectativa** (_Iterated expectation_), na qual a média não condicional é igual à média não condicional do CEF:

$$
\mathbb{E}[Y_{i}] = \mathbb{E}[\mathbb{E}[Y_{i} \mid X_{i}]]
$$

Outras propriedades úteis para o estudo:

**Propriedade da decomposição**, onde podemos escrever $$Y_{I}$$ em termos da CEF e de $$\epsilon_{i}$$:

$$
Y_{i} = \mathbb{E}[Y_{i} \mid X_{i}] + \epsilon_{i}
$$

**Propriedade da previsão**: A CEF é a solução MMSE (_minimum mean squared error_, mínimo erro quadrático médio). Imagine que $$m(X_{i})$$ é qualquer função que use $$X_{i}$$, então:

$$
\mathbb{E}[Y_{i} \mid X_{i}] = argmin_{m(X)}\mathbb{E}[(Y_{i} - m(X_{i}))^{2}]
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

No meu entendimento a intuição é: a variância de $$Y$$ só poderia estar no que usamos para explicá-la (a CEF) ou no que representa a porção inexplicada, ($$\epsilon$$).

## A anatomia da regressão e a conexão da CEF com a regressão linear.

Vamos começar a entender as partes que compõe a regressão linear populacional. 

A regressão é composta pelos $$\beta$$ que minimizam a expectativa do erro quadrático:

$$
\beta = argmin_{b}\mathbb{E}[(Y_{i} - X'_{i}b))^{2}]
$$

Com a condição de primeira ordem - derivando e igualando à zero, chega-se em:

$$
\mathbb{E}[X_{i}(Y_{i} - X'_{i}b))] = 0
$$

E a solução é $$\beta = \mathbb{E}[X_{i}X'_{i}]^{-1}\mathbb{E}[(X_{i}Y_{i}))]$$. Uma observação bem interessante do autor é: por contrução (pela condição de segunda ordem), o resíduo é não correlacionado com as covariáveis $$X$$.

É interessante notar que em uma regressão simples isso significa que o $$\beta$$ que acompanha o $$x_{1}$$ é:

$$
\beta_{1} = \frac{Cov(Y_{i}, x_{1i})}{Var(x_{1i})}
$$

O que faz todo o sentido: o $$\beta$$ seria a proporção da variabilidade conjunta da entrada e da saída (covariância) em relação à variância sozinha da entrada apenas. É como pegar apenas a parte da vairância de $$x_{1}$$ que nos interessa: aquela que é útil para explicar a variação de $$Y_{i}$$.

Já em uma regressão múltipla com $$k$$ variáveis, temos:

$$
\beta_{k} = \frac{Cov(Y_{i}, \tilde{x_{ki}})}{Var(\tilde{x_{ki}})}
$$


Onde o $$\tilde{x_{ki}}$$ é o residual da regressão de todas as variáveis para explicar $$x_{ki}$$. Ou seja, **agora o nosso $$\beta$$ é a proporção da variância conjunta sobre a variância da variável apenas após a retirada do sinal que ela compartilha com as outras variáveis de entrada**.


A conexão da CEF com a regressão linear é explicada de três formas.

A primeira é com o **teorema da linearidade da CEF**. Quando isso ocorre, a regressão linear populacional é a CEF. 

O segundo teorema que justifica é o do **melhor preditor linear**, que diz que a função $$X'_{i}\beta$$ é o melhor preditor linear de $$Y_{i}$$ dado $$X_{i}$$ em termos de MMSE.

Então, o CEF seria o melhor preditor sem restrições de  $$Y_{i}$$ dado $$X_{i}$$, enquanto $$X'_{i}\beta$$ (a regressão linear populacional) é o melhor que se pode fazer na classe das funções lineares.

A terceira justificativa e predileta do autor é a **regressão como estimadora do CEF**, em que a regressão populacional é o melhor estimador linear para o CEF - mesmo que este seja não linear.

Em resumo, a regressão linear é o melhor preditor linear da variável dependente ($$Y$$), o CEF é o melhor preditor sem restrições de $$Y$$ e a regressão linear é a melhor aproximação linear do CEF. 

Uma implicação do teorema do CEF é que pode-se usar $$\mathbb{E}[Y_{i} \mid X_{i}]$$ ao invés do $$Y_{i}$$ e ponderar pela distribuição da variável $$X_{i}$$. Então é como se o coeficiente da regressão fosse proporcional ao volume que se tem em cada valor que $$X$$ pode assumir e o $$\beta$$ que melhor se ajusta para cada valor dela.


## Resultados assintóticos do método dos mínimos quadrados (OLS)

Bom, é esperado que nunca se tenha o caso populacional. Inferência estatística é sobre isso: como usar uma amostra (sample) para informar-se sobre a população. Então é preciso conectar agora os resultados populacionais vistos até aqui com o que se pode alcançar quando se está trabalhando com uma sample.

Sem ir muito longe nessa sessão, podemos resumir que a lei dos grades números e o teorema do limite central garantem que os momentos (como méria, variância, quantis...) convergem para o valor populacional de acordo com o tamanho da amostra aproximando-se da população, e que assintoticamente a distribuição destes momentos é uma normal.

A sessão deriva a consistência da distribuição dos $$\hat{\beta}$$ e uma das formas de calcular o seu desvio padrão para o cálculo da estatística t, através da matrix de covariância, quando são chamados de erro padrão robusto (_Heterokedasticity-consistent standard errors, White standard error, Eicker-White standard error, robust standard error_), pois com exemplos suficientes são capazes de dar bons intervalos de confiança sem muitas hipóteses sobre a distribuição dos dados ou sobre o modelo.

Porém, é preciso estar atento, pois é normal que os pacotes devolvam o erro padrão _default_, que só é válido sob __homoskedasticity__, que é $$\mathbb{E}[e^{2}_{i} \mid X_{i}] = \sigma^{2}$$, uma constante. Ou seja, o erro do seu modelo é constante ao longo de $$X$$. 

Uma intuição bem interessante dada é que seria natural esperar que haja _heteroskedasticity_ ao usar uma regressão linear para aproximar uma CEF não linear, então seria melhor buscar utilizar a versão robusta do desvio padrão dos betas.

Espera-se que os desvios robustos sejam maiores que os _default_, então como uma **dica prática**, o autor diz que se há uma diferença de +30% entre os dois ou se o robusto chega até a ser menor, é provável que haja um erro no código ou problema de tamanho de amostra.

É importante notar que as hipóteses utilizadas aqui **não são aquelas classicamente listadas nos manuais de econometria**: regressores não estocásticos, CEF linear, erros normalmente distribuídos e _homoskedasticity_. Essas hipóteses garantem duas propriedades: **[1]** estimadores OLS não viesados ($$\mathbb{E}[\hat{\beta}] = \beta$$) e **[2]** uma fórmula para a variância amostral dos estimadores que é válida para pequenas amostras. 

A justificativa é que ao invés de querer contar com o não viés e a fórmula válida para pequenas amostras, relaxa-se as hipóteses e conta-se com as propriedades assintóticas - ou seja, quando grandes amostras são utilizadas. O que aproxima-se de um cenário real de aplicação.

## Modelos saturados, efeitos principais e outros termos em econometria


**Modelo saturado** (_saturated models_)é aquele que possuindo apenas variáveis explicativas (entradas) que são discretas, inclui exaustivamente parâmetros para acompanhar todas as possibilidades de valores que pode ter. 

Se tiver apenas uma entrada dummy, então $$y = \alpha + \beta * x_{1}$$ já é a versão saturada. 

Note que se a variável explicativa $$s_{i}$$ tiver diversos níveis (1, 2... k), a versão saturada fica:

$$
Y_{i} = \alpha + \beta_{1}d_{1i} + \beta_{2}d_{2i} + ... + \beta_{k}d_{ki} + \epsilon_{i}
$$

Aqui $$d_{i} = \mathbb{1}[s_{i} = j]$$. Então $$\beta_{j} = \mathbb{E}[y_{i} \mid s_{i} = j] - \mathbb{E}[y_{i} \mid s_{i} = 0] $$. E que o termo constante fica como sendo $$\alpha = \mathbb{E}[y_{i} \mid s_{i} = 0]$$.

No caso de termos duas dummies, é preciso ter um parâmetro beta para cada uma e outro da combinação das duas. Nesse caso, os betas que acompanham as dummies sozinhas são chamados de efeitos principais (_main effects_), enquanto o beta da combinação é o termo da interação (_interactive term_).

Há diferentes formas de saturar um modelo. O ponto principal é a exaustão dos valores que as entradas podem ter em relação aos parâmetros que se deseja estimar.

## Exemplo em Python

[TODO]

## Considerações finais

Vou finalizar o estudo da primeira parte do capítulo 3 por aqui. A próxima sessão é "Regressão e causalidade". 

