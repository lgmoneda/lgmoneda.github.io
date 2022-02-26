---
layout: post
title: "Definindo um projeto inicial em Data Science"
date: 2022-02-23
lang: pt
ref: starterproj
comments: true
author: moneda
description: Princípios para definir um ótimo projeto inicial com exemplos para Cientistas de dados e Engenheiros de Machine Learning
image: ../../../images/starter-project/kelly-sikkema-O5XJoxrYbQo-unsplash.jpg
tags: management machine-learning
---

## Índice

1. [Introdução](#introdução)
2. [Os requisitos de um bom projeto inicial](#os-requisitos-de-um-bom-projeto-inicial)
3. [Como torná-lo perfeito](#como-torná-lo-perfeito)
4. [Relaxando as condições](#relaxando-as-condições)
5. [Checklists](#checklists)
6. [Exemplos](#exemplos)
7. [Conclusão](#conclusão)

## Introdução

Um novo cientista de dados ou engenheiro de aprendizado de máquina se juntará à equipe em breve. Um dos passos mais importantes durante o onboarding é o projeto inicial: a primeira tarefa real que o novo membro fará.

No entanto, não deve ser qualquer projeto. O projeto inicial pode definir o tom para os primeiros meses dos novos contratados na empresa. Independentemente da senioridade do novo membro, a definição do projeto inicial requer atenção. Um gerente de ciência de dados deve escolher um que respeite o ritmo do novo membro, agregue valor, maximize o aprendizado, gere impulso e desfaça a síndrome do impostor.

Os princípios neste artigo são gerais, mas os exemplos se concentram em Data Science.

<div align="center">
<figura>
<a href="../../../images/starter-project/kelly-sikkema-O5XJoxrYbQo-unsplash.jpg" name="Página em branco">
<img style="width:550px;margin:10px" src="../../../images/starter-project/kelly-sikkema-O5XJoxrYbQo-unsplash.jpg"/>
</a>
<figcaption>Um projeto inicial é um começo que não deve parecer como começar algo novo. Sem sentimentos de encarar uma página em branco. <br>Fonte: Kelly Sikkema</figcaption>
</figura>
</div>

## Os requisitos de um bom projeto inicial

### Não sensível ao tempo

Um projeto não sensível ao tempo não bloqueia nenhuma iniciativa, membro da equipe ou agente externo. É um período em que o aprendizado vem em primeiro lugar e a entrega vem em seguida. Um prazo difícil pode fazer com que o novo membro sacrifique sua educação para não comprometer a equipe. Além disso, pode ser muito estressante ser pressionado em um ambiente onde ainda não está claro como fazer as coisas.

Isso não significa que o projeto pode ser entregue a qualquer momento, mas o prazo é tão adiantado no tempo que você pode abstrair dele. Estime que a nova pessoa levará pelo menos o dobro do tempo de um membro integrado e defina um projeto que não gere estresse, mesmo que leve quatro vezes mais.

Um sinal vermelho é fazer com que o novo membro construa uma parte necessária de um projeto importante. Por exemplo, um banco de dados, conjunto de dados ou infraestrutura necessária para implantar um modelo no qual a equipe está trabalhando ou fará em breve. Trabalhar em um projeto que envolve muitos membros da equipe torna mais provável que o tempo de entrega seja essencial para permitir que outros membros façam seu trabalho. Ou pior, um projeto que já está atrasado.

### Descrição clara e definição de pronto

É isso que queremos o tempo todo e para todos. No entanto, existem iniciativas para as quais a definição do critério de sucesso é mais simples. Escolha-os. Você quer que no final do projeto inicial, algo muito concreto e valioso para a equipe aconteça, como:

- Uma recomendação para usar ou não uma determinada abordagem na próxima versão de um modelo;
- Uma grande demonstração de que uma nova fonte de dados é ou não valiosa;
- Um modelo implantado tomando decisões ou descartando um modelo de ML para tomar essa decisão;

Para alcançá-lo, pense se o time sabe uma maneira objetiva de verificar se a análise gerará uma decisão ou se o código deve ir para produção. Se a equipe não tiver certeza de como tomar essas decisões usando os resultados de trabalho do novo membro, evite-o como um projeto inicial.

Sua empresa provavelmente tem expectativas sobre quão cruas as demandas devem chegar às pessoas em um nível diferente. Enquanto os membros mais juniores executam tarefas óbvias, os mais seniores lidam com a ambiguidade e moldam o que precisa ser realizado.

Entretanto, é melhor considerar que a pessoa nova pertence a um ou dois níveis de senioridade a menos do que aquele em que foi contratada. Se você contratou um Cientista de Dados, forneça o suporte que você daria a Cientista de Dados Júnior. Se for Staff, trate como sênior. É até mesmo razoável que no inicio o suporte dado a qualquer pessoa acima de Staff na equipe seja o mesmo que um Sênior teria. Isso significa fornecer um projeto muito bem documentado em uma ferramenta como Jira, Trello e Asana. Vincule tarefas à documentação correta, deixe explícito os canais de ajuda, quebre-o o máximo que puder (e para membros jr, significa um nível de tarefas diárias ou por hora). Deixe a pessoa saber que você está fazendo isso por ela porque é o projeto inicial e use-o para definir o que você espera que ela faça sozinha depois disso.

### Zero ou baixa ambiguidade, sem dependências externas
Um problema de ambiguidade zero não gerará mudanças na direção. Não colocará a nova pessoa em uma posição em que ninguém na empresa possa ajudá-la.

Não ofereça um projeto que a equipe falhou no passado! É provável que haja ambiguidade se a equipe caiu nela no passado.

Evidentemente, evite um projeto que esteja ou possa estar bloqueado. Por exemplo, se seus dados dependem de um agente externo ou a equipe não tem certeza se os dados disponíveis têm qualidade para viabilizar o projeto.

Testar uma nova fonte de dados em um modelo existente é uma ótima opção. Mas se os dados ainda não estiverem disponíveis, torna-se uma má escolha.

### Um buddy que sabe executar o projeto
Um membro da equipe atual deve ser capaz de executar esse projeto do início ao fim sem nenhuma alteração no plano inicial. Defina um dos membros da equipe nesta situação como o buddy do novo contratado.

Isto permitirá pairings muito produtivos, respostas ótimas e específicas e uma confiança no novo membro de que ele terá o suporte perfeito para ter sucesso em sua primeira empreitada.

É por isso que o requisito anterior é essencial. Quanto menor a ambiguidade, maior a chance de um membro ou mais da equipe se encaixar nessa descrição e desempenhar perfeitamente o papel de buddy. Como você tratará a nova contratação como menos senior, um buddy do mesmo nível pode fazer um ótimo trabalho.

### Relativamente curto

Podemos ser tentados a dizer "quanto mais curto, melhor", mas não seria preciso. Acumular mini-tarefas e chamá-las de projeto inicial provavelmente está relacionado a bugs, coisas desinteressantes, tarefas pouco importantes, etc. Como são muito curtas, podem se tornar muito específicas e não permitir que o novo membro generalize. Por exemplo, corrigindo o monitoramento do modelo para uma métrica específica que está quebrada. É provável que a pessoa possa executá-lo. Ainda assim, é provável que consiga sem aprender a configurar um monitoramento de modelo completo para uma tarefa futura.

Queremos o mais curto, mas limitado a todos os outros requisitos.

Um bom período é de 2 a 8 semanas porque é longo o suficiente para incluir diferentes partes da stack e partes significativas de trabalho. Quanto mais ponta a ponta, melhor, mas sempre zero ou pouca ambiguidade. Se o trabalho principal da pessoa for implantar modelos de ML, desenvolva o projeto mais curto sobre a implantação de um modelo.

Terminar um projeto bem-sucedido rapidamente e apresentá-lo à equipe dá muita moral.

### Prepara a pessoa para os seguintes projetos

Um projeto pode respeitar todos os requisitos, mas não preparar o novo membro para os projetos seguintes. Espera-se que eles usem pelo menos uma ferramenta, linguagem de programação, sistema, etc., que será importante para a maioria dos projetos seguintes.

Eventualmente, os projetos de Data Science tocam a stack de engenharia ou análise de negócio. Evite usar um projeto inicial que ensine sobre uma "habilidade agradável de se ter". Por exemplo, os engenheiros de aprendizado de máquina podem não tocar com frequência nos microsserviços da sua empresa. Embora seja muito legal ter essa habilidade, e muitos ótimos membros do time sabem alavancá-la, é melhor usar o projeto inicial para construir habilidades básicas, que serão usadas na maioria dos projetos futuros.

O mesmo vale para um Cientista de Dados. Você pode ter um projeto que envolve 20% de conhecimento de dados e 80% de finanças. É um projeto ok para o onboarding. Ainda assim, suponha que seja incomum que Cientistas de Dados aproveitem o conhecimento financeiro em seus projetos em sua empresa. Nesse caso, está investindo 80% do projeto inicial em habilidades que provavelmente não serão usadas nos próximos meses.

## Como torná-lo perfeito

Esses itens tornam o bom projeto inicial um caso perfeito.

### Alta probabilidade de ser impactante

Prefira oferecer algo impactante. Entregar valor em uma nova empresa é extremamente aliviante para o novo contratado. Todos na equipe vão se sentir empolgados com isso. Normalmente, as tarefas relacionadas à redução de custos são inequívocas e impactantes.

Sabemos que os projetos de ciência de dados podem exigir alguma exploração antes de você informar seu impacto potencial. Se necessário, faça essa exploração antes que a pessoa entre e use-a para decidir se é um bom projeto. Verifique o volume de dados, o dinheiro envolvido em uma decisão, se há variabilidade no comportamento do cliente para uma determinada ação, etc.

Se envolver a tomada de decisões, prepare o terreno para descobrir se a equipe ou a empresa está aberta àquela mudança. Mesmo uma decisão clara e lucrativa pode encontrar resistência se colocar em risco a experiência do cliente.

### Alta visibilidade

Outra característica que pode tornar um projeto inicial perfeito é a visibilidade e a contribuição para uma parte crítica da empresa. Esse tipo geralmente está relacionado a melhorias futuras em uma solução essencial. Se sua equipe tiver um modelo de ML para tomar decisões, considere fazer com que o novo membro teste algumas abordagens específicas. Por exemplo, adicionar novas variáveis, engenharia de variáveis, excluir variáveis, simplificar etc. Qualquer melhoria marginal em uma solução crítica provavelmente terá impacto. Eles reconhecerão seu trabalho integrado a um projeto com muita visibilidade: "Nosso principal modelo de recomendação usa esse tipo de variável por causa do trabalho que fiz!".

Ao mesmo tempo, se não melhorarem, a equipe fica feliz em ter sua documentação. Você pode transmitir a todos os Cientistas de Dados da empresa sobre a eficácia dessa abordagem. Contanto que a próxima versão em si não dependa dessa fonte de melhoria, tudo bem.

### É fácil estimar o impacto

Um projeto pode ser considerado impactante sem uma maneira fácil de medi-lo. Por exemplo, uma ferramenta que faz um processo levar menos tempo e é usada por mais de 20 pessoas mensalmente provavelmente será chamada de impactante. Como queremos tornar o sucesso do novo contratado o mais explícito possível, escolher um projeto inicial em que possamos identificar o benefício monetário é o perfeito.

### Em vez de um projeto inicial, ofereça alguns e em um ramp-up

Como recomendado, em um projeto inicial, é bom oferecer um suporte as novas pessoas como se fossem mais juniores do que seu nível atual e oferecer um inicio em progressão (ramp-up). Uma forma é dividir o projeto inicial em expectativas e desafios progressivos.

É útil quando não há um projeto inicial que siga todos os requisitos, mas você pode ver 2-3 que seguem alguns deles, mas desarticulados. Um projeto de 1-2 semanas pode ser chamado de aquecimento. Se você precisar de dois aquecimentos para ensinar duas partes importantes da pilha, vá em frente. Para os Cientistas de Dados, geralmente está fazendo análises "offline". Do tipo que nos diz em qual direção devemos seguir no futuro: incluir ou não um novo recurso em um modelo existente, incluir ou parar de usar uma solução baseada em regras, fazer uma apresentação sobre os dados adquiridos em um experimento recente etc. Para um engenheiro de aprendizado de máquina, fazer o deploy de um modelo de exemplo, ou atualizar um modelo não tão importante pode ensinar o end-to-end em uma tarefa simples antes de algo mais desafiador.

Ainda assim, os projetos de aquecimento precisam seguir a maioria dos requisitos e se preparar para os próximos projetos, pois os usamos para acelerar a nova pessoa. Eles precisam expor o novo membro às ferramentas, fluxos, processos e negócios da empresa. Se o aquecimento não esticou a pessoa em nada, reconsidere os próximos passos do aumento para ajustá-los.

## Relaxando as condições

### Acabei de contratar este DS/MLE porque temos este projeto muito importante e sensível ao tempo
Vai acontecer com frequência. Nesses casos, o projeto de aquecimento com o ramp-up é uma boa estratégia.

O projeto de aquecimento pode estar relacionado ao ambicioso. Pode ser uma fatia. Exemplos que vi funcionando: a fase de pesquisa de uma nova versão do modelo ou a compreensão dos dados subjacentes. Nesses casos, é fundamental marcá-la como uma etapa com entrega específica. Então, quando a pessoa o entrega, ela sente que realizou algo significativo e criou impulso para o projeto desafiador.

### É uma equipe nova; não temos ideia do que um Cientista de Dados poderia fazer e não temos alguém para ser buddy
Existem alternativas. Primeiro, para evitar ser desmotivado por projetos ambíguos que ninguém na empresa sabe como executar, considere pedir a outra equipe para integrar e fornecer um projeto inicial para essa pessoa. Segundo, há uma chance de que a aplicação da ciência de dados a esse caso de uso específico não seja nova para um membro da empresa que não faz parte da nova equipe. Procure alguém para ajudá-lo a especificar o projeto seguindo as características que destacamos anteriormente.

No entanto, toda essa situação já é complicada e não só por causa do projeto inicial. Quanto mais júnior o membro, maior o risco de alocar em uma nova equipe. Antes de descobrir o projeto inicial, pense se faz sentido ter esse membro assumindo essa posição.

### A equipe não tem projeto com baixa ambiguidade

Se isso acontecer, use um ou dois projetos de aquecimento para ensinar principalmente ferramentas. Se o projeto inicial for ambíguo, informe o novo membro. E certifique-se de ter pessoas suficientes ao seu redor para apoiá-lo. É desafiador de duas maneiras. Primeiro, você orientará um novo membro em uma iniciativa que seria difícil mesmo para um membro a bordo. Em segundo lugar, torna-se mais complicado distinguir se um eventual mau desempenho é devido à iniciativa ou se o novo membro não está crescendo conforme o esperado.

## Checklists

Vamos criar duas checklists. A primeira é garantir que estamos preparando o ambiente para a nova contratação ter sucesso no primeiro projeto. Pense no Projeto Inicial que você tem em mente e pergunte-se se ele se adequa no que está descrito. É preciso marcar todas as caixas.

<table class="styled-table" style="margin-left:auto;margin-right:auto">
    <thead>
        <tr>
            <th style="text-align:center">Requisitos</th>
            <th style="text-align:center"></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Este projeto não bloqueará alguém na empresa se não for entregue a tempo</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>A equipe sabe como a saída do projeto se torna um resultado para a empresa</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>Há uma descrição muito detalhada do projeto em uma ferramenta como o Jira</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>Não há ambiguidade, é improvável que a direção do projeto mude</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>O andamento do projeto não depende de agentes externos</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
        <tr>
            <td>O buddy sabe muito bem como executar todo o projeto</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>O projeto levará apenas de 2 a 8 semanas, mesmo considerando o ritmo de novas contratações</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>O conhecimento adquirido será utilizado na maioria dos projetos futuros</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
    </tbody>
</table>

Seguindo os requisitos, é muito provável ter uma experiência positiva no projeto inicial. No entanto, podemos torná-lo incrível! Quanto mais ticks você tiver na lista a seguir, melhor.


<table class="styled-table" style="margin-left:auto;margin-right:auto;width:581px">
    <thead>
        <tr>
            <th style="text-align:center">A incrível lista de verificação do projeto inicial</th>
            <th style="text-align:center"></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Envolve um dos principais problemas ou soluções da equipe</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>É fácil estimar o impacto monetário e provavelmente é alto</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>Economiza dinheiro com um processo muito caro</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>Está quebrado em alguns projetos de dificuldade progressiva</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>É provável que o novo contratado seja exposto a outras equipes de negócios</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>O projeto pode ser uma referência para resolver um problema semelhante em outra equipe</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
<tr>
            <td>Há um público que estaria muito interessado em uma apresentação sobre isso</td>
            <td style="text-align:center;font-size:18px">&square; </td>
        </tr>
    </tbody>
</table>

## Exemplos

### Avaliando uma nova fonte de dados para o modelo principal da equipe

Uma nova fonte de dados fornece novos dados para alimentar um modelo de Machine Learning. Quando é uma fonte externa, a equipe precisa avaliar se a integração faz sentido. É um dos principais motivos para ter-se uma nova versão de um modelo.

Nesse caso, a equipe ainda não estava trabalhando em uma nova versão. Não havia pressão de tempo. Os dados necessários para avaliar já estavam disponíveis, sem bloqueios externos. Era provável que os novos dados melhorassem o modelo. Sabíamos exatamente como dizer sim ou não a essa decisão observando os resultados do projeto. Era provável que fosse um sim, e foi! O projeto inicial da pessoa desencadeou o trabalho de um arquiteto de negócios e engenharia, depois de engenheiros de aprendizado de máquina e cientistas de dados. A fonte de dados foi incluída e impactou significativamente o modelo principal da equipe. Embora o feedback tenha sido longo, a nova pessoa pôde reconhecer a importância de seu trabalho desde o início.

### Desenvolvendo um modelo em batch

Um modelo de aprendizado de máquina em batch processa novos exemplos alimentados periodicamente por dados armazenados. Em contrapartida, um modelo em tempo real precisa processá-los após uma ação e com baixa latência. Em termos de engenharia, os modelos em tempo real são mais complicados.

Olhando para o backlog, o projeto de maior impacto na equipe era um modelo em tempo real - e incluia algumas dependências externas. No entanto, um projeto inicial não é qualquer projeto, portanto, o processo de priorização muda. Para integrar um novo engenheiro de Machine Learning, decidimos trabalhar em um projeto diferente, um modelo em batch cujo impacto era menor.

Não havia pressão de tempo e dependências. O buddy sabia como executar todas as tarefas atribuídas ao novo contratado. Baixa ambiguidade, o projeto não mudou em relação ao proposto inicialmente. Depois de terminá-lo, o novo contratado trabalhou no modelo de tempo real, que oferecia o nível de desafio certo para fluir.

### Desenvolvendo uma nova versão de um modelo importante

Normalmente, não há como evitar que o novo contratado trabalhe em um projeto crítico. Neste caso, outros membros da equipe trabalharam nas duas versões anteriores e estavam prontos para novos desafios. Duas coisas foram cruciais para fazê-lo funcionar. Primeiro, um pequeno projeto de aquecimento para se preparar. Este assumiu a forma de uma fase de pesquisa que poderia adicionar novas alterações para a versão seguinte, mas sem depender de seu impacto para justificá-la. Segundo, ter os desenvolvedores anteriores como buddies dos dois novos contratados e explicitamente torná-los responsáveis ​​por seu sucesso. Além disso, esta nova versão tinha uma proposta de valor muito clara, sem ambiguidade.

Ele quebrou o requisito de não ser sensível ao tempo. No entanto, o prazo não foi particularmente desafiador, e os buddies estavam perto o suficiente para mitigar uma eventual pressão. Por outro lado, o impacto e a importância do projeto proporcionaram grande exposição.

## Conclusão

Definir um projeto inicial exige que o gerente de Data Science equilibre muitas coisas. Lute muito para preencher todos os requisitos. Relaxe-os conscientemente, se necessário, à custa de alocar mais atenção para torná-lo bem-sucedido. O alto investimento durante esta fase será recompensado rapidamente.

<!-- ## References -->

<!-- [^fn1]: Arjovsky, M., Bottou, L., Gulrajani, I., & Lopez-Paz, D., Invariant Risk Minimization (2019). -->
<!-- [^fn2]: Lu, C., Wu, Y., Hern\'andez-Lobato, Jo\'se Miguel, & Sch\"olkopf, Bernhard, Nonlinear invariant risk minimization: a causal approach, arXiv preprint arXiv:2102.12353, (2021). -->
