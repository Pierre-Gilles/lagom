---
layout: post
title: Benchmarking Vultr High Frequency Compute Instances
description: Finding a powerful cloud server for the Gladys Gateway
img: benchmarking-vultr-cover.jpg
categories:
  - blog
---

Hi everyone,

As you know, I'm working on [Gladys Assistant](https://gladysassistant.com), an open-source home automation software.

To control their home when they are away, Gladys users use the [Gladys Gateway](https://gladysassistant.com/pricing), an online proxy service I run, which allows them to access their local instance from anywhere in the world, all that **end-to-end encrypted** to respect their privacy.

![gladys Gateway Schema](/assets/img/benchmarking-vultr-high-frequency-compute-instances/gladys-gateway-schema.png)

## Current hosting

Currently, the Gladys Gateway is hosted on 2 DigitalOcean droplets in Frankfurt datacenter.

1. First droplet is running the PostgreSQL database.
2. Second droplet is running 4 Docker containers:
   1. Redis
   2. Gladys Gateway server
   3. Nginx-proxy for SSL
   4. Let's Encrypt companion to renew SSL certificate automatically

## The problem

As we have more and more users using the Gladys Gateway + more and more users having cameras in Gladys, the usage is growing and our infrastructure needs to evolve.

![gladys-gateway-usage-running-high](/assets/img/benchmarking-vultr-high-frequency-compute-instances/gladys-gateway-usage-running-high.png)

## Requirements

The server is mainly a websocket proxy, so what we want is:

- **Located in France**: For minimul latency, close to my users. I'll had more locations if I have more users in other countries in the future, but that's not the case right now. Frankfurt was already close, but we want closer.
- **Lots of bandwidth**: As we have camera image going through the gateway, we need > 1Gps port.
- **Fast CPU**: To handle lots of websockets messages in a short amount of time
- **More RAMs**: Websockets sessions are stored in Redis, in RAM for performance.

I looked at many providers :

- **DigitalOcean**: Their prices are great, performances are reliable, and the UI is just amazing. But they are not available in France (yet?) sadly.
- **Scaleway** : General purpose instances looked promising, but were expensive (Starting at 42\$/month + VAT) + a quick twitter search showed me that Scaleway had reliability issue, not well handled... They don't seem to care about uptime, which is very important for critical application like this. I want guarantees on SLA + automatic refund with a multiplier when the server is down.
- **OVH**: I read only bad feedbacks about them. Reliability & support is not their thing...
- **Vultr**: A great DigitalOcean-like provider, with a datacenter in France :heart_eyes: I saw that they launched a High Frequency compute offer recently, and this is what I'm going to benchmark here!

## Vultr High Frequency Compute Benchmark

This is what they offer on their website ([See Vultr High Compute Instances](https://www.vultr.com/products/high-frequency-compute/?ref=8527763-6G)):

![vultr-high-frequency-offer](/assets/img/benchmarking-vultr-high-frequency-compute-instances/vultr-high-frequency-offer.png)

![vultr-fast-cpu](/assets/img/benchmarking-vultr-high-frequency-compute-instances/vultr-fast-cpu.png)

Exactly what we need for a high-usage websocket server!

### The server

The server is a 2 vCPU + 4 Gb RAM Vultr High Compute Instance.

It started in 30 seconds, and I destroyed the server in 1 click after the tests. Running this server during tests cost me \$0.04.

A few generic informations about the server :

![generic-bench](/assets/img/benchmarking-vultr-high-frequency-compute-instances/generic-bench.png)

### Network speed

A little speedtest.net:

![network-speed](/assets/img/benchmarking-vultr-high-frequency-compute-instances/network-speed.png)

- **Download**: 3.5 Gb/s
- **Upload**: 4.3 Gb/s

Not bad !! 🚀

### Ping

A ping from my place near Paris took 5ms on average:

![ping](/assets/img/benchmarking-vultr-high-frequency-compute-instances/ping.png)

In comparaison, a DigitalOcean instance in Franfkurt gives me a 20ms ping:

![ping-fra](/assets/img/benchmarking-vultr-high-frequency-compute-instances/ping-fra.png)

This is not that different if it was just a web server, but for real-time home automation, this is really better ! 🙂

### Disk write performance

A simple dd of a 1 Gb file gives us some pretty decent performance :

![write-perf](/assets/img/benchmarking-vultr-high-frequency-compute-instances/write-perf.png)

### Disk read performance

Reading the same file we just wrote gives us a 1.6 GB/s speed. Not bad !

![read-perf](/assets/img/benchmarking-vultr-high-frequency-compute-instances/read-perf.png)

### CPU

I didn't run any CPU tests, because there are plenty of them online (On [VPSBenchmarks](https://www.vpsbenchmarks.com/compare/vultr) for example). Feedbacks on the High Frequency Compute are really great.

## To Conclude

I already use Vultr to host Gladys Assistant community (with an amazing reliability over years), and I have to say that once again, they proved that they can provide performant cloud instances.

I would love your feedback on this, but I think I'll migrate Gladys Gateway servers to Vultr soon.

I want to improve latency and speed for my users, and I'm convinced that this change will help us in this way !
