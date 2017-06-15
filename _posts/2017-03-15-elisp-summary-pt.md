---
layout: post
title: "Uma breve introdução ao Emacs Lisp"
date: 2017-03-15
lang: pt
ref: elisp-intro
description: Compartilhando o minhas anotações do livro "An Introduction to Programming in Emacs Lisp".
---

Há 45 dias comecei a usar o Emacs, o que implica em passar a utilizar o Elisp, a linguagem de programação da família Lisp para uso no Emacs. Após modificar alguns módulos e escrever minhas próprias funções, senti necessidade de entender melhor a linguagem, suas formas especiais e sintaxe.

<div align="center">
<figure>
	<a href="images/elisp-cover.png">
		<img  style="width:250px;margin:10px" src="../../../images/elisp-cover.png"/>
	</a>
	<figcaption>Não foi fácil explicar essa capa aos que me perguntavam o que eu estava lendo.</figcaption>
</figure>
</div>

Após ler o  ["An Introduction to Programming in Emacs Lisp"](https://www.gnu.org/software/emacs/manual/eintr.html) quase inteiramente, decidi escrever um resumo pessoal para consulta rápida e acabei resolvendo estruturar melhor para compartilhar, imaginando que possa ajudar outras pessoas que já tenham alguma experiência com programação e queiram aprender rapidamente sobre o Elisp. Algumas referências são do <a href="https://www.gnu.org/software/emacs/manual/html_node/elisp/">Manual Elisp</a>.

A estrutura que seguirei:

1. [**LIS**t **P**rocessing](#lisp)
2. [Symbols, symbol expression and variables](#symbols)
3. [Evaluating](#evaluating)
4. [Defining functions (defun) and the single quote ](#defun)
5. [Local scope (let)](#scope)
6. [Conditionals: if, then, else, cond and when](#conditional)
7. [Manipulating lists: car, cdr and cons](#lists)
8. [Progn, lambda and condition case](#other)
9. [Loops: while, dolist and dotimes](#loops)
10. [Recursion](#recursion)
11. [Debug](#debug)
12. [Customization](#customization)

##  1. List Processing <a name="#lisp"> </a>

LISP significa "List Processing". E esse é um ótimo nome! Listas são a base do LISP e um programa é basicamente o processamento dessas listas, que são uma estrutura delimitada por "()" e com espaços em branco entre seus elementos. 

```elisp
;; Lista de número 
(1 2 3 4)
;; Lista dentro de lista
'(esta lista tem uma (lista dentro dela))
;; Lista de strings
("John" "Ringo" "Paul" "George")
;; Lista de símbolos
(john ringo paul george)
;; Lista variada
("John" 1 (2 3 "Paul") ("Ringo" george))
```

<!-- A list in Lisp—any list—is a program ready to run. If you run it (for which the Lisp jargon is evaluate), the computer will do one of three things: do nothing except return to you the list itself; send you an error message; or, treat the first symbol in the list as a command to do something. (Usually, of course, it is the last of these three things that you really want!) -->

<!-- The single apostrophe, ', that I put in front of some of the example lists in preceding sections is called a quote; when it precedes a list, it tells Lisp to do nothing with the list, other than take it as it is written. But if there is no quote preceding a list, the first item of the list is special: it is a command for the computer to obey. (In Lisp, these commands are called functions.) The list (+ 2 2) shown above did not have a quote in front of it, so Lisp understands that the + is an instruction to do something with the rest of the list: add the numbers that follow.  -->

##  2. Atoms, symbols, symbol expression and variables <a name="#symbols"></a>

No Elisp nós chamamaremos qualquer coisa que não pode ser dividida de **átomo**. Os átomos são: **números** (1, 2, 3...), "símbolos" (+, -, john, ringo...) e strings ("John", "Ringo"...). Geralmente, nós estamos interessados em **símbolos** e **números**. 

A representação de símbolos e listas é chamada de **expressão simbólica / symbolic expressions**, **s-expressions** ou ainda **sexp**. A palavra **expressão** faz referência tanto à representação gráfica (que vemos impressa no terminal), quanto a representação interna de átomos e listas. 

Você pode usar  **setq** e **defvar** para definir uma variável. **defvar** se diferencia de **setq** por apenas definir um valor quando a variável ainda não existe. Além disso, permite adicionar documentação para variável. 

```elisp
;; Sintaxe
(setq symbol &optinal value)
;; Exemplo
(setq x 1)
;; Sintaxe
(defvar symbol &optinal value docstring)
;; Exemplo
(defvar x 1 "valor de x")
```
##  3. Avaliação / Processamento / Evaluating<a name="evaluating"></a>


A beleza no Elisp (na família LISP, na verdaed) está da generalidade em sua execução: quase tudo é avaliado e o comportamento padrão é tratar as listas como uma chamada de função, a menos que você explicitamente indique que quer a avaliação apenas do símbolo. Portanto, uma lista como ``` (nome_funcao arg1 arg2)``` pode ser vista como uma chamada para a função ```nome_funcao``` seguida por seus dois argumentos. Você pode usar o **evaluate / avaliação** de uma expressão simbólica atráves do bind ```C-x C-e``` com o cursor no final da s-exp.

Apenas formas especiais (_special forms_) passam por uma avaliação diferente, tais como **defun** e outras que são apresentadas abaixo.
```
("John" "Ringo" "Paul" "George")
=> Invalid function "John"
(concat "John" "Yoko")
=> "JohnYoko"
'("John" "Yoko")
=> ("John" "Yoko")
```

Essa abordagem faz parte do paradigma da programação funcional. Embora o Elisp não seja uma linguagem puramente funcionar, alguns aspectos desse paradigma estão presentes. Uma discussão maior sobre isso está presente <a href="https://www.emacswiki.org/emacs/FunctionalProgramming">na wiki.</a>


## 4. Definindo Funções (defun)

Nós vimos que listas são avaliadas como funções, é feito a chamada e um valor é retornado. Para definir uma função nós usamos a forma especial **defun**. Ela é seguida do nome da função e a lista de argumentos. Os argumentos são __privados__, portanto, eles não influenciam variáveis fora da função. Qualquer outro símbolo utilizado dentro da função irá trazer seu valor de fora, uma vez que o Elisp trabalha com escopo global. Após estes elementos, escreva a documentação da função, explicando o seu comportamento. A última avaliação feita dentro do corpo da função será o valor retornado por esta.

```elisp
(defun numero-mais-cinco (numero)
	"Soma o argumento passado com cinco"
	(+ numero 5))

(numero-mais-cinco 10)
=> 15
```

Embora uma função sempre retorne um valor, às vezes nós estamos mais interessados nos efeitos colaterais da execução de uma função (_side effects_), que é tudo que ela faz, mas que não faz parte do retorno. Muitas coisas são feitas como side-effect, como abrir ou fechar um buffer, passar um texto de um buffer para outro, ou seja, são ações realizadas ao longo da execução da função e que fazem parte da finalidade desta. 

## 5. Escopo Local - a forma especial "let"

Uma vez que o escopo no Elisp é global, nós precisamos informar quando queremos que ele não seja. Nós podemos fazer isso utilizando a forma especial "let", que segue a seguinte estrutura:


```elisp
(let varlist body)
```

**Varlist** é uma lista de variáveis que serão definidas para determinados valores, ou serão **nil** se nada for passado. 

```elisp
(let ((nome "John") (renda 3000) endereco)
	body...)
```
Neste caso, as variáveis nome, renda e endereco serão atribuídas para "John", 3000 e _nil_, respectivamente. Não importa se variáveis com esses mesmos nomes existem em qualquer outra parte do seu código, é garantido que as variáveis tratadas por tais nomes terão esses valores dentro do **let** e que eles também não serão propagados para a continuidade do programa.

O **let** retorna a última expressão avaliada em seu corpo. 

Onde e porque deve ser usado: em suas funções, assim fica fácil gerenciar a questão do escopo global e é garantido que as variáveis que você está trabalhando dentro da função possuem o valor que você espera e apenas onde você precisa. As outras variáveis que funcionam em um escopo local são aquelas passadas como argumentos de funções. Qualquer chamada que é feito dentro do **let**, como funções, é avaliada de acordo com o escopo deste. Se você possui um **setq** dentro de uma função, você deveria pensar em isolá-lo utilizando o **let**. 

Há ainda outra forma de utilizar uma variável em escopo local. Na verdade, é a mesma dos argumentos de função, mas passados de forma interativa. 

```elisp
(defun myfunc ()
	(interactive "p")
	body...)
```

O "p" aqui é de "prefixo". Nós podemos passar agumentos com  ```C-u [argument] M-x [myfunc]```. O "p" faz com que o emacs passe o prefixo como argumento da função (o que veio da C-u). É possível até mesmo montar a lista de argumentos perguntando ao usuário pelas entradas, como é feito na função _append-to-buffer_:

```elisp
(interactive 
	(list (read-buffer 
		"Append to buffer: "
		(other-buffer (current-buffer) t))
		(region-beginning)
		(region-end)))
```

A forma especial **let*** é bem parecida com a **let**, a não ser por sua lista de variáveis ser definida em sequência, o que permite o uso de variáveis definidas antes na definição das posteriores.

## 6. Condicionais: if, when, unless e cond <a name="conditional"></a>

Formas especiais para avaliar predicatos e executar uma função dependendo de tal avaliação. A sintaxe é suficiente para o seu entendimento:


```elisp
(if (predicate) ; if-part
	(body))     ; then-part
	
(if (predicate)
	(then action)
	(else action))
	
(if (> 10 5)
	(message "10 > 5")
	(message "10 <= 5"))
	
;; Como o if, mas sem a parte do else e permite vários then-actions
(when (predicate) (action1) ... )

(when (> 10 5) 
	(message "10 > 5")
	(sleep-for 0.5)
	(message "What were you expecting?"))

;; Como o if, mas sem a then-part. Não executa apenas quando o predicato é verdadeiro
(unless (predicate) (action1) ...)

;; A forma cond permite um número arbitrário de condicionais e ações
(setq number 5)
(cond ((< number 1) (message "Number < 1"))
      ((< number 3) (message "Number < 3"))
	  ((< number 5) (message "Number < 5"))
	  (t (message "Number >= 5"))
)
```


## 7. Manipulando listas: car, cdr e cons <a name="lists"></a>

As funções **car**, **cdr** e **cons** ssão fundamentais para se trabalhar com listas. A **car** retorna o primeiro elemento da lista (head). O **Cdr** aponta para o segundo elemento, ou seja, retorna a parte da lista que segue após o head. Caso não esteja acostumado com listas ligadas, veja: ["How lists are implemented"](https://www.gnu.org/software/emacs/manual/eintr.html#List-Implementation) chapter.

**Car** é um acrônimo para a frase "Content of the address part of the register" e **cdr** vem de "Contests of the decremented part of the register".

```elisp
(car '(john ringo paul george))
=> john  

(car (cdr '(john ringo paul george)))
=> ringo  

(car (cdr '((john ringo paul) george)))
=> george

```

**Cons** é usado para construir listas: 

```elisp
(cons 'john '(ringo paul george))
=> (john ringo paul george)

(cons 'beatles ())
=> (beatles)
```

Todos os três são **"não destrutivos"**! Eles não alteram e nem excluem as listas originais.  

Para descobrir o comprimento de uma lista: 

```elisp
(length '(john ringo))
=> 2
```

Ao invés de utilizar **cdr** repetidamente, nós podemos utilizar **nthcdr** e passar o número de repetição que gostariamos como um argumento:

```elisp
(car (nthcdr 2 '(john ringo paul george)))
=> paul
```
E ao invés de chamar o **car** após o **nthcdr**, nós podemos simplesmente utilizar o **nth**:


```elisp
(nth 2 '(john ringo paul george))
=> paul
```

Se quisermos definir os valores de uma lista, precisamos utilizar **setcar** e **setcdr**. Elas modificarão de fato as listas originais: 

```elisp
(setq beatles '(john ringo paul george))
(setcar beatles 'david)
=> (david ringo paul george)  

(setq beatles '(john ringo paul george))
(setcdr beatles '(yoko))
=> (john yoko)
```

## 9. Loops: while, dolist e dotimes <a name="loops"></a>

Como essas estruturas são bem comuns em outras linguagens de programação, este é apenas um resumo de sintaxe. Algo comum de ser feito é um loop através dos elementos de uma lista : 

```elisp
(while test-whether-list-is-empty
	body...
	set-list-to-cdr-of-list)
```  

```elisp
(setq beatles '(john ringo paul george))
(while beatles
  (print (car beatles))
  (setq beatles (cdr beatles)))
```  

O "test-whether-list-is-empty" pode ser a própria lista, uma vez que esta retorna **nil** se estiver vazia. Outra tarefa comum é fazer algo uma determinada quantidade de vezes:


```elisp
(while (< count desired-number-of-times)
	body...
	(setq count (1+ count)))
```  

O **1+** é como a abreviação "++" presente em algumas linguagens, uma maneira fácil de escrever ```(+ variable 1)```.   

As outras duas formas, **dolist** e **dotimes** são _macros_. Macros podem ser consideradas um passo a frente das formas especiais, uma forma sintáxica mais elegante para algumas tarefas comuns. **Dolist** automaticamente encurta a lista, passa o **car** de cada versão encurtada da lista como o primeiro de seus argumentos, então pode executar o desejado neste elemento.

```elisp
(dolist (element list ...)
	body)
```  

```elisp
(setq beatles '(john ringo paul george))
(dolist (element beatles)
  (print element))
```  

**Dotimes** automaticamente passa o número da iteração para cada repetição (é o primeiro argumento):

```elisp
(let (value)
	(dotimes (number 3 value)
		(setq value (cons number value))))

=> (2 1 0)
```

Retornará value, não importanto se é um átomo ou lista.

## 10. Progn, lambda e condition case <a name="other"></a>

A **progn** avalia cada um de seus argumentos e retorna o valor da última avaliação. Onde e porque: como a **progn** é uma única expressão, mas pode realizar vários passos e retorna apenas um valor, ela pode ser usada como argumento para outras funções, ou em qualquer lugar onde possamos ter apenas uma eexpressão, mas queremos realizar mais coisas. 

```elisp
;; Syntax
(progn 
    body...)

;; Example
(defun zap-to-char (arg char)
  "Kill up to and including ARG'th occurrence of CHAR.
Case is ignored if `case-fold-search' is non-nil in the current buffer.
Goes backward if ARG is negative; error if CHAR not found."
  (interactive "p\ncZap to char: ")
  (if (char-table-p translation-table-for-input)
      (setq char (or (aref translation-table-for-input char) char)))
  (kill-region (point) (progn
                         (search-forward (char-to-string char)
                                         nil nil arg)
                         (point))))

```

Na parte ```(kill-region ...)``` nós precisamos passar dois pontos como argumentos. No segundo argumento, nós queremos fazer outras coisas antes de passar este segundo ponto, portanto, utilizados o **progn**, é feito um search-foward e então utilizado o ```(point)``` para retonar o ponto necessário.

A palavra-chave **lambda** é utilizada para definir uma **lambda expression**, é utilizada da mesma forma como em outras linguagens, para a escrita de funções anônimas. Você pode simplesmente escrever uma função sem precisar nomeá-la e utilizar a estrutura convencional. É últil para ser usada em conjunto com a **mapcar**, uma vez que um de seus argumentos é uma função, você pode simplesmente passar uma lambda expression, descrevendo um comportamento simples e que não será reutilizado.

```elisp
;; Syntax
(lambda (arg-variables…)
  [documentation-string]
  [interactive-declaration]
  body-forms…)
  
;; Simple example
(lambda (x)
	"Return 10 times a number"
	(* 10 x))

;; Example
(setq numbers '(1 2 3))
(mapcar 
	(lambda (x) 
		(* 10 x))
	numbers)
=> (10 20 30)
```

**condition-case** é utilizada para lidar com erros e situações complicadas que não poderão impedir que o programa continue rodando. 

```elisp
;; Syntax
(condition-case 
	var
	bodyform
	error-handler)
```

## 10. Recursão <a name="recursion"></a>
Não há nada de diferente sobre recursão no Elisp que alguém com conhecimento básico de programação não saiba. 

```elisp
(defun name-of-recursive-function (argument-list)
	(if stop-condition
		body...) ; Base case
		(name-of-recursive-function next-step-expression))
```

Sendo a ```next-step-expression``` algo como ```(cdr list)``` ou um contador regressivo ```(1- number)``` e assim por diante.

A forma especial ```cond``` se encaixa bem para o corpo de uma função recursiva.  

Existem alguns padrões para recursão sobre uma lista: _every_, _accumulate_ e _keep_. Na _every_ nós iteramos por cada item de uma lista, realizamos uma ação e, geralmente, retornamos uma outra lista, algo como: 

```elisp
(cons act-on-car (recursive-function (cdr list)))
```

Na _accumulative_, o resultado é a combinação do resultado de cada chamada (para cada elemento da lista):

```elisp
(+ (car list) (recursive-function (cdr list)))
```

Com a _keep_ nós realizamo algo apenas em elementos de interesse, é feito um teste para saber. 

O capítulo de recursão do livro é curto e muito mais informativo do que foi resumido aqui: <a href="https://www.gnu.org/software/emacs/manual/html_mono/eintr.html#Recursion">capítulo do livro aqui.</a>.

## 11. Debug <a name="debug"></a>

O Emacs possui dois debuggers: **debug** (interno) e **edebug** (requer instrumentção da função). ```M-x debug-on-entry RET my_function RET```. Então avalie ```(my_func)```. Digite **d** para avaliar a próxima expressão. Para cancelar: ```M-x cancel-debug-on-entry RET my_function RET```. A ```debug-on-quit``` dispara com o comando ```C-g``` (cancel), então é útil para os casos que a função entra em um loop infinito. 

Para usar o **edebug** chame ```M-x edebug-defun RET``` com o cursor dentro ou depois da definição de uma determinada função. Então use o ```SPC``` (tecla espaço) para realizar a avaliação de cada passo.

```elisp
(defun my-func (x)
  (* 10 x)
  (* 5 x)) ;; Call edebug-defun with cursor here
(my-func 1) ;; Execute the function and pass each evaluation using SPC
```

## 12. Customização <a name="customization"></a>

> "Você não precisa gostar do Emacs para gostar do Emacs."

O Emacs é facilmente customizável e o Elisp oferece formas para ajudar nisso. A customização do Emacs através da edição de um arquivo de inicialização ```.emacs``` não é o foco aqui.

A **defcustom** permite ao usuário especificar o valor de uma variável. Embora você possa usar o **setq**, essa forma especial facilita a customização pelo usuário, uma vez que você pode definir:

- :type o tipo de dado que a variável deve receber;
- :options sugerir uma lista de valores para serem escolhidos, que não são exclusivos, mas convenientes para aquela variável; 
- :group o grupo do qual a variável faz parte, onde encontrá-la, de que conjunto ela pertence; 

```M-x customize``` permite que você busque pelos grupos.

<!-- **Advising Functions** is a feature to add code to existing functions without having to redefining that function. Then, if you want to add a behavior to a emacs-mode function, you can use these features: -->

<!-- ```elisp -->
<!-- (defun original-function (x) -->
<!-- 	(* 10 x) -->
<!-- 	) -->
<!-- (defun other-func (x) -->
<!-- (+ 10 x)) -->

<!-- (add-function :before (other-func x) #'original-function) -->

<!-- (add-function :before (message "oi") #'original-function) -->

<!-- ``` -->
