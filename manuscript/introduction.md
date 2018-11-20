{frontmatter}

# Introduction #

Hello new friend! 👋

![This is me, Swizec](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/6300d21408f5e9f0c8f5698d266fb258.jpg)

Welcome to what I hope is the best and most fun React and D3 learning resource on the internet. No TODO apps here, just fun interactive stuff that makes you look great at a dinner party.

After an hour with *React + D3*, you’ll know how to make React and D3.js play together. You’ll know how to create composable data visualizations. Understand *why* that’s a good idea, and you will have the tools to build your own library of interactive visualization components. Or use *and understand* somebody else's.

It's going to be fun! 

I believe learning new tech should be exciting, so I did my best to inject joy whenever I could.

250+ pages as a book, 8 example apps, near 8 hours of video, a bunch of skill building blocks. 👌

Going through this course you will:

- build a bunch of reusable visualization components
- build an interactive data dashboard
- learn about reusable animation components
- learn the basics of D3.js
- master React
- learn the basics of Redux and MobX
- look into rendering rich animations on canvas
- explore React alternatives like Preact and Inferno
- learn about server-side rendering
- learn a few basics of data science
- learn some WebGL and 3D rendering

You might be thinking *"How the hell does this all fit together to help me build interactive graphs and charts?"*. They're building blocks!

First I will show you the basics. Stuff like how to make React and D3 like each other, how to approach rendering, what to do with state.

Then you'll build a big project to see how it all fits together.

When you're comfortable with React and D3 working together, I will show you animation. Cool things like how to approach updating components with fine grained control and how to do transitions. I'll show you how tricks from the gaming industry work on the web.

Short on time? Don't worry. 

The initial examples work in CodeSandbox, a web-based IDE. Read the explanation, run the code, master enough React to be dangerous. You won't even have to leave the browser.

In about an hour, you'll know React and D3 well enough to explore on your own, to sell the tech to your boss and your team, and to assess if the React+D3 combination fits your needs.

I believe learning new tech should be exciting.

# Foreword

I wrote the first version of React+D3 in Spring 2015 as a dare.  Can I learn a thing and write a book in a month? Yes.

That first version was 91 pages long and sold a few hundred copies. Great success! 

You are reading, and watching, the pinnacle of how this material has evolved over almost 4 years. 4 years I've been working on this. Not every day, not all the time. 

Little experiments here and there, launches and relaunches about once a year. Learning how to do video, exploring new approaches, hosting in-person workshops.

A lot has changed. 

React isn't what it used to be. The internals are different, the API is easier to use. Hooks just flipped everything on its head all over again. Suspense and async rendering are here and getting even better.

D3 has seen less change, but still went through major improvements. It's easier to use now. Easier to understand. More modern.

It feels like the web development world is a different place in late 2018 than it was in early 2015. It really does. Look at my code from 3 years ago and I think *"What!? We used to live like this? This is horrible"*

Almost 200 people bought this version of React+D3 in preorders alone. It started as a book update and grew into a proper online course.

If you're one of those early supporters, thank you! You are the best. Without you this never would have happened. 🙏🏻

---

Because I think it's interesting, here's what I had to say about that first version back in 2015:

> I wrote this book for you as an experiment. The theory we’re testing is that technical content works better as a short e-book than as a long article.

> You see, the issue with online articles is that they live and die by their length. As soon as you surpass 700 words, everything falls apart. Readers wander off to a different tab in search of memes and funny tweets, never to come back.

> This hurts my precious writer's ego, but more importantly, it sucks for you. If you're not reading, you're not learning.

> So here we both are.

> I’m counting on you to take some time away from the internet, to sit down and read. I'm counting on you to follow the examples. I'm counting on you to *learn*.

> You’re counting on me to have invested more time, effort, and care in crafting this than I would have invested in an article. I have.

> I’ve tried to keep this book as concise as possible. iA Writer estimates it will take you about an hour to read *React+d3.js*, but playing with the examples might take some time, too.


A lot of that still rings true. People are distracted, busy, the internet is shiny. It's hard to sit down and learn stuff.

The most common feedback I get from students goes something like this 👇

> Loving your book! It's amazing. So clear and concise and relatable. But I read 20 pages, then my wife had a kid, my boss pulled the project, and I'm doing backend now. But truly amazing. I'm gonna get back to it as soon as I can!

Sometimes they do.

That's okay. Life happens. I understand. Hell, I procrastinated for months before sitting down to update this stuff :)

I recommend you go through the basic chapters at least. The little building blocks. You can do that in an afternoon or two. It's worth it, I promise.

# What you need to know

I’m going to assume you already know how to code and that you're great with JavaScript. Many books have been written to teach the basics of JavaScript; this is not one of them.

If you're struggling with modern JavaScript syntax, I suggest visiting my [Interactive ES6 Cheatsheet](https://es6cheatsheet.com)

I'm assuming you've tried D3 before, or at least heard of it. You don't have to know how D3 works, or understand what the code you copy pasted to meet a deadline does. I'll show you all you need to know.

If you want to learn D3 in depth, there's plenty of great resources out there. For example, the third edition of my first ever book, [D3.js 4.x Data Visualization - Third Edition](https://www.packtpub.com/web-development/d3js-4x-data-visualization-third-edition). Written by Ændrew Rininsland with some chapters left from yours truly.

As for React, same deal: I expect you have some idea how to use it, but you'll be fine even if this is your first time looking at React. We'll go through everything you need to know as it's happening.

All examples in React + D3 use modern JavaScript. That is JavaScript from ES6 – ES2015 – and beyond. No special mods, just stuff you get by default in all React projects in recent years. Even if some syntax isn't in the standard yet.

I'm going to explain any new syntax that we use.

## How to approach React + D3

I recommend starting with an idea, a problem. Something you want to build. A dataset you want to play with. A feature you want to add to your app.

That makes it easier. Helps focus your brain. Notice things in this course that help *you* specifically.

From there, I think you should see how much time you've got. The course is designed so you can go over the important stuff in a couple hours. Watch a video, read some text, try some code. See how it feels.

If the best way is a daily practice, 20 minutes after work, 5 minutes on the pooper, do that. If you're more of a sit down and cram it out kind of person, a nice Sunday afternoon with some coffee will do just fine.

But don't make it a chore. We're here to have fun :)

Two suggestions ✌️: 

1. *Try* the example code. Don’t just copy-paste; type it and execute it. Execute frequently. If something doesn’t fit together, look at the linked Github repositories or solved CodeSandboxes. Each project has one.
2. If you know something, skip that section. You’re awesome. ❤️

React + D3 is based on code samples. They look like this:

{caption: "Some code"}
```javascript
let foo = 'bar';
foo += 'more stuff';
```

Each code sample starts with a commented out file path. That's the file you're editing. Like this:

{caption: "Code samples have file paths"}
```javascript
// ./src/App.js

class App ...
```

Commands that you should run in the terminal start with an `$` symbol, like this:

{line-numbers: false}
```
$ npm start
```


# Why React and D3

React is Facebook's  approach to writing modern JavaScript front-ends. It encourages building an app out of small, re-usable components. Each component is self-contained and only knows how to render a small bit of the interface.

The catch is that many frameworks have attempted this: everything from Angular to Backbone and jQuery plugins. But where jQuery plugins get become messy, Angular depends too much on HTML structure, and Backbone needs a lot of boilerplate, React has found a sweet spot.

I've found React a joy to use. Using React was the first time in my life that I could move a piece of HTML in a modern app without rewriting half my JavaScript. It's like a super power.

React being the most popular JavaScript framework out there, the world seems to agree. React is great. ⚛️

D3 is Mike Bostock’s infamous data visualization library. It's used by The New York Times along with many other sites. It is the workhorse of data visualization on the web, and many charting libraries out there are based on it.

But D3 is a fairly low-level library. You can’t just say *"I have data; give me a bar chart"*. Well, you can, but it takes a few more lines of code than that. Once you get used to it though, D3 is a joy to use.

Just like React, D3 is declarative. 

You tell your code *what* you want instead of *how* you want it. It gives you access straight to the SVG so you can manipulate your lines and rectangles as you want. The problem is that D3 isn't so great, if all you want are charts.

That's where React comes in.

Once you’ve created a histogram component, you can always get a histogram with `<Histogram x="5" ... />`. Once you have a piechart, it's always `<Piechart x="20" ... />`. Just like they were HTML elements.

Doesn’t that sound like the best? I think it's amazing.

It gets better! 

With React, you can make different graph and chart components share the same data. When your data changes, the whole visualization reacts.

Your graph changes. The title changes. The description changes. Everything changes. Mind, blown.

Look how this H1B salary visualization changes when the user picks a subset of the data to look at.

![Default H1B histogram](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/full_default_h1b.png)

![Changes after user picks a data subset](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/full_changed_h1b.png)

React + D3: a powerful combination indeed.

# Buzzword soup explained

We're going to use some buzzwords in this book. Hell, we've used some already. Most will get a thorough explanation further on, but let me give you a quick rundown.

- **Babel**, a JavaScript transpiler that makes your code work on all browsers.
- **ECMAScript2015,16,17,18**, official names for JavaScript as new features come out every summer
- **ES5**, any JavaScript features that existed before June 2015
- **ES6** or **ES6+**, a common name for JavaScript as it exists past June 2015
- **fat arrows**, a new way to define functions in ES6 (`=>`)
- **Git**, a version control system. It's pretty popular, you probably know it :)
- **H1B**, a popular type of work visa in the United States
- **JSX**, a language/syntax that lets you use `<a href="/example">` as a native part of JavaScript
- **Mustache**, a popular way to write HTML templates for JavaScript code. Uses `{{ ... }}` syntax.
- **npm**, most popular package manager for JavaScript libraries
- **props**, component properties set when rendering
- **state**, a local dictionary of values available in most components
- **functional components**, React components expressed as pure functions that take props and return markup
- **Webpack**, a module packager for JavaScript. Makes it more convenient to organize code into multiple files. Provides cool plugins.

# JSX

Our components are going to use JSX, a JavaScript syntax extension that lets us treat XML-like data as normal code. You can use React without JSX, but JSX makes React’s full power easier to use.

The gist of JSX is that we can use any XML-like string just like it was part of JavaScript. No Mustache or messy string concatenation necessary. Your functions can return HTML, SVG, or XML.

For instance, code that renders one of our first examples – a color swatch – looks like this:

{caption: "Render a color swatch"}
```javascript
ReactDOM.render(
	<Colors width="400" />, 
	document.getElementById('svg')
);
```

Which compiles to:

{caption: "JSX compiled result"}
```javascript
ReactDOM.render(
	React.createElement(Colors, {width: "400"}),
	document.querySelectorAll('svg')[0]
);
```

HTML code translates to `React.createElement` calls with attributes translated into a property dictionary. The beauty of this approach is two-pronged: you can use React components as if they were HTML tags, and HTML attributes can be anything.

You’ll see that anything from a simple value to a function or an object works equally well.
