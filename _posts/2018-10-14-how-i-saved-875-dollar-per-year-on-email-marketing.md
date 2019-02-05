---
layout: post
title: How I saved 875$ per year on email marketing
description: Email services has become ridiculously expensive, so I decided to say no
img: saved-875-email-marketing.jpg
categories:
- blog
---

Hey everyone! 

As you know, I founded an open-source project, [Gladys](https://gladysassistant.com), which is a smart home assistant based on a Raspberry Pi.

I founded the project 5 years ago, and now my email list is bigger than ever: more than 3 000 subscribers on it! 🍾

I'm sending regularly a newsletter (never more than once a week) about my work on the project to all my subscribers, and for that I'm using usual email marketing tools that many people use.

## My previous email marketing stack

I started with MailChimp. Their service is great, and when I reached 2 000 subscribers I became a happy paying customer. 

I was paying around 50$ per month for their service.

![MailChimp pricing](/assets/img/email-marketing/mailchimp-pricing.jpg)

But something I didn't like with Mailchimp, is that it made me look like a big corporation. 

Their emails, forms, templates look highly professionnal, which is great for most business. 

But as an indie maker, it looked too "marketing" for me, and people were seeing my emails the same way they were seeing mass marketing emailing.

So last year, I switched to Convertkit, an email marketing platform for blogger! 

The tool is really great: I was able to send plain-text email, so it's more personal, and my users loved it!

The only problem was: the price!

Don't misread what I'm saying, **I'm happy to pay for a good service**, but when it's too expensive, it's just not possible.

When I reached 3 000 suscribers, my pricing bumped to 79$/month. 

![Convertkit pricing](/assets/img/email-marketing/convertkit-pricing.jpg)

79$/month is 948$ per year.

For an open-source project, 948$ per year is **a lot**.

Even if Gladys is making revenue, putting close to 1k$ per year in email marketing alone was way too high for me.

## My new email marketing stack

So I looked on the internet what other people were doing, and I read this article:

[Our nonprofit needed a cheaper way to send email blasts. So we engineered one.](https://medium.freecodecamp.org/our-nonprofit-needed-a-cheaper-way-to-send-email-blasts-so-we-engineered-one-167322e3f28e)

In this article, Quincy Larson from freeCodeCamp explained that their non-profit have to send a weekly newsletter to millions of people. They did a few cost estimate, and saw that MailChimp would charge them 4 200$ per month to send emails, 50k$ a year!! Way too much for a non-profit.

So they coded an open-source tool for creating email campaigns that would send emails threw Amazon SES, so they don't have to deal with IP reputation (because all the email reputation work is done by AWS).

Amazon SES is super cheap: $0.0001 per email sent (that's 1$ for 10k emails!).

I tried their tool, but it seems that it's currently unmaintained and I struggled to make it work.

So I looked at the open-source email marketing ecosystem, and found [MailTrain](https://mailtrain.org/). It's exactly like Convertkit, but it's free & open-source 😄

So I installed Mailtrain on a 5$ [DigitalOcean](https://m.do.co/c/871afdf5c23d) VPS thanks to Docker, and boom: I canceled my Convertkit account!

**Let's now make a quick calcul**.

Every month, I'm sending between 3-4 newsletters to 3 100 subscribers.

Let's say I'm sending 12k emails a month.

12k * $0.0001 = $1,20/month

So if we add the DigitalOcean VPS:

$1,20 + $5 = $6,20/month

That's 74,40$ per YEAR 😍

Now let's compare:

$948 - $74,40 = $873,6/year saved!

## Mailtrain, an open-source email marketing tool

So let's show how my mailtrain installation looks like.

It's simple, and it just works:

![Mailtrain Overview](/assets/img/email-marketing/mailtrain-overview.jpg)

### Little tip to install Mailtrain

To install it on your server, just follow the instructions on MailTrain repository with the Docker install (it's the easiest way).

The only thing I changed is that I added a nginx-proxy container in front of Mailtrain to enable HTTPS.

I changed the docker-compose.override.yml with the following configuration: 

<script src="https://gist.github.com/Pierre-Gilles/2d3f6a7ca7fe4531730856fe7485a8a1.js"></script>

You just have to change the domain/email informations with your configuration and it'll work 🙂

## Email provider

You can use any email provider you want, as soon as they provide SMTP credentials. I'm currently using [Mailgun](https://www.mailgun.com/) while my Amazon SES account is being activated by Amazon, but I'll switch to Amazon SES as soon as my account is ready.

Mailgun is free for the first 10k emails/month so don't hesitate to use them, the setup is dead easy!

Amazon SES is more complicated to setup, but way cheaper.

**Note:** You probably wonder why I don't use Mailgun if the 10k first emails per month are free. Well, I also have a Gladys Discourse Community which is sending 50/60k emails per month, so it's beginning to cost me a lot. Amazon is the best option for me.

### Suscription forms

Mailtrain provide you default subscription forms hosted on your domain and they are really great. 

You can even design your own if you want to adapt it to your identity.

![Subscription pricing](/assets/img/email-marketing/mailtrain-form.jpg)

There is even a REST API if you want to plug any service (Zapier for example) on it, or do any automated work on it. The best part is that as it's open-source you can do anything you want and modify the software!

### Automation

I personaly never use automation as I find it too "marketing" (users hate automated emails), but Mailtrain provide a tool for automation if you need it 😉

## In closing

I hope this article will inspire you and make you want to switch to an open-source alternative to send emails 🙂

Sometimes it's great to pay for paid services: they manage everything for you, the service is great, provide tons of value, and you're happy to support their development.

But sometimes, you have to look around for alternatives, and see if paying that much money is a good investment for your business.

Here, this was not the case for me. Close to 1k$ a year saved can change a lot for my business, and I'm happy I cut this cost.

Open-Source, I love you 🤟❤️
