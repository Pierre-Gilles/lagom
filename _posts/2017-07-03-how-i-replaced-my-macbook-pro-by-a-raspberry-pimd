---
layout: post
title: How I replaced my MacBook Pro by a Raspberry Pi during 1 week
description: The story of a sofware engineer trying to work on a 35$ ARM machine
img: how-i-replaced-my-mabook-pro-by-a-raspberry-pi.png
categories:
- blog
---

Last week, I forgot my bag in a G7 Taxi in Paris. Inside was the MacBook Pro I'm using every day. This day was probably not a good day.

The problem with losing your computer in a Taxi in Paris is that you can't contact the driver like you would do with an Uber. If you don't remenber the Taxi numberplate, you have no chance to see the driver again. The only chance you have to get your bag back is to go to the "item found" Police department of Paris, and hope the driver has been honest.

As the driver won't drop my bag immediately, I decided to wait one week before considering my bag as completely lost. What can I do during one week without any computers at home?
Wait... that's not true, I have a computer at home! What about using my Raspberry Pi 3?

The Raspberry Pi is clearly a good idea: It's powerful, it runs Linux, it's silent.  Let's go for one week on this!

![I miss you, MacBook Pro!](/assets/img/2017-07-03-how-i-replaced-my-macbook-pro-by-a-raspberry-pi/my_good_old_macbook_pro.jpeg)

I miss you, Macbook Pro!

## Softwares I was using on my mac

I'm software engineer, and use this personal mac for lots of stuff:

- Coding on the opens-source project Gladys I founded. [Gladys](https://gladysproject.com) is a home assistant based on a Raspberry Pi (like a kind of Jarvis), written in Node.js so it's basically some Node.js development. For this I'm using VS Code + Node.js + MySQL.
- Writing on Gladys blog. I'm writing my articles in Markdown using Macdown on my mac. I'm editing images with Photoshop.
- Answering messages on Gladys community (it's basically a Discourse forum)
- Video editing on Final Cut Pro (outch, this is going to be hard to replace)
- Web browsing (News reading, YouTube, Twitter)
- Terminal, mostly for dev tools & SSH (that's where I spend most of my day, and should be the easiest thing to replace)

## Setting up the Raspberry Pi

For those who don't know the Raspberry Pi, it's a tiny Linux computer powered by a quad core ARM CPU and 1Gb of RAM. It's used in a lot of DIY project, because it only costs [35$ on average](https://www.amazon.com/gp/product/B01C6Q2GSY/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=gladproj-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01C6Q2GSY&linkId=0837cd1b3cc2b715934805ef5eb11723).

I have severals of them at home for my Home Automation project Gladys, so I took one to convert it into a full Desktop PC.

First step was to download Raspbian Jessie. I used my parents computer, and cloned the image on a 16Gb micro-SD card.

I plugged an old Wireless Mouse, a really old USB keyboard, a 22" HDMI screen into the Raspberry Pi, and turned everything on.

![Raspberry Pi Desktop Setup](/assets/img/2017-07-03-how-i-replaced-my-macbook-pro-by-a-raspberry-pi/desktop_setup.jpeg)

The first good impression when turning the Pi on is the noise: The Raspberry Pi doesn't have any fans, so it's perfectly silent. My mac was quite silent too, but not that silent.

## Working on the Raspberry Pi

### Web browsing

Raspbian Jessie has Chromium included. I decided to go with it, and the result is quite good. Browsing is nearly as fast as on a classical computer, and as it's Chromium, Javascript is perfectly executed. The only problem is that each tab in Chromium is a separate process.. Each chromium process takes 150/200Mb of RAM, and since the Raspberry Pi has 1Gb of RAM, having 3/4 tabs opened is really the limit before having a laggy system. And don't ever try to swap on the SD card, it's really slow!

Ok, so lesson learned: Only keep 3 tabs opens. I just need to forget about "right-click" -> "Open in a new tab", and I'll be good.

### Writing

As a power-user of Evernote, I decided to try the Evernote web app inside Chromium. And it works great! This article is currently written inside Evernote for web, and it's almost as good as the mac app.

![Using Evernote Web on a Raspberry Pi 3](/assets/img/2017-07-03-how-i-replaced-my-macbook-pro-by-a-raspberry-pi/evernote_web_raspberry_pi.png)

I haven't found any great Markdown writing app available on Linux and compiled for ARM, so I'll just copy paste the note content inside the default text-editor, add markups, and git push the article to my github page repository to publish it.

### Development

To develop, I'm using VS Code, and spend most of my remaining time in the terminal.

For the terminal, the Raspberry Pi is just perfect. Nothing change, I'm at home.

For VS Code, whereas it's possible to compile it on ARM, I was more spectical. VS Code is an electron based app, so it starts a full instance of Chromium. It may be too heavy to run it next to Chromium.

I decided to use vim with the Javascript plugin.

The coding process itself is quite good. The only problem is that most tools you use on your dev machine are really slow on a Rasperry Pi. Webpack, uglifyJS, Babel: My good old mac was really better at this.

### Image editing

I forgot about Photoshop, and first tried Canva on the web. It was way too slow to really use it. And since I'm taking my pictures with my camera/phone, and usually transfer them using the SD port of the Mac, the best solution I found was connecting my camera using Wi-Fi to my iPhone.

Then, using the canon app, I downloaded the pictures I wanted, edited the picture inside Canva iOS app, and uploaded the images to Google Drive. Not the most efficient, but it works!

Then, to resize the image so it's not too heavy in an article, I simply used an online resizer.

![Resizing image Raspberry Pi 3 web](/assets/img/2017-07-03-how-i-replaced-my-macbook-pro-by-a-raspberry-pi/resize_image_min.png)


Note: Google Drive was really hard to use on the Raspberry Pi.

### Video editing

Let's just forgot this part :D
I won't edit any videos this week.
If I needed to, I would have used the iOS iMovie app. Since my Mac was already struggling with video editing, the Raspberry Pi would have died.

## In closing

I've been using the Raspberry Pi since the first model as a home automation server, but I've never really used the desktop version in the past.

And I was impressed by the speed and usability of the Raspberry Pi 3 in desktop mode. It's definitely not a tool for compiling heavy software or rendering 4K videos, but for basic blogging, browsing and simple development, it just works.

For the price it costs, you definitely have a nice machine.

I really hope I'll get my mac back, (finger crossed) but this was a good opportunity to test the Raspberry Pi in Desktop mode!

PS: For all users on [Gladys](https://gladysproject.com), sorry for not being that present last week, it was not an easy week. Without my mac, it was hard to publish big changes on the project, especially on the video pack I'm working on. But i'm back soon!



