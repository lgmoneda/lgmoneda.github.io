---
layout: post
title: "Bias em Ciência de Dados"
date: 2019-01-14
lang: pt
ref: bias
author: moneda
description: Discussão sobre o que significa bias em ciência de dados
---

Neste texto pretendo abordar o significado de bias para ciência de dados. Para tal, irei passar pelo mesmo conceito nas áreas que compõe e se relacionam com o objetivo.

1. [Significado de bias](significado-de-bias)
2. [Bias em estatística](bias-em-estatisca)
3. [Aprendizado de Máquina](aprendizado-de-maquina)
4. [Ciência de dados](ciencia-de-dados)  
   4.1 [Com quem estamos aprendendo?](com-quem-estamos-aprendendo)  
   4.2 [Estudos de caso](estudos-de-caso)
5. [Ética e justiça](etica-e-justica)

## Significado de Bias

A tradução de bias para o português é viés, cujo significado é:

**Vi-és**  
(francês _biais_)
1. Linha, trajectória ou direcção oblíqua. = OBLIQUIDADE
2. Tira estreita de tecido cortada obliquamente da peça.
3. Tendência ou carácter de algo.
4. Distorção ou tortuosidade na maneira de observar, de julgar ou de agir.

Os significados mais relevantes para um contexto de dados são o de tendência e distorção. 

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

Um dos grandes temas em aprendizado de máquina é o _trade-off_ entre viés e variância (Bias x Variance), que reflete também no sub-ajuste e sobre-ajuste (underfitting e overfitting). 

O erro de generalização de um algoritmo de aprendizado, o quão bem ele pode prever novos casos, pode ser decomposto em viés e variância. 

O viés também é chamado de erro sistemático, pois ele é sobre o algoritmo não ser capaz de expressar a forma funcional com que aquele fenômeno se dá. Ou seja, por mais que usemos amostras diferentes ou maiores, ele nunca se aproximará do valor real que queremos estimar, pois não é capaz.

Já a variância é chamada também de erro aleatório, pois captura nuânces das amostras, uma vez que tende a construir regras complexas demais sem a quantidade de exemplos necessária para tal. 

Portanto, para um mesmo exemplo, se temos um modelo com o viés alto (underfitting), o erro será alto, mas causado por regras simples. Se for feito amostragens aleatórias do conjunto de treinamento (_bootstraping_) e treinarmos 10 modelos, teremos 10 previsões muito parecidas entre si, porém, todas serão ruins.

Já no caso de um modelo com o erro de variância alto, ou seja, no caso do overfitting, se fizermos o _bootstrap__ teremos 10 previsões bem diferentes entre si, porém, algumas podem passar bem próxima do valor real, enquanto outras passariam longe. De forma que não teríamos a garantia se estamos em um caso bom ou ruim, tendo que conviver com a aleatoriedade dessa estimação. 

É preciso aumentar a complexidade do modelo de acordo com a disponibilidade de dados para construir regras complexas o suficientes para explicar o fenômeno, que possuam poder de generalização. E é assim que nós aceitamos viés nos modelos, pois em determinada medida é vantajoso
Neste contexto o bias é sobre a previsão, sobre o quanto podemos estar distantes do valor real na média.

**Portanto**, nós aceitamos viés em modelos de aprendizado de máquina que tem como objetivo a previsão para que possamos minimizar o erro de generalização. 

### Aprendizado supervisionado

Antes de falar sobre viés nos dados é preciso falar um pouco sobre teoria do aprendizado supervisionado. 

Basicamente, aprendizado supervisionado se resume na conexão de uma distribuição conjunta de variáveis $$X$$ (as suas características, _features_, as colunas da sua tabela de dados) em uma variável alvo $$y$$ (o _target_, uma determinada coluna da sua tabela e que você tem o interesse de prever). É suposto que haja um conjunto anotado de exemplos, ou seja, registros na sua tabela que possuam o valor de $$y$$ para que possamos treinar um modelo que aprenderá a fazer essa conexão:

$$

\begin{equation}
X \rightarrow y 
\end{equation}

$$

Qual o resultado obtido? Um modelo que é capaz de conectar novos exemplos vindos da distribuição conjunta $$X$$ à valores de $$y$$, ou seja, prevê-los, pois espera-se que você entregue um exemplo vindo de $$X$$ antes de poder observar o valor real de $$y$$, com o desempenho médio encontrado na etapa de validação enquanto construíamos o modelo. 

Qualquer aplicação que esteja fora disso terá um comportamento diferente. E é sobre isso que falaremos nas próximas secções.

## Ciência de dados
Vamos tratar essa secção como se fosse "aplicação de aprendizado de máquina". Boa parte do que é chamado de ciência de dados hoje é sobre previsão. E previsões são feitas de modelos e dados. 

Vamos considerar que o bias em relação à modelo é o relacionado ao _trade off_ anteriormente explicado e que é uma questão teórica.

Portanto, de onde vem o que comumente temos ouvido como "efeitos preocupantes causados pelo bias em machine learning"?

### Com quem estamos aprendendo?

Como dito, em aprendizado de máquina queremos aprender uma relação, um fenômeno: churn, inadimplência, ocorrência de uma doença e etc. E em aprendizado supervisionado precisamos de uma base anotada para dizer para máquina: "Tá vendo como as coisas acontecem? É assim! Agora eu quero que você aprenda todas as regras que dizem como as características podem prever cada caso.". Mas como essa base foi anotada?

Digamos que queiramos construir um modelo para diagnosticar virose baseada nos sintômas dos pacientes. Agora precisamos de uma base que contenha uma série de sintômas e características de um paciente e uma anotação que diga "virose ou não". 

Para a nossa sorte, encontramos um médico muito cuidadoso que ao longo dos anos tomou nota de todas as suas consultas e fez questão de registrar as características dos pacientes e seus sintomas. Em uma série de casos, o seu diagnóstico foi de que o paciente estava com virose, em outros de que ele não possuia. 

Pegamos essa base e alimentamos o modelo com as características ($$X$$) e dizemos que quando observamos aquilo o caso era de virose ou não ($$y$$). Treinado o modelo, o que teremos?

Uma máquina capaz de dizer se um novo paciente tem virose ou não? **Não!** 

Teremos uma máquina capaz de imitar a maneira como o o médico do qual usamos a base de dados diagnostica virose! Com tudo que há de certo e errado nisso. Portanto, se esse médico em específico tem uma tendência a achar que é um caso de virose sempre o paciente apresenta náusea em uma frequência maior do que outros medicos o fariam, o nosso modelo levará esse viés consigo. 

> Mas que abordagem ruim! Basta usar como variável alvo algo mais próximo da realidade. 

Sim, este é o certo. Porém, nem sempre há o que possa ser considerado como **verdade** (_ground truth_) para um fenômeno. Precisaríamos antes de algo que atestasse 

E mesmo se o médico fizesse um esforço para melhorar as suas anotações e bolasse um esquema:

1. Se o paciente não voltar, o tratamento para virose funcionou e realmente era virose;
2. Se o paciente voltar, não era virose.

Porém, quem garante que a doença não curou-se de forma não relacionada com o tratamento? Ou que o paiente não voltou por ter ido em outro médico e buscar tratamento alternativo? Ou que ele voltou e o tratamento nào foi adequado ou aplicado da forma correta?

Temos, assim, que a **variável alvo de um modelo de aprendizado supervisionado é principal fonte do que é chamado de viés em aprendizado de máquina**. 

Das causas, podemos citar:

1. O fato de que um modelo necessariamente aprende com o passado e aplica as regras no presente, o que influencia o futuro e os novos dados que realimentarão os modelos. Portanto, ele propaga viéses do passado;
2. Regras, preconceitos e viéses são aprendidos pelos modelos se o target
3. Nem sempre é possível observar a formação da variável alvo e o modelo pode ser a causa disso. Um modelo que é usado para conceder crédito não vai possibilitar que se observe como bom pagado ou não uma pessoa que teve o crédito negado. Porém, continuamos aplicando para todos os pedidos de crédito atuais um modelo que foi treinado apenas com pessoas que receberam crédito no passado, estamos treinando e aplicando em distribuições $$X$$ diferentes!


### Estudos de caso
#### Amazon



https://www.reuters.com/article/us-amazon-com-jobs-automation-insight/amazon-scraps-secret-ai-recruiting-tool-that-showed-bias-against-women-idUSKCN1MK08G

## Ética e justiça
## Falácia Ecológica

https://en.wikipedia.org/wiki/Ecological_fallacy
## Bibliografia

[^fn1]: https://www.uv.es/uriel/2%20Simple%20regression%20model%20estimation%20and%20properties.pdf
[^fn2]: https://en.wikipedia.org/wiki/Gauss%E2%80%93Markov_theorem#Statement
