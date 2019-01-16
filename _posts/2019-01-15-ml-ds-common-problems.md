---
layout: post
title: "Problemas comuns na aplicação de Machine Learning"
date: 2019-01-15
lang: pt
ref: bias
author: moneda
description: Os problemas mais comuns que surgem na aplicação de Machine Learning
---


1. [Significado de bias](significado-de-bias)
2. [Bias em estatística](bias-em-estatisca)
3. [Aprendizado de Máquina](aprendizado-de-maquina)

https://towardsdatascience.com/top-examples-of-why-data-science-is-not-just-fit-predict-ce7a13ef7663
## Formato

- Descrição
- O que pode dar errado?
- Teoria
- Exemplo
- O que fazer?

## Validação

## Target (variável alvo)

### Eles nào estão feitos
### Viés na observação
### Censura / Rejeitados

## Distribuição dos dados

### Deslocamento da população

**Descrição**: com o passar do tempo, a população na qual o seu modelo é aplicado pode mudar.

**O que pode dar errado?**: toda a validação é feita tendo como hipótese que a população seria a mesma. Portanto, não há garantia de desempenho na nova população. 

**Teoria**: aprendizado de máquina é um mapeamento da distribuição populacional na variável de interesse (a que será prevista). Treinar com uma população e aplicar em outra é simplesmente errado

**O que fazer?**: é comum que a população dos exemplos vá mudando ao longo do tempo, a performance do modelo deve degradar com o passar do tempo. Porém, isso pode ser mais ou menos agressivo. O 'minimo é monitorar as distribuições das variáveis que entram - mesmo que seja um monitoramento univariado, já será útil. Além disso, a performance é onde estará a melhor sinalização da degradação do modelo. Mas se a formação do target é longa, é melhor estar de olho nas entradas para não ter que esperar muito e só identificar algo errado depois de dias ou meses.

### Surgimento de novas classes, mudança da importância ou significado


**Descrição**: este é apenas um caso especial do anterior. Você possui várias variáveis categóricas no seu modelo e estar associado à cada uma das classes tem um determinado significado quando se treina o modelo. Porém, 

**O que pode dar errado?**: o significado daquela categoria pode mudar de acordo com ações tomadas na sua empresa. 

**Teoria**: em uma modelo treinado off-line e em produção, o aprendizado todo já ocorreu e o modelo está apenas atuando. 

**O que fazer?**: Monitorar o desempenho por categorias que são sensíveis: filtro o dataset para cada classe e calculo a métrica de performance que tenho usado para cada uma delas e espera-se que o comportamento mantenha de uma em relação à outra. 

Além disso, manter-se atualizado de tudo que há de lançamento, campanha, mudança de política e engenharia que possa ter impacto nos exemplos que vão entrar no seu modelo.

Manter o Uma variável categórica pode ter uma mudança grande ao longo do tempo. channel...

## Modelos em produção (Infraestrutura)

### Missing data

É uma prática comum o data scientist conferir se os valores faltantes (missing values) em seu conjunto de treino são aleatórios ou se há uma razão específica para eles. Modelos como o XGboost conseguem tratar os missings como se fossem uma classe e aprender o que há de sinal neles. 

**O que pode dar errado?**: os missings em produção podem ter origens diversas. Um provedor de dados que falhou não aleatoriamente, exemplos vindos de um determinado canal de acquisição e etc. Isso faz com que o missing tenha um significado diferente daquele aprendido durante o treino e isso vai passar um sinal errado para o modelo. Estratégias de substituir o missing pela mediana/moda não são suficientes: se o missing atinge uma subpopulação que deveria ser "ruim", a mediana vai torná-los melhor e vice-versa, o que vai degradar o desempenho.

### 

## Interpretação 

### Dos parâmetros

Após construir um modelo preditivo é comum querer interpretar como as previsões foram geradas. No caso de regressões, é especialmente comum que se queira saber qual foi o peso associado à determinadas variáveis que foram aprendidos. 

Por exemplo, foi feito um modelo para prever o desempenho de um funcionário no próximo semestre. O RH da empresa não quer apenas prever, mas quer ser capaz de influenciar o desempenho e por isso quer saber que tipo de característica tem o maior retorno, seja para implementar políticas ou usar para contratação. Porém, o modelo foi feito para ser um bom modelo preditivo e não para estimar o relacionamento entre as variáveis ou para ser feita a inferência causal. 

Portanto, quando se for olhar para o parâmetro associado ao impacto de um curso no desempenho, ele estará super estimado, pois "ser um funcionário interessado" é uma **confounding variable** para fazer um curso e ter bom desempenho. Isto quer dizer que ser um funcionário interessado impacta tanto a probabilidade de se inscrever em cursos quanto o desempenho. 

Isso é algo sutil, pois em econometria o objetivo muitas vezes é estimar parâmetros e não previsão. Porém, os mesmos modelos hoje são usados com foco em desempenho de previsão. Então é preciso tomar cuidado.


### Errada da saída do modelo
Em aprendizado supervisionado, o que será previsto será exatamente o que foi definido como target. Para isso, para prever churn ou default, precisamos ter uma definição do que consistirão esses fenômenos. 

Se dissermos que um usuário do produto deu churn se ele deixou de usá-lo por 30 dias dentro de 3 meses após o primeiro uso e utilizamos isso para definir o target binário de um classificador, a probabilidade que o modelo dará será sobre a chance de um usuário deixar de usá-lo por 30 dias dentro dos 3 primeiros meses como usuário. Parece óbvio, mas como o seu modelo será chamado de "modelo para prever churn" dentro da sua empresa, há uma chance que pessoas possam consumí-lo sem saber o que a probabilidade significa. 









## Bias em estatística

A primeira vez que a maioria dos cientistas de dados ouviu o termo "bias" foi provavelmente em aulas introdutórias de estatística. Qual o significado de bias em um livro de estatística básica? É o de **desvio sistemático** do valor real. É desvio por não coincidir com o valor real e é sistemático por acontecer consistentemente, em média. 

Então é dito que um estimador, ou seja, uma abordagem para estimar (encontrar uma aproximação de algo) de um parâmetro, que é uma característica real de algo, como a média de uma população, é não viesado se na média o estimador é igual ao valor real. Seja $$ \hat{\theta} $$ um estimador e $$\theta$$ o parâmetro a ser estimado:

$$

\begin{equation}
\mathbb{E}[\hat{\theta}] = \theta
\end{equation}

$$

Essa característica poderia ser a média dos estudantes brasileiros em um exame nacional. A população são os estudantes brasileiros e você quer estimar a média nacional perguntando apenas para parte deles. A média amostral é um estimador não viesado. O que isso quer dizer? Que se tirarmos amostras aleatórias dos estudantes e perguntarmos suas notas, a média desses valores irá "flutuar" em torno na média real e irá convergir para esta com o aumento do número de estudantes nessa amostra. 

Até aqui estamos falando do viés que pode estar ou não contido no estimador, isto é, na abordagem que estamos usando para acessar o valor real de um parâmetro que é desconhecido para nós - que é impossível ou muito custoso de ser medido diretamente. 

Da mesma forma, quando queremos decompôr um fenômeno em uma relação linear com uma regressão linear, quer-se estimar como cada variável independente contribui na formação da variável dependente. Então há uma noção de que existe uma relação verdadeira expressa como:

$$

\begin{equation}
y = \beta_{0} + \beta_{1} * x_{1} + \beta_{2} * x_{2} + ... 
\end{equation}

$$

Mas como não temos acesso direto à essa equação, nós gostaríamos de estimá-la, sendo assim, buscamos algo como:

$$

\begin{equation}
y = \hat{\beta_{0}} + \hat{\beta_{1}} * x_{1} + \hat{\beta_{2}} * x_{2} + ... + \epsilon
\end{equation}

$$

Novamente, quer-se um estimador que não seja viesado, que seu valor esperado seja igual ao real. Além disso, é preferível, entre todos os não viesados, que a variância seja a menor possível. Graficamente [^fn1]:


<div align="center">
<figure>
	<a href="images/bias/estimator-distribution.png">
		<img  style="width:500px;margin:10px" src="../../../images/bias/estimator-distribution.png"/>
	</a>
	<figcaption>O valor do estimador deve "flutuar" em torno e concentrar-se no valor real (unbiased) e desejaríamos que a flutuação fosse pequena (menor variância possível). </figcaption>
</figure>
</div>

Segundo o *Gauss=Markov theorem** [^fn2], se os erros $$\epsilon$$ do modelo de regressão linear:

- Possuem média zero: $$ \mathbb{E}[\epsilon] = 0 $$
- São Homocedásticos, ou seja, todos possuem a mesma variância e ela é finita: $$Var(\epsilon_{i}) = \sigma^{2} < \inf$$
- Termos distintos são não correlacionados: $$Cov(\epsilon_{e}, \epsilon_{j}) = 0, \forall i \neq j$$

Ao estimarmos esses parâmetros usando **ordinary least squares (OLS)**, teremos o melhor estimador linear não viesado (best linear unbiased estimator - BLUE). 


Portanto, até aqui estamos chamando de não viesada as técnicas que utilizamos para estimar dizemos que isso é uma propriedade delas.

Muito provavelmente

## Aprendizado de Máquina

Bias x Variance

## Ciência de dados
Boa parte do que é chamado de ciência de dados hoje é sobre previsão. E previsões são feitas de modelos e dados. 

Neste contexto

## Falácia Ecológica


## Behavioral Economics


In this post I'm going to show how a well structured HTML, Python and a loyal Raspberry Pi can help you to find a nice position in any company you like.

At the end, you'll be able to receive this kind of message:

<div align="center">
<figure>
	<a href="images/find-job-email-example.png">
		<img  style="width:350px;margin:10px" src="../../../images/find-job-email-example.png"/>
	</a>
	<figcaption>You should receive an e-mail like that when the script finds what you want</figcaption>
</figure>
</div>

## Overview

1. Crawling jobs portal
2. Sending an e-mail
3. Configuring RPi to run a script periodically



Uma vez que eu já tinha esse tipo de conhecimento da faculdade, não foi preciso buscar um curso sobre esses tópicos. Porém, é comum que cursos de ML comecem com revisão desse tipo de conteúdo (principalmente de Probabilidade e Álgebra Linear). Então, caso não tenha conhecimento desses tópicos, é possível tentar aprender o suficiente através dessas revisões. Um livro que faz essa revisão é o [Deep Learning Book](http://deeplearningbook.org/), que está disponível no link.

## Teoria

É um ótimo momento para quem quer aprender Machine Learning, pois tem uma infinidade de cursos por ai. Os que eu indicaria seriam:

1. [Learning from data](https://www.edx.org/course/learning-data-introductory-machine-caltechx-cs1156x): é um curso bem teórico, mas breve. Há um livro com o mesmo nome.
2. [Elements of Statistical Learning](outros eu fiz): Li apenas parte do livro, que achei muito bom, embora seja uma leitura pesada.
3. [Understanding Machine Learning](http://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/understanding-machine-learning-theory-algorithms.pdf): Este é apenas um livro e é o que foi usado na disciplina MAP5918 Aprendizagem de Máquinas I.
4. [Machine Learning Specialization UW, Coursera](https://pt.coursera.org/specializations/python): É o menos pesado de todos, acho que as aulas tem a medida certa entre teoria e prática, exceto pelo primeiro curso dos quatro, que é bem introdutório, mas ótimo para ter noções.

Eu começaria pelo 4 e depois iria para o 1.

## Prática

Para praticar machine learning é preciso decidir quais ferramentas utilizar, portanto, um pouco sobre o que uso.

### Ferramentas

Basicamente, para um iniciante a escolha é Python ou R. Se você já conhece Python ou outra linguagem, eu indicaria a primeira, caso não tenha background grande em programação, ir para o R passa a fazer mais sentido.

Para aprender Python eu fiz os últimos cursos da especialização do Coursera [Python for Everybody](https://pt.coursera.org/specializations/python). Se já souber programar, faça o mais rápido possível esses cursos!

O conjunto de bibliotecas que uso e que faz parte da maior parte de quem usa Python para Data Science é:
- Numpy: cuida das operações matriciais de forma otimizada
- Pandas: para manipulação de dados
- Matplotlib: na criação de gráficos
- Scikit-Learn: ferramentas e modelos de Machine Learning
- Keras: redes neurais e Deep Learning

Dá para aprender essas ferramentas com cursos bem básicos, nos quais você basicamente pega a sintaxe e idéia geral de cada uma, como os do [Datacamp](https://www.datacamp.com/community/tutorials/machine-learning-python).

Isso é o suficiente para começar!

### Recursos para praticar
Existem cursos que as atividades são mais próximas da prática em Machine Learning, como é o caso do da UW. Então, para exercitar, eu indicaria:

1. [Machine Learning Specialization UW, Coursera](https://pt.coursera.org/specializations/python): Possui Assignments para todas as semanas, praticamente. Após o primeiro curso essas atividades passam a aparecer em dobro, em uma delas usa-se a biblioteca GraphLab e na outra apenas Numpy, uma dá idéia do projeto em alto nível, a outra você implementa algoritmos. 
2. [Kaggle](www.kaggle.com.): Plataforma de competições de Data Science. Existe algumas que são de tutorial, é um ótimo passo inicial. Depois é só entrar em uma competição real e acompanhar a discussão do problema no fórum e os códigos que o pessoal compartilha.

## Resolução de Problemas

Porém, há algo que em nenhum dos cursos ou o Kaggle pode oferecer: um problema em aberto. Para isso geralmente é preciso buscar um trabalho na área um iniciar um projeto pessoal. Especificar um problema, coletar/gerar os dados, escolher a melhor abordagem e etc, tudo isso vai contribuir para a formação. Este deve ser um passo após os primeiros cursos e praticar um pouco com as ferramentas no Kaggle ou Assignments.

## Bibliografia

[^fn1]: https://www.uv.es/uriel/2%20Simple%20regression%20model%20estimation%20and%20properties.pdf
[^fn2]: https://en.wikipedia.org/wiki/Gauss%E2%80%93Markov_theorem#Statement
