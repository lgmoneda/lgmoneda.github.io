---
layout: post
title: "Problemas comuns na aplicação de Machine Learning"
date: 2019-01-15
lang: pt
ref: bias
author: moneda
description: Os problemas mais comuns que surgem na aplicação de Machine Learning
---


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









## Bibliografia

[^fn1]: 
[^fn2]: 
