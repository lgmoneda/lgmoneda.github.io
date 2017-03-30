---
layout: post
title: "Tweetando como Proust"
date: 2016-04-02
lang: pt
ref: tweet-proust
comments: true
description: Utilização de um modelo estatístico simples alimentado com a obra "Em busca do tempo perdido" para gerar Tweets com o estilo de Marcel Proust.
---

Há uns dias vi um notebook do <a href="https://twitter.com/yoavgo">@yaovgo</a> sobre como um modelo linguístico usando apenas a probabilidade da ocorrência do próximo caractere pode gerar textos relativamente bons. 

O nome dessa abordagem é "unsmoothed maximum-liklihood character level language models". Ou seja, modelos linguísticos com granularidade de caractere (frases são montadas caractere por caractere), utilizando máxima-verossimilhança (o próximo caractere é aquele com a maior probabilidade, que foi calculada com o texto de treino) e não-suavizado, pois se determinada letra nunca aparece após determinada cadeia de caracteres a probabilidade que associamos à ela será zero.

Resumindo, decidimos uma janela, a ordem do modelo, que será quantos caracteres usaremos como base para levantar as probabilidades. Se esta ordem for de 4, então dividiremos o texto em cadeias de 4 caracteres e olharemos para o próximo. É feita uma contagem e depois normalizamos, assim, terminamos com uma probabilidade. Abaixo, o código quase idêntico ao exemplo base.

{% highlight python %}
def train_char_lm(fname, order=4):
    data = file(fname).read()
    #dealing with encoding
    data = unicode(data, "utf-8")
    lm = defaultdict(Counter)
    pad = "~" * order
    data = pad + data
    for i in xrange(len(data)-order):
        history, char = data[i:i+order], data[i+order] 
        lm[history][char]+=1
    def normalize(counter):
        s = float(sum(counter.values()))
        return [(c,cnt/s) for c,cnt in counter.iteritems()]
    outlm = {hist:normalize(chars) for hist, chars in lm.iteritems()}
    return outlm
{% endhighlight %}

Para treinar esse modelo, usaremos o texto de "Em busca do tempo perdido" de Marcel Proust. A idéia é conseguir gerar trechos baseados nos temas e escolhas de palavra do autor, mas que não sejam idênticos aos que aparecem na obra. Os dados e o código usado estão no <a href="https://github.com/lgmoneda/proust-dataset">github</a>

Exemplificando a saída do modelo, vamos treiná-lo com uma janela de 4 caracteres e consultar o dicionário para "amig". A saída será a seguinte:

{% highlight python %}
o : 0.574675324675
a : 0.408441558442
u : 0.0116883116883
á : 0.00454545454545
  : 0.000649350649351
{% endhighlight %}

O que é consequência das palavras amig<b>o</b>(s), amig<b>a</b>(s), amig<b>u</b>inho(s), amig<b>á</b>vel e a estranha presença do termo "jamig", que causou a presença do caractere " " (vazio) na lista.

Para gerar os textos, na verdade, não é utilizado o caractere mais provável, mas sim o primeiro da distribuição de probabilidades que tem probabilidade maior do que o acaso. A função original foi modificada para aceitar que entremos com uma cadeia inicial para gerar o texto. A palavra ou palavras da cadeia inicial devem estar contidas no texto de treino. Nesse caso:

{% highlight python %}
print generate_text(lm, 4, nletters=300, history="Gord")
{% endhighlight %}

---

> "Gordomo, de dogarto dia às que monóculos Verdurin passas imaginar a no uma japontava poder acabava-se que as se ela no prema essa," 

---

Muitas palavras estão corretas, mas as algumas acabam ficando erradas. Isso acontece por, por exemplo, com **"Gordomo"**, que a janela pequena faz com que o modelo opte por gerar a palavra "Mordomo" quando está enxergando apenas o "ordo". Essa mudança de palavra no meio de uma palavra é ruim, isso é sequer seguir o contexto intra-palavra, se é que esse conceito existe.

A solução é aumentar a janela. Mas até quanto? Quando vamos aumentando a janela, a tendência é que as palavras saiam todas corretas, depois que elas comecem a interagir com o sentido de outras palavras próximas e por fim... copiar exatamente o texto de treino. Isso acontece pelo fato de que uma janela muito grande acaba tornando-se uma evidência muito especifica do conjunto de treino e fica inevitável que ele não se reproduza. Portanto, é preciso equilirar a ordem do modelo para escapar do underfitting e do overfitting. Um bom valor foi 15.

---

> "Gordo; porém raspara os bigodes e bastara isso para fazer-me ir a alguma parte — continuou em voz baixa —, embora tenha eu pleno direito
> à minha liberdade. É certo que abdiquei dela por outra forma - acrescentou, testemunhando-lhe os seus sentimentos. Mas é uma criatura 
> deliciosa, uma mulher sustentada, e por um velho tão orgulhoso com os aristocratas, afeiçoa-se a eles, que se mostram logo uns ingratos."

---

E como essa saída se compara ao livro em si? Novamente, não queremos simplesmente reproduzir o texto, mas reorganizar de maneira lógica e que lembre o estilo do autor. 

No texto original aparece:

---

> "No entanto, era ele mesmo, apenas embranquecido e **gordo; porém raspara os bigodes e bastara isso para** fazê-lo 
> perder sua personalidade."

> "— Naturalmente, quando me perseguem vinte vezes seguidas **para fazer-me ir a alguma parte — continuou em voz baixa —, embora tenha eu 
> pleno direito à minha liberdade**, não posso em todo caso agir como um grosseirão."

> "E, não aceitando outro que eu lhe propusera, o senhor, sem querer, prestou-me um imenso serviço, deu-me a **minha liberdade. É certo que 
> abdiquei dela por outra forma - acrescentou** num tom melancólico onde transparecia o desejo de fazer confidências -;"

---

Esse resultado parece conseguir misturar suficientemente bem cadeias do texto, mantém um contexto razoável e gera trecho razoável.

Agora precisamos fazer Proust caber em um tweet, o que talvez seria a parte que mais o desagradasse. Mais fácil seria imaginar uma rede social chamada "N'allez pas trop vite", na qual os usuários tem no **mínimo** 5 mil caracteres para expressarem uma idéia. 

{% highlight python %}
def gen_tweet(lm, order, theme, max_iter=20):
    tweet = generate_text(lm, order, nletters=order+1, history=theme)
    iter = 0
    while len(tweet) > 140 and iter < max_iter and len(tweet) < 70:
        tweet = generate_text(lm, order, nletters=order+1, history=theme)
        iter += 1
    return tweet
{% endhighlight %}

Basicamente, vamos gerar trechos até que eles respeitem todas as condições: mais que 70 e menos que 140 caracteres e já com a imposição de terminar em um ponto final. Agora é só aproveitar o gerador para movimentar sua conta no twitter!
<!-- <pre><code class="python agate"></code></pre> -->

---

> "...desse sentimento que não podemos considerá-lo como dantes."

> "É terrível ter a vida de outra pessoa ligada à nossa como uma bomba que não podemos largar sem cometer um crime."

---

O que nos rendeu um profundo tweet:

<div align="center">
<blockquote class="twitter-tweet" data-lang="en"><p lang="pt" dir="ltr">Sentimento que não podemos largar sem cometer um crime.</p>&mdash; Luis Moneda (@lgmoneda) <a href="https://twitter.com/lgmoneda/status/772557911621001216">September 4, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

E outros um pouco mais psicodélicos:

<div align="center">
<blockquote class="twitter-tweet" data-lang="en"><p lang="pt" dir="ltr">Armário rústico de um velho solar transformado num Charlus mil vezes mais inteligente que o resto da pupila reagia segregando ondas de azul.</p>&mdash; Luis Moneda (@lgmoneda) <a href="https://twitter.com/lgmoneda/status/772775829554200577">September 5, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

var disqus_config = function () {
    this.page.url = "http://lgmoneda.github.io/";  
    this.page.identifier = "/2016/04/02/tweetando-como-proust.html"; 
};

(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = '//lgmoneda.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
                                
{% endif %}
