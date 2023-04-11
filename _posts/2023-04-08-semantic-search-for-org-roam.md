---
layout: post
title: "Semantic Search for Org roam"
date: 2023-04-08
lang: en
ref: ssorgroam
comments: true
toc: true
author: moneda
description: Creating a Semantic Search functionality to improve search, thinking, and writing with Org roam.
image: ../../../images/ssorgroam/magic-org-roam-social.png
tags: emacs org-roam machine-learning
---

## The Struggle when the Zettelkasten method

We all dive into Zettelkasten Method looking for a structure to empower our creativity. However, our cognition gets in the way at some point. From a previous post [^fn1]:

> I've been using org-roam for a while. It applies the Zettelkasten method to Emacs. In summary, it is a note-taking system in which you link notes. The start is fascinating; you make many connections and remember every note. However, as you add more notes, it gets harder to connect or to remember you have a useful note when living a specific situation [^fn2] . The knowledge creation-application gap will start to increase. After 2.5y, I have 3.4k notes. It becomes non-trivial to connect and apply.

<div align="center">
<figure>
	<a href="../../../images/rel-rev/my-org-roam-bg.png" name="intro">
		<img  style="width:450px;margin:10px" src="../../../images/rel-rev/my-org-roam-bg.png"/>
	</a>
		<figcaption> A zoom-out of my knowledge graph. As the number of my notes grew, I was less certain I would be able to retrieve the right one at the most convenient moment. </figcaption>
</figure>
</div>

In [December 2022](https://org-roam.discourse.group/t/a-demo-of-ai-for-linking-writing-and-thinking-with-org-roam-should-we-build-org-roam-ai/2891), I experimented semantic search for my [Org roam](https://www.orgroam.com/) nodes and the results have been satisfactory. The three main usages are:

1. Searching a node when I don't remember its title and there is no strong key-word to find it;
2. Read my knowledge base when I'm thinking about a subject for work, research, or dialogue;
3. To support me when writing an article or a node, making it easier to connect to existing nodes.

In this post, I will share how to use Large Language Models (LLM) to represent your Org-roam nodes, both with OpenAI offerings and open source models. I will focus on the nodes as the most granular entity, but I will provide directions to expanding it to a general search over your roam files, and explore it in future posts.

<div align="center">
<figure>
	<a href="../../../images/ssorgroam/org-roam-search.gif" name="demo">
		<img  style="width:700px;margin:5px" src="../../../images/ssorgroam/org-roam-search.gif"/>
	</a>
		<figcaption>Using the search over the previous blog post.</figcaption>
</figure>
</div>

Since I did the post in Org-roam discourse, I wondered if I should find people to collaborate and make it a package, but I realized things were moving too fast so I decided to keep playing while I learn my product needs and new supporting packages are released. It was a great decision! I've found [langchain](https://github.com/hwchase17/langchain), which makes it really easy to explore LLMs.  Even OpenAI released a plug-in for this use case: [openai/chatgpt-retreival-plugin](https://github.com/openai/chatgpt-retrieval-plugin). The system in this post is very simple, but hopefully useful for those who will keep playing with their raw data and LLMs.

## Overview

1. Go through every org file in the org-roam directory and break them into org nodes;
2. Build a dataset with their id, content, and other metadata;
3. Transform them into embeddings and store in a vector DB;
4. Create a local server to enable querying the vector DB;
4. Query them from Emacs using the API;
5. Display the results in a Emacs buffer.

<div align="center">
<figure>
	<a href="../../../images/ssorgroam/diagram.svg" name="diagram">
		<img  style="width:700px;margin:10px" src="../../../images/ssorgroam/diagram.png"/>
	</a>
		<figcaption> A simple representation of the procress. Though we don't learn from data and fit curves, I still like to split into a "learning stage". </figcaption>
</figure>
</div>

The library versions:

```
adjustText==0.7.3
langchain==0.0.101
openai==0.27.0
orgparse==0.3.2
matplotlib-inline==0.1.6
numpy==1.23.5
pandas==1.5.2
sentence-transformers==2.2.2
scikit-learn==1.1.3
```

## The data
Since the Org-roam database does not offer the actual content of the nodes, we will read directly from the Org files.

First, we list the Org files from the Org roam folder. Use the *BANNED_LIST* to avoid using files you are uncomfortable manipulating or exposing. I will offer an alternative local solution with an open-source model. Still, if you use OpenAI or other vendors, you need to be comfortable sending it around. OpenAI's terms of service state that it deletes data transmitted via its API after 30 days and is not used to improve its models. This code should give you the list of your org-roam files:


```python
import os
import glob

ROAM_PATH = "/your/path/to/org-roam/files"
BANNED_FILES = {"my_journal",
                "personal_finances"}

def get_all_files_in_a_folder(full=False):
    # Use os.path.join() to safely join file paths
    path = os.path.join(ROAM_PATH, "**/*.org")

    # Use set operations to filter out unwanted files
    files = set(glob.glob(path, recursive=True))
    files = files.difference(set(f for f in files if any(word in f for word in BANNED_FILES)))

    if not full:
        # Use os.path.basename() to get just the file name
        files = [os.path.splitext(os.path.basename(file))[0] for file in files]

    return files

```



To create a dataset from the notes, we will use [orgparse](https://github.com/karlicoss/orgparse). The library offers convenience for navigating Org files and exploring its structure.

If you follow Zettelkasten Principles, your nodes should be relatively small. However, there are nested nodes for those using org-roam v2. The code provided extract content in three different ways:

- `node_text`: it is only the text on that Org heading. It does not include children's headings' content;
- `node_text_nested`: it consists of the title and body of all the children's headings;
- `node_text_nested_exclusive`: the same as `node_text_nested`, but we exclude the content from children headings that are org roam nodes.

The content I will embed will be the `node_text_nested_exclusive`. I've also added a property to org headings I want to exclude from it by adding the following under an org heading:

```
:PROPERTIES:
:SEARCH: ignore
:END:
```

It is a better practice to split the text further, but we will keep the objective of transforming every node into a single representation. More about it in the [Directions to make different design choices](/2023/04/08/semantic-search-for-org-roam.html#directions-to-make-different-design-choices).

```python
import orgparse
import pandas as pd
import re

def org_roam_nodes_to_dataframe(org_file):
    # Load the org file into an OrgData object
    org_data = orgparse.load(org_file)

    # Define a function to extract the title of a node
    def extract_title(node):
        if node.heading:
            # If the node has a heading, return it
            return node.heading
        else:
            # Otherwise, extract the title from the org file using a regular expression
            title_pattern = re.compile(r'^#\+title:\s*(.*)$', re.IGNORECASE)
            match = title_pattern.search(node.body)
            if match:
                return match.group(1)
            else:
                # If the title is not found, extract it from the first line of the body
                return re.sub(r"#\+title:",
				"",
				node.body.split("\n")[0], flags=re.IGNORECASE).strip()

    # Define a function to recursively extract the bodies of a node and its descendants
    def extract_node_nested_body(node):
        body = node.body
        for child in node.children:
            body += '\n' + child.level * "*" + " " + child.heading + "\n" + \
			extract_node_nested_body(child)
        return body.strip()

    # Define a function to recursively extract the bodies of a node
	# and its descendants when they are not other nodes
    def extract_node_nested_body_exclusive(node):
        body = node.body
        for child in node.children:
            if not child.properties.get('ID') and not child.properties.get('SEARCH'):
                body += '\n' + child.level * "*" + " " + child.heading + "\n" + \
				extract_node_nested_body_exclusive(child)
        return body.strip()

    # Define a function to build the hierarchy of a node
    def build_node_hierarchy(node):
        hierarchy = [extract_title(node)]
        parent = node.parent

        # while parent and parent != org_data[0]:
        while parent:
            hierarchy.append(extract_title(parent))
            parent = parent.parent
        return ' > '.join(reversed(hierarchy)).strip()

    # Define a function to convert a node to a dictionary
    def node_to_dict(node, file_name):
        node_dict = {
            'file_name': file_name,
            'node_id': node.properties.get('ID'),
            'node_title': extract_title(node),
            'node_hierarchy': build_node_hierarchy(node),
            'node_text': node.body,
            'node_text_nested': extract_node_nested_body(node),
            'node_text_nested_exclusive': extract_node_nested_body_exclusive(node),
        }

        return node_dict

    # Create a list of all org-roam nodes in the OrgData object
    nodes = [node_to_dict(node, org_file) for node in org_data[0][:] if node.properties.get('ID')]

    return pd.DataFrame(nodes)
```


The following code will generate a pandas DataFrame from your Org roam nodes.

```python
org_files = get_all_files_in_a_folder(full=True)

roam_nodes_df = pd.concat([org_roam_nodes_to_dataframe(org_file) for org_file in org_files])
```

We can still clean-up a little bit the data.

```python
roam_nodes_df["text_to_encode"] = (
    roam_nodes_df["node_text_nested_exclusive"]
    .astype(str)
    .str.replace("#\+filetags:", "tags:")
    .str.replace("#\+title:", "title:")
    .str.replace("#\+STARTUP: inlineimages latexpreview", "")
)

```

And we finally generate the text we will encode. I add the heading hierarchy since the way I nest information makes it necessary to provide the full meaning of a node.

```python
roam_nodes_df["text_to_encode"] = (
    "[" + roam_nodes_df["node_hierarchy"] + "] " +
    roam_nodes_df["text_to_encode"].astype(str)
)
```
## Embeddings and the vector database

An Embedding is a vector representation of a larger instance of information. With LLM, people are getting used to transforming text into embeddings, but you can make the same with images or tabular data. The idea is that you are compressing information into a fixed space (e.g., 1512 dimensions), which enables you to compare different pieces of information using operations over with vectors.

OpenAI offers embedding models, and we will use the `text-embedding-ada-002` (the default model for langchain, but also the best value for the money today). They price it by the token. Ada02 is priced at $0.0004 for 1k tokens. A token is more granular than a word. The rule of thumb is that `1 token = 0.75 words`. OpenAI has a library to tokenize text so one can know how many tokens are needed. The Ada02 model accepts an input of 8192. That's a lot. It could encode all my Org roam nodes except for a few misusages of Org roam I do.

Let's first check how much we can expect to pay if we embed the org-roam nodes.

```python
import tiktoken

TOKENS_PACK = 1000
COST_PER_TOKEN = 0.0004

encoding = tiktoken.get_encoding("cl100k_base")
tokens_per_text = roam_nodes_df["text_to_encode"].apply(encoding.encode).apply(len)

total_tokens = tokens_per_text.sum()
total_cost = total_tokens / TOKENS_PACK * COST_PER_TOKEN

print(total_cost)
```

I have 3.5k notes, and using the "node_text_nested_exclusive" will cost me ~$0.12. It is very reasonable.

Remember, you can't mix embeddings. An embedding is a very particular way a model has to represent data. It has a consistency between the representation of different objects by the same model, but there is no expected consistency between different embedding models.

We will use `langchain` wrappers around the Chroma Vector database. First, we create a new vector database.

```python
from langchain.vectorstores import Chroma
from langchain.docstore.document import Document
from langchain.embeddings import OpenAIEmbeddings

persist_directory = "/path/to/the/db-org-roam-nodes-openai"

embedding = OpenAIEmbeddings(openai_api_key="<your-open-ai-key>")
vectordb = Chroma("langchain_store", embedding_function=embedding, persist_directory=persist_directory)
```

Now we can add our org roam nodes to it. The first argument is the text it will encode using the embedding. The Metadata will generate the link and other info we will display in the results buffer. Since we are not building a full solution that can update the nodes as they are updated, the "ids" argument is irrelevant.

```python
vectordb.add_texts(list(roam_nodes_df["node_text_to_encode"].values),
                   metadatas=[{"ID": roam_nodes_df.iloc[i]["node_id"],
                               "title": roam_nodes_df.iloc[i]["node_title"],
                               "hierarchy": roam_nodes_df.iloc[i]["node_hierarchy"],
                               "file_name": roam_nodes_df.iloc[i]["file_name"]} for i in range(len(roam_nodes_df))],
                   ids=list(roam_nodes_df["node_id"]))

vectordb.persist()
```

You can test it in a jupyter notebook:

```python
input_prompt = "A machine learning model is degrading. Its performance has been dropping since it was released. What are the possible reasons for it?"
search_results = vectordb.similarity_search_with_score(input_prompt, k=10)
search_results
```

## The local server

A local Python server is a straightforward and convenient way to serve your search. The database doesn't get large since most people cannot generate that much text data from personal notes. And it is way faster than running it as a script on demand.

```python
import urllib.parse
import re

from http.server import BaseHTTPRequestHandler, HTTPServer
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma


class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        # Input
        request_str = urllib.parse.unquote(self.path.split("/api/")[-1])
        print(request_str)

        # Retrieve docs
        search_results = vectordb.similarity_search_with_score(request_str, k=15)
        retrieved_docs = sorted(search_results, key=lambda x: x[1], reverse=True)
        org_link_format = "[%.2f]: [[id:%s][%s]] \n %s"
        docs = [org_link_format % (score, doc.metadata["ID"],
		                           doc.metadata["title"].strip(),
	                                   doc.metadata["hierarchy"].strip())
                                 for doc, score in retrieved_docs]

        # Format the output
        response_str = f"#+title: Most similar nodes \n\n:QUERY:\n{request_str} \n:END:\n\n"
        for i, source in enumerate(docs):
            response_str += "* " + source + "\n"

        print(response_str)
        self.wfile.write(response_str.encode())

def run_server():
    server_address = ('', 8800)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f'Server is running on port {server_address[1]}')

    httpd.serve_forever()

if __name__ == '__main__':
    persist_directory = "the/path/to/your/vector-db"
    embedding = OpenAIEmbeddings(openai_api_key="<your-openai-key>")

    vectordb = Chroma("langchain_store",
              embedding_function=embedding,
              persist_directory=persist_directory)
    run_server()

```

## The Emacs interface

To use it from Emacs, we will create a function to make the request to our server and another that deals with its input and output.

```elisp
(defun call-roam-search-python-server (input-string)
  'Call Python server with INPUT-STRING and return the output string.'
  (let ((url-request-method "GET")
        (url-request-extra-headers
         '(("Content-Type" . "text/plain"))))
    (with-current-buffer
        (url-retrieve-synchronously (concat "http://localhost:8800/api/" input-string))
      (goto-char (point-min))
      (search-forward-regexp "\n\n")
      (buffer-substring (point) (point-max)))))
```

```elisp
(defun org-roam-semantic-search-api ()
   'Call the semantic-search API on a selected region or ask for an input. Display its output in a org buffer.'
    (interactive)
	(let* ((text (if (use-region-p)
           (buffer-substring-no-properties (region-beginning) (region-end))
		   (read-string "Enter search: ")))
		   (buf (get-buffer-create "*org-roam-similar-nodes*"))
		   (api-output (call-roam-search-python-server text)))
	  (with-current-buffer buf
		(erase-buffer)
		(org-mode)
		(insert (format "%s" api-output))
		(org-shifttab)
		(display-buffer buf))
	  )
	)
```


I map the `org-roam-semantic-search-api` together with other org-roam commands as `C-c n a` so it becomes part of my usual flow.

Now, you should be able to M-x while selecting a portion of text or entering an input for it, and see the screen we have shown in the intro with related org-roam nodes!

<div align="center">
<figure>
	<a href="../../../images/ssorgroam/maigc-org-roam.png" name="tsne">
		<img  style="width:550px;margin:2px" src="../../../images/ssorgroam/magic-org-roam.png"/>
	</a>
		<figcaption>A magic Org roam!</figcaption>
</figure>
</div>

## Directions to make different design choices

### Using an open-source model

The OpenAI model is convenient because it accepts many tokens as input (8192), is high quality, doesn't run locally (which makes it fast), and is not expensive. However, there are open-source options, and there will be many soon.

For those that don't want to see their data going around, one option to run locally is the `sentence-transformers` library.

However, if we keep the design choice of having every Org roam node represented by a single vector, we must use a workaround since their best model can accept 382 input tokens.

[Here](https://gist.github.com/lgmoneda/f54575eebaa8932ca926f5d0526e8a31) I provide a couple of functions to embed a list of documents. The functions will split a single document into sentences and use the maximum input token of the model to aggregate as many sentences as possible and form chunks. Then it will average the embeddings of all the chunks from a single document. That's the approach I've used for the Org-roam discourse post.


### Breaking the Org roam nodes into chunks

A more promising direction is to split text further and don't treat the Org roam node as the most granular entity of your knowledge base. When playing with augmented retrieval and ChatGPT over my Org roam notes, I need to split it to provide many different text pieces to ChatGPT.

The following code shows the Vector DB ingestion part with a loop that breaks Org roam nodes into multiple texts.

```python
from langchain.text_splitter import CharacterTextSplitter

text_splitter = CharacterTextSplitter(chunk_size=300, chunk_overlap=0)

for index, row in data.iterrows():
    org_id = row["node_id"]
    title = row["node_title"]
    file_name = row["file_name"]
    node_hierarchy = row["node_hierarchy"]
    texts = text_splitter.split_text(row["node_text_recursive"])
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
```

### Plotting the relationship between the different nodes

In my original post in Org-roam discourse, an image displayed the returned nodes in a 2d representation. It is intended to let you spot the relationship between them, so one should be able to spot a few clusters on the image. E.g., if you colored the data points using their tags, we should see nodes with the same color closer in the plot.

We need to retrieve the vectors from the similarity search to make it. Currently, langchain doesn't expose them on Chroma, but we can create a modified search function to do it.

```python
from typing import List, Tuple

def similarity_search_with_embeddings(
    vectordb,
    query: str,
    k: int = 4,
    filter: Optional[Dict[str, str]] = None,
    ,**kwargs: Any,
):
    """Run similarity search with Chroma and return labels, embeddings and scores of top k results.

    Args:
        query (str): Query text to search for.
        k (int): Number of results to return. Defaults to 4.
        filter (Optional[Dict[str, str]]): Filter by metadata. Defaults to None.

    Returns:
        Labels (List), Embeddings (List), Scores (List)
    """
    query_embedding = vectordb._embedding_function.embed_query(query)
    results = vectordb._collection.query(
        query_embedding,
        n_results=k,
        where=filter,
        include=["metadatas", "documents", "distances", "embeddings"], **kwargs
    )

    return [d["title"] for d in results["metadatas"][0]], results["embeddings"][0], results["distances"][0]
```

With a list of labels, embeddings, and scores (colors), we can call a function to give us that plot.

```python
import matplotlib.pyplot as plt
import numpy as np

from sklearn.manifold import TSNE
from adjustText import adjust_text

def plot_vectors(vectors, labels, colors):
  shorten_labels = []
  for label in labels:
      if len(label) > 30:
          label = label[:30] + "..."
      shorten_labels.append(label)
  labels = shorten_labels
  # Project the vectors into two dimensions using t-SNE
  tsne = TSNE(n_components=2,
              perplexity=5)
  projected_vectors = tsne.fit_transform(np.array(vectors))

  # Create a colormap with different shades of purple
  cmap = plt.get_cmap("winter")
  plt.figure(figsize=(12, 12))
  # Plot the projected vectors with different shades of purple
  plt.scatter(projected_vectors[:, 0], projected_vectors[:, 1], c=colors, cmap=cmap)

  # Add labels to the plot using ajustText
  texts = []
  for label, x, y in zip(labels, projected_vectors[:, 0], projected_vectors[:, 1]):
    text = plt.annotate(label, xy=(x, y), fontsize=15)
    texts.append(text)
  adjust_text(texts)

  plt.savefig("path/to/the/output.jpg")
```

Now you can modify the API output to include a link to the image: `[[file:/path/to/the/output.jpg]]`. In Elisp, remember to toggle the image display so you can see it. Add `(org-display-inline-images nil t)` to the end of the `org-roam-semantic-search-api`.

<div align="center">
<figure>
	<a href="../../../images/ssorgroam/tsne.jpg" name="tsne">
		<img  style="width:550px;margin:2px" src="../../../images/ssorgroam/tsne.jpg"/>
	</a>
		<figcaption>The green dots are the most similar to the query. Their proximity to each other should enable the user to visually cluster subjects in the results.</figcaption>
</figure>
</div>

## Next steps

We can improve the search and thinking experience by providing a conversational interface with ChatGPT to do Questions & Answers based on the knowledge in Org roam, including the nodes it has used as sources.

<div align="center">
<figure>
	<a href="../../../images/ssorgroam/chatgpt.png" name="tsne">
		<img  style="width:600px;margin:10px" src="../../../images/ssorgroam/chatgpt.png"/>
	</a>
		<figcaption>A single-interaction Q&A with the Org roam notes</figcaption>
</figure>
</div>

A video showing it live:

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/vHamsOQW_N4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## References

[^fn1]: Moneda, L. (2023). [A relevance revolution for knowledge-workers](http://lgmoneda.github.io/2023/01/25/relevance-revolution-knowledge-work.html). Blogpost at lgmoneda.github.io.
[^fn2]: Shipper, D. (2022) The Fall of Roam. [Link](https://every.to/superorganizers/the-fall-of-roam).
