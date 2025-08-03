---
layout: post
title: "Cognitive joy tooling #3: Closing the creation-application gap of my knowledge base using auto-segmentation, colors, and semantic search"
date: 2025-02-09
lang: en
ref: cjt3
comments: true
author: moneda
tags: emacs org-roam cognition-augmentation
description: Segmenting what I read or write to make me inspect my personal notes more often
image: ../../../images/cjt3/social-share-chunky-semantic-search.png
---

<h2 id="index">Index</h2>
<ol>
<li><a href="#the-knowledge-creation-application-gap-problem">The
Knowledge creation-application gap problem</a></li>
<li><a
href="#segmenting-a-text-based-on-the-diversity-of-the-retrieved-documents-from-a-knowledge-base">Segmenting
a text based on the diversity of the retrieved documents from a
knowledge base</a></li>
<li><a href="#colors-and-navigation">Colors and navigation</a></li>
<li><a
href="#reading-studying-and-writing-with-the-colorful-segments">Reading,
studying, and writing with the colorful segments</a></li>
<li><a href="#future-work">Future work</a></li>
</ol>
<h2 id="the-knowledge-creation-application-gap-problem">The Knowledge
creation-application gap problem</h2>

<h2
id="segmenting-a-text-based-on-the-diversity-of-the-retrieved-documents-from-a-knowledge-base">Segmenting
a text based on the diversity of the retrieved documents from a
knowledge base</h2>
<p>Considering the intention to go through text under the lens of my
knowledge, I use a
criterion based on the retrieved documents from the knowledge base made
of my Org roam nodes.</p>
<p>It starts by splitting the text into sentences based on
punctuation.</p>
<p><img
src="/images/cjt3/2025-02-16_09-02-29_sentence_split_by_ponctuation.png"
style="text-align: center; margin: auto; display: block; width: 70%; height: auto;" /></p>
<p>I point to the first sentence and consider it a candidate segment.
Then I iterate over the sentences. In every iteration, I use my <a
href="https://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html">semantic
search API</a> to retrieve the top 15 documents related to the current
segment and the following sentence. I compare the documents without
considering their ranking or the hierarchy of the nodes. I check the
percentage of overlapping documents.</p>
<p><img
src="/images/cjt3/2025-02-16_11-31-18_iteration_segments_semantic_search_api.png"
style="text-align: center; margin: auto; display: block; width: 70%; height: auto;" /></p>
<p>With the overlapping percentage, I can decide whether or not to merge
the following sentence into the current segment.</p>
<p>A parameter called <code>segmentation granularity</code>, which
ranges from zero to one, controls the merging decision by determining
the proportion of documents that must be similar to merge the sentence
into the segment.</p>
<p>When it is set to zero, the entire text will be a single segment,
while using one will segment it by sentences—as we started. If I decide
to aggregate the sentence into a segment, the next comparison is between
the updated current segment (the previous "current segment" appended by
the previous "following sentence") and the following sentence.</p>
<p><img
src="/images/cjt3/2025-02-16_07-39-14_iterate_segmentation_cjt3.png"
style="text-align: center; margin: auto; display: block; width: 70%; height: auto;" /></p>
<p>By the end, every sentence will have been grouped into a segment or
become a segment itself.</p>
<p><img
src="/images/cjt3/2025-02-16_05-25-42_auto_segmentation_using_kb.png"
style="text-align: center; margin: auto; display: block; width: 70%; height: auto;" /></p>
<p>This approach has the downside of the cold start problem since it
depends on having a certain amount of notes to generate the comparison
(I have 5k+). For example, if one has only 15 notes and retrieves the
top 15, they will always overlap 100%, even though the notes might
differ. Thus, it takes time to become interesting. During this phase,
one can hardly segment by the diversity of one's knowledge.</p>
<p>One interesting behavior is that if you are just beginning to
investigate a subject, the retrieved documents will be mostly the same,
generating fewer segments. It makes sense that someone sees content in a
subject they are a beginner with fewer nuances than those they have been
in touch with for a longer time.</p>
<p>On the other side, considering the simplistic overlapping criterion,
having many notes on the same subject is also harmful because comparing
two segments can give a false sense of diversity if you have different
notes that tackle very close subjects. A measure based on semantic
distance might fit better here.</p>
<p>Here's the <a
href="https://gist.github.com/lgmoneda/d40eec3ca8c7db802260a0e7aa724478">actual
code</a>. It is more convoluted than needed because I reuse the semantic
search API, which could have a better interface. On the bright side, it
is cool to build a new function based on it quickly.</p>
<h2 id="colors-and-navigation">Colors and navigation</h2>
<p>I highlight segments using eight colors. It means the colors only
differentiate segments but don't have a meaning per se. A color will
appear multiple times in long texts but without interpretation.</p>
<p>I based the colors on <a
href="https://github.com/kepano/flexoki-obsidian/blob/main/theme.css">flexoki</a>,
but I modified them to look watered down in my background color. The
colors used in this post images are:
<code>"#F4DBD9" "#E7EBD6" "#F6EDCD" "#F6E2D4" "#F3DBE5" "#D2DEF0" "#E1DCED" "#D7EBE9"</code>.</p>
<p>I use a minimalistic theme, and the colors bring more sense into my
activities than a distraction. I don't keep the highlights. A function
clears them out when I finish reading or writing. Making them look
beautiful and minimal was critical. It is a small pleasure that
compounds in my activities—just as specific pens provide extra pleasure
in handwriting, the paper color and granularity attend to our touch in
physical book reading, or keyboards offer tactile fun to typing.</p>
<figure
style="text-align: center; margin: auto; display: block; width: 90%; height: auto;">
<img src="/images/cjt3/screen_20250217_063616.jpg" />
<figcaption>The colors only determine different segments but don't have
meaning. Excerpt of <a
href="https://darioamodei.com/machines-of-loving-grace">"Machines of
loving grace"</a>.</figcaption>
</figure>
<p>I the segmentation to take me to a state that feels exploratory and
dynamic. So, I used <code>ivy-pos-frame</code> to bring similar
documents when I use a shortcut over a segment. I can quickly navigate
on it and open the Org roam node by hitting <code>RETURN</code>. I keep
the menu and the cursor position on it even after opening a node to
enable going to another node quickly. See below the new buffers popping
up, then getting replaced by the new references I open, which enables me
to skim many of my notes seamlessly. The <a
href="https://gist.github.com/lgmoneda/d40eec3ca8c7db802260a0e7aa724478">elisp
code</a>.</p>
<figure class="video-container">
<video autoplay loop muted playsinline class="centered-video">
  <source src="../../../images/cjt3/trim-eww.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
  <figcaption class="video-caption">Jumping to different docs associated with a segment is very fluid. The navigation between segments isn't yet. Excerpt of <a href="https://darioamodei.com/machines-of-loving-grace">"Machines of loving grace"</a>.</figcaption>
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

<p>I wonder if a navigation mode would make it even better. It is,
moving from one segment to the other by only pressing <code>n</code> or
<code>p</code>, automatically displaying the top results. Or simply use
<code>C-c n</code> and <code>C-c p</code> to navigate the segments. It
would certainly save me time, and it would be perfect for reading.</p>
<p>I can easily set the granularity parameter to change my
experience.</p>
<figure
style="text-align: center; margin: auto; display: block; width: 90%; height: auto;">
<img
src="/images/cjt3/2025-02-19_05-10-59_screenshot.png" />
<figcaption>I can easily change the granularity parameter. I wish I
could simply slide and see segments changing in real time for these
default values. I foresee challenges because depending on the content,
I'd have to dynamically find the set of parameters that really generate
different segmentations to make the sliding interesting.</figcaption>
</figure>
<p>I've been using it mostly to give me something that connects three
meaningful sentences in the same segment and isn't simply segmented by
paragraphs.</p>
<figure class="video-container">
<video autoplay loop muted playsinline class="centered-video">
  <source src="../../../images/cjt3/changes-gran-high.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
  <figcaption class="video-caption">How segmentation changes as I change the granularity parameter. It differentiates from a single segment up to segmented by sentences. The idea is to explore the in between states. Excerpt of <a href="https://darioamodei.com/machines-of-loving-grace">"Machines of loving grace"</a>.</figcaption>
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

<h2
id="reading-studying-and-writing-with-the-colorful-segments">Reading,
studying, and writing with the colorful segments</h2>
<p>Though my initial motivation was writing, I realized that reading
implies writing to me most of the time. When reading books, blog posts,
scientific papers, etc., I will take notes even if it is a single
paragraph about a concept I've learned from it, or to say why I didn't
engage much in note-taking for it.</p>
<p>In the beginning, I copied and pasted text into the Emacs scratch
buffer to apply the function, but now I'm slowly bringing content
directly to it to streamline the process. Two working solutions are <a
href="https://www.gnu.org/software/emacs/manual/html_mono/eww.html">Emacs
Web Browser</a> (EWW) for web content and <a
href="https://depp.brause.cc/nov.el/">nov.el</a> for epubs.</p>
<p>All the above examples on top of <a
href="https://darioamodei.com/machines-of-loving-grace">Machines of
loving grace</a> are in EWW.</p>
<p>I'm not a big fan of reading on an LCD screen. Ny book reading still
happens on Kindle. I highlight and write Kindle notes, and when I finish
or do a checkpoint, I export my Kindle notes to the bibliographical
notes in org roam, where I keep it under a heading called "Kindle
highlights", and I go over them extracting the notes, re-reading, and
processing it into new nodes. Nonetheless, when skimming <em>The
Timeless Way,</em> <a id="cite-alexander1979timeless-1"></a><span
class="citation" data-cites="alexander1979timeless">Alexander (<a
href="#ref-alexander1979timeless" role="doc-biblioref">1979</a>)</span>,
I had a passage connected to a piece of creative writing I did over 10
years ago. Revisiting it and grasping the resemblance satisfied a need
orthogonal to productivity and nudged me into contemplation.</p>
<p>When writing, I apply it to org roam content. I navigate the segments
and check for links. Then, eventually, I link written ideas to nodes
representing them or add more ideas revealed by the connections.
Finally, I use a function to clear the colorful faces and keep
editing.</p>
<figure class="centered-video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Rzj5CSekqHI?si=ntYNG1WQ9oK8KwVZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <figcaption> This is a completely staged example, but it shows the pattern of segmenting, linking Org roam nodes, adding them to the text, and un-coloring it.</figcaption>
</figure>

<h2 id="future-work">Future work</h2>
<p>The joint activity of reading, thinking, contrasting with my
knowledge, linking what I'm learning to what I know, writing and
explaining new concepts with my own words, and applying it to learn is
the real day-to-day activity I do and enjoy. This functionality gives me
more structure to better enjoy the transitions between these activities.
I see it as a feature for "fixing books" as in Andy Matuschak's <a
href="https://andymatuschak.org/books/">Why books don't work</a>.</p>
<p>I'm working on functionality to support the contrast of my knowledge
to the new content, ease the links, and engage me in thinking. I am
curious to formalize why I connect two nodes when writing. I realized I
do it so automatically that I have to think to answer if one idea is
composing the other or if I'm opposing or reinforcing them. I hope to
write about it here.</p>
<p>As a closing remark, if you have read the <a
href="https://lgmoneda.github.io/2025/01/11/sharing-org-roam-content.html">Sharing
content with Org Roam</a> post, this text is another example of writing
inside Org roam. By the way, the first section is made of two
transclusions. The Org nodes are: The knowledge
creation-application gap and Chunkfy semantic
search. For the second one, I wanted only the heading called
"Problem statement", which isn't an Org roam node, so I could link its
content using
<code>#+transclude: [[file:20241224080942-chunkfy_semantic_search.org::*Problem statement][Chunkify Problem Statement]] :level 2 :only-contents</code>.
It engaged me in improving the text to make it modular enough to be
transcluded, which is another thing I classify as cognitive joy.</p>
<h2 id="references">References</h2>
<div id="refs" class="references csl-bib-body" role="list">
<div id="ref-alexander1979timeless" class="csl-entry" role="listitem">
Alexander, C. (1979) <em>The timeless way of building</em>. Oxford
University Press (Center for environmental structure series, v. 8).
Available at: <a
href="https://books.google.com.br/books?id=H6CE9hlbO8sC">https://books.google.com.br/books?id=H6CE9hlbO8sC</a>.
<a href="#cite-alexander1979timeless-1" class="backlink" title="Back to citation 1">↩︎<sup>1</sup></a>
</div>
</div>
