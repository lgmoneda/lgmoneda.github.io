---
layout: post
title: "Problemas comuns na aplicação de Machine Learning"
date: 2019-01-15
lang: pt
ref: ds-common-problems
author: moneda
description: Os problemas mais comuns que surgem na aplicação de Machine Learning
---


## TODO

add

- data leakage
- selection bias
- production feedback loop
- speciall cross validation techniques
- choosing the right evaluation metric
- start with simple models
- dont use epsilon models
- monitor your model

A única maneira de se protejer de comenter erros em projetos de aprendizado de máquina é não monitorar a solução.


O que faz aplicar aprendizado de máquina interessante é que o entendimento da teoria ajuda a identificar os potenciais problemas, assim como na investigação dos casos. Então este é um texto também de incentivo à construção de uma bse teóerica sólida. Além disso, as descrições aqui buscam ser simples e mostram como fato corriqueiros podem se tornar problemas na prática de ciência de dados, o que é especialmente ignorado por iniciantes na área, que tendem a ter um foco em modelos complicados e esquecer dos outros aspectos envolvidos em um projeto com aprendizado de máquina.

Os casos serão dividos em:

1. [Validação](#validação)
2. [Variável Alvo (_target_)](#variável-alvo-target)
3. [Dados de entradas](#dados-de-entrada)
4. [Produção (Infraestrutura)](#produção)

## Formato

Para cada caso vou tentar dividir nos subtópicos:

- Descrição
- O que pode dar errado?
- Teoria
- Exemplo
- O que fazer?

## Validação

Um dos erros mais comuns é confundir técnicas de validação com o objetivo desta. Validação não é separar treino e teste e nem fazer validação cruzada com _K-Fold_, mas sim avaliar o poder de generalização do modelo no cenário em que ele será utilizado. No desenvolvimento do modelo essa informação tem duas finalidades: seleção de modelo (você quer escolher o que tem o melhor desempenho) e valoração da solução (é preciso saber o desempenho do modelo para decidir se ele é uma solução financeiramente viável).

As técnicas citadas de validação cobrem o caso teórico e mais simples. Porém, como as aplicações são mais complexas que isso, é preciso atentar para como o modelo será usado para realizar a sua validação.



## Target (variável alvo)

### Eles nào estão feitos
### Viés na observação
### Censura / Rejeitados

## Distribuição dos dados

Após ter um modelo treinado, obtemos uma função que é capaz de mapear uma distribuição conjunta à uma variável resposta ($$ X \rightarrow y $$). Porém, $$X$$ não ficará lá toda bonitinha e comportada gerando ótimas previsões, ela muito provavelmente mudará. As origens podem ser:

- Mudar por comportamento externo: causada por mudanças na economia, concorrentes e etc;
- Mudar por comportamento interno: causada por features, produtos, marketing e etc;
- Mudar por bug (externo ou interno): provedores de dados ou bugs internos. Mais sobre isso na parte sobre Produção.

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

### Ambiente de produção diferente do de desenvolvimento

**Descrição**: um dataset é construindo unindo dados de diferentes origens. Então um modelo é desenvolvido em um ambiente local, ou mesmo utilizando algo que possa emular o ambiente de produção. Mas as circustâncias que estarão presentes no modelo em produção não estão todas na fase de desenvolvimento e é possível que não seja possível sequer colocar o modelo em produção.

**O que pode dar errado?**: você pode estar utilizando dados (cracterísticas, features) que não estarão disponíveis em produção por uma diversidade de motivos. Elas podem ser geradas em uma frequência diferente (diária, mensal e etc), ou não há estrutura para serví-las para o seu modelo e seria muito custoso implementar por apenas uma ou poucas características.

**O que fazer?**: no momento que tiver criado o dataset para treinar o modelo, certifique-se de que é possível utilizar todos aqueles dados em produção, mesmo antes de fazer os experimentos iniciais. Geralmente, os dados vem em conjunto de diversas fontes, então começar trabalhando com 500 características talvez não implique em tanto trabalho na hora de certificar-se disto.

## Interpretação

### Dos parâmetros

Após construir um modelo preditivo é comum querer interpretar como as previsões foram geradas. No caso de regressões, é especialmente comum que se queira saber qual foi o peso associado à determinadas variáveis que foram aprendidos.

Por exemplo, foi feito um modelo para prever o desempenho de um funcionário no próximo semestre. O RH da empresa não quer apenas prever, mas quer ser capaz de influenciar o desempenho e por isso quer saber que tipo de característica tem o maior retorno, seja para implementar políticas ou usar para contratação. Porém, o modelo foi feito para ser um bom modelo preditivo e não para estimar o relacionamento entre as variáveis ou para ser feita a inferência causal.

Portanto, quando se for olhar para o parâmetro associado ao impacto de um curso no desempenho, ele estará super estimado, pois "ser um funcionário interessado" é uma **confounding variable** para fazer um curso e ter bom desempenho. Isto quer dizer que ser um funcionário interessado impacta tanto a probabilidade de se inscrever em cursos quanto o desempenho.

Isso é algo sutil, pois em econometria o objetivo muitas vezes é estimar parâmetros e não previsão. Porém, os mesmos modelos hoje são usados com foco em desempenho de previsão (regressão linear, logística). Então é preciso tomar cuidado.


### Errada da saída do modelo
Em aprendizado supervisionado, o que será previsto será exatamente o que foi definido como target. Para isso, para prever churn ou default, precisamos ter uma definição do que consistirão esses fenômenos.

Se dissermos que um usuário do produto deu churn se ele deixou de usá-lo por 30 dias dentro de 3 meses após o primeiro uso e utilizamos isso para definir o target binário de um classificador, a probabilidade que o modelo dará será sobre a chance de um usuário deixar de usá-lo por 30 dias dentro dos 3 primeiros meses como usuário. Parece óbvio, mas como o seu modelo será chamado de "modelo para prever churn" dentro da sua empresa, há uma chance que pessoas possam consumí-lo sem saber o que a probabilidade significa.









## Bibliografia

[^fn1]: [More data is not better and Machine Learning is a Grind](https://scm.ncsu.edu/scm-articles/article/more-data-is-not-better-and-machine-learning-is-a-grind-just-ask-amazon)
[^fn2]: [Top examples why machine learning is not just fit() and predict()](https://towardsdatascience.com/top-examples-of-why-data-science-is-not-just-fit-predict-ce7a13ef7663)
