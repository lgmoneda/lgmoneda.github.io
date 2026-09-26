;;; export-proust.el --- Org source for the Proust notebook -*- lexical-binding: t; -*-

(require 'ox-html)
(require 'cl-lib)
(require 'subr-x)

(defvar lmoneda/proust-site-directory
  (file-name-directory (or load-file-name buffer-file-name))
  "Directory containing the Proust page template and generated HTML.")
(defvar lmoneda/proust--entries nil)
(defvar lmoneda/proust--source-directory nil)
(defvar lmoneda/proust--output-directory nil)

(defun lmoneda/proust--escape (text)
  "Escape TEXT for HTML text or a quoted attribute."
  (replace-regexp-in-string
   "\"" "&quot;" (org-html-encode-plain-text (or text "")) t t))

(defun lmoneda/proust--image (path &optional source-file)
  "Return the site URL for PATH, copying SOURCE-FILE when provided.
Use a WebP derivative only when it is newer than the original."
  (if (string-match-p "\\`https?://" path)
      path
    (let* ((image-dir (expand-file-name "../images/em-busca-do-tempo-perdido/"
                                        lmoneda/proust--output-directory))
           (filename (file-name-nondirectory path))
           (destination (if source-file
                            (expand-file-name filename image-dir)
                          (expand-file-name path lmoneda/proust--output-directory)))
           (webp (if (equal filename "2025-07-27_05-57-46_screenshot.png")
                     (expand-file-name "genevieve.webp" image-dir)
                   (concat (file-name-sans-extension destination) ".webp"))))
      (when source-file
        (unless (file-readable-p source-file)
          (error "Missing Org image: %s" source-file))
        (make-directory image-dir t)
        (unless (and (file-exists-p destination)
                     (with-temp-buffer
                       (set-buffer-multibyte nil)
                       (insert-file-contents-literally source-file)
                       (let ((source (buffer-string)))
                         (erase-buffer)
                         (insert-file-contents-literally destination)
                         (equal source (buffer-string)))))
          (copy-file source-file destination t)))
      (unless (file-readable-p destination)
        (error "Missing site image: %s" destination))
      (file-relative-name
       (if (and (file-exists-p webp)
                (not (file-newer-than-file-p destination webp))) webp destination)
       lmoneda/proust--output-directory))))

(defun lmoneda/proust--link (link description info)
  "Export LINK with DESCRIPTION and INFO, copying local inline images."
  (let ((html (org-html-link link description info)))
    (if (and (equal (org-element-property :type link) "file")
             (string-match-p "<img\\b" html))
        (let* ((path (org-element-property :path link))
               (source (expand-file-name path lmoneda/proust--source-directory))
               (url (lmoneda/proust--escape (lmoneda/proust--image path source))))
          (replace-regexp-in-string
           "src=\"[^\"]*\""
           (lambda (_) (format "src=\"%s\" loading=\"lazy\" decoding=\"async\"" url))
           html t t))
      html)))

(defun lmoneda/proust--headline (headline contents info)
  "Render HEADLINE and CONTENTS using export INFO and the site's layout."
  (if (/= (org-export-get-relative-level headline info) 1)
      (org-html-headline headline contents info)
    (let* ((id (or (org-element-property :CUSTOM_ID headline)
                   (org-element-property :ID headline)
                   (org-export-get-reference headline info)))
           (title (or (org-element-property :TITLE headline)
                      (org-element-property :raw-value headline)))
           (image (org-element-property :IMG headline))
           (alt (or (org-element-property :ALT headline) ""))
           (safe-id (lmoneda/proust--escape id))
           (safe-title (lmoneda/proust--escape title)))
      (push (cons id title) lmoneda/proust--entries)
      (cond
       ((equal id "intro")
        (format
         (concat "<section class=\"intro-section\" id=\"%s\">\n"
                 "<div class=\"intro-content\"><h1 id=\"page-title\">Em busca das<br><em>referências perdidas</em></h1>\n"
                 "<p class=\"original-title\" lang=\"fr\">%s</p>\n"
                 "<div class=\"org-intro\">%s</div></div>\n%s</section>\n")
         safe-id safe-title (or contents "")
         (if image
             (format "<figure class=\"intro-portrait\"><img src=\"%s\" alt=\"%s\" fetchpriority=\"high\" /></figure>\n"
                     (lmoneda/proust--escape (lmoneda/proust--image image))
                     (lmoneda/proust--escape alt)) "")))
       ((and image (not (string-match-p "class=\"figure\"" (or contents ""))))
        (format
         (concat "<section class=\"full-bleed-section\" id=\"%s\">\n"
                 "<div class=\"image-container\"><img src=\"%s\" alt=\"%s\" loading=\"lazy\" />"
                 "<div class=\"chapter-title\"><h2>%s</h2></div></div>\n"
                 "<div class=\"content-section\"><div class=\"text-content org-content\">%s</div></div></section>\n")
         safe-id (lmoneda/proust--escape (lmoneda/proust--image image))
         (lmoneda/proust--escape alt) safe-title (or contents "")))
       (t
        (format
         (concat "<section class=\"reference-section\" id=\"%s\">\n"
                 "<div class=\"reference-heading\"><h2>%s</h2></div>\n"
                 "<div class=\"org-content reference-org-content\">%s</div></section>\n")
         safe-id safe-title (or contents "")))))))

(defun lmoneda/proust--section (section contents info)
  "Keep top-level SECTION contents free of redundant HTML wrappers."
  (let ((parent (org-export-get-parent-headline section)))
    (if (and parent (= (org-export-get-relative-level parent info) 1))
        contents
      (org-html-section section contents info))))

(org-export-define-derived-backend 'proust 'html
  :translate-alist '((headline . lmoneda/proust--headline)
                    (link . lmoneda/proust--link)
                    (section . lmoneda/proust--section)))

(defun lmoneda/proust--render (template replacements)
  "Fill TEMPLATE with literal REPLACEMENTS, without reprocessing inserted text."
  (replace-regexp-in-string
   "@@PROUST_[A-Z_]+@@"
   (lambda (key) (or (cdr (assoc key replacements))
                    (error "Unknown Proust template field: %s" key)))
   template t t))

(defun lmoneda/export-proust-site (&optional directory)
  "Export the current Org buffer to DIRECTORY or the Proust site directory.
Org controls exclusions, citations and footnotes.  Export never evaluates
Babel blocks, saves the source buffer, commits files or pushes the site."
  (interactive)
  (unless (and (derived-mode-p 'org-mode) buffer-file-name)
    (user-error "Run this command from the Proust Org file"))
  (let* ((lmoneda/proust--output-directory
          (file-name-as-directory (or directory lmoneda/proust-site-directory)))
         (lmoneda/proust--source-directory (file-name-directory buffer-file-name))
         (lmoneda/proust--entries nil)
         (org-export-use-babel nil)
         (org-export-default-language "pt_BR")
         (org-html-htmlize-output-type nil)
         (org-export-with-broken-links nil)
         (org-export-exclude-tags (cons "noexport" org-export-exclude-tags))
         (template (with-temp-buffer
                     (insert-file-contents (expand-file-name "page-template.html" lmoneda/proust--output-directory))
                     (buffer-string)))
         (fragment (org-export-as 'proust nil nil t
                                  '(:with-toc nil :section-numbers nil
                                    :with-title nil :with-author nil :with-date nil
                                    :with-creator nil :with-sub-superscript nil
                                    :html-with-latex nil :html-footnotes-section
                                    "<section id=\"footnotes\" class=\"bibliography\" role=\"doc-endnotes\"><h2>%s</h2><div id=\"text-footnotes\">%s</div></section>")))
         (fragment (replace-regexp-in-string "[ \t]+$" "" fragment))
         (entries (nreverse lmoneda/proust--entries))
         (ids (mapcar #'car entries))
         (nav (mapconcat
               (lambda (entry)
                 (format "<li><a href=\"#%s\">%s</a></li>"
                         (lmoneda/proust--escape (car entry))
                         (lmoneda/proust--escape (cdr entry)))) entries "\n"))
         (first-id (or (car ids) "main-content")))
    (unless entries (user-error "No exportable headings in this Org buffer"))
    (unless (= (length ids) (length (delete-dups (copy-sequence ids))))
      (user-error "Duplicate section IDs in the Org source"))
    (when (string-match-p "id=\"footnotes\"" fragment)
      (setq nav (concat nav "\n<li><a href=\"#footnotes\">Notas</a></li>")))
    (let* ((fields `(("@@PROUST_NAV@@" . ,nav)
                     ("@@PROUST_HOME@@" . ,(lmoneda/proust--escape first-id))))
           (index (lmoneda/proust--render
                   template (append fields `(("@@PROUST_MAIN_ATTRS@@" . "")
                                              ("@@PROUST_CONTENT@@" . ,fragment)))))
           (experiment (lmoneda/proust--render
                        template (append fields
                                         '(("@@PROUST_MAIN_ATTRS@@" . " data-content-src=\"test.html\" aria-busy=\"true\"")
                                           ("@@PROUST_CONTENT@@" . "<p class=\"loading-message\" role=\"status\">Carregando o caderno…</p><noscript><p><a href=\"index.html\">Abrir o caderno completo</a></p></noscript>"))))))
      (dolist (output `(("test.html" . ,fragment)
                        ("index.html" . ,index)
                        ("experiment.html" . ,experiment)))
        (with-temp-file (expand-file-name (car output) lmoneda/proust--output-directory)
          (insert (cdr output)))))
    (message "Exported %d Org sections to %s" (length entries) lmoneda/proust--output-directory)))

(provide 'export-proust)
;;; export-proust.el ends here
