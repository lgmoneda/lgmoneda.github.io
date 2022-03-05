---
layout: post
title: "Um pequeno guia para Data Science / Machine Learning"
date: 2017-06-12
lang: pt
ref: ds-guide
description: Minha avaliação dos recursos que utilizei e os que indicaria para iniciantes em Data Science e Machine Learning.
tags: machine-learning
---

Em Junho de 2014 eu completava o meu primeiro curso de Machine Learning,  Andrew Ng no Coursera. Desde então foram muitos outros, competições, projetos pessoais e o começo da minha carreira em data science. Por esse tempo nessa jornada, já me pediram algumas vezes por indicações de como iniciar-se nessa área, então resolvi escrever esse guia com os recursos que indicaria. Alguns deles eu fiz parcialmente, outros completamente, mas toda indicação aqui é muito bem vista pelos colegas da área. Em cada tópico vou tentar adicionar qual seria o primeiro recurso que usaria, assim fica mais fácil para um iniciante decidir.

Acho que podemos quebrar as competências de um Data Scientist em 3 partes:
1. Teórico
2. Prático / Ferramentas
3. Resolução de problemas

Na primeira parte tem tanto a base para estudar a teoria em Machine Learning quanto o que tem sido feito na própria área. O conhecimento básico reside em:

1. Cálculo
2. Estatística e Probabilidade
3. Álgebra Linear
4. Cálculo Numérico


<div align="center">
<figure>
	<a href="images/RoadToDataScientist1.png">
		<img  style="width:350px;margin:10px" src="../../../images/RoadToDataScientist1.png"/>
	</a>
	<figcaption>Um guia visual para se perder antes de tornar-se um Cientista de Dados.</figcaption>
</figure>
</div>

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
