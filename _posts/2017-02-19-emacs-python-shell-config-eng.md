---
layout: post
title: "A solution for the reload modules problem in Emacs Python Shell"
date: 2017-02-19
lang: en
ref: emacs-python-shell-eng
comments: true
---

An annoying problem in using the ```C-c C-c``` to send the current buffer to the python shell is that the modules are not reloaded. I mean, after the first time we run our script, all the imported modules still the same, even if we modify them, the interpreter would not reload it to make the changes take effect. We can solve it by forcing the Python Process to restart each time we call the ```python-shell-send-buffer```. Beyond that, some other behaviours are added to it: 

1. The first time a buffer is sent to shell, it'll be started automatically;
2. For the forther tmes, the Python process will be restarted;
3. If the Python Shell window is no visible in any frame, we pop up it;

Just add to your init.el:

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
  ;; Pop new window only if shell isn't visible
  ;; in any frame.
  (unless (get-buffer-window "*Python*" t) 
    (python-shell-switch-to-shell)
    )
 )

(defun my-python-shell-run-region ()
  (interactive)
  (python-shell-send-region (region-beginning) (region-end))
  (python-shell-switch-to-shell)
  )

(eval-after-load "python"
  '(progn
     (define-key python-mode-map (kbd "C-c C-c") 'my-python-shell-run)
     (define-key python-mode-map (kbd "C-c C-r") 'my-python-shell-run-region)
     (define-key python-mode-map (kbd "C-h f") 'python-eldoc-at-point)
     ))

```
