---
layout: post
title: "A brief introduction to Emacs Lisp for people with programming background"
date: 2017-03-15
lang: en
ref: elisp-intro
description: Sharing my summary of the "An Introduction to Programming in Emacs Lisp" book.
---

It's been now 45 days i am an Emacs user, which implies going through some Elisp, the Lisp family language for Emacs. After modifying some modes and writing my own functions, it was time to get some conscious about how Elisp works, its special forms and syntax. 

<div align="center">
<figure>
	<a href="../../../images/elisp-cover.png">
		<img  style="width:250px;margin:10px" src="../../../images/elisp-cover.png"/>
	</a>
	<figcaption>It wasn't easy to explain this cover to people around me.</figcaption>
</figure>
</div>

After reading ["An Introduction to Programming in Emacs Lisp"](https://www.gnu.org/software/emacs/manual/eintr.html) almost entirely, i have decided to write a summary for myself and share it, since it could help others in the same situation: people with some programming background who wants a brief introduction to Elisp. Some references are from the <a href="https://www.gnu.org/software/emacs/manual/html_node/elisp/">Elisp Manual</a>.

The structure follows:

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

LISP stands for List Processing. And that's a really meaningful name! Lists are the base of LISP and it basically passes by lists, a structure bounded by "()", and process/evaluate them. Indentation doesn't matter, just embrace the lists by "()" and keep white spaces between its members.  

```elisp
;; List of numbers
(1 2 3 4)
;; List inside list
'(this list has (a list inside of it))
;; List of strings
("John" "Ringo" "Paul" "George")
;; List of symbols
(john ringo paul george)
;; Mixed List
("John" 1 (2 3 "Paul") ("Ringo" george))
```

<!-- A list in Lisp—any list—is a program ready to run. If you run it (for which the Lisp jargon is evaluate), the computer will do one of three things: do nothing except return to you the list itself; send you an error message; or, treat the first symbol in the list as a command to do something. (Usually, of course, it is the last of these three things that you really want!) -->

<!-- The single apostrophe, ', that I put in front of some of the example lists in preceding sections is called a quote; when it precedes a list, it tells Lisp to do nothing with the list, other than take it as it is written. But if there is no quote preceding a list, the first item of the list is special: it is a command for the computer to obey. (In Lisp, these commands are called functions.) The list (+ 2 2) shown above did not have a quote in front of it, so Lisp understands that the + is an instruction to do something with the rest of the list: add the numbers that follow.  -->

##  2. Atoms, symbols, symbol expression and variables <a name="#symbols"></a>

In Elisp we call anything we can't divide as an **atom**. The atoms are: **numbers** (1, 2, 3...), "symbols" (+, -, john, ringo...) and strings ("John", "Ringo"...). Usually, we care about **symbols** and **numbers**. 

The representation of symbols and lists are called **symbolic expressions**, **s-expressions** or, even shorter, **sexp**. The word **expressions** refers both for printable or internally representation of atoms and lists.

You can use **setq** and **defvar** to define a variable. **defvar** differs from **setq** because it only sets a value if the variable doesn't exist yet, and it contains a documentation string too.

```elisp
;; Syntax
(setq symbol &optinal value)
;; Example
(setq x 1)
;; Syntax
(defvar symbol &optinal value docstring)
;; Example
(defvar x 1 "value x")
```
##  3. Evaluating<a name="evaluating"></a>


From my point of view, the beauty in Elisp comes from this general list processing: everything is evaluated and the default behavior is to treat a list as a function call, unless you explicitly advise with a quote that it should be seen as "plain". So a list ``` (function_name arg1 arg2)``` is seen as a call to a function named as the first argument,the other elements are passed as arguments to that function. You can **evaluate** symbols expressions with the bind ```C-x C-e``` with the cursor at the end of the s-exp.
```
("John" "Ringo" "Paul" "George")
=> Invalid function "John"
(concat "John" "Yoko")
=> "JohnYoko"
'("John" "Yoko")
=> ("John" "Yoko")
```

This approach is part of the Functional Programming paradigm. Though Elisp isn't a purely functional language, many aspects of the paradigm are present in there. You can see further information about it <a href="https://www.emacswiki.org/emacs/FunctionalProgramming">in its wiki.</a>


## 4. Defining functions (defun)

We have seen that lists are evaluated as a function, it makes a call and returns a value. To define a function we use the special form **defun**. It's followed by the function name and its arguments. The arguments are private, so it does not change anything outside the function. Any other symbol called inside a function will bring its value from outside, since Elisp has global scope. Then, write a documentation string explaining the function behavior. The last evaluation inside defun is the value it'll return when called.

```elisp
(defun number-plus-five (number)
	"Sum argument number and five"
	(+ number 5))

(number-plus-five 10)
=> 15
```

Though a function always returns a value, sometimes we're more interested in its side-effects, that is, everything that is done while the function is evaluated but is not reflect in its returned value. A lot of things can be done as side-effects, like changing buffers, displaying a message and so on. 

## 5. Local Scope - the "let" special form

Since scope in elisp is global, we need to inform when we want it to be local. It's achieved by the special form **let**, which follows the structure:


```elisp
(let varlist body)
```

**Varlist** is a list of variables that will be bounded to informed values, or **nil** if anything is passed.

```elisp
(let ((name "John") (income 3000) address)
	body...)
```
In such a case, the variables name, income and address will be bounded to "John", 3000 and nil, respectively. It doesn't matter if variables with such names appear in any other place, we guarantee its values inside the **let** and we don't propagate it to the outside. 

The **let** form returns the last evaluated expression in its body.

Where and why it should be used: inside functions then the global scope won't be messed and you guarantee the variables attend what you want just where you want it. The other variables that work in a local score are the ones passed as function arguments. Anything called inside **let** (like functions) is evaluated at its scope. If you have a **setq** inside a function (defun's body), you should isolate it inside this function scope using **let**.

There's yet another way to set a variable in a local scope. In fact, it's just the function arguments, but passed in a interactive way:

```elisp
(defun myfunc ()
	(interactive "p")
	body...)
```

The "p" here stands for "prefix". We can pass an argument like  ```C-u [argument] M-x [myfunc]```. The "p" makes emacs pass the prefix argument (from C-u) as the function argument. We can even build the arguments list, you can prompt the user for some of them, like in append-to-buffer built-in function:

```elisp
(interactive 
	(list (read-buffer 
		"Append to buffer: "
		(other-buffer (current-buffer) t))
		(region-beginning)
		(region-end)))
```

The **let*** special form is just like the **let**, except that the varlist is set in a sequence then you can use earlier variables in the var list to set values of the latter ones.

## 6. Conditionals: if, when, unless and cond <a name="conditional"></a>

Special forms to evaluate predicates and execute a function depending on the evaluation. The syntax is enough to understand it.

```elisp
(if (predicate) ; if-part
	(body))     ; then-part
	
(if (predicate)
	(then action)
	(else action))
	
(if (> 10 5)
	(message "10 > 5")
	(message "10 <= 5"))
	
;; Like if, but without else part and support many then-actions
(when (predicate) (action1) ... )

(when (> 10 5) 
	(message "10 > 5")
	(sleep-for 0.5)
	(message "What were you expecting?"))

;; Like if, but without the then-part. Skip only when predicate is true
(unless (predicate) (action1) ...)

; The cond form supports an arbitrary number of predicates and actions
(setq number 5)
(cond ((< number 1) (message "Number < 1"))
      ((< number 3) (message "Number < 3"))
	  ((< number 5) (message "Number < 5"))
	  (t (message "Number >= 5"))
)
```

## 7. Manipulating lists: car, cdr and cons <a name="lists"></a>

The **car**, **cdr** and **cons** are fundamental functions to work with lists. Car returns the head of a list, its first element. **Cdr** points to the second term of a list and that will return the part from list that follows the head (if you're not used to linked lists, read ["How lists are implemented"](https://www.gnu.org/software/emacs/manual/eintr.html#List-Implementation) chapter).

**Car** is an acronym from the phrase "Content of the address part of the register" and **cdr** comes from "Contests of the decremented part of the register".

```elisp
(car '(john ringo paul george))
=> john  

(car (cdr '(john ringo paul george)))
=> ringo  

(car (cdr '((john ringo paul) george)))
=> george

```

**Cons** is used to construct lists, like:

```elisp
(cons 'john '(ringo paul george))
=> (john ringo paul george)

(cons 'beatles ())
=> (beatles)
```

All three are not **destructive**! They do not change or exclude original lists.  

To find lists length:

```elisp
(length '(john ringo))
=> 2
```

Instead of using **cdr** repeatedly, we can use **nthcdr** and pass the repeat number of times as argument:

```elisp
(car (nthcdr 2 '(john ringo paul george)))
=> paul
```

And instead of calling a car after a nthcdr, we can just use **nth**:


```elisp
(nth 2 '(john ringo paul george))
=> paul
```

If we want to set values from a list, we need to use **setcar** and **setcdr**. This actually changes the original list.

```elisp
(setq beatles '(john ringo paul george))
(setcar beatles 'david)
=> (david ringo paul george)  

(setq beatles '(john ringo paul george))
(setcdr beatles '(yoko))
=> (john yoko)
```




## 9. Loops: while, dolist and dotimes <a name="loops"></a>

Since it's a very common structure from any programming language, it's a brief syntax summary. A classical thing to do is loop through a list:

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

The "test-whether-list-is-empty" test can be the list itself, since it returns **nil** if empty. Another common task is to do something a certain number of times:


```elisp
(while (< count desired-number-of-times)
	body...
	(setq count (1+ count)))
```  

The **1+** is like the "++" shortcut from some languages, an easy way to write ```(+ variable 1)```.   

The other two forms, **dolist** and **dotimes** are macros. Macros are one step ahead special forms, a syntax sugar for some common tasks. **Dolist** automatically shorten the list, binds the *8car** of each shortened version of the list to the first of its arguments.

```elisp
(dolist (element list ...)
	body)
```  

```elisp
(setq beatles '(john ringo paul george))
(dolist (element beatles)
  (print element))
```  

**Dotimes** automatically passes iteration number for each repetition:

```elisp
(let (value)
	(dotimes (number 3 value)
		(setq value (cons number value))))

=> (2 1 0)
```

It returns value, no matter if it's an atom or list.

## 10. Progn, lambda and condition case <a name="other"></a>

The **progn** evaluates each of its arguments and returns the value of the last one. Where and why: since progn is a single expression and can produce side effects and return a single value, it can be used as argument to other functions, or wherever we can have only one expression but we want to do more than one thing.

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

In the ```(kill-region ...)``` call we need to pass to points. At the second argument we want to make more tbefore passing it, so we use **progn**, make a search-foward and then use ```(point)```.

The **lambda** define a **lambda expression**, it is used as in other languages, to write anonymous functions, you can just write a function on the fly without having to name it using the **defun** form. It's useful to use with **mapcar**, since one of its arguments is a function, you can just write it inside mapcar using lambda.

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

**condition-case** is used to handle errors and complicated situations in which we couldn't just stop the program.

```elisp
;; Syntax
(condition-case 
	var
	bodyform
	error-handler)
```

## 10. Recursion <a name="recursion"></a>
There's nothing different about recursion in Elisp as you may be used to.

```elisp
(defun name-of-recursive-function (argument-list)
	(if stop-condition
		body...) ; Base case
		(name-of-recursive-function next-step-expression))
```

Being ```next-step-expression``` something like ```(cdr list)``` or a regressive counter ```(1- number)``` and so on.

The ```cond``` special form fits nicely to a recursive function body.  

There are some patterns to recursion over lists: every, accumulate and keep. With every we iterate over all elements and act, building (usually) another list with the result, like:

```elisp
(cons act-on-car (recursive-function (cdr list)))
```

In accumulative, the result is a combination of every call result:

```elisp
(+ (car list) (recursive-function (cdr list)))
```

With keep we cat only on elements of interest, do a test to check it.

The book's recursion chapter is short but way more informative than this little summary: <a href="https://www.gnu.org/software/emacs/manual/html_mono/eintr.html#Recursion">book.</a>.

## 11. Debug <a name="debug"></a>

Emacs has two debuggers: **debug** (internal) and **edebug** (requires instrument a function). ```M-x debug-on-entry RET my_function RET```. Then evaluate ```(my_func)```. Type d to evaluate next expression. To cancel: ```M-x cancel-debug-on-entry RET my_function RET```. The ```debug-on-quit``` triggers with ```C-g``` (cancel), so it's useful to use when you're entering infinite loops.

To use **edebug** call ```M-x edebug-defun RET``` with the cursor whithin or just after a function definition. Then use ```SPC``` to pass evaluation.

```elisp
(defun my-func (x)
  (* 10 x)
  (* 5 x)) ;; Call edebug-defun with cursor here
(my-func 1) ;; Execute the function and pass each evaluation using SPC
```

## 12. Customization <a name="customization"></a>

> "You don't have to like Emacs to like it."

Emacs is easily customized and Elisp has forms to help with it. The customization of Emacs via the ```.emacs``` is not the purpose here.

The **defcustom** let the user specify a variable value. Though you can use setq, this special form offers help to customization, since you can define:

- :type kind of data that variable should be set;
- :options suggest a list of values to that variable, not exclusive, only convenient;
- :group in which group the var is located, where to find it, from where does it belong;

```M-x customize``` let you search for groups.

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
