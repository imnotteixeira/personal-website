---
title: "Creating a personal website"
date: "2021-03-14"
draft: false
path: "/blog/creating-personal-website"
---

## Hello World

Everything starts like this, right?
<!-- end_excerpt -->

## Why did I do this?

There are mainly two reasons, well... Actually three:

#### 1. I might have things to share every once in a while

Every now and then I figure how to solve a specific problem and I just want to share it with someone, this would be the perfect place to write it down and make it available for anyone.

I also like to play with data and look at charts! When I analyze something, I will post my findings here!

#### 2. I wanted to create something with Gatsby

I've been using React for almost 3 years now, but I never got to play much with Gatsby (or other tools such as Next.js, really). This was the perfect project to start using it and broaden my tech stack.

#### 3. I wanted to do something

This doesn't really require much explanation, does it? I was bored on a saturday night and remembered I had a free .me domain from Github Education. The rest is *git* history.

## How did I do it?

Well, first I redeemed my free domain at [nc.me](https://nc.me/). Then, I created a GitHub repository to hold the website's source code. In order to deploy it, I am using Netlify. It's really easy, just had to connect the GitHub repository and it will build automatically on every push to the `main` branch.

I had some small trouble configuring DNS, but I solved it following this great post: [Setting up Domain with Namecheap & Netlify](https://dev.to/easybuoy/setting-up-domain-with-namecheap-netlify-1a4d)

After verifying it was serving my website correctly, it was time to start using a Gatsby website. I am using a tweaked version of the [Julia Template](https://github.com/niklasmtj/gatsby-starter-julia) which I tweaked myself.

---

Currently, I am working on a React design pattern that helps build multiple client interfaces (Desktop and Mobile) where the layout is completely different and CSS media-queries are not enough. You can expect a post on this soon!

*Never stop learning*

See you later,
<br>
Angelo








