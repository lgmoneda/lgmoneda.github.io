---
layout: post
title: "A brief introduction to Emacs Lisp for people with programming background"
date: 2017-03-15
lang: en
ref: elisp-intro
description: Sharing my summary of the "An Introduction to Programming in Emacs Lisp" book.
---

It's been now 45 days i am an Emacs user, which implies going through some Elisp, the Lisp family language for Emacs. After modifying some modes and writing my own functions, it was time to get some conscious about how Elisp works, its special forms and syntax. 

After reading ["An Introduction to Programming in Emacs Lisp"](https://www.gnu.org/software/emacs/manual/eintr.html) almost entirely, i have decided to write a summary for myself and share it, since it could help others in the same situation: people with some programming background who wants a brief introduction to Elisp.

The structure follows:

1. **LIS**t **P**rocessing
2. Symbols, symbol expression and variables
3. Defining functions (defun) and the single quote 
4. Local scope (let)
5. Conditionals: if, then, else, cond and when
6. Manipulating lists: car, cdr and cons
7. Progn, lambda and condition case
8. Loops: while, dolist and dotimes
9. Recursion


## 1. List Processing

LISP stands for List Processing. And that's a really meaningful name! Lists are the base of LISP and it basically passes by lists, a structure bounded by "()", and process/evaluate them. Indentation doesn't matter, just embrace the lists by "()" and keep whitespaces between its members.  

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

The beauty in Elisp comes from the fact that a 

A list in Lisp—any list—is a program ready to run. If you run it (for which the Lisp jargon is evaluate), the computer will do one of three things: do nothing except return to you the list itself; send you an error message; or, treat the first symbol in the list as a command to do something. (Usually, of course, it is the last of these three things that you really want!)

The single apostrophe, ', that I put in front of some of the example lists in preceding sections is called a quote; when it precedes a list, it tells Lisp to do nothing with the list, other than take it as it is written. But if there is no quote preceding a list, the first item of the list is special: it is a command for the computer to obey. (In Lisp, these commands are called functions.) The list (+ 2 2) shown above did not have a quote in front of it, so Lisp understands that the + is an instruction to do something with the rest of the list: add the numbers that follow. 

## 2. Atoms, symbols, symbol expression and variables

In Elisp we call anything we can't divide as an **atom**. The atoms are: **numbers** (1, 2, 3...), "symbols" (+, -, john, ringo...) and strings ("John", "Ringo"...). Usually, we care about **symbols** and **numbers**. 

The representation of symbols and lists are called **symbolic expressions**, **s-expressions** or, even shorter, **sexp**. The word **expressions** refers both for printable or internally representation of atoms and lists.

## 3. Evaluating (functional programming discussion?)

http://stackoverflow.com/questions/6021649/is-it-true-that-lisp-is-not-a-functional-programming-language

We've described "List" part of **Lisp**, now we'll see the **processing** part, usually called **evaluation**. Every list in Elisp will be evaluated and primarily as a function, and  should be 

## 3. Defining functions (defun)

-> falar de side-effects

## 4. Local Scope - the "let" special form

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

## Manipulating lists: car, cdr and cons

The **car**, **cdr** and **cons** are fundamental functions to work with lists. Car returns the head of a list, its first element. **Cdr** points to the second term of a list and that will return the part from list that follows the head (if you're not used to linked lists, read ["How lists are implemented"](https://www.gnu.org/software/emacs/manual/eintr.html#List-Implementation) chapter).

**Car** is an acronym from the phrase "Contet of the address part of the register" and **cdr** comes from "Contests of the decrement part of the register".

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

All three are not **desctructive**! They do not change or exclude original lists.  

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

## 8. Loops: while, dolist and dotimes

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

The other two forms, **dolist** and **dotimes** are macros. Macros are one step ahead special forms, a syntax sugar for some common tasks. **Dolist** automatically sorten the list, binds the *8car** of each shortened version of the list to the first of its arguments.

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

