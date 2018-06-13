---
title: My books
description: Here is the list of books I read/I'm reading!
layout: default
---

# My Books

This is the list of books I read the past years. I try to update it when I read a new book, but sometimes I forget 😄 If you have suggestions of books to read, don't hesitate to ping me on Twitter <a href="https://twitter.com/{{ site.data.theme.social.twitter }}">@{{ site.data.theme.social.twitter }}
  </a> !

<style>
.align-left{
    float: left;
    margin-right: 30px;
    margin-bottom: 15px;
    margin-left: 20px;
    height: 150px;
}
.one-book{
    height: 150px;
    margin-bottom: 40px;
}
.year-title{
    margin-bottom: 25px;
}
.comment{
    margin-top: 20px;
}
</style>

<div>
{% for year in site.data.books %}
    <div>
    <h2 class="year-title">{{ year.year }}</h2>
    {% for book in year.books %}
        <p class="one-book">
            <a href="{{ book.link }}" rel="nofollow">
                <img src="/assets/img/books/{{book.img}}" class="align-left">
            </a>
            <a href="{{ book.link }}" rel="nofollow">
                {{ book.name }}
            </a>
        </p>
    {% endfor %}
    </div>
{% endfor %}
</div>

