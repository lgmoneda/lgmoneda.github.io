---
layout: post
title: "Converting papers to EPUB to read in e-ink devices"
date: 2026-03-21
lang: en
ref: pdf-to-epub-feedback-loop
comments: true
author: moneda
tags: ai epub kindle e-ink papers
description: Converting research papers to EPUB for e-ink reading, and why a benchmark feedback loop changed everything
image: ../../../images/pdf-to-epub/social-share-pdf-to-epub.png
---

<h2 id="index">Index</h2>
<ol>
<li><a href="#introduction">Introduction</a></li>
<li><a href="#how-it-works">How It Works</a></li>
<li><a href="#the-feedback-loop-breakthrough">The feedback loop
breakthrough</a></li>
</ol>
<h2 id="introduction">Introduction</h2>
<p>I like to read papers, and to avoid spending more time on a computer,
I decided to start reading them on an e-ink device. I dreamed about a
large A4-size device, but before committing, I realized that reading
them on my Kindle Paperwhite was only painful because of the PDF format
and the typical research paper standards (e.g., two-column layout).</p>
<p>The online conversion from PDF to EPUB was poor, so I built a small
tool to convert papers to EPUB optimized for Kindle-like reading. It
started as a quick script, but it became much more useful after
tightening the quality around math, image handling, and structure.</p>
<p>The project is open source here: <a
href="https://github.com/lgmoneda/pdf-to-epub">pdf-to-epub</a>.</p>
<p>For usage and setup details, check the README in the repo. The
simplest conversion command is:</p>
<div class="sourceCode" id="cb1"><pre
class="sourceCode bash"><code class="sourceCode bash"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a><span class="ex">python</span> pdf_to_epub.py https://arxiv.org/pdf/2511.10395</span></code></pre></div>
<p>I hope it is useful to people with e-readers in general: Kindle,
Kobo, Boox, etc.</p>
<h2 id="how-it-works">How it works</h2>
<p>The conversion pipeline is short: OCR the paper, normalize markdown
artifacts, then generate EPUB.</p>
<p><img src="/images/pdf-to-epub-feedback-loop/conversion-pipeline.png" /></p>
<h2 id="the-feedback-loop-breakthrough">The feedback loop
breakthrough</h2>
<p>I've been using it for 6 months, and it was ok. I accepted the many
mistakes in it, because it was still better than the online version.
Nonetheless, since I'm exercising my skills in generating feedback loops
for AI-assisted development, I picked this project to improve.</p>
<p>Instead of trying one paper, patching once, and hoping it
generalizes, I used a benchmark set of papers with different failure
modes (two-column text, equation-heavy content, image-rich pages). Then
the cycle became:</p>
<ol>
<li>run benchmark</li>
<li>Inspect concrete failures</li>
<li>patch a focused part of the converter</li>
<li>rerun and verify no regressions</li>
</ol>
<p>AI assistance became much more effective only after this loop
existed. Without strong feedback, AI suggestions are often plausible but
shallow. With a benchmark and explicit pass/fail signals, iteration
became fast, objective, and cumulative.</p>
<p>The AI tool I used, Codex, created the benchmark, requested
clarification about quality criteria, and iterated until it was
performing well on it.</p>
<p>Having a long-running agent in a task is amazing, and excludes me as
the bottleneck for quality assurance.</p>
