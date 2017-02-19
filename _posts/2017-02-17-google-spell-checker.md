---
layout: post
title: "Utilizando a Google como corretor ortográfico"
date: 2017-02-17
lang: pt
ref: google-ortografico
comments: true
---

1. [Introdução](#introducao)
2. [Problemas](#problemas)
3. [Corrigindo os problemas](#corrigindo)
4. [Casos úteis](#casos)
5. [Performance](#performance)
  
### Introdução <a name="introducao"></a>

Há um tempo pensei em tirar proveito do **"Você quis dizer"** da Google para realizar correção ortográfica. Uma pesquisa rápida me levou pra um [script](https://github.com/bkvirendra/didyoumean) de quatro anos atrás e que continua funcionando. Os problemas que foram identificados estão corrigidos [no meu fork](https://github.com/lgmoneda/didyoumean).


```python
def didYouMean(q):
    q = str(str.lower(q)).strip()
    url = "http://www.google.com/search?q=" + urllib.quote(q)
    html = getPage(url)
    soup = BeautifulSoup(html)
    ans = soup.find('a', attrs={'class' : 'spell'})
    try:
        result = repr(ans.contents)
        result = result.replace("u'","")
        result = result.replace("/","")
        result = result.replace("<b>","")
        result = result.replace("<i>","")
        result = re.sub('[^A-Za-z0-9\s]+', '', result)
        result = re.sub(' +',' ',result)
    except AttributeError:
        result = 1
    return result
```

Basicamente, é feito o request utilizando a url com a query sendo a palavra que queremos corrigir e então utiliza-se o BeatifulSoup para pegar a linha onde é mostrada o "Você quis dizer", que faz parte da classe **spell**. É feito um pré-processamento do resultado e caso não seja sugerida correção, retonar-se 1.
  
```
python didYouMean.py "futebor"
       => futebol
python didYouMean.py "futebol"
       => 1
```

### Problemas  <a name="problemas"></a>

A Google não faz muito idéia do que temos na cabeça quando fazemos uma pesquisa, mas guiando-se pela popularidade e contexto é possível fazer um bom trabalho. Neste quesito, quanto mais contexto damos, melhor, pois ajudará na desambiguação. Por exemplo, a pesquisa consegue identificar que estamos falando do remédio **Cataflam** quando cometemos um pequeno erro por causa da proximidade da palavra correta e da popularidade da pesquisa, mas assim que vamos cometendo mais erros, falta contexto e a correção fica errada:

```
python didYouMean.py "catafram"
       => cataflam
python didYouMean.py "catafran"
       => catamaran
python didYouMean.py "capafran"
       => cifran
python didYouMean.py "kapafran"
       => kapalaran  
```

Há também o problema do idioma e do encoding. Se fazemos, por exemplo:
  
```
python didYouMean.py "camiza"
       => 1

python didYouMean.py "paixão"
       => paixxe3o
```

No primeiro caso "camiza" está correto, mas não para o português do Brasil. Enquanto no segundo vemos que o caractere "ã" precisa ser tratado.

### Corrigindo os problemas  <a name="corrigindo"></a>

#### Idioma

Mesmo uma alteração no cabeçalho (o header do request) "Accept-Language" não foi capaz de corrigir problemas com a língua desejada. Porém, o comportamento tornou-se o desejado quando ao invés de realizar a query no endereço originalmente utilizado, realizou-se com a versão encriptada:

```
url = "https://encrypted.google.com/search?q=" + urllib.quote(q)
```
  
#### Encoding

Ainda temos o problema de encoding. Para resolvê-lo vamos tirar o pré-processamento do código original, pois ele era aplicado ao ```contents``` do que era encontrado, o que incluia as tags do HTML. Usaremos o atributo ```text``` e deixaremos de usar o ```repr()```. 

```python
import pandas as pd
df = pd.DataFrame()
df["Português"] = ["paichão", "missanga", "corapão", "cassamba"]
df["Português Corrigido"] = df["Português"].apply(lambda x: didYouMean(x))
```  
```
   Português   Português Corrigido
0   paichão        u'paix\xe3o'
1  missanga       u'mi\xe7anga'
2   corapão    u'cora\xe7\xe3o'
3  cassamba       u'ca\xe7amba'
```

A correção é feita com eliminando todo o pré-processamento original e com a seguinte modificação:

```python
### Not using repr()
### Using text instead of contents
result = ans.text
```
  
```
   Português            Português Corrigido
0   paichão              paixão
1  missanga             miçanga
2   corapão             coração
3  cassamba             caçamba

```

#### Contexto

A correção depende muito do contexto. Portanto, vamos permitir que o usuário passe o contexto da palavra para que a probabilidade de acertar o intuito do usuário aumente.


```python
### Passing a context with query string
url = "https://www.google.com/search?q=" + urllib.quote(q + " " + context) 
```

```python
### Excluding context before returning the result
result = [word for word in result.split(" ") if word not in unicode(context, "utf-8")]
result = " ".join(result)
```

Dessa forma:

```python
df = pd.DataFrame()
df["Remedios"] = ["catafram", "catafran", "capafran", "kapafran"]
df["Corrigido"] = df["Remedios"].apply(lambda x: didYouMean(x, encrypted=True))
df["Corrigido Contexto"] = df["Remedios"].apply(lambda x: didYouMean(x, context="bula remédio", encrypted=True))
```

```
   Remedios   Corrigido          Corrigido Contexto
0  catafram   cataflam           cataflam
1  catafran  catamaran           cataflam
2  capafran     cifran           cataflam
3  kapafran  kapalaran           cataflam
```

O contexto também pode ser usado para informar a língua, passando algo como "pt-br" e "português brasil".

### Casos úteis <a name="casos"> </a>
  
Até agora estamos utilizando muito do que um dicionário tradicional poderia fazer. Uma boa utilidade para a ferramenta seria a correção de termos muito específicos, como remédios, nomes de Pokemons e etc, Para isso, bastaria adicionar o contexto, ou dependendo da especificidade, nem isso é necessário.


```
### Example 1
df = pd.DataFrame()
df["Remedios"] = ["capafram", "ruvitril", "puscoban", "huyabc", "adivil"]
df["Corrigido"] = df["Remedios"].apply(lambda x: didYouMean(x, context="bula remédio", encrypted=True))
print(df)

### Example 2
df = pd.DataFrame()
df["Pokemons"] = ["Picachu", "xamander", "boobasar", "skertle"]
df["Corrigido"] = df["Pokemons"].apply(lambda x: didYouMean(x))
print(df)
```

```
   Remedios Corrigido
0  capafram  cataflam
1  ruvitril  rivotril
2  puscoban  buscopan
3    huyabc    hyabak
4    adivil     advil


   Pokemons	    Corrigido
0   Picachu            pikachu
1  xamander         charmander
2  boobasar          bulbasaur
3   skertle           squirtle

```


### Performance <a name="performance"> </a>

Como pode-se imaginar, a performance do script da maneira que está não é muito boa.

```

def test():
    df = pd.DataFrame()
    df["Remedios"] = ["capafram", "ruvitril", "puscoban", "huyabc", "adivil"]
    df["Corrigido"] = df["Remedios"].apply(lambda x: didYouMean(x, context="bula remédio", encrypted=True))

print(timeit.timeit("test()", setup="from __main__ import test", number=15))

```

```
158.442110062
```

Ou seja, demora-se 2 minutos e 40 segundos para realizar a correção de 75 termos. Vamos tentar cuidar disso em uma próxima oportunidade!