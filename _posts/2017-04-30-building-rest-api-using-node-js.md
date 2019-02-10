---
layout: post
title: Building a powerful REST API with Node.js (Part 3)
description: How I'm building a better, faster, stronger Gladys Developer Platform with Node.js!
img: refactoring-developer-website-part-3.jpg
categories:
- blog
- gladys
---

Hi, everyone!

This article is the third article of my series "Refactoring Gladys Developer Platform". Last time, I was explaining how [I designed the PostgreSQL database of the new platform](/blog/gladys/2017/04/25/database-design-with-postgresql.html).

Today, I'm going to talk about Node.js development. For our new platform we need a fast REST API, and we are going to use Node.js to build it.

## Why Node.js ?

- Node.js is lightning fast. It's built on top of Google V8 engine, which compile JavaScript to machine code at execution.
- Node.js I/O are Asynchronous and Event Driven. It means that all input/output operation (database call, file read, HTTP request, etc..) are not blocking your process, and you can still do other things when an I/O operation is performed. If you send an HTTP request to a third-party API (ex: Sending an email to your email provider), it will probably take something like 300/400ms. During this time, you'll be able to do other things. This asynchronous nature makes Node.js extremely scalable.
- Ecosystem: NPM (Node Package Manager) is the largest repository of open-source libraries in the world
- It's used by top companies: Netflix, Uber, Paypal, Wal-Mart, Groupon.
- It's Open-Source and released under the MIT Licence.

**Source:** 

- [Node.js](https://nodejs.org/en/)
- [What is the best example of how NodeJS has saved/save money for company/startup?](https://www.quora.com/What-is-the-best-example-of-how-NodeJS-has-saved-save-money-for-company-startup/answer/Nextbrain-Technologies)

## The REST API

On this back-end, we are managing:

- users
- modules
- scripts
- sentences

That's all!

Let's cover the routes we need:

**User :**

- POST /signup => account creation
- POST /login => login
- PATCH /user/:id => modify your account

**Module :**

- POST /module => publish a module
- PATCH /module/:id => modify a module
- DELETE /module/:id => remove a module
- POST /module/:id/text => publish new version of text
- POST /module/:id/review => review a module
- POST /module/:id/version => publish new version module
- POST /module/:id/download => user downloaded a module
- GET /module => get all modules with pagination
- GET /user/:id/module => get modules created by a user
- GET /module/:id => get a module by ID

**Script :**

- POST /script => create a script
- PATCH /script/:id => modify a script
- DELETE /script/:id => delete a script
- GET /script => get list of script
- GET /user/:id/script => get scripts created by user

**Sentence :**

- POST /sentence => create a sentence
- POST /sentence/:id/vote => vote for a sentence
- DELETE /sentence/:id => remove a published sentence

**Admin :**

I'm going to implement an admin dashboard to accept/reject published module. I don't have currently any dashboard and it's really annoying to manually accept module in the database.

- POST /module/:id/accept => accept a module
- POST /module/:id/reject => reject a module
- POST /module_text/:id/accept => accept a new version of the text
- POST /module_text/:id/reject => reject a new version of the text

## Image uploading

To handle image upload, there are different options:
- Upload image to the server and the server is responsible for serving all images
- Upload image to the server, which sends the image to a cloud file provider (Like Amazon S3, Google Cloud Storage or Microsoft Blob Storage)
- Upload directly the image to a cloud file provider.

The first option is clearly not the best for us. We want something scalable, easy to deploy and easy to migrate on another server if we want to upgrade the server. The other problem is that storage is not illimited!

Second option seems better, but still, if we have lots of users uploading at the same time, the back-end will be busy working with files transfer: That's clearly not his job.

I'm going to pick the third option. All the heavy work is going to be done by our cloud provider, not our back-end. In our case, it's going to be an Amazon S3 bucket.

> But, does it means the client uploads what he wants in our S3 bucket ??

No, of course no. Before uploading, the client just need to ask our back-end for a pre-signed URL. It's an URL that allows the client to upload only in a specific place in our S3 bucket, during a limited time.

That means that the user cannot upload what he wants, when he wants, where he wants. But still, the user is uploading directly on Amazon S3. No extra server load on our side :)

So, new route on our back-end:

- POST /module/image/upload => will return a pre-signed URL for direct upload to S3

## Development

### File structure

This is what our back-end file structure will looks like: 

```
-- core
---- api
------ user
-------- controller
---------- user.signup.js
-------- model
---------- user.create.js
----- service
-- index.js
-- package.json
```

I prefer organizing my back-end by entity (user, module) with inside both controllers and models,
rather than doing the opposite (controllers and models, with inside 'user', 'module'). 
It's much more clear, and easier when you develop, because all files you need are just near. And when your app is becoming bigger, it's still easy to find a file.

### Password hashing and authentification

To hash password, I'm going to use [bcrypt](https://www.npmjs.com/package/bcrypt).

For authentification, we want a stateless way of authenticating users. We are going to use [jsonwebtoken](https://jwt.io).

What is a jsonwebtoken ?

It's an encoded token composed of three parts: 

- A header, specifying the algorithm used. Example: 

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- A payload, which contains the data we wants. Example:

```
{
  "sub": "ce95683c-e682-4bcd-a18d-2e3d250aad48",
  "name": "John Doe"
}
```

- A signature. The signature is simply generated like this: 
`HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`. Only the back-end is able to generate this signature because the HMACSHA256 function takes a `secret`. And only the back-end knows the secret!

The idea is simple: 

- The user logs in with a POST /login request on our back-end
- We generate a JWT with the user information inside, signs the JWT and return the token to the user
- Each time the client sends an HTTP request to the back-end, he adds an "Authorization" header containing the JWT
- The back-end reads the JWT, and verify that the signature is correct. If yes, it means that the JWT is valid, and it's the right user who is making this request. We let him access the ressource he wants.

> Does it means that the user can log in as any user just by changing the data inside the payload ?

No, because if the user changes the payload, the signature is not valid anymore, and the back-end will reject the JWT.

> What about expiration ? Does it means the token is valid forever ?

Good question, of course no! The JWT specification allows us to set a `exp` attribute inside the payload. For example, we can say that a token is valid for 2 days. We will put inside the `exp` attribute the timestamp of today + 2 days. When the user in 2 days will try to send a request, the back-end will open the JWT, see that the JWT is no longer valid, and reject the user. The user will need to log in again.

### Data validation

To validate data, I'm going to use [Joi](https://github.com/hapijs/joi), it's an awesome NPM package that allows us to validate JSON according to a defined schema. For example, for our user, I defined the schema as this:

```js
const Joi = require('joi');

var schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().token().min(2).required()
});
```

- The email, password and name field are required.
- Password should be minimum 6 characters
- Email should be an email
- Name should be a token, like on Twitter, you can't have spaces in your username, only letters, numbers and special characters like `_`.

Then, in my model, when I'm creating a user, I just have to do that:

```js
// params contains the body sent by the user
// schema is Joi schema defined before
// stripUnknown: true means that we want to remove other field that are not in the schema
// example: if the user put a `lastname` attribute that is not in the schema, it will be cleaned
return validate(params, schema, {stripUnknown: true})
    .then((user) => {

        // create user
    });
```

### DB requests

For database requests, we have mainly two options:
- We can use an ORM
- We can write raw SQL queries

Having an ORM saves you time, but performance are not that great, and if you want to write specific query, you won't be able to do it with the ORM, you will need to go back to SQL.

I'm not going to use an ORM for all SELECT requests, for performance reason mainly.

For insert/update requests, the problem is that attributes are not all required, and we don't want to hand-generate all types of SQL request. For this, I will use [squel](https://hiddentao.com/squel/), a SQL query builder which supports PostgreSQL.

We have the best of both worlds: 
- SELECT request never changes, so they are all written in SQL for maximum performance
- INSERT/UPDATE are going to be generated by squel 

### Logging

Logging is really important. You can't know if your system is broken if you don't have any logs. 

The thing is that you can't browse all logs just by hand, it takes too much times. And if something is broken, you need alerts!

Here, two options:
- Host your own logging solution (Like an ELK stack)
- Use a cloud log provider (Like Sentry, Loggly)

Here I'm going to use the second solution, as it takes time to host my own logging platform. I don't know yet which provider I'm going to use.

### Emails

Sending transactional emails (Confirmation email, reset password) is a serious job if you don't want to fall in the SPAM folder of your user. I'm going to use [Mailgun](https://www.mailgun.com/) that I was already using before. Email are delivered correctly, and not that expensive (First 10 000/months are free, then it's $0.00050 per email, so 20 000 emails = 5$, cheeaap)

## In closing

I'm working hard on this new platform, and the back-end is in good way! Don't hesitate to get a look on the code on the [GitHub repository](https://github.com/GladysAssistant/dev-plaftorm-backend). Yes, this platform is open-source!

I hope this article was clear, don't hesitate to ask question in comments :)

Have a nice week-end!

**Summary of this series:** 

- [Refactoring Gladys Developer Platform (Part 1)](/blog/gladys/2017/04/22/refactoring-gladys-developer-website.html)
- [Database Design with PostgreSQL (Part 2)](/blog/gladys/2017/04/25/database-design-with-postgresql.html)
- [Building a powerful REST API with Node.js (Part 3)](/blog/gladys/2017/04/30/building-rest-api-using-node-js.html)
- Setting up Unit testing, Continuous Integration and Deployment (Part 4) (Coming soon)
- Leveraging caching with Redis (Part 5) (Coming soon)
- Scheduling job with RabbitMQ (Part 6) (Coming soon)
- A front-end in React/Redux (Part 7) (Coming soon)


