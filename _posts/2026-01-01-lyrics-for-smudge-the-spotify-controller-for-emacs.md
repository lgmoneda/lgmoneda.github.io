---
layout: post
title: "Lyrics for Smudge, the Spotify controller for Emacs"
date: 2026-01-01
lang: en
ref: smudge-lyrics
comments: true
author: moneda
tags: emacs
description: Elisp code to pop-up current track lyrics.
image: ../../../images/smudge-lyrics/gnu-singing.png
---

<p>Using Smudge as a distraction-free Spotify interface, I miss lyrics
support. Since Spotify's API lacks this feature, but an open-source
project provides it, I requested it from Codex.</p>
<p>You can find the code in this <a
href="https://gist.github.com/lgmoneda/6dbb6f5e6183928e0c6897547b153570">GitHub
Gist</a>. Codex generated the entire code after a couple of interactions
to fix issues. I'm sharing because it wasn't a one-shot, so others can
save time.</p>
<p>To demonstrate, here's what happens when you call
<code>my-smudge-lyrics-popup</code> in Emacs while playing a song in
Spotify with Smudge connected.</p>
<figure class="video-container">
<video autoplay loop muted playsinline class="centered-video">
  <source src="../../../images/smudge-lyrics/smudge-lyrics-short.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
  <figcaption class="video-caption"></figcaption>
</figure>

<style>
.centered-video {
  text-align: center;
  margin: auto;
  display: block;
  width: 100%;
  height: auto;
}
</style>

<p>Enjoy your singing!</p>
