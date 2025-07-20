---
layout: attic
title: The Attic
lang: en
ref: the-attic-index
---

<div class="attic-icon">
  <img src="/images/the-attic/full-attic-transparent.png" alt="The Attic" />
</div>

<div class="attic-grid">
{% assign attic_files = site.static_files | where_exp: "file", "file.path contains '/the-attic'" | where: "extname", ".html" | sort: "name" | reverse %}
{% for file in attic_files %}
    {% assign filename = file.name | remove: '.html' %}
    {% assign date_parts = filename | split: '-' %}
    {% if date_parts.size >= 3 %}
      {% assign year = date_parts[0] %}
      {% assign month = date_parts[1] %}
      {% assign day = date_parts[2] %}

      {% comment %} Look up title in data file {% endcomment %}
      {% assign title = nil %}

      {% for entry in site.data.attic.entries %}
        {% if entry.filename == filename %}
          {% assign title = entry.title %}
          {% break %}
        {% endif %}
      {% endfor %}

      {% comment %} Fallback to filename-based title if not found in data {% endcomment %}
      {% unless title %}
        {% assign title_parts = date_parts | slice: 3, date_parts.size %}
        {% assign title = title_parts | join: '-' | replace: '-', ' ' %}
      {% endunless %}

      {% case month %}
        {% when '01' %}{% assign month_name = 'Jan' %}
        {% when '02' %}{% assign month_name = 'Feb' %}
        {% when '03' %}{% assign month_name = 'Mar' %}
        {% when '04' %}{% assign month_name = 'Apr' %}
        {% when '05' %}{% assign month_name = 'May' %}
        {% when '06' %}{% assign month_name = 'Jun' %}
        {% when '07' %}{% assign month_name = 'Jul' %}
        {% when '08' %}{% assign month_name = 'Aug' %}
        {% when '09' %}{% assign month_name = 'Sep' %}
        {% when '10' %}{% assign month_name = 'Oct' %}
        {% when '11' %}{% assign month_name = 'Nov' %}
        {% when '12' %}{% assign month_name = 'Dec' %}
      {% endcase %}

      {% assign formatted_date = day | plus: 0 | append: ' ' | append: month_name | append: ' ' | append: year %}

      <div class="attic-post">
        <div class="attic-post-date">{{ formatted_date }}</div>
        <a href="{{ file.path }}" class="attic-post-title">{{ title }}</a>
      </div>
    {% endif %}
{% endfor %}
</div>
