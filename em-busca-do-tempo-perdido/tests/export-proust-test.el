;;; export-proust-test.el --- Org export regression tests -*- lexical-binding: t; -*-
(require 'ert)
(load (expand-file-name "../export-proust.el" (file-name-directory load-file-name)) nil t)

(defmacro lmoneda/proust-test-with-site (source &rest body)
  "Export SOURCE in a temporary site, then evaluate BODY."
  (declare (indent 1))
  `(let* ((root (make-temp-file "proust-export-test-" t))
          (site (expand-file-name "site/" root))
          (template (expand-file-name "page-template.html" lmoneda/proust-site-directory)))
     (unwind-protect
         (progn
           (make-directory site)
           (copy-file template (expand-file-name "page-template.html" site))
           (with-temp-buffer
             (org-mode)
             (setq buffer-file-name (expand-file-name "source.org" root))
             (insert ,source)
             (let ((org-cite-global-bibliography nil))
               (lmoneda/export-proust-site site)))
           ,@body)
       (delete-directory root t))))

(defun lmoneda/proust-test-read (site filename)
  (with-temp-buffer
    (insert-file-contents (expand-file-name filename site))
    (buffer-string)))

(ert-deftest proust-respects-org-exclusions-and-updates-navigation ()
  (lmoneda/proust-test-with-site
      "#+title: Notebook\n* Private :noexport:\nSECRET\n[[file:missing.png]]\n* Intro\n:PROPERTIES:\n:ID: intro\n:END:\nSource introduction.\n* Art & music\n:PROPERTIES:\n:CUSTOM_ID: art\n:END:\nAuthor's content.\n** Private child :noexport:\nHIDDEN CHILD\n* Draft :noexport:\n:PROPERTIES:\n:ID: draft\n:END:\nDraft text.\n"
    (let ((index (lmoneda/proust-test-read site "index.html"))
          (preview (lmoneda/proust-test-read site "experiment.html")))
      (should (string-match-p "Author's content" index))
      (should (string-match-p "href=\"#art\">Art &amp; music" index))
      (should (string-match-p "href=\"#art\">Art &amp; music" preview))
      (should-not (string-match-p "SECRET\\|HIDDEN CHILD\\|Draft text\\|#draft\\|@@PROUST_" index))
      (should-not (string-match-p "Author's content" preview))
      (should (string-match-p "data-content-src=\"test.html\"" preview)))))

(ert-deftest proust-keeps-global-footnotes-and-raw-org-content ()
  (lmoneda/proust-test-with-site
      "* Intro\n:PROPERTIES:\n:ID: intro\n:END:\nFirst reference[fn:1].\n* Lantern\n:PROPERTIES:\n:ID: lanterna\n:END:\nSecond reference[fn:1].\n\n[fn:1] The original footnote.\n"
    (let ((html (lmoneda/proust-test-read site "test.html")))
      (should (string-match-p "The original footnote" html))
      (with-temp-buffer
        (insert html)
        (should (= 1 (how-many "id=\"fn.1\"" (point-min) (point-max))))
        (should (= 2 (how-many "href=\"#fn.1\"" (point-min) (point-max)))))
      (should (string-match-p "href=\"#footnotes\">Notas" (lmoneda/proust-test-read site "index.html"))))))

(ert-deftest proust-duplicate-ids-do-not-overwrite-pages ()
  (let ((root (make-temp-file "proust-duplicate-" t)))
    (unwind-protect
        (progn
          (copy-file (expand-file-name "page-template.html" lmoneda/proust-site-directory)
                     (expand-file-name "page-template.html" root))
          (with-temp-file (expand-file-name "index.html" root) (insert "Existing page"))
          (with-temp-buffer
            (org-mode)
            (setq buffer-file-name (expand-file-name "source.org" root))
            (insert "* One\n:PROPERTIES:\n:ID: repeated\n:END:\nA\n* Two\n:PROPERTIES:\n:ID: repeated\n:END:\nB\n")
            (should-error (lmoneda/export-proust-site root)))
          (should (equal "Existing page" (lmoneda/proust-test-read root "index.html"))))
      (delete-directory root t))))

(ert-deftest proust-copies-org-images-and-preserves-caption ()
  (let* ((root (make-temp-file "proust-image-" t))
         (site (expand-file-name "site/" root))
         (resource (expand-file-name "painting.png" root)))
    (unwind-protect
        (progn
          (make-directory site)
          (copy-file (expand-file-name "page-template.html" lmoneda/proust-site-directory)
                     (expand-file-name "page-template.html" site))
          (with-temp-file resource (insert "source image bytes"))
          (with-temp-buffer
            (org-mode)
            (setq buffer-file-name (expand-file-name "source.org" root))
            (insert "* Painting\n:PROPERTIES:\n:ID: painting\n:END:\n#+CAPTION: Author's caption\n[[file:painting.png]]\n")
            (lmoneda/export-proust-site site))
          (let ((html (lmoneda/proust-test-read site "test.html")))
            (should (string-match-p "Author's caption" html))
            (should (string-match-p "../images/em-busca-do-tempo-perdido/painting.png" html))
            (should (file-exists-p (expand-file-name "images/em-busca-do-tempo-perdido/painting.png" root)))))
      (delete-directory root t))))
