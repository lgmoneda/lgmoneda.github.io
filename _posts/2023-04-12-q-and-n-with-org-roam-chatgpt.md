---
layout: post
title: "Q&A with Org roam using ChatGPT"
date: 2023-04-15
lang: en
ref: qnaorgroam
comments: true
toc: true
author: moneda
description: Make questions to Org roam notes and get answers with links to the source nodes
image: ../../../images/qnaorgroam/qna-org-roam-social.png
tags: emacs org-roam machine-learning
---


The ChatGPT generated an extremely convenient way to query anything. At first, it is impressive to query the model's internal knowledge.

It doesn't take long to  "train on top of ChatGPT" to insert a different knowledge base. However, it is not the current way of enabling interaction of ChatGPT with your own knowledge base. The most common method today is the "retrieval augmented chat", which means an information retrieval step is inserted between the user's interactions and the Chatbot.

This post will build a single-interaction Q&A with Org Roam using ChatGPT. It is highly based on the [langchain](https://python.langchain.com/en/latest/modules/chains/index_examples/qa_with_sources.html) example.

<div align="center">
<figure>
	<a href="../../../images/ssorgroam/chatgpt.png" name="tsne">
		<img  style="width:600px;margin:10px" src="../../../images/ssorgroam/chatgpt.png"/>
	</a>
		<figcaption>A single-interaction Q&A with the Org roam notes</figcaption>
</figure>
</div>

We will reuse parts of the [Semantic Search for Org roam](http://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html).

Before you move forward: if you just want to have something working, I'd recommend [Khoj](https://github.com/debanjum/khoj), which a friend of mine presented to me after the Semantic Search post. If you want to see code but at a higher level, you can use the [langchain's tutorial](https://python.langchain.com/en/latest/modules/chains/index_examples/vector_db_qa_with_sources.html). If you want a full-featured corporate solution, look to the [chatgpt-retrieval-plugin](https://github.com/openai/chatgpt-retrieval-plugin) by OpenAI. If you want simply interact with vanilla ChatGPT inside Emacs, check [org-ai](https://github.com/rksm/org-ai) and [chatgpt-shell](https://github.com/xenodium/chatgpt-shell). If you see yourself tweaking these things to adapt to your data and use cases, move on! You might learn a thing or two that will be helpful for your explorations.

<div align="center">
<figure>
	<a href="../../../images/qnaorgroam/qna-org-roam.png" name="qna with org-roam">
		<img  style="width:450px;margin:10px" src="../../../images/qnaorgroam/qna-org-roam.png"/>
	</a>
		<figcaption>Playing Q&A with Org roam.</figcaption>
</figure>
</div>


## Overview

The full code is in the [qna-org-roam](https://github.com/lgmoneda/qna-org-roam) repository.

1. Build a knowledge base using a vector database with Org roam nodes split into chunks
2. Create a prompt with instructions for the Q&A
3. Feed the prompt with knowledge retrieved from the user query
4. Send the prompt to ChatGPT
5. Post-process ChatGPT output to include the source Org roam nodes
6. Display it in an Emacs buffer

<div align="center">
<figure>
	<a href="../../../images/qnaorgroam/diagram.svg" name="diagram">
		<img  style="width:700px;margin:10px" src="../../../images/qnaorgroam/diagram.png"/>
	</a>
		<figcaption> </figcaption>
</figure>
</div>

The library versions:

```
langchain==0.0.101
openai==0.27.0
orgparse==0.3.2
matplotlib-inline==0.1.6
numpy==1.23.5
pandas==1.5.2
sentence-transformers==2.2.2
scikit-learn==1.1.3
```

## The knowledge base for retrieval

I assume you have your org-roam nodes data in a pandas DataFrame as described in the [previous post](http://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html) [^fn1]. First, create a new vector database:

```python
from langchain.vectorstores import Chroma
from langchain.docstore.document import Document
from langchain.embeddings import OpenAIEmbeddings

persist_directory = "/paht/to/db-org-roam-nodes-openai-qna"

embedding = OpenAIEmbeddings(openai_api_key="<your-openai-key>")
vectordb = Chroma("langchain_store", embedding_function=embedding, persist_directory=persist_directory)
```

In this case, we don't want to represent every Org roam node as a single embedding. Since we want to provide a couple of excerpts to ChatGPT work on top, it is better to break our nodes into pieces. Notice the input token size of the embedding model Ada02 is 8192, while ChatGPT (gpt-3.5-turbo) accepts 4018. If we explored this large input size, it would be an issue to retrieve a node's text to provide context. GPT-4 has a version with a 32k input tokens size, which will let us either provide longer excerpts or more pieces from our notes. Even in the current context, that's a design choice you can play with: do you prefer to provide longer texts as input or more pieces potentially coming from different nodes?


```python
from langchain.text_splitter import CharacterTextSplitter

text_splitter = CharacterTextSplitter(chunk_size=300, chunk_overlap=0)

for index, row in roam_nodes_df.iterrows():
    org_id = row["node_id"]
    title = row["node_title"]
    file_name = row["file_name"]
    node_hierarchy = row["node_hierarchy"]
    if type(row["node_text_nested_exclusive"]) == float:
        texts = [""]
    else:
        texts = text_splitter.split_text(row["node_text_nested_exclusive"])
    texts = ["[" + node_hierarchy + "] " + text for text in texts]
    metadatas = [
        {
            "source": f"{index}-{i}",
            "ID": org_id,
            "title": title,
            "hierarchy": node_hierarchy,
            "file_name": file_name,
        }
        for i in range(len(texts))
    ]
    ids = [f"{index}-{i}" for i in range(len(texts))]
    vectordb.add_texts(texts, metadatas=metadatas, ids=ids)

vectordb.persist()
```

To play with the size of the text chunks produced from your org nodes, edit the `chunk_size`. There are other [text splitters](https://python.langchain.com/en/latest/reference/modules/text_splitter.html) available in langchain. For example, a Python code splitter. I have noticed the Character splitter will frequently split code blocks I have in my notes in two. A good text splitter for Org mode taking advantage of `orgparse` is something I'd love to see happening!

```python
import nltk
nltk.download('punkt')

from langchain.text_splitter import NLTKTextSplitter
text_splitter = NLTKTextSplitter(chunk_size=400, chunk_overlap=0)
```

Notice we also have a condition on the `node_text_nested_exclusive` being a float. What happens is that I frequently have empty Org roam nodes (the content becomes a `nan`). E.g., I'd create a node related to a feeling, not describe it, but link it in many places. It is a workaround, a bad practice I wish I overcome soon. Who knows if not by asking my Org roam assistant: "Which notes need attention?". Or getting a proactive call from it like "What about filling the note X?".

## The prompt engineering

The prompt will accomplish a few things:

1. Set a "mode" for ChatGPT as a personal assistant;
2. Use in-context learning to improve the accuracy of ChatGPT in performing the task;
3. Provide meaningful excerpts from our knowledge base.

The full code for the prompts is [here](https://gist.github.com/lgmoneda/df3d9725b2abcd6a2e0824bf792b89ee). It is highly based and completely re-uses the in-context learning part from [langchain tutorial](). Let's check it part by part.

First, we set the mode and provide basic information. I give it my name, so it can recognize it when it sees it in the notes. We also make it clear it needs to use the knowledge provided from the knowledge base instead of using its own. It is the main part of using ChatGPT over a specific knowledge base. I also provide the current date to enable it to reset its internal state of "today" and don't treat events with a date after 2021 as from the future.

```
My name is Luis Moneda. You are my personal assistant. Given the following extracted parts of long documents from my personal notes and a question, create a final answer with references ("SOURCES").
The document's content will be preceded by its heading hierarchy inside brackets, which you should use to get context.
If you don't know the answer, just say that you don't know. Don't try to make up an answer.
ALWAYS return a "SOURCES" part in your answer that only contains numbers. Today is {}.
```

The following part is the "In-context learning", one of the most exciting parts of LLMs, which is teaching or fine-tuning the model by providing 1-5 examples in the prompt and expecting it to generalize in the following. In our example, the task is to get a couple of sentences from documents and form a final answer based on them, listing which documents it has consulted. You can adapt it to our more specific case by adding the heading hierarchy of the content in brackets before the actual content and answering it yourself. Even though I didn't adapt it, it works well.

```
QUESTION: Which state/country's law governs the interpretation of the contract?
=========
Content: This Agreement is governed by English law and the parties submit to the exclusive jurisdiction of the English courts in  relation to any dispute (contractual or non-contractual) concerning this Agreement save that either party may apply to any court for an  injunction or other relief to protect its Intellectual Property Rights.
Source: 28-pl
Content: No Waiver. Failure or delay in exercising any right or remedy under this Agreement shall not constitute a waiver of such (or any other)  right or remedy.

11.7 Severability. The invalidity, illegality or unenforceability of any term (or part of a term) of this Agreement shall not affect the continuation  in force of the remainder of the term (if any) and this Agreement.

11.8 No Agency. Except as expressly stated otherwise, nothing in this Agreement shall create an agency, partnership or joint venture of any  kind between the parties.

11.9 No Third-Party Beneficiaries.
Source: 30-pl
Content: (b) if Google believes, in good faith, that the Distributor has violated or caused Google to violate any Anti-Bribery Laws (as  defined in Clause 8.5) or that such a violation is reasonably likely to occur,
Source: 4-pl
=========
FINAL ANSWER: This Agreement is governed by English law.
SOURCES: 28-pl
```

We close the prompt with the block that will receive the knowledge-base content and a request to ChatGPT to answer the final question.

```
PROMPT_QUESTION = """
QUESTION: {}
=========
"""

PROMPT_CONTENT = """
Content: {}
Source: {}

"""

PROMPT_POST = """
=========
FINAL ANSWER:
"""
```

## The ChatGPT Q&A API

We must build a wrapper around OpenAI's ChatGPT API to add the last pieces to the request. The most relevant documents are retrieved from the knowledge base, which we use to build the prompt. After getting the answer from ChatGPT, there is a bit of post-processing for the result to add Org links. The rest of the code is in the [repository](https://github.com/lgmoneda/qna-org-roam).


```
class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        search_input = urllib.parse.unquote(self.path.split("/api/>")[-1])

        ### Retrieve docs from the knowledge base
        retrieved_docs = vectordb.similarity_search(search_input, k=8)

        ### Build prompt
        prompt_content = ""

        for ith, doc in enumerate(retrieved_docs):
            prompt_content += PROMPT_CONTENT.format(doc.page_content, ith)

        complete_input_prompt = PROMPT_PRE + PROMPT_QUESTION.format(search_input) + \
            prompt_content + PROMPT_POST


        response = chat_gpt(complete_input_prompt)
        answer_content = response["choices"][0]["message"]
        response_str = post_process_answer(answer_content.content, retrieved_docs)
        self.wfile.write(response_str.encode())
```

## Connecting Emacs to the ChatGPT


To generate the interactive interface, we will create a minor mode for a chat that enables us to map Return to send a message to our chat API and display its result.

```elisp
(define-minor-mode chat-minor-mode
  "A minor mode to send chat messages to API."
  :init-value nil
  :lighter " Chat"
  :keymap (let ((map (make-sparse-keymap)))
            (define-key map (kbd "RET") 'exchange-with-chat-api)
            map))
```

Now we generate a buffer with our minor mode.

```elisp
(defun q-n-a-with-org-roam ()
  "Create a temporary buffer in org mode for chatting with an API."
  (interactive)
  (let ((buf (get-buffer-create "*Q&A Org-roam*")))
    (switch-to-buffer buf)
    (org-mode)
	(chat-minor-mode)
    (erase-buffer)
    (insert "#+TITLE: Q&A with org-roam\n\n")
    (goto-char (point-max))
    (insert "Type your message here:\n> ")
    (goto-char (point-max))
	))
```

Finally, we need to send the request and display the answer from our chat API. I also included the `insert-string-simulating-typing` function to make it an experience!

```elisp
(defun insert-string-simulating-typing (string)
  "Inserts STRING into the current buffer simulating typing."
  (interactive "sEnter string to insert: ")
  (let ((delay 0.03)) ; adjust this delay as desired
    (dolist (char (append string nil))
      (insert char)
      (sit-for delay))))

(defun call-python-server (input-string)
  "Call Python server with INPUT-STRING and return the output string."
  (let ((url-request-method "GET")
        (url-request-extra-headers
         '(("Content-Type" . "text/plain"))))
    (with-current-buffer
        (url-retrieve-synchronously (concat "http://localhost:8800/api/" input-string))
      (goto-char (point-min))
      (search-forward-regexp "\n\n")
      (buffer-substring (point) (point-max)))))

(defun exchange-with-chat-api ()
  "Send the current message to the API and display the response."
  (interactive)
  (let* ((message (buffer-substring-no-properties (line-beginning-position) (line-end-position)))
         (response (call-python-server message)))
    (goto-char (point-max))
    (insert "\n\n")
    (setq result (split-string-at-substring response "SOURCES:"))
    (insert-string-simulating-typing (nth 0 result))
    (if (nth 1 result)
		(insert (decode-coding-string (nth 1 result) 'utf-8)))
    (goto-char (point-max))
    (insert "\n\n> ")))
```

## Limitations and where to tweak for improvement

I would recommend inspecting the final prompt. You will probably get frustrated with how the document content is split to be provided to ChatGPT. There is a large room for improvement there, and it is a part I've been working on. Another thing is the asymmetric/symmetric search part. A question is more similar to a different way of asking it than its answer. One example of both issues is when I ask: "What are metrics to evaluate a machine learning model?"

One of the document parts provided is:

```
Content: [The Meta field guide to Machine Learning, Zeldin, O. > Online experimentation of ML systems] How do we measure the impact our ML system have in the real world?
Source: 2
```
It is literally the intro to the relevant content I want. So I wish it wasn't isolated in a chunk! At the same time, I understand the question is very similar to what I did, more than it is to the answers in my notes.

Another lousy case in this same question.

```
Content: [Machine Learning Model > Model architecture] The structure of the Machine Learning model.
Source: 0
```

Then it makes the ChatGPT start the answer with:

> Metrics to evaluate a machine learning model include the structure of the model...

While it is not that related to model evaluation. The ChatGPT will assume the text extracts are relevant; if they are not, the answer will sound weird.

You might also get a lot of extracts from the same source. Newer `langchain` versions offer a different search method: `max_marginal_relevance_search`. It works in two steps. First, it retrieves `fetch_k` similar documents, then extracts `k` most diverse among them. You can replace the `similarity_search` method with it.

### Making it a chat

We are doing a single exchange with ChatGPT, which does not leverage the conversational part of it. One can modify it to keep the context of the previous questions and answers. Keep the user inputs and ChatGPT answers in a messages list and append it to every new user input and ChatGPT answer, following [this format](https://platform.openai.com/docs/guides/chat):

```
messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
```

One could extend and make it a conversation on top of the same topic until a keyword or command is given (like the "clear" used in the `chatgpt-shell` package).

## Next steps

One of the directions to explore is the plug-in design. [Plug-ins](https://openai.com/blog/chatgpt-plugins) is how OpenAI has been expanding ChatGPT capabilities and one of the possibilities to make ChatGPT more of an intelligent switcher to the right tool available and enable it to act. In our search to leverage Zettelkasten, specifically the Org roam implementation, the question becomes: which capabilities should we offer to make ChatGPT the best companion for the many things one can use Org roam for?

In "Sparks of artificial general intelligence: early experiments with GPT-4" [^fn5], there's a section called "Interaction with the world" in which tool usage is explored. The following excerpt provides an idea of how it happens. It comes from Figure 5.4:

```
A computer is going to manage a user's calendar and email based on natural language instructions.
To do so, it would need access to the following API functions:
- CALENDAR.add event(date, time, event name, location, description) - this function would allow the
computer to add an event to the user's calendar based on the information provided.
- CALENDAR.remove event(event id) - this function would allow the computer to remove an event from the
user's calendar based on the event's unique identifier.
- CALENDAR.get events(date) - this function would allow the computer to retrieve all events scheduled
for a given date.
- CALENDAR.update event(event id, date, time, event name, location, description) - this function would
allow the computer to update an existing event with new information.
- EMAIL.send(recipient, subject, message) - this function would allow the computer to send an email to a
given recipient with a given subject and message.
- EMAIL.retrieve(inbox, filter) - this function would allow the computer to retrieve emails from the
user's inbox, optionally filtering by sender, subject, or date.
- USER.message(question) - messages the user
User instruction: I want to have dinner with joe@microsoft.com and luke@microsoft.com at Contoso
restaurant (their email is reservations@contoso.com) this week. Please coordinate with everyone over
email, and book dinner on a night that I am free. Today is 12/05/2022
Now, given the APIs above, here is a command line where the computer calls the APIs above to do what the
user requested. The computer only calls API functions and gets responses.<|endofprompt|>
```

Feel free to reach out if you are exploring this field for Org roam.

## References

[^fn1]: Moneda, Luis, [Semantic Search for Org roam](http://lgmoneda.github.io/2023/04/08/semantic-search-for-org-roam.html), Blogpost at lgmoneda.github.io, (2023).
[^fn5]: Bubeck, Sébastien, Chandrasekaran, V., Eldan, R., Gehrke, J., Horvitz, E., Kamar, E., Lee, P., et al, (2023). Sparks of artificial general intelligence: early experiments with gpt-4. [arXiv preprint](https://arxiv.org/abs/2303.12712) arXiv:2303.12712.
