---
layout: post
title: "Cognitive joy tooling #1: the Catalyst AI assistant, design review and 90-days retrospective"
date: 2024-10-19
lang: en
ref: cet1-cata-agent
comments: true
author: moneda
description: My experience using a catalyst agent that engages me when I use Org and Org Roam 
image: ../../../images/cjt1/venus-social-share.jpg
tags: cognition-augmentation emacs org-roam machine-learning
---

## Index

1. [Introduction](#introduction)
2. [I don't want to live without the semantic search on my notes](#i-dont-want-to-live-without-the-semantic-search-on-my-notes)
3. [The Catalyst Assistant architecture](#the-catalyst-assistant-architecture)
4. [On the interactions](#on-the-interactions)
5. [Conclusion](#conclusion)

## Introduction

Since I developed a [Semantic Search for Org Roam](https://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html) (the Emacs version of the Roam Research, Obsidian, etc.), I've been playing with another tooling to improve my joy in intellectual work: coding, writing, studying, researching, etc.

A natural following step after the semantic search and the Q&A was an assistant. I got frustrated with my first trial of making an Agent that uses a tool to navigate an Org file and find an answer—it was before context windows enlarged and prices dropped vastly. Then I started playing with prompts, emulating my data, and checking if LLMs could accomplish the tasks I thought I would enjoy from an assistant inside my many Emacs workflows. It was promising.

The early excellent results made me feel I'd be ready to share something as self-contained as the other features, but that was different. When I started getting frustrated with tweaking, I made it a light write-up on my experiences playing with cognition tooling. Further, currently, one can find many resources on how to develop with LLMs, but less on the critical usage of it for those creating their own tools: when does it feel joyful? I'm trying to discover that as I play around and discuss with others. It was a good justification to fix the blog comment section. Feel free to share your ideas there or send me an e-mail.

I will review the previous tools, and the Catalyst Assistant, which helps me achieve whatever I define as my goals and access my to-do, Agenda, and org roam files.

The focus is on something other than providing a package since I've been exploring the use cases until I find out what is useful. Regardless, I [share some code](https://gist.github.com/lgmoneda/6764fd712660b9bd0eb9870f66778ee6).

## I don't want to live without the semantic search on my notes

I will use the [semantic search](https://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html) multiple times if I write, study, or research. I currently have 4895 nodes, and there are a couple about specific topics, ideas, theories, etc. Their name is a phrase. For example, "Children shift from exploration to explotation in the face of unpredictable and adversarial environment", which was based on a [tweet](https://x.com/AlisonGopnik/status/1729550771262218724?s=20) by Gopnik.

I'm more likely to remember its meaning and try to find it using a query like "children don't explore in environments that are too unpredictable to them."

Here are the results:

<div align="center">
<figure>
	<a href="../../../images/cjt1/semantic-search-result.png" name="Semantic Search result">
		<img  style="width:700px;margin:10px" src="../../../images/cjt1/semantic-search-result.png"/>
	</a>
		<figcaption>Inside the headings there is  the hierarchy the node is from. Example:  The philosophical baby: what children's minds tell us about truth, love and the meaning of life, Gopnik, A. > Why do humans have such a long period where babies are helplessness > Children are very sensitive to if someone is teaching them and act less curiously. </figcaption>
</figure>
</div>

Finding interesting related things while you try to find a specific note feels excellent. It keeps bringing my nodes to the surface at the right time.

It became natural to me to write, select, search, and jump to read related notes, get back, link them, integrate their ideas, and keep moving.

Whenever the semantic search had an issue, I fixed it as soon as possible so that I could keep using it.

## I can survive without the Q&A tool

My Q&A tool broke at some point after I updated some libraries. I didn't bother to fix it for a very long time. It gives me a hint that it isn't providing me much value. However, I've been on parental leave for a couple of months, and one of my main usages of the Q&A was reminding me, aggregating, and listing resources about a subject when someone from work gets to me looking for help. Even so, I can use semantic search to achieve this.

## The Catalyst Assistant architecture

Here's how I defined what I wanted from this project at the beginning:


> I want to have an entity that engages me in deep thinking, challenges me, and augments my ability of self-reflection and self-authoring to feel more satisfied with my work and collections of experiences.


The "feel more satisfied" part is key as I don't want something that maximizes anything I could call "production". I don't want to do more; I just want to feel more frequently the good feelings I feel when I'm engaged in an activity.

The original project name was "A generative self and a catalyst agent" because I wanted part of it to pursue what I'm pursuing to complement me (generative self), and the other to provoke and challenge (catalyst agent). I've been exploring the Catalyst Agent (CA) only so far.

I believe many use this trick, but I started doing sanity checks by mocking the data I intended to make accessible to the CA to verify if it could achieve what I expected.

Here's a diagram of the version I've used for around 90 days.

<div align="center">
<figure>
	<a href="../../../images/cjt1/catalyst-agent-v1-diagram.svg" name="Catalyst Agent V1 diagram">
		<img  style="width:700px;margin:10px" src="../../../images/cjt1/catalyst-agent-v1-diagram.svg"/>
	</a>
		<figcaption>The diagram shows the information flow and the interaction points with the Catalyst Agent.</figcaption>
</figure>
</div>


I manage most of my life inside Org. My todo.org file has everything I do that isn't related to my job, which lives in another org file I don't connect to the CA. Further, I format them in an Agenda View, making it easier for me to grasp the whole.

My agenda view has headings that organize the entries in the todo file in the following sections: deadlines in the next 60 days, week tasks, priority tech epic, priority family epic, priority cultural epic, late tasks, backlog, 2024 goals, 2024 family goals, backlog projects.

I developed functionality to register every change to my todo.org so the CA would know what I'm doing. Here's an example of the logs generated when I edit it:


<p style="background-color: #ededed;">
 2024-10-19 13:11:39 | Deletion | line 1215: ***** TODO Tsting it | Heading hierarchy: Projects > Blog > My Posts > [[id:B8B78CC9-8C8F-49DD-99ED-0D9ECBEDDA40][A blog post]] about the Catalyst V1 and using it for 90 days > Testing it
 <br><br>
 2024-10-19 13:11:39 | Addition | line 1215: ***** TODO Modify it | Heading hierarchy: Projects > Blog > My Posts > [[id:B8B78CC9-8C8F-49DD-99ED-0D9ECBEDDA40][A blog post]] about the Catalyst V1 and using it for 90 days > Modify it
</p>

For the Org roam files, which is my knowledge base, I started by using git to channel the edits to the CA, which means it is less structured than the log above.

I clean the change logs after dumping them in the initial prompt or any routine. The Agent has a persistent memory, makes observations, and synthesizes them following Park (2023) [^fn1].

The Agent has also a "Passive routine", in which it reads my changelogs, reflect on them, and store on its memory. Here's an example of what it stored after the previous change in my to-do list.

<p style="background-color: #ededed;">
[PASSIVE] Passive Agent response to be saved: Luis made a minor but notable change in his to-do list today, specifically related to his blog post about the Catalyst V1. He deleted a task labeled "Tsting it" and replaced it with "Modify it." This reflects a shift towards refining and improving the content of his blog post, which aligns with his ongoing objective to write and enhance his blog. <br><br>

While the change is small, it indicates a focus on quality and clarity in his writing, which is essential for maintaining high standards in his work. There were no updates in his knowledge base, suggesting that his current focus is primarily on task management and content creation rather than new knowledge acquisition. Overall, this change demonstrates a commitment to improving the originality and quality of his written content.
</p>


There are three ways of interacting with it: via chat, manually triggering a routine, or getting the result of a proactive routine run.

The routines are prompt templates, which I call, and are delivered in a "Proactive Catalyst" buffer inside Emacs. When there is content, it shows the brain emoji in the mode line. Example:

<div align="center">
<figure>
	<a href="../../../images/cjt1/proactive-agent-example.png" name="The proactive catalyst buffer">
		<img  style="width:700px;margin:10px" src="../../../images/cjt1/proactive-agent-example2.png"/>
	</a>
		<figcaption>The Proactive Agent buffer cumulates the messages it sends to me. The notification is non invasive and the markdown view makes it cool.</figcaption>
</figure>
</div>

The chat leverages the [chatgpt-shell](https://github.com/xenodium/chatgpt-shell) package, so I get many base functionalities for free. Example:

<div align="center">
<figure>
	<a href="../../../images/cjt1/shell-interaction.png" name="Catalyst Agent Shell interaction">
		<img  style="width:700px;margin:10px" src="../../../images/cjt1/shell-interaction.png"/>
	</a>
		<figcaption>Talking directly to the Agent rarely revealed something interesting. It was mostly making me notice aspects of my Agenda, like the overdue task I had on evaluating my evolution on long term goals.</figcaption>
</figure>
</div>

The proactive catalyst and the catalyst shell could be one, but I couldn't find a quick way to combine them.

### Routines

The proactive routines should be triggered by an event. Currently, I only use the "continuous review," which I trigger every hour to check on potential changes in my Org roam notes. I planned to have the morning and evening routines also be proactive, but I'm manually triggering them until I'm happy with them.

- morning-outline: look into my goals and help me prepare my Agenda for the day;
- evening-close: reflect on what I've accomplished on the day
- continuous-review: review the changes in my knowledge base in terms of quality and originality;
- researcher-review: review as a researcher and provide references, and I replace in the template to run it for the fields of neuroscience, AI, evolutionary biology, analytic philosophy, systems thinking, and Greek philosophy;
- challenger-prompt: when I "A/B test" prompts I place the challenger here, so I keep comparing until I'm happy;
- zettelkasten-connection-suggestion: suggest connections to the other notes in my knowledge base;

### On the interactions 

#### It is unnatural to start a chat, but it is engaging when the Agent is proactive

It wasn't natural to trigger the Catalyst Shell and start a conversation when working. I tried to lower the barrier by activating MacOS's dictation, but its quality is inferior to the ChatGPT version.

I was excited by the brain emoji that would stick in my mode-line when the CA had something for me. Even after many disappointments, I was always eager to see, even to check it failing.

I consider defining more triggers and custom routines to get served more often.

#### I had very mixed results on Zettelkasten linking recommendation

Part of the CA chain contains the same retrieval I use for the Semantic Search. Still, there are other steps, like accessing our previous interactions. Many times, it will give me the same results, cite links that have already been made, and provide a shallow justification.

In the following case, Public Speaking was already linked to the entry about Cortisol.

<p style="background-color: #ededed;">
Sleep<br>
The recent changes focus on the impact of caffeine and mental stressors on cortisol levels, with references to public speaking and mental arithmetic. This is a well-trodden area in stress research. Can you provide a unique perspective on this? For instance, how might these stressors specifically affect your personal sleep patterns or productivity? Exploring this could add a personal dimension to the entry. <br><br>

Consider linking this with your entry on Public Speaking to explore how stress management techniques might mitigate these effects.
</p>

Others, it will connect to something the Semantic Search didn't return and make a literal citation of the note, which is neat. I requested a suggestion from the previous session, and this was the result:


<p style="background-color: #ededed;">
🤖 2024-10-18 12:01:21 <br>
Your reflections on the Catalyst Assistant (CA) and its interaction with you can be connected to several areas in your knowledge base: <br><br>

1. Habit Formation: Your mention of "triggering the Catalyst Shell" aligns with your understanding of habits as "automatic behavior triggered by situational cues." Consider exploring how establishing clear triggers could improve your interaction with the CA, similar to habit formation. This is discussed in your Habit document. <br><br>

2. Emotional Engagement: The excitement and disappointment you feel with the CA's performance can be linked to your insights on user experience in productivity tools. Reflecting on how these emotional responses impact your motivation could provide deeper insights, as noted in your User Experience in Productivity Tools entry. <br><br>

3. Feedback Mechanisms: The brain emoji as a notification mechanism ties into your understanding of situational awareness. This highlights the importance of feedback in maintaining engagement, as discussed in Situational Awareness, Aschenbrenner, L.. <br><br>

By exploring these connections, you can enhance your productivity and satisfaction with the CA. Consider defining more specific triggers and routines that align with your existing knowledge of habit formation and feedback mechanisms.
</p>


The continuous review routine also prompts potential connections. Somehow, it got "stuck" by suggesting always the same connection. I was writing on "My family philosophy", exploring how my wife and I want to live and the choices we need to make, and it insisted on suggesting I connect anything I was studying/writing to it! Even prompt engineering and risk:

<p style="background-color: #ededed;">
Consider linking this document to related entries in your knowledge base, such as Chain of thought for deeper insights into sequential thinking in prompts, and "The Family philosophy" to explore how structured prompts can align with broader strategic goals. <br><br>

... <br><br>

20201010211921-risk.org <br>
The recent changes introduce a definition of risk, emphasizing uncertainty and its impact on valued aspects like health and wealth. This is a foundational concept in risk management literature. Can you provide a unique perspective on this? For example, consider exploring how digital transformation influences risk perception and management in modern organizations. This could add depth and originality to your entry. <br><br>

Consider linking this with insights from "The Family philosophy" to explore how family-oriented risk management strategies might differ from corporate ones, especially in terms of values and priorities.
</p>

The recommendation part deserves a very structured module.

#### It is critical to my work in a shallow and unrooted way

The assistant simply says things that usually happen (lack of documentation, lack of clarity, etc.), but it needs to be more rooted in what is actually happening. A couple of times, it asked me to add something that was already there to the text.

It usually makes the same challenges, and after a while, it felt like a template for me. Most of the text below could be more interesting to me because it is the basic way it challenges me every time.

<p style="background-color: #ededed;">
... <br><br>

However, the entry currently lacks any personal reflections or connections to your existing projects. <br><br>

To enhance this entry, consider noting specific themes or ideas from the book that resonate with your current work or personal interests. This could provide a richer context for why this book is relevant to you. <br><br>

... <br><br>

To improve, consider summarizing the key points of the blog post and how they relate to your current projects or research. This could provide a clearer understanding of why this resource is valuable. <br><br>

For originality, consider exploring how the ideas presented in the blog post might be applied or tested in your own work. This is a common idea present in many machine learning discussions. Can you provide a unique perspective on this? For example, the challenge of accurately estimating model performance in dynamic environments is an unsolved problem in this area. Can you explore this further? <br><br>

...
</p>

By chance, it gets interesting sometimes. When taking notes about Fernando Pessoa's "The Book of Disquiet", it suggested covering how it would change with the digital age and virtual experiences, which I think would be interesting. Nonetheless, it always repeats the same general structure of saying, "...this theme is familiar... explore more personal views..."

<p style="background-color: #ededed;">
Prompt for originality: These themes are rich but familiar. Can you provide a unique perspective on how these ideas intersect with contemporary issues or personal experiences? For example, how might Bernardo Soares' views on travel and imagination apply to the digital age and virtual experiences?
</p>


#### When it is specific, it is awesome

A couple of great moments happened when it was specific and reminded me about something I'd suggest myself if I were reviewing for another person, but that commonly escapes from me since it is hard to detach from myself when writing and avoid mental auto-completing. When I was writing a workshop on [Conway's law and team boundaries](https://datascienceleadership.com/docs/technical-leadership/conway-law-team-boundaries), it reminded me people might not know about Spotify's org model, so I added a reference.

Examples:

<div style="background-color: #ededed; padding: 10px;">
    <ol>
        <li><strong>Content Adjustments</strong>:
            <ul>
                <li><strong>Quality Assessment</strong>: Minor adjustments were made to the text, such as fixing spacing issues and clarifying the example of an everyday team. These changes improve readability but are relatively minor.</li>
                <li><strong>Example</strong>: The change from "e.g., a squad" to "e.g., the Spotify's squad" adds specificity, which is helpful. However, it could be further improved by briefly explaining what a Spotify squad is for readers unfamiliar with the term.</li>
            </ul>
        </li>
    </ol>
</div>

The continuous proofreading gets hilarious sometimes because I use Org Roam for everything, including storing everyday recipes. So here's a critique about the carrot puree (and, of course, a recommendation to link it to the Family Philosophy). At the same time, it was a very nice review!

<p style="background-color: #ededed;">
20210111235722-food.org <br><br>
The recent addition of a recipe for "Purê de cenoura" is a good start, but it lacks depth. The entry provides a basic method involving carrots, garlic, and butter (or olive oil), but it could be improved by including more details on the cooking process, such as specific cooking times or tips for achieving the best texture. Additionally, consider exploring variations or complementary dishes that pair well with this purée. <br><br>

This is a common recipe found in many culinary sources. Can you provide a unique perspective on this? For example, you might explore how different spices or herbs could enhance the flavor profile, or how this dish fits into a broader dietary plan. <br><br>

Consider linking this entry with your knowledge base on "The Family philosophy" to explore how this recipe aligns with your family's dietary goals or traditions.
</p>

I'm still determining how I will evolve it. I could simply have a specialized on-demand routine for proofreading, which contains many subtasks, and keep specializing in technical, scientific, and creative writing. Still, the proactive part is always awesome because it doesn't let me write anything without a small review.

#### The hard-to-recognize hallucination

The LLM slips non-absurd invented facts into our conversations. For example, I had no project related to "advanced machine learning techniques".


<div style="background-color: #ededed; padding: 10px;">
    <p><strong>Example Projects</strong></p>

    <ul>
        <li><strong>Keep in Backlog</strong>:
            <ul>
                <li>"Write a Data Science Leadership book" (aligns with your professional development).</li>
                <li>"The Grandparents Biographies" (important for family engagement and storytelling).</li>
            </ul>
        </li>
        <li><strong>Store for Distant Future</strong>:
            <ul>
                <li>"Research on advanced machine learning techniques" (if not immediately relevant).</li>
                <li>"Explore new data visualization tools" (if you have other priorities).</li>
            </ul>
        </li>
    </ul>
</div>


When I requested further information, it clarified that it discussed a certain paper. But I was only reading it, not writing it. So, while it was specific about the other entries, it was generic about this one. It is hard to say if it referred to this paper from the beginning or just used it as an excuse when asked directly.

<p style="background-color: #ededed;">
You don't have a project specifically named "Research on advanced machine learning techniques." However, you are working on a paper titled "Estimating Model Performance Under Covariate Shift Without Labels," which involves advanced machine learning concepts. If you want to create a dedicated project for advanced techniques, consider how it might integrate with your current work or as a new entry in your knowledge base.
</p>

#### Formatting is flaky

In the Semantic Search and Q&A, I treated the Org Roam links to ensure they would work properly. In the CA, I only do it via the prompt. It means it gets it right around 70% of the time and takes me nowhere for others. It was neat when it worked at first, but now it is frustrating. I certainly need a specific step to ensure them.

The markdown format also varies greatly. Sometimes, it is very structured; others, it isn't.

#### Memory does not work as expected

I expected it to recall our previous conversations or my actions and bring them up when convenient. In the beginning, I had a small talk about my musical taste, and I'd restart the session and get back to that topic without issues. However, after a couple of months, it acted as if we never talked about music.

<p style="background-color: #ededed;">
Catalyst> Hey, considering our interactions, what do you know about my music taste?

I don't have specific details about your music taste from our interactions or your knowledge base. If you share more about your preferences, like favorite genres or artists, I can help explore connections or insights related to that!
</p>

## Conclusion

Currently, it is super mixed-feelings tool. It isn't as central to my workflow as the Semantic Search, but it is fun enough I keep fixing the bugs and tweaking it. I mapped a second large iteration, in which I will use agents and tooling instead of chains. The idea is to isolate better the use cases and get closer to useful modules by providing more structure.


## References

[^fn1]: Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). Generative agents: interactive simulacra of human behavior. arXiv preprint arXiv:2304.03442.

