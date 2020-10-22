---
layout: post
title: "Alternativa para recarregamento de módulos no Python Shell do Emacs"
date: 2017-02-19
lang: pt
ref: emacs-python-shell
comments: true
author: moneda
description: Quando se executa mais de uma vez um programa em Python no Emacs, os módulos importados não são recarregados e mudança no código destes não é refletida na execução. Porém, podemos escrever uma função para mudar esse comportamento.
---

Um grande problema de utilizar o ```C-c C-c``` para enviar o buffer atual para o interpretador Python é que os módulos não são recarregados. Ou seja, após a primeira vez em que se roda um programa em Python, todos os imports permanecem os mesmos e, portanto, caso você esteja editando um módulo, as modificações não terão efeito. A saída para isso é forçar que o processo seja terminado e reiniciá-lo. Além disso, alguns outros comportamentos foram pensados para deixar mais cômodo:

1. Na primeira vez que um buffer é enviado para rodar, o shell será inicializado automaticamente.
2. Na demais vezes, o processo do Python será reinicializado.
3. Caso a window do Python Shell não esteja visível, ela será trazida para frente.

Para tal, basta adicionar ao init.el:  

```elisp
;; Run python and pop-up its shell.
;; Kill process to solve the reload modules problem.
(defun my-python-shell-run ()
  (interactive)
  (when (get-buffer-process "*Python*")
     (set-process-query-on-exit-flag (get-buffer-process "*Python*") nil)
     (kill-process (get-buffer-process "*Python*"))
     ;; If you want to clean the buffer too.
     ;;(kill-buffer "*Python*")
     ;; Not so fast!
     (sleep-for 0.5)
     )
  (run-python (python-shell-parse-command) nil nil)
  (python-shell-send-buffer)
  ;; Pop new window only if shell isnt visible
  ;; in any frame.
  (unless (get-buffer-window "*Python*" t) 
    (python-shell-switch-to-shell)))

(defun my-python-shell-run-region ()
  (interactive)
  (python-shell-send-region (region-beginning) (region-end))
  (python-shell-switch-to-shell))

(eval-after-load "python"
  '(progn
     (define-key python-mode-map (kbd "C-c C-c") 'my-python-shell-run)
     (define-key python-mode-map (kbd "C-c C-r") 'my-python-shell-run-region)
     (define-key python-mode-map (kbd "C-h f") 'python-eldoc-at-point)))

```
