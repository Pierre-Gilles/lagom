---
layout: post
title: RGDP - Database Design with PostgreSQL (Part 2)
description: Designing Gladys Developer website database with PostgreSQL.
img: refactoring-developer-website-part-2.jpg
categories:
- blog
- gladys
---

Hi, everyone!

This is the second article of my series "Refactoring Gladys Developer Platform". You can read the first article [here](/blog/gladys/2017/04/22/refactoring-gladys-developer-website.html). The goal is to blog on how I'm building a fast and scalable back-end using Node.js, PostgreSQL, Redis and Nginx. We are going here to speak about database design.

## Why PostgreSQL?

It's a complete ACID compliant database that offers many features and great performance. It's able to handle very large amount of data, and you can probably design any database you want with it.

### Things I love with PostgreSQL

- **Uuid type :** PostgreSQL supports uuid types, this means you can uses uuid as primary keys without having to generate and validate them on your backend side.
- **Full-text search:** You want fuzzy matching, multiple languages, stemming in search? PostgreSQL does that.
- **Spatial and Geographic objects:** You are building the next Uber? You want to store geographical data in your DB? And query them? PostGis provides out of the box methods to calculate distances between points and lots of tools to query geographical data.
- **JSONB:** Since version 9.2, PostgreSQL is to able to store JSON with the new `JSONB` type. You can query inside the JSON with great performance. The goal is not to replace your relational database, it's just that sometimes you need to store documents or JSON data that you don't want to split into tables for maximum performance.

**Read more:** 

- [Is PostgreSQL good enough?](http://renesd.blogspot.fr/2017/02/is-postgresql-good-enough.html)
- [Postgres full-text search is Good Enough!](http://rachbelaid.com/postgres-full-text-search-is-good-enough/)
- [Unleash the Power of Storing JSON in Postgres](https://blog.codeship.com/unleash-the-power-of-storing-json-in-postgres/)

## Building our database

### Data Model

I've already talked about it in my last article, here is what the database is going to look like:

[![Gladys Developer Platform Data Model](/assets/img/2017-04-22-refactoring-gladys-developer-website/data-model.png)](/assets/img/2017-04-22-refactoring-gladys-developer-website/data-model.png)

### Tables

Because of all restricted keywords in PostgreSQL (user, group...), I took the habit to prefix all tables with `t_` to prevent any issues. So I'm going to create theses tables:

```
t_user
t_instance
t_module
t_module_text
t_module_version
t_module_download
t_module_review
t_script
t_sentence
t_sentence_vote
```

Here is the final create table script :

```sql
CREATE TABLE t_user (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
name character varying NOT NULL,
email character varying NOT NULL,
password character varying NOT NULL,
active boolean DEFAULT false NOT NULL,
last_connected timestamp NOT NULL default now(),
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_user ADD CONSTRAINT t_user_pkey PRIMARY KEY (id);

CREATE TABLE t_module (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
user_id uuid NOT NULL,
name character varying NOT NULL,
img character varying NOT NULL,
url character varying NOT NULL,
slug character varying NOT NULL,
online boolean DEFAULT false NOT NULL,
min_gladys_version integer NOT NULL,
max_gladys_version integer NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_module ADD CONSTRAINT t_module_pkey PRIMARY KEY (id);

CREATE TABLE t_module_text (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
module_id uuid NOT NULL,
language character varying NOT NULL,
description character varying NOT NULL,
instruction_html character varying NOT NULL,
instruction_markdown character varying NOT NULL,
online boolean DEFAULT false NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_module_text ADD CONSTRAINT t_module_text_pkey PRIMARY KEY (id);

CREATE TABLE t_module_version (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
module_id uuid NOT NULL,
version character varying NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_module_version ADD CONSTRAINT t_module_version_pkey PRIMARY KEY (id);

CREATE TABLE t_instance (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
user_id uuid,
version character varying,
os character varying,
platform character varying,
node_version character varying,
latitude double precision,
longitude double precision,
city character varying,
zipcode character varying,
country character varying,
first_seen timestamp NOT NULL default now(),
last_seen timestamp NOT NULL default now(),
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_instance ADD CONSTRAINT t_instance_pkey PRIMARY KEY (id);

CREATE TABLE t_module_download (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
module_version_id uuid NOT NULL,
instance_id uuid,
network_hash character varying,
source character varying,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_module_download ADD CONSTRAINT t_module_download_pkey PRIMARY KEY (id);

CREATE TABLE t_module_review (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
module_id uuid NOT NULL,
user_id uuid NOT NULL,
note integer NOT NULL,
    text character varying,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_module_review ADD CONSTRAINT t_module_review_pkey PRIMARY KEY (id);

CREATE TABLE t_script (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
user_id uuid NOT NULL,
name character varying NOT NULL,
code character varying,
description character varying NOT NULL,
instruction_html character varying NOT NULL,
instruction_markdown character varying NOT NULL,
online boolean DEFAULT false NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_script ADD CONSTRAINT t_script_pkey PRIMARY KEY (id);

CREATE TABLE t_sentence (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
user_id uuid NOT NULL,
    text character varying NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_sentence ADD CONSTRAINT t_sentence_pkey PRIMARY KEY (id);

CREATE TABLE t_sentence_vote (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
sentence_id uuid NOT NULL,
user_id uuid NOT NULL,
vote integer NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_sentence_vote ADD CONSTRAINT t_sentence_vote_pkey PRIMARY KEY (id);

CREATE TABLE t_gladys_version (
id uuid DEFAULT uuid_generate_v4() NOT NULL,
version character varying NOT NULL,
created_at timestamp NOT NULL default now(),
updated_at timestamp NOT NULL default now(),
is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY t_gladys_version ADD CONSTRAINT t_gladys_version_pkey PRIMARY KEY (id);
```

As you can see, uuid are created automatically by PostgreSQL if not provided by the backend.

I'm putting a `is_deleted` boolean column on each table to avoid to hard delete rows in the DB from the back-end. We don't want unexpected data loss, and here the back-end just has to update a row with `is_deleted` to true when something needs to be deleted. It can be restored if a mistake was made.

### Foreign Keys

```sql
ALTER TABLE ONLY t_module
ADD CONSTRAINT fk_t_module__user_id_t_user FOREIGN KEY (user_id) REFERENCES t_user(id);

ALTER TABLE ONLY t_module_text
ADD CONSTRAINT fk_t_module_text__module_id_t_module FOREIGN KEY (module_id) REFERENCES t_module(id);

ALTER TABLE ONLY t_module_version
ADD CONSTRAINT fk_t_module_version__module_id_t_module FOREIGN KEY (module_id) REFERENCES t_module(id);

ALTER TABLE ONLY t_instance
ADD CONSTRAINT fk_t_instance__user_id_t_user FOREIGN KEY (user_id) REFERENCES t_user(id);

ALTER TABLE ONLY t_module_download
ADD CONSTRAINT fk_t_module_download__module_version_id_t_module_version FOREIGN KEY (module_version_id) REFERENCES t_module_version(id);

ALTER TABLE ONLY t_module_download
ADD CONSTRAINT fk_t_module_download__instance_id_t_instance FOREIGN KEY (instance_id) REFERENCES t_instance(id);

ALTER TABLE ONLY t_module_review
ADD CONSTRAINT fk_t_module_review__module_id_t_module FOREIGN KEY (module_id) REFERENCES t_module(id);

ALTER TABLE ONLY t_module_review
ADD CONSTRAINT fk_t_module_review__user_id_t_user FOREIGN KEY (user_id) REFERENCES t_user(id);

ALTER TABLE ONLY t_script
ADD CONSTRAINT fk_t_script__user_id_t_user FOREIGN KEY (user_id) REFERENCES t_user(id);

ALTER TABLE ONLY t_sentence
ADD CONSTRAINT fk_t_sentence__user_id_t_user FOREIGN KEY (user_id) REFERENCES t_user(id);

ALTER TABLE ONLY t_sentence_vote
ADD CONSTRAINT fk_t_sentence_vote_user_id_t_user FOREIGN KEY (user_id) REFERENCES t_user(id);

ALTER TABLE ONLY t_sentence_vote
ADD CONSTRAINT fk_t_sentence_vote_sentence_id_t_sentence FOREIGN KEY (sentence_id) REFERENCES t_sentence(id);
```

For those who don't know foreign keys, the goal is to ensure that if I insert a `t_module` in the database with a given `user_id`, the `user_id` actually refers to an existing user uuid in the `t_user` table.

### Indexes

Indexes are really important. They can really improve the performance of your database.

I create indexes on all columns that are used to perform JOIN operations, ORDER BY and WHERE.

For the moment, I'm going to create these indexes:

```sql
CREATE INDEX ix_t_user_email ON t_user USING btree (lower(email));
CREATE INDEX ix_t_module_user_id ON t_module USING btree (user_id);
CREATE INDEX ix_t_module_text_module_id ON t_module_text USING btree (module_id);
CREATE INDEX ix_t_module_version_module_id ON t_module_version USING btree (module_id);
CREATE INDEX ix_t_instance_user_id ON t_instance USING btree (user_id);
CREATE INDEX ix_t_module_download_instance_id ON t_module_download USING btree (instance_id);
CREATE INDEX ix_t_module_download_module_version_id ON t_module_download USING btree (module_version_id);
CREATE INDEX ix_t_module_review_user_id ON t_module_review USING btree (user_id);
CREATE INDEX ix_t_module_review_module_id ON t_module_review USING btree (module_id);
CREATE INDEX ix_t_script_user_id ON t_script USING btree (user_id);
CREATE INDEX ix_t_sentence_user_id ON t_sentence USING btree (user_id);
CREATE INDEX ix_t_sentence_vote_user_id ON t_sentence_vote USING btree (user_id);
CREATE INDEX ix_t_sentence_vote_sentence_id ON t_sentence_vote USING btree (sentence_id);
CREATE INDEX ix_t_gladys_version_created_at ON t_gladys_version USING btree (created_at);
```

### Unique Indexes

In this database, I have several relation tables. For example, a user is able to vote for a sentence.
I don't want a user to vote 2 times for the same sentence, so I'm going to put a unique index on the two columns (user_id, sentence_id) of the `t_sentence_vote` table.

```sql
--- No duplicate (user_id, sentence_id) row in t_sentence_vote table
--- Prevent a user from voting two times for the same sentence
CREATE UNIQUE INDEX ix_t_sentence_vote_sentence_id_user_id_unique on t_sentence_vote (user_id, sentence_id) WHERE (is_deleted = false);
```

As you can see, it's only a partial index on a subset of the table: Only rows where `is_deleted` = false (because a user can vote several times if his vote is deleted).

## Running PostgreSQL inside Docker

### Dockerfile

First, I'm saving all the SQL I need to init my DB in a `init.sql` file. I just need to create a Dockerfile with the following content:

```Dockerfile
FROM postgres:9.6-alpine
ADD init.sql /docker-entrypoint-initdb.d/
```

I start from the postgres 9.6 alpine image. Alpine is a lightweight Linux distribution that is used to create minimal Docker images. Perfect for us!

I add the `init.sql` file inside the `/docker-entrypoint-initdb.d` folder so that the SQL file will be executed at first startup of the container.

## In closing

We now have our database! I hope you enjoyed this article, don't hesitate if you have any feedbacks. In the next article, I'm going to talk about the development of the REST API of the new dev platform.

All of my code is on [Github](https://github.com/GladysAssistant/dev-plaftorm-backend).

**Summary of this series:** 

- [Refactoring Gladys Developer Platform (Part 1)](/blog/gladys/2017/04/22/refactoring-gladys-developer-website.html)
- [Database Design with PostgreSQL (Part 2)](/blog/gladys/2017/04/25/database-design-with-postgresql.html)
- [Building a powerful REST API with Node.js (Part 3)](/blog/gladys/2017/04/30/building-rest-api-using-node-js.html)
- Setting up Unit testing, Continuous Integration and Deployment (Part 4) (Coming soon)
- Leveraging caching with Redis (Part 5) (Coming soon)
- Scheduling job with RabbitMQ (Part 6) (Coming soon)
- A front-end in React/Redux (Part 7) (Coming soon)