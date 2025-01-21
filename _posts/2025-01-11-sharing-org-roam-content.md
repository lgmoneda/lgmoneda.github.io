---
layout: post
title: Sharing Org Roam content
date: 2025-01-11
lang: en
ref: org-roam-share
comments: true
author: moneda
tags: emacs org-roam
description: Four ways I share my notes from Org Roam
image: ../../../images/org-roam-share/social-share-org-roam-share.jpg
---

<h2 id="index">Index</h2>
<ol>
<li><a href="#introduction">Introduction</a></li>
<li><a href="#sharing-restricted-content">Sharing restricted
content</a></li>
<li><a href="#sharing-open-content">Sharing open content</a></li>
<li><a href="#sharing-synchronously-with-multiple-people">Sharing
synchronously with multiple people</a></li>
<li><a href="#creating-and-sharing-to-the-world">Creating and sharing to
the world</a></li>
</ol>
<h2 id="introduction">Introduction</h2>
<p>I once was bothered by how isolated I felt in org-roam. I felt I
should have ways to build collaborative docs or send a link to people so
they could consume the content I write. I was highly inspired by <a
href="https://braindump.jethro.dev/">Jethro's braindump</a> and <a
href="https://notes.andymatuschak.org/About_these_notes">Andy
Matuschak's working notes</a>. At some point, I realized my ambitions
were different and lower than those involved in building and researching
note-taking. Beyond that, all my collaboration today happens via my
full-time job using Google Docs, Miro, and Confluence. I might sketch
things in org-roam and use it as a <em>thinking environment</em> while
I'm collaborating via those other tools.</p>
<p>However, after more than four years of using it, something stood out:
the desire to share my thinking process or atomic notes to help others
with the problem at hand.</p>
<p>I will share my day-to-day use cases, how I select and remix my Org
roam nodes, different mediums I use (PDF, online, and presentations),
and some code so others can use similar workflows if they fit.</p>
<h2 id="sharing-restricted-content">Sharing restricted content</h2>
<p>Sometimes, in a one-on-one or small group meeting at work, someone
asks me for advice about a problem. I usually answer live using my
top-of-mind references and experiences, but I promise to send further
details and additional resources.</p>
<p>Since I might insert the specific context of my company and team, or
even the selection of the topics can reveal what we are working on,
which might be low-risk but nonetheless unnecessary, I prefer to
generate a PDF and share it directly with the person or the group.</p>
<p>To discover and select the material, I use both the <a
href="https://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html">semantic
search</a> and the <a
href="https://lgmoneda.github.io/2023/04/15/q-and-n-with-org-roam-chatgpt.html">Q&amp;A</a>
functionalities.
Even if I couldn't recall it live, it will help refresh me on that
topic. It isn't a necessary step; I imagine many can just select based
on their current knowledge about their notes and references.</p>
<p>The material might be a single org roam file, a node, or a collection
of nodes spread in different files.</p>
<p>Two straightforward options are sharing the entire org file, which
might contain many org roam nodes, or selecting only one node for it.
One can use the <code>org-latex-export-to-pdf</code>, which I modified
slightly in the following function so I don't have to pick the file in
the roam folder but in a folder with fewer files that gets cleaned from
time to time—in my case, the Downloads folder.</p>
<div class="sourceCode" id="cb1" data-org-language="emacs-lisp"><pre
class="sourceCode commonlisp"><code class="sourceCode commonlisp"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a>(<span class="kw">defun</span><span class="fu"> lgm/export-org-to-downloads-folder </span>()</span>
<span id="cb1-2"><a href="#cb1-2" aria-hidden="true" tabindex="-1"></a>  <span class="st">&quot;Export the current Org file to PDF and save it in the downloads folder.</span></span>
<span id="cb1-3"><a href="#cb1-3" aria-hidden="true" tabindex="-1"></a><span class="st">Prompts for the output filename, defaulting to the original Org file&#39;s name.&quot;</span></span>
<span id="cb1-4"><a href="#cb1-4" aria-hidden="true" tabindex="-1"></a>  (interactive)</span>
<span id="cb1-5"><a href="#cb1-5" aria-hidden="true" tabindex="-1"></a>  (<span class="kw">let*</span> ((org-file (buffer-file-name))</span>
<span id="cb1-6"><a href="#cb1-6" aria-hidden="true" tabindex="-1"></a>         (downloads-folder <span class="st">&quot;~/Downloads/&quot;</span>) <span class="co">; Change this path to your desired folder</span></span>
<span id="cb1-7"><a href="#cb1-7" aria-hidden="true" tabindex="-1"></a>         (default-pdf-name (concat (file-name-sans-extension (file-name-nondirectory org-file)) <span class="st">&quot;.pdf&quot;</span>))</span>
<span id="cb1-8"><a href="#cb1-8" aria-hidden="true" tabindex="-1"></a>         (output-file (read-file-name <span class="st">&quot;Save PDF as: &quot;</span></span>
<span id="cb1-9"><a href="#cb1-9" aria-hidden="true" tabindex="-1"></a>                                      downloads-folder</span>
<span id="cb1-10"><a href="#cb1-10" aria-hidden="true" tabindex="-1"></a>                                      (concat downloads-folder default-pdf-name)</span>
<span id="cb1-11"><a href="#cb1-11" aria-hidden="true" tabindex="-1"></a>                                      <span class="kw">nil</span></span>
<span id="cb1-12"><a href="#cb1-12" aria-hidden="true" tabindex="-1"></a>                                      default-pdf-name)))</span>
<span id="cb1-13"><a href="#cb1-13" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb1-14"><a href="#cb1-14" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Ensure the buffer is visiting a valid file</span></span>
<span id="cb1-15"><a href="#cb1-15" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">unless</span> (<span class="kw">and</span> org-file (file-exists-p org-file))</span>
<span id="cb1-16"><a href="#cb1-16" aria-hidden="true" tabindex="-1"></a>      (<span class="kw">error</span> <span class="st">&quot;Buffer is not visiting a file or file does not exist&quot;</span>))</span>
<span id="cb1-17"><a href="#cb1-17" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb1-18"><a href="#cb1-18" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Export the Org file to PDF</span></span>
<span id="cb1-19"><a href="#cb1-19" aria-hidden="true" tabindex="-1"></a>    (org-latex-export-to-pdf)</span>
<span id="cb1-20"><a href="#cb1-20" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb1-21"><a href="#cb1-21" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Move the exported PDF to the specified location</span></span>
<span id="cb1-22"><a href="#cb1-22" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">let</span> ((exported-pdf (concat (file-name-sans-extension org-file) <span class="st">&quot;.pdf&quot;</span>)))</span>
<span id="cb1-23"><a href="#cb1-23" aria-hidden="true" tabindex="-1"></a>      (<span class="kw">if</span> (file-exists-p exported-pdf)</span>
<span id="cb1-24"><a href="#cb1-24" aria-hidden="true" tabindex="-1"></a>          (<span class="kw">rename-file</span> exported-pdf output-file <span class="kw">t</span>)</span>
<span id="cb1-25"><a href="#cb1-25" aria-hidden="true" tabindex="-1"></a>        (<span class="kw">error</span> <span class="st">&quot;PDF file not found after export&quot;</span>)))</span>
<span id="cb1-26"><a href="#cb1-26" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb1-27"><a href="#cb1-27" aria-hidden="true" tabindex="-1"></a>    (message <span class="st">&quot;Org file exported to PDF and saved as %s&quot;</span> output-file)))</span></code></pre></div>
<p>However, you likely want to share a collection of org roam nodes that
mix different references. That's the power of the zettelkasten method.
An essential emacs package for it is the <a
href="https://github.com/nobiot/org-transclusion">org-transclusion</a>.
It lets you import notes content into other org roam files. Let me use
an example. Once asked about interviewing
questions for platforms' internal customers, I had a few org roam
nodes I wanted to share.</p>
<p>I can start by creating a new heading in the file where I'm taking
meeting notes. I can then start collecting the nodes returned by the
semantic search and the Q&amp;A while inserting specific context about
the problem.</p>
<p>After that, I select the Org sub-tree with <code>C-x n s</code> (you
can revert by using <code>C-x n w</code>), and I call the same previous
function to export it. Here's how the narrowed Org roam file looks like
without adding the transclusion:</p>
<figure
style="text-align: center; margin: auto; display: block; width: 100%; height: auto;">
<img src="/images/org-roam-share/screen_20250119_060612.jpg" />
<figcaption>The org-transclusion let me quickly grab pieces of my
personal knowledge base and compose something personalized for the
situation.</figcaption>
</figure>
<p>The <a
href="https://lgmoneda.github.io/resources/on-user-interviewing.pdf">generated
pdf</a> looks fine for a quick share.</p>
<p>A couple of times, I preferred to generate ASCII text. When I make
career conversations, I have the questions written in the Org roam file
about that person. Still, since I want them to reflect on it a couple of
days before, I would export as ASCII using 'org-ascii-export-as-ascii'
and copy and paste in a direct message to them.</p>
<h2 id="sharing-open-content">Sharing open content</h2>
<p>When I want to share notes on bibliographical references, like a book
or article in which I don't make any connection to information that
shouldn't be public, I share it online, but in an extremely ad-hoc way,
very differently from full-feature digital gardens. Here's <a
href="https://lgmoneda.github.io/org-roam/conway1968committees.html">example
1</a> and <a
href="https://lgmoneda.github.io/org-roam/park2023generative.html">example
2</a> <a href="#fn1" class="footnote-ref" id="fnref1"
role="doc-noteref"><sup>1</sup></a>. I list them in a <a
href="https://lgmoneda.github.io/org-roam/">page</a> so I can easily
ctrl+f to share the links.</p>
<figure
style="text-align: center; margin: auto; display: block; width: 100%; height: auto;">
<img src="/images/org-roam-share/screen_20250119_201853.jpg" />
<figcaption>This is the online version of one of my Org roam files. I
use a function to make pushing a single file online very
convenient.</figcaption>
</figure>
<p>The following code is very specific for my use case but can be a
starting point for others.</p>
<div class="sourceCode" id="cb2" data-org-language="emacs-lisp"><pre
class="sourceCode commonlisp"><code class="sourceCode commonlisp"><span id="cb2-1"><a href="#cb2-1" aria-hidden="true" tabindex="-1"></a><span class="co">;; It is fixed for my personal blog case, so I dont have to add it to the org-roam files</span></span>
<span id="cb2-2"><a href="#cb2-2" aria-hidden="true" tabindex="-1"></a>(<span class="kw">setq</span> org-html-head-extra</span>
<span id="cb2-3"><a href="#cb2-3" aria-hidden="true" tabindex="-1"></a>      (concat <span class="st">&quot;&lt;link rel=&#39;stylesheet&#39; type=&#39;text/css&#39; href=&#39;../org-roam/org.css&#39; /&gt;&quot;</span>))</span>
<span id="cb2-4"><a href="#cb2-4" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-5"><a href="#cb2-5" aria-hidden="true" tabindex="-1"></a><span class="co">;; Publishing org-roam files to my personal website so I can easily share notes</span></span>
<span id="cb2-6"><a href="#cb2-6" aria-hidden="true" tabindex="-1"></a>(<span class="kw">defun</span><span class="fu"> lgm/publish-org-roam-to-github </span>(github-repo-dir output-dir branch)</span>
<span id="cb2-7"><a href="#cb2-7" aria-hidden="true" tabindex="-1"></a>  <span class="st">&quot;Publish the current Org Roam file to a GitHub Pages site, including images.</span></span>
<span id="cb2-8"><a href="#cb2-8" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-9"><a href="#cb2-9" aria-hidden="true" tabindex="-1"></a><span class="st">GITHUB-REPO-DIR: Path to your GitHub Pages repository.</span></span>
<span id="cb2-10"><a href="#cb2-10" aria-hidden="true" tabindex="-1"></a><span class="st">OUTPUT-DIR: Directory inside the repository where the HTML file will be placed.</span></span>
<span id="cb2-11"><a href="#cb2-11" aria-hidden="true" tabindex="-1"></a><span class="st">BRANCH: Branch to which changes should be committed (e.g., &#39;gh-pages&#39;).&quot;</span></span>
<span id="cb2-12"><a href="#cb2-12" aria-hidden="true" tabindex="-1"></a>  (interactive</span>
<span id="cb2-13"><a href="#cb2-13" aria-hidden="true" tabindex="-1"></a>   (<span class="kw">list</span> (read-directory-name <span class="st">&quot;GitHub Repo Directory: &quot;</span> <span class="st">&quot;~/repos/lgmoneda.github.io/&quot;</span>)</span>
<span id="cb2-14"><a href="#cb2-14" aria-hidden="true" tabindex="-1"></a>         (read-string <span class="st">&quot;Output Directory (relative to repo root): &quot;</span> <span class="st">&quot;org-roam/&quot;</span>)</span>
<span id="cb2-15"><a href="#cb2-15" aria-hidden="true" tabindex="-1"></a>         (read-string <span class="st">&quot;Branch: &quot;</span> <span class="st">&quot;master&quot;</span>)))</span>
<span id="cb2-16"><a href="#cb2-16" aria-hidden="true" tabindex="-1"></a>  (<span class="kw">let*</span> ((org-file (buffer-file-name))</span>
<span id="cb2-17"><a href="#cb2-17" aria-hidden="true" tabindex="-1"></a>         (org-html-export-file (concat (file-name-sans-extension org-file) <span class="st">&quot;.html&quot;</span>))</span>
<span id="cb2-18"><a href="#cb2-18" aria-hidden="true" tabindex="-1"></a>         (output-path (expand-file-name output-dir github-repo-dir))</span>
<span id="cb2-19"><a href="#cb2-19" aria-hidden="true" tabindex="-1"></a>         (output-file (expand-file-name (file-name-nondirectory org-html-export-file) output-path))</span>
<span id="cb2-20"><a href="#cb2-20" aria-hidden="true" tabindex="-1"></a>         (image-dir (expand-file-name <span class="st">&quot;images/org-roam/&quot;</span> github-repo-dir))</span>
<span id="cb2-21"><a href="#cb2-21" aria-hidden="true" tabindex="-1"></a>         (image-paths (<span class="kw">make-hash-table</span> <span class="bu">:test</span> <span class="dt">&#39;equal</span>)))</span>
<span id="cb2-22"><a href="#cb2-22" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">unless</span> org-file</span>
<span id="cb2-23"><a href="#cb2-23" aria-hidden="true" tabindex="-1"></a>      (<span class="kw">error</span> <span class="st">&quot;This buffer is not visiting a file&quot;</span>))</span>
<span id="cb2-24"><a href="#cb2-24" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">unless</span> (derived-mode-p <span class="dt">&#39;org-mode</span>)</span>
<span id="cb2-25"><a href="#cb2-25" aria-hidden="true" tabindex="-1"></a>      (<span class="kw">error</span> <span class="st">&quot;This function only works in Org mode buffers&quot;</span>))</span>
<span id="cb2-26"><a href="#cb2-26" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-27"><a href="#cb2-27" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Sync org-roam db</span></span>
<span id="cb2-28"><a href="#cb2-28" aria-hidden="true" tabindex="-1"></a>    (org-roam-db-sync)</span>
<span id="cb2-29"><a href="#cb2-29" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-30"><a href="#cb2-30" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Ensure the image directory exists</span></span>
<span id="cb2-31"><a href="#cb2-31" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">unless</span> (file-directory-p image-dir)</span>
<span id="cb2-32"><a href="#cb2-32" aria-hidden="true" tabindex="-1"></a>      (make-directory image-dir <span class="kw">t</span>))</span>
<span id="cb2-33"><a href="#cb2-33" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-34"><a href="#cb2-34" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Find and copy images referenced in the Org file</span></span>
<span id="cb2-35"><a href="#cb2-35" aria-hidden="true" tabindex="-1"></a>    (org-element-map (org-element-parse-buffer) <span class="dt">&#39;link</span></span>
<span id="cb2-36"><a href="#cb2-36" aria-hidden="true" tabindex="-1"></a>      (<span class="kw">lambda</span> (link)</span>
<span id="cb2-37"><a href="#cb2-37" aria-hidden="true" tabindex="-1"></a>        (<span class="kw">when</span> (<span class="kw">string=</span> (org-element-property <span class="bu">:type</span> link) <span class="st">&quot;file&quot;</span>)</span>
<span id="cb2-38"><a href="#cb2-38" aria-hidden="true" tabindex="-1"></a>          (<span class="kw">let*</span> ((image-path (org-element-property :path link))</span>
<span id="cb2-39"><a href="#cb2-39" aria-hidden="true" tabindex="-1"></a>                 (absolute-image-path (expand-file-name image-path (file-name-directory org-file)))</span>
<span id="cb2-40"><a href="#cb2-40" aria-hidden="true" tabindex="-1"></a>                 (relative-image-path (file-relative-name absolute-image-path (file-name-directory org-file)))</span>
<span id="cb2-41"><a href="#cb2-41" aria-hidden="true" tabindex="-1"></a>                 (image-filename (file-name-nondirectory image-path))</span>
<span id="cb2-42"><a href="#cb2-42" aria-hidden="true" tabindex="-1"></a>                 (destination-image-path (expand-file-name image-filename image-dir)))</span>
<span id="cb2-43"><a href="#cb2-43" aria-hidden="true" tabindex="-1"></a>            (<span class="kw">when</span> (<span class="kw">and</span> image-path (file-exists-p absolute-image-path))</span>
<span id="cb2-44"><a href="#cb2-44" aria-hidden="true" tabindex="-1"></a>              <span class="co">;; Copy the image and store the mapping for replacement</span></span>
<span id="cb2-45"><a href="#cb2-45" aria-hidden="true" tabindex="-1"></a>              (copy-file absolute-image-path destination-image-path <span class="kw">t</span>)</span>
<span id="cb2-46"><a href="#cb2-46" aria-hidden="true" tabindex="-1"></a>              (puthash relative-image-path</span>
<span id="cb2-47"><a href="#cb2-47" aria-hidden="true" tabindex="-1"></a>                       (concat <span class="st">&quot;../images/org-roam/&quot;</span> image-filename)</span>
<span id="cb2-48"><a href="#cb2-48" aria-hidden="true" tabindex="-1"></a>                       image-paths))))))</span>
<span id="cb2-49"><a href="#cb2-49" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-50"><a href="#cb2-50" aria-hidden="true" tabindex="-1"></a>    (message <span class="st">&quot;Image Paths: %s&quot;</span></span>
<span id="cb2-51"><a href="#cb2-51" aria-hidden="true" tabindex="-1"></a>             (<span class="kw">mapcar</span> (<span class="kw">lambda</span> (key)</span>
<span id="cb2-52"><a href="#cb2-52" aria-hidden="true" tabindex="-1"></a>                       (<span class="kw">list</span> key (<span class="kw">gethash</span> key image-paths)))</span>
<span id="cb2-53"><a href="#cb2-53" aria-hidden="true" tabindex="-1"></a>                     (hash-table-keys image-paths)))</span>
<span id="cb2-54"><a href="#cb2-54" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-55"><a href="#cb2-55" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Export the Org file to HTML</span></span>
<span id="cb2-56"><a href="#cb2-56" aria-hidden="true" tabindex="-1"></a>    (org-html-export-to-html)</span>
<span id="cb2-57"><a href="#cb2-57" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-58"><a href="#cb2-58" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Ensure the output directory exists</span></span>
<span id="cb2-59"><a href="#cb2-59" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">unless</span> (file-directory-p output-path)</span>
<span id="cb2-60"><a href="#cb2-60" aria-hidden="true" tabindex="-1"></a>      (make-directory output-path <span class="kw">t</span>))</span>
<span id="cb2-61"><a href="#cb2-61" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-62"><a href="#cb2-62" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Move the exported HTML to the output directory</span></span>
<span id="cb2-63"><a href="#cb2-63" aria-hidden="true" tabindex="-1"></a>    (copy-file org-html-export-file output-file <span class="kw">t</span>)</span>
<span id="cb2-64"><a href="#cb2-64" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-65"><a href="#cb2-65" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Post-process the HTML file to update image paths</span></span>
<span id="cb2-66"><a href="#cb2-66" aria-hidden="true" tabindex="-1"></a>    (with-temp-buffer</span>
<span id="cb2-67"><a href="#cb2-67" aria-hidden="true" tabindex="-1"></a>      (insert-file-contents output-file)</span>
<span id="cb2-68"><a href="#cb2-68" aria-hidden="true" tabindex="-1"></a>      (<span class="kw">dolist</span> (key (hash-table-keys image-paths))</span>
<span id="cb2-69"><a href="#cb2-69" aria-hidden="true" tabindex="-1"></a>        (goto-char (point-min))</span>
<span id="cb2-70"><a href="#cb2-70" aria-hidden="true" tabindex="-1"></a>        (while (search-forward key <span class="kw">nil</span> <span class="kw">t</span>)</span>
<span id="cb2-71"><a href="#cb2-71" aria-hidden="true" tabindex="-1"></a>          (replace-match (<span class="kw">gethash</span> key image-paths) <span class="kw">t</span> <span class="kw">t</span>)))</span>
<span id="cb2-72"><a href="#cb2-72" aria-hidden="true" tabindex="-1"></a>      (write-file output-file))</span>
<span id="cb2-73"><a href="#cb2-73" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-74"><a href="#cb2-74" aria-hidden="true" tabindex="-1"></a>    (message <span class="st">&quot;Exported %s to %s&quot;</span> org-file output-file)</span>
<span id="cb2-75"><a href="#cb2-75" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb2-76"><a href="#cb2-76" aria-hidden="true" tabindex="-1"></a>    <span class="co">;; Commit and push the changes to GitHub</span></span>
<span id="cb2-77"><a href="#cb2-77" aria-hidden="true" tabindex="-1"></a>    (<span class="kw">let</span> ((default-directory github-repo-dir))</span>
<span id="cb2-78"><a href="#cb2-78" aria-hidden="true" tabindex="-1"></a>      (shell-command (<span class="kw">format</span> <span class="st">&quot;git add %s&quot;</span> (shell-quote-argument output-file)))</span>
<span id="cb2-79"><a href="#cb2-79" aria-hidden="true" tabindex="-1"></a>      (shell-command (<span class="kw">format</span> <span class="st">&quot;git add %s&quot;</span></span>
<span id="cb2-80"><a href="#cb2-80" aria-hidden="true" tabindex="-1"></a>                             (shell-quote-argument</span>
<span id="cb2-81"><a href="#cb2-81" aria-hidden="true" tabindex="-1"></a>                              (expand-file-name <span class="st">&quot;images/org-roam/&quot;</span> github-repo-dir))))</span>
<span id="cb2-82"><a href="#cb2-82" aria-hidden="true" tabindex="-1"></a>      (shell-command</span>
<span id="cb2-83"><a href="#cb2-83" aria-hidden="true" tabindex="-1"></a>       (<span class="kw">format</span> <span class="st">&quot;git commit --no-gpg-sign -m &#39;Publish %s with images&#39;&quot;</span></span>
<span id="cb2-84"><a href="#cb2-84" aria-hidden="true" tabindex="-1"></a>               (file-name-nondirectory output-file)))</span>
<span id="cb2-85"><a href="#cb2-85" aria-hidden="true" tabindex="-1"></a>      (shell-command (<span class="kw">format</span> <span class="st">&quot;git push origin %s&quot;</span> branch))</span>
<span id="cb2-86"><a href="#cb2-86" aria-hidden="true" tabindex="-1"></a>      (message <span class="st">&quot;Published to GitHub Pages branch: %s&quot;</span> branch))))</span>
<span id="cb2-87"><a href="#cb2-87" aria-hidden="true" tabindex="-1"></a></span></code></pre></div>
<h2 id="sharing-synchronously-with-multiple-people">Sharing
synchronously with multiple people</h2>
<p>Once, I got very excited about a book that I wanted to share with my
team. Generating notes from everything I wrote in the bibliographical
notes would generate a very long PDF, and I also wanted to do a live
activity using my team's context to practice the concepts. In this
scenario, I created a new Org roam file and mixed new content with Org
roam nodes to prepare a slide presentation.</p>
<figure
style="text-align: center; margin: auto; display: block; width: 100%; height: auto;">
<img src="/images/org-roam-share/screen_20250119_073426.jpg" />
<figcaption>Another awesome usage of org-transclusion is preparing a
slide presentation</figcaption>
</figure>
<p>I use the <code>org-present</code> package, and most of my custom
configuration was inspired by <a
href="https://systemcrafters.net/emacs-tips/presentations-with-org-present/">this
material by System Crafters</a>.</p>
<figure
style="text-align: center; margin: auto; display: block; width: 100%; height: auto;">
<img
src="/images/org-roam-share/org-present-example.gif" />
<figcaption>Org-present makes it convenient to quickly put together
presentations when combined with org-transclusion</figcaption>
</figure>
<p>Since we don't take notes about the slide format, reusing Org roam
nodes generated a wordy presentation. It was a lesson in isolating
concepts better. At the same time, I prepared a couple of presentations
extremely quickly.</p>
<p>The second scenario I preferred was when I wanted to do a
company-wide presentation on a generic topic for a knowledge-sharing
event. I prepared it entirely in Org roam since I wanted to keep the
generated assets for future reference and reuse. It indeed happened, and
it became <a
href="https://datascienceleadership.com/docs/technical-leadership/tech-driven-career">an
article in my Data Science Leadership material</a>.</p>
<h2 id="creating-and-sharing-to-the-world">Creating and sharing to the
world</h2>
<p>When blogging, I write the post in Org Roam first since I want to
link to nodes and explore my graph. As a result, I had to write it twice
and translate it to Markdown when pushing it to this blog. Though the
overhead wasn't that meaningful, I also realized I was refraining from
adding org roam links to the text only to reduce the work of excluding
them when manually exporting it to Markdown.</p>
<p>After adopting some syntax in Org to match what I used to generate in
the blog by using markdown, I could leverage pandoc export to HTML to
write it in a single place and export it to my blog. This is the first
post I'm doing using it, and it feels great. Every post I've seen about
publishing a blog using Org roam uses <code>ox-hugo</code>, so it seems
more straightforward if you don't use Jekyll already; examples <a
href="https://blog.jethro.dev/posts/automatic_publishing/">1</a> and <a
href="https://justin.vc/posts/ox-hugo-and-org-roam/">2</a>.</p>
<figure
style="text-align: center; margin: auto; display: block; width: 100%; height: auto;">
<img src="/images/org-roam-share/screen_20250120_162251.jpg" />
<figcaption>The Jekyll yaml front matter lies inside a drawer at the top
of the Org roam file, so most of the configuration isn't
visible.</figcaption>
</figure>
<p>My code for it isn't very generic, and the pandoc arguments try to
reproduce what I was getting before when using only markdown. For
example, starting my headings with <code>h2</code>. Regardless, it is <a
href="https://gist.github.com/lgmoneda/d5963cddea2dd811a2df434e9a4ef345">here</a>
if you want to take a look for inspiration.</p>
<section id="footnotes" class="footnotes footnotes-end-of-document"
role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><p>I started doing it recently, and I still don't know what
to do with Org roam links. In the code provided, they are all broken
links. For the blog post case, I exclude all of them.<a href="#fnref1"
class="footnote-back" role="doc-backlink">↩︎</a></p></li>
</ol>
</section>
