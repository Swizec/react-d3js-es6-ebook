# What you need to know

I’m going to assume you already know how to code and that you're great with
JavaScript. Many books have been written to teach the basics of JavaScript;
this is not one of them.

If you're struggling with modern JavaScript syntax, I suggest visiting my
[Interactive ES6 Cheatsheet](https://es6cheatsheet.com)

I'm assuming you've tried D3 before, or at least heard of it. You don't have to
know how D3 works, or understand what the code you copy pasted to meet a
deadline does. I'll show you all you need to know.

If you want to learn D3 in depth, there's plenty of great resources out there.
For example, the third edition of my first ever book,
[D3.js 4.x Data Visualization - Third Edition](https://www.packtpub.com/web-development/d3js-4x-data-visualization-third-edition).
Written by Ændrew Rininsland with some chapters left from yours truly.

As for React, same deal: I expect you have some idea how to use it, but you'll
be fine even if this is your first time looking at React. We'll go through
everything you need to know as it's happening.

All examples in React + D3 use modern JavaScript. That is JavaScript from ES6
– ES2015 – and beyond. No special mods, just stuff you get by default in all
React projects in recent years. Even if some syntax isn't in the standard yet.

I'm going to explain any new syntax that we use.

## How to approach React for Data Visualization

I recommend starting with an idea, a problem. Something you want to build. A
dataset you want to play with. A feature you want to add to your app.

That makes it easier. Helps focus your brain. Notice things in this course that
help _you_ specifically.

From there, I think you should see how much time you've got. The course is
designed so you can go over the important stuff in a couple hours. Watch a
video, read some text, try some code. See how it feels.

If the best way is a daily practice, 20 minutes after work, 5 minutes on the
pooper, do that. If you're more of a sit down and cram it out kind of person, a
nice Sunday afternoon with some coffee will do just fine.

But don't make it a chore. We're here to have fun :)

Two suggestions:

1. _Try_ the example code. Don’t just copy-paste; type it and execute it.
   Execute frequently. If something doesn’t fit together, look at the linked
   Github repositories or solved CodeSandboxes. Each project has one.
2. If you know something, skip that section. You’re awesome. :heart:

React + D3 is based on code samples. They look like this:

```{.javascript caption="Some code"}
let foo = 'bar';
foo += 'more stuff';
```

Each code sample starts with a commented out file path. That's the file you're
editing. Like this:

```{.javascript caption="Code samples have file paths"}
// ./src/App.js

class App ...
```

Commands that you should run in the terminal start with an `$` symbol, like
this:

```
$ npm start
```
