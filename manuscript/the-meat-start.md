{mainmatter}

<!--- begin-lecture title="What you'll build" -->

{#the-meat-start}
# Visualizing data with React and d3.js #

Welcome to the main part of React + D3 2018. We're going to talk a little theory, learn some principles, then get our hands dirty with some examples. Through this book you're going to build:

- [A few small components in Codesandbox](#basic-approach)
- [A choropleth map](#choropleth-map)
- [An interactive histogram](#histogram-of-salaries)
- [A bouncing ball](#bouncing-ball)
- [A swipe transition](#swipe-transition)
- [An animated alphabet](#animated-alphabet)
- [A simple particle generator with Redux](#animating-react-redux)
- [A particle generator pushed to 20,000 elements with canvas](#canvas-react-redux)
- [Billiards simulation with MobX and canvas](#billiards-simulation)
- [A dancing fractal tree](#fractal-tree)

Looks random, right? Bear with me. Examples build on each other. 

The first few examples teach you about static data visualizations and the basics of merging React and D3 using two different approaches.

The choropleth and histogram visualizations teach you about interactivity and components working together.

You learn about game loop and transition animations through two types of bouncing balls. Followed by more complex enter/exit transitions with an animated alphabet.

We look at how far we can push React's performance with a simple particle generator and a dancing fractal tree. A billiards game helps us learn about complex canvas manipulation.

Throughout these examples, we're going to use **React 16**, compatible with **React 17**, **D3v5**, and modern **ES6+** JavaScript syntax. The particle generator also uses **Redux** for the game loop and the billiards simulation uses MobX. We use **Konva** for complex canvas stuff.

That way you can build experience in large portions of the React ecosystem so you can choose what you like best.

Don't worry, if you're not comfortable with modern JavaScript syntax just yet. By the end of this book, you're gonna love it!

Until then, here's an interactive cheatsheet: [es6cheatsheet.com](https://es6cheatsheet.com/). It uses runnable code samples to compare the ES5 way with the ES6 way so you can brush up quickly.

To give you a taste of React alternatives, we'll check out **Preact**, **Inferno**, and **Vue** in the fractal tree example. They're component-based UI frameworks similar to React. Preact is tiny, Inferno is fast, and Vue is about as popular as React.

----

Let's talk about how React and D3 fit together. If there's just one chapter you should read, this is the one. It explains how things work and fit together. Takes you from beginning to being able to figure out the rest on your own.

Although you should still play with the bigger examples. They're fun.

This section has five chapters:

- [A quick intro to D3](#d3-quick-intro)
- [How React makes D3 easier](#basic-approach)
- [When should you use an existing library? Which one?](#existing-libraries)
- [Quickly integrate any D3 code in your React project with Blackbox Components](#blackbox-components)
- [Build scalable dataviz components with full integration](#full-feature-integration)
- [Handling state in your React app](#state-handling-architecture)
- [Structuring your React App](#structuring-your-app)

<!--- end-lecture -->

<!--- end-section -->

<!--- begin-section title="A quick intro to D3" -->

{#d3-quick-intro}
# A quick intro to D3

<!--- begin-lecture title="Why D3" -->

D3 is the best library out there for custom data visualization. It comes with a rich ecosystem of functions for almost anything you can think of. From simple medians, to automatic axis generators, and force diagrams.

Most data visualization you see on the web is built with D3. The New York Times uses it, Guardian uses it, r/dataisbeautiful is full of it.

Learning D3 from scratch is where life gets tricky.

There are several gotchas that trip you up and make examples look like magic. You've probably noticed this, if you ever looked at an example project built with D3. They're full of spaghetti code, global variables, and often aren't made to be maintainable.

Most examples are just one-off toys after all. It's art.

A lot of dataviz that *isn't* art, is charts and graphs. You'll often find that using D3 to build those, is too complicated. D3 gives you more power than you need.

If you want charts, I suggest using a charting library. 

Where many charting libraries fall short is customization. The API is limited, you can't do everything you want, and it gets easier to just build it yourself.

A lot of what you end up doing in real life is finding a D3 example that looks like what you want to build and adapting it. That's why you should learn at least some D3.

But D3 is hard to read. Take this barchart code, for example 👇

{caption: "Barchart in pure D3", line-numbers: false}
```javascript
d3.tsv("data.tsv", function(d) {
  d.frequency = +d.frequency;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); });
});
```

Can you tell what's going on? I'd need to read it pretty carefully.

Which brings us to 👉

<!--- end-lecture -->

<!--- begin-lecture title="3 key insights to learn D3 from scratch" -->

## 3 key insights that help you learn D3.js from scratch

Somebody once asked me how to learn D3.js from scratch. I quipped that it took me writing a book to really learn it. It's one hell of a library.

Most people don't go that far. They don't have to. 

You start with a problem, find similar examples, do some copy pasta, tweak until it works and end up with a working visualization you don't understand. You'd be surprised how few engineers actually understand how their D3 data visualization works.

Fear not! There are just 3 key concepts you have to grok. Then you can understand every D3 example out there. 😱

<!--- end-lecture -->

<!--- begin-lecture title="Data vs. DOM manipulation" -->

### 1) Data manipulation vs. DOM manipulation

All D3 examples are split into two parts: 

1. Data manipulation
2. DOM manipulation 

First you prep your values, then you render.

You have to go through many examples to notice what's going on. Inference learning is hard. Most beginners miss this pattern and it makes D3 look more confusing than it is.

Let's take an example from [D3's docs](https://github.com/d3/d3/wiki/Gallery), a bar chart with a hover effect.

![An example D3 barchart](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/barchart-example.png)

You can [try it online](https://cdn.rawgit.com/mbostock/3885304/raw/a91f37f5f4b43269df3dbabcda0090310c05285d/index.html). When you hover on a bar, it changes color. Pretty neat.

Mike Bostock, the creator of D3, built this chart in 43 lines of code. Here they are 👇

{caption: "Example D3 barchart", line-numbers: false}
```javascript
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(d) {
  d.frequency = +d.frequency;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); });
});
```

There are two parts to this code: Data manipulation and DOM manipulation.

{caption: "Data manipulation code", line-numbers: false}
```javascript
var // ..,
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// ...

d3.tsv("data.tsv", function(d) {
  d.frequency = +d.frequency;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

// ...
});
```

Bostock here first prepares his data: 

- some sizing variables (`margin`, `width`, `height`)
- two scales to help with data-to-coordinates conversion (`x, y`)
- loads his dataset (`d3.tsv`) and updates his scales' domains

In the DOM manipulation part, he puts shapes and objects into an SVG. This is the part that shows up in your browser.

{caption: "DOM manipulation code", line-numbers: false}
```javascript
var svg = d3.select("svg"),
    // ..
    
// ..

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// ..
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); });
});
```

DOM manipulation in D3 happens via D3 selections. They're a lot like jQuery `$(something)`. This is the part we're doing with React later on.

Here Bostock does a few things

- selects the `<svg>` node (`d3.select`)
- appends a grouping `<g>` node (`.append`) with an SVG positioning attribute (translate)
- adds a bottom axis by appending a `<g>`, moving it, then calling `d3.axisBottom` on it. D3 has built-in axis generators
- adds a left axis using the same approach but rotating the ticks
- appends a text label "Frequency" to the left axis
- uses `selectAll.data` to make a virtual selection of `.bar` nodes and attach some data, then for every new data value (.enter), appends a `<rect>` node and gives it attributes

That last part is where people get lost. It looks like magic. Even to me.

It's a declarative approach to rendering data. Works great, hard to understand. That's why we'll do it in React instead :)

You can think of `.enter` as a loop over your data. Everything chained after `.enter` is your loop's body. Sort of like doing `data.map(d => append(rect).setManyAttributes())`

That function executes for any *new* data "entering" your visualization. There's also `.exit` for anything that's dropping out, and `.update` for anything that's changing.

<!--- end-lecture -->

<!--- begin-lecture title="Scales" -->

### 2) Scales

Scales are D3's most versatile concept. They help you translate between two different spaces. Like, mathematical spaces.

They're like the mathematical functions you learned about in school. A domain maps to a range using some sort of formula.

![A basic function](https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Function_color_example_3.svg/440px-Function_color_example_3.svg.png)

Colored shapes in the domain map to colors in the range. No formula for this one. That makes it an ordinal scale.

```javascript
let shapes = d3.scaleOrdinal()
	.domain(['red', 'orange', ...)
	.range(['red', 'orange', ...)
```

[Play with scales on CodeSandbox](https://codesandbox.io/s/r0rw72z75o)

Once you have this scale, you can use it to translate from shapes to colors. `shapes('red triangle')` returns `'red'` for example.

Many different types of scales exist. Linear, logarithmic, quantize, etc. Any basic transformation you can think of exists. The rest you can create by writing custom scales.

You're most often going to use scales to turn your data values into coordinates. But other use-cases exist.

<!--- end-lecture -->

<!--- begin-lecture title="D3 layouts" -->

### 3) D3 layouts

Sure `.enter.append` looks like magic, but D3 layouts are the real mind=blown of the D3 ecosystem. They take your input data and return a full-featured visualization thing.

For example, a force layout using forces between nodes to place them on the screen.

![Force layout](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/force-layout.png)

Or a circle packing layout that neatly packs circles.

![Circle packing layout](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/circle-packing-layout.png)

I don't know the maths that goes into most of these. And that's the point, you shouldn't have to!

Here's a key insight about the magic of layouts: They're the data part.

You take a `forceLayout` and feed it your data. It returns an object with a `tick` event callback.

```javascript
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
```

This `simulation` now handles everything *about* rendering your nodes. Changes their positions on every `tick` callback, figures out how often to change stuff, etc.

But it is up to you to render them. A layout handles your dataviz in the abstract. You're in control of the rendering.

For a force layout, you have to update the DOM on every tick of the animation. For circle packing, you render it once.

Once you grok this, all the fancy visualizations out there start making sense. Also means you can use these fancy layouts in React 🙌

<!--- end-lecture -->

<!--- begin-lecture title="Recap" -->

## Recap

There's a lot more D3 can do, but those are the 3 key insights you need to understand any example you find in the wild.

1. Code is split into data and DOM manipulation
2. Scales are great and used a lot
3. You're always in control of rendering

Then you can start using D3's more advanced features like maps and axes and shape generators and geo computations and data loading and transitions and user interactions.

There's a lot. We're not going to cover it all but you can find those advanced features in the docs and the skills you learn here will help you get started.

<!--- end-lecture -->

<!--- end-section -->

<!--- begin-section title="How React makes D3 easier" -->

<!--- begin-lecture title="React + D3 = ❤️" -->

{#basic-approach}
# How React makes D3 easier

Our visualizations are going to use SVG – an XML-based image format that lets us describe images in terms of mathematical shapes. For example, the source code of an 800x600 SVG image with a rectangle looks like this:

{caption: "SVG rectangle", line-numbers: false}
```html
<svg width="800" height="600">
    <rect width="100" height="200" x="50" y="20" />
</svg>
```

These four lines create an SVG image with a black rectangle at coordinates `(50, 20)` that is 100x200 pixels large. Black fill with no borders is default for SVG shapes.

SVG is perfect for data visualization on the web because it works in all browsers, renders without blurring or artifacts on all screens, and supports animation and user interaction. You can see examples of interaction and animation later in this book.

But SVG can get slow when you have many thousands of elements on screen. We're going to solve that problem by rendering bitmap images with canvas. More on that later.

----

Another nice feature of SVG is that it's just a dialect of XML - nested elements describe structure, attributes describe the details. Same principles that HTML uses.

That makes React's rendering engine particularly suited for SVG. Our 100x200 rectangle from before looks like this as a React component:

{caption: "A simple rectangle in React", line-numbers: false, format: javascript}
```
const Rectangle = () => (
    <rect width="100" height="200" x="50" y="20" />
);
```

To use this rectangle component in a picture, you'd use a component like this:

{caption: "Rect component in a picture", line-numbers: false, format: javascript}
```
const Picture = () => (
    <svg width="800" height="600">
        <Rectangle />
    </svg>
);
```

Sure looks like tons of work for a static rectangle. But look closely! Even if you know nothing about React and JSX, you can look at that code and see that it's a `Picture` of a `Rectangle`.

Compare that to a pure D3 approach:

{caption: "A static rectangle in d3.js", line-numbers: false, format: javascript}
```
d3.select("svg")
  .attr("width", 800)
  .attr("height", 600)
  .append("rect")
  .attr("width", 100)
  .attr("height", 200)
  .attr("x", 50)
  .attr("y", 20);
```

It's elegant, it's declarative, and it looks like function call soup. It doesn't scream *"Rectangle in an SVG"* to as much as the React version does.

You have to take your time and read the code carefully: first, we `select` the `svg` element, then we add attributes for `width` and `height`. After that, we `append` a `rect` element and set its attributes for `width`, `height`, `x`, and `y`.

Those 8 lines of code create HTML that looks like this:

{caption: "HTML of a rectangle", line-numbers: false, format: javascript}
```
<svg width="800" height="600">
    <rect width="100" height="200" x="50" y="20" />
</svg>
```

Would've been easier to just write the HTML, right? Yes, for static images, you're better off using Photoshop or Sketch then exporting to SVG.

Dealing with the DOM is not D3's strong suit. There's a lot of typing, code that's hard to read, it's slow when you have thousands of elements, and it's often hard to keep track of which elements you're changing. D3's enter-update-exit cycle is great in theory, but most people struggle trying to wrap their head around it.

If you don't understand what I just said, don't worry. We'll cover the enter-update-exit cycle in the animations example. 

Don't worry about D3 either. **It's hard!** I've written two books about D3, and I still spend as much time reading the docs as writing the code. The library is huge and there's much to learn. I'll explain everything as we go along.

D3's strong suit is its ability to do everything except the DOM. There are statistical functions, great support for data manipulation, a bunch of built-in data visualizations, magic around transitions and animation ... **D3 can calculate anything for you. All you have to do is draw it out.**

That's why our general approach sounds like this in a nutshell:

* React owns the DOM
* D3 calculates properties

We leverage React for SVG structure and rendering optimizations; D3 for its mathematical and visualization functions.

Now let's look at three different ways of using React and D3 to build data visualization:

- using a library
- quick blackbox components
- full feature integration

<!--- end-lecture -->

<!--- begin-lecture title="What about existing libraries?" -->

{#existing-libraries}
# When should you use an existing library? Which one?

The quickest way to achieve the benefits of integrating React with D3 is to use a library. A collection of components with pre-built charting visualizations. Plug it into your app, move on with life.

Great option for basic charts. I recommend it dearly to anyone who comes to me and asks about building stuff. Try a library first. If it fits your needs, perfect! You just saved yourselves plenty of time.

Where libraries become a problem is when you want to move beyond the library author's idea of How Things Are Done. Custom features, visualizations that aren't just charts, disabling this or that default behavior ... it gets messy.

That's why I rarely use libraries myself. Often find it quicker to build something specific from scratch than figuring out how to hold a generalized API just right.

But they're a great first step. Here's a few of the most popular React & D3 libraries 👇 

List borrowed from [a wonderful Smashing Magazine article](https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/), because it's a good list.

<!--- end-lecture -->

<!--- begin-lecture title="Victory.js" -->

## Victory

> React.js components for modular charting and data visualization

[Victory.js logo](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/victoryjs.gif)](http://formidable.com/open-source/victory/)

Victory offers low level components for basic charting and reimplements a lot of D3's API. Great when you need to create basic charts without a lot of customization. Supports React Native.

Here's what it takes to implement a Barchart using Victory.js. [You can try it on CodeSandbox](https://codesandbox.io/s/3v3q013x36)

{caption: "Bar chart in Victory.js", line-numbers: false}
```javascript
const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

const App = () => (
  <div style={styles}>
    <h1>Victory basic demo</h1>
    <VictoryChart domainPadding={20}>
      <VictoryBar data={data} x="quarter" y="earnings" />
    </VictoryChart>
  </div>
);
```

Create some fake data, render a `<VictoryChart>` rendering area, add a `<VictoryBar>` component, give it data and axis keys. Quick and easy.

My favorite feature of Victory is that components use fake random data until you pass your own. Means you always know what to expect.

<!--- end-lecture -->

<!--- begin-lecture title="Recharts" -->

## Recharts

> A composable charting library built on React components

[Recharts homepage](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/recharts.png)

Recharts is like a more colorful Victory. A pile of charting components, some customization, loves animating everything by default.

Here's what it takes to implement a Barchart using Recharts. [You can try it on CodeSandbox](https://codesandbox.io/s/mmkrjl7qxp)

{code-samples: "Bar chart in Recharts", line-numbers: false}
```javascript
const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

const App = () => (
  <div style={styles}>
    <h1>Recharts basic demo</h1>
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="quarter" />
      <YAxis dataKey="earnings" />
      <Bar dataKey="earnings" />
    </BarChart>
  </div>
);
```

More involved than Victory, but same principle. Fake some data, render a drawing area this time with `<BarChart>` and feed it some data. Inside the `<BarChart>` render two axes, and a `<Bar>` for each entry.

Recharts hits a great balance of flexibility and ease ... unless you don't like animation by default. Then you're in trouble.

<!--- end-lecture -->

<!--- begin-lecture title="Nivo" -->

## Nivo

> nivo provides a rich set of dataviz components, built on top of the awesome d3 and Reactjs libraries.

[Nivo homepage](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/nivo.gif)

Nivo is another attempt to give you a set of basic charting components. Comes with great interactive documentation, support for Canvas and API rendering. Plenty of basic customization.

Here's what it takes to implement a Barchart using Nivo. [You can try it on CodeSandbox](https://codesandbox.io/s/n1wwkvq24)

{caption: "Bar chart in Nivo", line-numbers: false}
```javascript
const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

const App = () => (
  <div style={styles}>
    <h1>Nivo basic demo</h1>
    <div style={{ height: "400px" }}>
      <ResponsiveBar data={data} keys={["earnings"]} indexBy="quarter" />
    </div>
  </div>
);
```

Least amount of effort! You render a `<ResponsiveBar>` component, give it data and some params, and Nivo handles the rest.

Wonderful! But means you have to learn a whole new language of configs and props that might make your hair stand on end. The documentation is great and shows how everything works, but I found it difficult to know which prop combinations are valid.

<!--- end-lecture -->

<!--- begin-lecture title="VX" -->

## VX

> vx is collection of reusable low-level visualization components. vx combines the power of d3 to generate your visualization with the benefits of react for updating the DOM.

[VX](vx.png)

VX is the closest to the approaches you're learning in this book. React for rendering, D3 for calculations. When you build a set of custom components for your organization, a flavor of VX is what you often come up with.

That's why I recommend teams use VX when they need to get started quickly.

Here's what it takes to implement a Barchart using Nivo. [You can try it on CodeSandbox](https://codesandbox.io/s/k5853pryrv)

{caption: "Bar chart built in VX", line-numbers: false}
```javascript
const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

const App = ({ width = 400, height = 400 }) => {
  const xMax = width;
  const yMax = height - 120;

  const x = d => d.quarter;
  const y = d => d.earnings;

  // scales
  const xScale = scaleBand({
    rangeRound: [0, xMax],
    domain: data.map(x),
    padding: 0.4
  });
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, max(data, y)]
  });

  return (
    <div style={styles}>
      <h1>VX basic demo</h1>
      <svg width={width} height={height}>
        {data.map((d, i) => {
          const barHeight = yMax - yScale(y(d));
          return (
            <Bar
              width={xScale.bandwidth()}
              height={barHeight}
              x={xScale(x(d))}
              y={yMax - barHeight}
              data={{ x: x(d), y: y(d) }}
            />
          );
        })}
      </svg>
    </div>
  );
};
```

Move involved than previous examples, but means you have more control and fight the library less often. VX does the tedious stuff for you, so you can focus on the stuff that matters.

This code creates value accessor methods, D3 scales, then iterates over an array of `data` and renders a `<Bar` for each. The bar gets a bunch of props.

<!--- end-lecture -->

<!--- begin-lecture title="When you shouldn't use a library" -->

## When not to use a library

Libraries are great. Quick to get started, quick to keep using, great for common usecases.

Now, if you want to build something custom, something that delights and astounds, something that makes your users love you ... You're gonna have to understand how combining React and D3 works under the hood. Whether you use a library or not.

A rule of thumb you can use is to consider how custom you want to make your visualization. The more customizations, the more likely you are to benefit from rolling your own.

Or if you've had a lot of practice with rolling your own and it's literally easier than learning a library.

If you have to customize an existing library, or build your own for the team, that's what we're here for today :)

<!--- end-lecture -->

<!--- end-section -->

<!--- begin-section title="Quickly integrate any D3 code in your React project with Blackbox Components" -->

<!--- begin-lecture title="The idea behind blackbox components" -->

{#blackbox-components}
# Quickly integrate any D3 code in your React project with Blackbox Components

Blackbox components are the quickest way to integrate D3 and React. You can think of them as wrappers around D3 visualizations.

With the blackbox approach, you can take any D3 example from the internets or your brain, wrap it in a React component, and it Just Works™. This is great when you're in a hurry, but comes with a big caveat: You're letting D3 control some of the DOM.

D3 controlling the DOM is *okay*, but it means React can't help you there. That's why it's called a Blackbox – React can't see inside.

No render engine, no tree diffing, no dev tools to inspect what's going. Just a blob of DOM elements.

Okay for small components or when you're prototyping, but I've had people come to my workshops and say *"We built our whole app with the blackbox approach. It takes a few seconds to re-render when you click something. Please help"*

🤔

Here's how it works:
- React renders an anchor element
- D3 hijacks it and puts stuff in

You manually re-render on props and state changes. Throwing away and rebuilding the entire DOM subtree on each render. With complex visualizations this becomes a huge hit on performance.

Use this technique sparingly.

<!--- end-lecture -->

<!--- begin-lecture title="A quick blackbox example - a D3 axis" -->

{#blackbox-axis}
## A quick blackbox example - a D3 axis

Let's build an axis component. Axes are the perfect use-case for blackbox components. D3 comes with an axis generator bundled inside, and they're difficult to build from scratch.

They don't *look* difficult, but there are many tiny details you have to get _just right_.

D3's axis generator takes a scale and some configuration to render an axis for us. The code looks like this:

{caption: "Vanilla D3 axis",line-numbers: false, format: javascript}
```
const scale = d3.scaleLinear()
		.domain([0, 10])
		.range([0, 200]);
const axis = d3.axisBottom(scale);

d3.select('svg')
  .append('g')
  .attr('transform', 'translate(10, 30)')
  .call(axis);
```

You can [try it out on CodeSandbox](https://codesandbox.io/s/v6ovkow8q3).

If this code doesn't make any sense, don't worry. There's a bunch of D3 to learn, and I'll help you out. If it's obvious, you're a pro! This book will be much quicker to read.

We start with a linear scale that has a domain `[0, 10]` and a range `[0, 200]`. Scales are like mathematical functions that map a domain to a range. In this case, calling `scale(0)` returns `0`, `scale(5)` returns `100`, `scale(10)` returns `200`. Just like a linear function from math class – y = kx + n.

We create an axis generator with `axisBottom`, which takes a `scale` and creates a `bottom` oriented axis – numbers below the line. You can also change settings for the number of ticks, their sizing, spacing, and so on.

Equipped with an `axis` generator, we `select` the `svg` element, append a grouping element, use a `transform` attribute to move it `10`px to the right and `30`px down, and invoke the generator with `.call()`.

It creates a small axis:

![Simple axis](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/simple-axis.png)

Play around with it on [Codesandbox](https://codepen.io/swizec/pen/YGoYBM). Change the scale type, play with axis orientation. Use `.ticks` on the axis to change how many show up. Have some fun :)

<!--- end-lecture -->

<!--- begin-lecture title="A React + D3 axis" -->

## A quick blackbox example - a React+D3 axis

Now let's say we want to use that same axis code but as a React component. The simplest way is to use a blackbox component approach like this:

{caption: "React blackbox axis", line-numbers: false, format: javascript}
```
class Axis extends Component {
	gRef = React.createRef();
		
	componentDidMount() { this.d3render() }
	componentDidUpdate() { this.d3render() }

	d3render() {
		const scale = d3.scaleLinear()
	                  .domain([0, 10])
	                  .range([0, 200]);
    	const axis = d3.axisBottom(scale);

		d3.select(this.gRef)
		  .call(axis);  
	}

	render() {
    	return <g transform="translate(10, 30)" ref={this.gRef} />
	}
}
```

So much code! Worth it for the other benefits of using React in your dataviz. You'll see :)

We created an `Axis` component that extends React's base `Component` class. We can't use functional components because we need lifecycle hooks. 

Our component has a `render` method. It returns a grouping element (`g`) moved 10px to the right and 30px down using the `transform` attribute. Same as before.

A React ref saved in `this.gRef` and passed into our `<g>` element with `ref` lets us talk to the DOM node directly. We need this to hand over rendering control to D3.

The `d3render` method looks familiar. It's the same code we used in the vanilla D3 example. Scale, axis, select, call. Only difference is that instead of selecting `svg` and appending a `g` element, we select the `g` element rendered by React and use that.

We use `componentDidUpdate` and `componentDidMount` to keep our render up to date. Ensures that our axis re-renders every time React's engine decides to render our component.

That wasn't so bad, was it? 

[Try it out on Codesandbox](https://codesandbox.io/s/3xy2jr1y5m).

You can make the axis more useful by getting positioning, scale, and orientation from props. We'll do that in our big project.

### Practical exercise

Try implementing those as an exercise. Make the axis more reusable with some carefully placed props.

Here's my solution, if you get stuck 👉 [https://codesandbox.io/s/5ywlj6jn4l](https://codesandbox.io/s/5ywlj6jn4l)

<!--- end-lecture -->

<!--- begin-lecture title="A D3 blackbox higher order component - HOC" -->

{#blackbox-hoc}
# A D3 blackbox higher order component – HOC

After that example you might think this is hella tedious to implement every time. You'd be right!

Good thing you can abstract it all away with a higher order component – a HOC. Now this is something I should open source (just do it already), but I want to show you how it works so you can learn about the HOC pattern.

Higher order components are great when you see multiple React components sharing similar code. In our case, that shared code is:

- rendering an anchor element
- calling D3's render on updates

With a HOC, we can abstract that away into a sort of [object factory](https://en.wikipedia.org/wiki/Factory_method_pattern). It's an old concept making a comeback now that JavaScript has classes.

Think of our HOC as a function that takes some params and creates a class – a React component. Another way to think about HOCs is that they're React components wrapping other React components and a function that makes it easy.

A HOC for D3 blackbox integration, called `D3blackbox`, looks like like this:

{caption: "React blackbox HOC", line-numbers: false, format: javascript}
```
function D3blackbox(D3render) {
	return class Blackbox extends React.Component {
		anchor = React.createRef();
		
		componentDidMount() { D3render.call(this); }
		componentDidUpdate() { D3render.call(this) }

		render() {
	    const { x, y } = this.props;
	    return <g transform={`translate(${x}, ${y})`} ref={this.anchor} />;
		}
	}
}
```

You'll recognize most of that code from earlier. 

We have `componentDidMount` and`componentDidUpdate` lifecycle hooks that call `D3render` on component updates. `render` renders a grouping element as an anchor with a ref so D3 can use it to render stuff into.

Because `D3render` is no longer a part of our component, we have to use `.call` to give it the scope we want: this class, or rather `this` instance of the `Blackbox` class.

We've also made some changes that make `render` more flexible. Instead of hardcoding the `translate()` transformation, we take `x` and `y` props. `{ x, y } = this.props` takes `x` and `y` out of `this.props` using object decomposition, and we used ES6 string templates for the `transform` attribute.

Consult the [ES6 cheatsheet](https://es6cheatsheet.com/) for details on the syntax.

Using our new `D3blackbox` HOC to make an axis looks like this:

{caption: "React blackbox HOC", line-numbers: false, format: javascript}
```
const Axis = D3blackbox(function () {
    const scale = d3.scaleLinear()
	            .domain([0, 10])
	            .range([0, 200]);
    const axis = d3.axisBottom(scale);

    d3.select(this.anchor)
      .call(axis);    
});
```

You know this code! We copy pasted our axis rendering code from before, wrapped it in a function, and passed it into `D3blackbox`. Now it's a React component.

Play with this example on [Codesandbox, here](https://codesandbox.io/s/5v21r0wo4x).

<!--- end-lecture -->

<!--- begin-lecture title="D3blackbox magic trick - render anything in 30 seconds" -->

{#magic-trick}
## D3blackbox magic trick – render anything in 30 seconds

Let me show you a magic trick. 30 seconds to take a random D3 piece of code and add it to your React project.

We can try it on the example barchart from before.

![An example D3 barchart](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/barchart-example.png)

You can [try it online](https://cdn.rawgit.com/mbostock/3885304/raw/a91f37f5f4b43269df3dbabcda0090310c05285d/index.html). When you hover on a bar, it changes color. Pretty neat.

I recommend you follow along in a CodeSandbox. If you fork the [react-d3-axis-hoc CodeSandbox](https://codesandbox.io/s/5v21r0wo4x) that will be easiest.

You should already have the `D3blackbox` HOC. If you don't, make a new file and paste it in.

With your HOC ready, create a new file in CodeSandbox. Call it `Barchart.js`.

Add your imports:

{caption: "Import dependencies", line-numbers: false}
```javascript
import React from 'react';
import D3blackbox from './D3blackbox';
import * as d3 from 'd3';
```

This gives you React, our HOC, and D3.

Now right-click view code on that barchart and copy the code. Wrap it in a `D3blackbox` call. Like this:

{caption: "Wrap D3 code in D3blackbox", line-numbers: false}
```javascript
const Barchart = D3blackbox(function () {
	var svg = d3.select("svg"),
	    margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height") - margin.top - margin.bottom;
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	    y = d3.scaleLinear().rangeRound([height, 0]);
	
	var g = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	d3.tsv("data.tsv", function(d) {
	  d.frequency = +d.frequency;
	  return d;
	}, function(error, data) {
	  if (error) throw error;
	
	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
	
	  g.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));
	
	  g.append("g")
	      .attr("class", "axis axis--y")
	      .call(d3.axisLeft(y).ticks(10, "%"))
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", "0.71em")
	      .attr("text-anchor", "end")
	      .text("Frequency");
	
	  g.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.letter); })
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("width", x.bandwidth())
	      .attr("height", function(d) { return height - y(d.frequency); });
	});
})

export default Barchart;
```

That should throw some errors. We have to change the `d3.select` and get `width` and `height` from props.

{caption: "Change where D3 renders", line-numbers: false}
```javascript
const Barchart = D3blackbox(function () {
  // markua-start-delete
	var svg = d3.select("svg"),
  // markua-end-delete
  // markua-start-insert
  var svg = d3.select(this.anchor.current)
  // markua-end-insert
	    margin = {top: 20, right: 20, bottom: 30, left: 40},
	    // markua-start-delete
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height") - margin.top - margin.bottom;
	    // markua-end-delete
	    // markua-start-insert
	    width = +this.props.width - margin.left - margin.right,
	    height = +this.props.height - margin.top - margin.bottom;
	    // markua-end-insert
```


Most D3 examples use a global `svg` variable to refer to their drawing area – the SVG. Change that to the element you want, your anchor, and the whole visualization should render in there.

We also replaced reading width and height from the SVG element to getting them from props. This makes our component more reusable and better follows best practices.

Next step is to change where our barchart gets its data. Gotta use the public URL.

{caption: "Change data URL", line-numbers: false}
```javascript
//markua-start-delete
d3.tsv("data.tsv", function(d) {
// markua-end-delete
// markua-start-insert
d3.tsv("https://cdn.rawgit.com/mbostock/3885304/raw/a91f37f5f4b43269df3dbabcda0090310c05285d/data.tsv", function(d) {
// markua-end-insert
	  d.frequency = +d.frequency;
	  return d;
// markua-start-delete
	}, function(error, data) {
	  if (error) throw error;
// markua-end-delete
// markua-start-insert
	}).then(function(data) {
// markua-end-insert
```

Same link, absolute version. And we updated the callback-based code to use the D3v5 promises version. That's the most disruptive change going from v4 to v5 I believe.

That's it. You now have a Barchart component that renders the example barchart from D3's docs.

You can use it like this 👇 I recommend adding this code to the main App component that CodeSandbox creates for you.

{caption: "Use the Barchart", line-numbers: false}
```javascript
import Barchart from './Barchart';

// ...
return (
	<svg width="800" height="600">
		<Barchart x={10} y={10} width={400} height={300} />
	</svg>
)
```

But like I said, don't use this in production. It's great for quick prototypes, trying stuff out, or seeing how an existing visualization might fit your app.

<!--- end-lecture -->

<!--- end-section -->

<!--- begin-section title="Build scalable dataviz components with full integration" -->

<!--- begin-lecture title="The approach" -->

{#full-feature-integration}
# Build scalable dataviz components with full integration

As useful as blackbox components are, we need something better if we want to leverage React's rendering engine. The blackbox approach in particular struggles with scale. The more charts and graphs and visualizations on your screen, the slower it gets.

Someone once came to my workshop and said *"We used the blackbox approach and it takes several seconds to re-render our dashboard on any change. I'm here to learn how to do it better."*

In our full-feature integration, React does the rendering and D3 calculates the props.

Our goal  is to build controlled components that listen to their props and reconcile that with D3's desire to use a lot of internal state.

There are two situations we can find ourselves in:

1. We know for a fact our component's props never change
2. We think props could change

It's easiest to show you with an example.

Let's build a scatterplot step by step. Take a random array of two-dimensional data, render in a loop. Make magic.

Something like this 👇

![A simple scatterplot](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/scatterplot.png)

You've already built the axes! Copy pasta time.

<!--- end-lecture -->

<!--- begin-lecture title="When props don't change - a scatterplot" -->

## Props don't change

Ignoring props changes makes our life easier, but the component less flexible and reusable. Great when you know in advance that there are features you don't ned to support.

Like, no filtering your data or changing component size 👉 means your D3 scales don't have to change.

When our props don't change, we follow a 2-step integration process:

* set up D3 objects as class properties
* output SVG in `render()`

We don't have to worry about updating D3 objects on prop changes. Work done 👌

### An unchanging scatterplot

We're building a scatterplot of random data. You can see the [final solution on CodeSandbox](https://codesandbox.io/s/1zlp4jv494)

Here's the approach 👇

- stub out the basic setup
- generate random data
- stub out Scatterplot
- set up D3 scales
- render circles for each entry
- add axes

I recommend creating a new CodeSandbox, or starting a new app with create-react-app. They should work the same.

#### Basic setup

Make sure you have `d3` added as a dependency. Then add imports in your `App.js` file.

{caption: "Import files in App.js", line-numbers: false}
```javascript
// ./App.js

import * as d3 from "d3";
import Scatterplot from "./Scatterplot";
```

Add an `<svg>` and render a Scatterplot in the render method. This will throw an error because we haven't defined the Scatterplot yet and that's okay.

{caption: "Render Scatterplot in App.js", line-numbers: false}
```javascript
// ./App.js

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <svg width="800" height="800">
        <Scatterplot x={50} y={50} width={300} height={300} data={data} />
      </svg>
    </div>
  );
}
```

CodeSandbox adds most of that code by default. If you're using create-react-app, your App component has different markup. That's okay too.

We added this part:

```javascript
<svg width="800" height="800">
	<Scatterplot x={50} y={50} width={300} height={300} data={data} />
</svg>
```

An `<svg>` drawing area with a width and a height. Inside, a `<Scatterplot` that's positioned at `(50, 50)` and is 300px tall and wide. We'll have to listen to those props when building the Scatterplot.

It also accepts data.

#### Random data

We're using a line of code to generate data for our scatterplot. Put it in App.js. Either globally or within the App  function. Doesn't matter because this is an example.

{caption: "Generate random data", line-numbers: false}
```javascript
const data = d3.range(100)
							 .map(_ => [Math.random(), Math.random()]);
```

`d3.range` returns a counting array from 0 to 100. Think `[1,2,3,4 ...]`.

We iterate over this array and return a pair of random numbers for each entry. These will be our X and Y coordinates.

#### Scatterplot

Our scatterplot goes in a new `Scatterplot.js` file. Starts with imports and an empty React component.

{caption: "Scatterplot stub", line-numbers: false}
```javascript
// ./Scatterplot.js
import React from "react";
import * as d3 from "d3";

class Scatterplot extends React.Component {

  render() {
    const { x, y, data, height } = this.props;

    return (
      <g transform={`translate(${x}, ${y})`}>
 
      </g>
    );
  }
}

export default Scatterplot;
```

Import dependencies, create a `Scatterplot` component, render a grouping element moved to the correct `x` and `y` position. Nothing too strange yet.

#### D3 scales

Now we define D3 scales as component properties. We're using the class field syntax that's common in React projects.

Technically a Babel plugin, but comes by default with CodeSandbox React projects and create-react-app setup. As far as I can tell, it's a common way to write React components.

{caption: "Add D3 scales", line-numbers: false}
```javascript
// ./Scatterplot.js
class Scatterplot extends React.Component {
  xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, this.props.width]);
  yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([this.props.height, 0]);
```

We're defining `this.xScale` and `this.yScale` as linear scales. Their domains go from 0 to 1 because that's what Math.random returns and their ranges describe the size of our scatterplot component.

Idea being that these two scales will help us take those tiny variations in datapoint coordinates and explode them up to the full size of our scatterplot. Without this, they'd overlap and we wouldn't see anything.

#### Circles for each entry

Rendering our data points is a matter of looping over the data and rendering a `<circle>` for each entry. Using our scales to define positioning.

{caption: "Loop through data and render circles", line-numbers: false}
```javascript
// ./Scatterplot.js

return (
  <g transform={`translate(${x}, ${y})`}>
    {data.map(([x, y]) => (
      <circle cx={this.xScale(x)} cy={this.yScale(y)} r="5" />
    ))}
  </g>
);
```

In the `return` statement of our `render` render method, we add a `data.map` with an iterator method. This method takes our datapoint, uses array destructuring to get `x` and `y` coordinates, then uses our scales to define `cx` and `cy` attributes on a `<circle>` element.

#### Add axes

You can reuse axes from our earlier exercise. Or copy mine from [the CodeSandbox](https://codesandbox.io/s/1zlp4jv494)

Mine take a scale and orientation as props, which makes them more flexible. Means we can use the same component for both the vertical and horizontal axis on our Scatterplot.

Put the axis code in `Axis.js`, then augment the Scatterplot like this 👇

{caption: "Add axes to Scatterplot", line-numbers: false}
```javascript
import Axis from "./Axis";

// ...

return (
  <g transform={`translate(${x}, ${y})`}>
    {data.map(([x, y]) => (
      <circle cx={this.xScale(x)} cy={this.yScale(y)} r="5" />
    ))}
    <Axis x={0} y={0} scale={this.yScale} type="Left" />
    <Axis x={0} y={height} scale={this.xScale} type="Bottom" />
  </g>
);
```

Vertical axis takes the vertical `this.yScale` scale, orients to the `Left` and we position it top left. The horizontal axis takes the horizontal `this.xScale` scale, orients to the `Bottom`, and we render it bottom left.

Your Scatterplot should now look like this

![Rendered basic scatterplot](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/scatterplot-basic.png)

<!--- end-lecture -->

<!--- begin-lecture title="A scatterplot When props do change" -->

## Props might update

The story is a little different when our props might update. Since we're using D3 objects to calculate SVG properties, we have to make sure those objects are updated *before* we render.

No problem in React 15: Update in `componentWillUpdate`. But since React 16.3 we've been told never to use that again. Causes problems for modern async rendering.

The official recommended solution is that anything that used to go in `componentWillUpdate`, can go in `componentDidUpdate`. But not so fast! 

Updating D3 objects in `componentDidUpdate` would mean our visualization always renders one update behind. Stale renders! 😱

The new `getDerivedStateFromProps` to the rescue. Our integration follows a 3-step pattern:

*   set up D3 objects in component state
*   update D3 objects in `getDerivedStateFromProps`
*   output SVG in `render()`

`getDerivedStateFromProps` is officially discouraged, and yet the best tool we have to make sure D3 state is updated *before* we render.

Because React calls `getDerivedStateFromProps` on every component render, not just when our props actually change, you should avoid recalculating complex things too often. Use memoization helpers, check for changes before updating, stuff like that.

### An updateable scatterplot

Let's update our scatterplot so it can deal with resizing and updating data. 

3 steps 👇

- add an interaction that resizes the scatterplot
- move scales to state
- update scales in `getDerivedStateFromProps`

You can see [my final solution on CodeSandbox](https://codesandbox.io/s/ll9kp8or0l). I recommend you follow along updating your existing code.

#### Resize scatterplot on click

To test our scatterplot's adaptability, we have to add an interaction: Resize the scatterplot on click.

That change happens in `App.js`. Click on the `<svg>`, reduce width and height by 30%.

Move sizing into App state and add an `onClick` handler.

{caption: "Sizing into state and click handler", line-numbers: false}
```javascript
// App.js
class App extends React.Component {
  state = {
    width: 300,
    height: 300
  };

  onClick = () => {
    const { width, height } = this.state;
    this.setState({
      width: width * 0.7,
      height: height * 0.7
    });
  };

  render() {
    const { width, height } = this.state;
```

We changed our App component from a function to a class, added `state` with default `width` and `height`, and an `onClick` method that reduces size by 30%. The `render` method reads `width` and `height` from state.

Now gotta change rendering to listen to these values and fire the `onClick` handler.

{caption: "Use state in rendering", line-numbers: false}
```javascript
// App.js

<svg width="800" height="800" onClick={this.onClick}>
  <Scatterplot
    x={50}
    y={50}
    width={width}
    height={height}
    data={data}
  />
</svg>
```

Similar rendering as before. We have an `<svg>` that contains a `<Scatterplot>`. The svg fires `this.onClick` on click events and the scatterplot uses our `width` and `height` values for its props.

If you try this code now, you should see a funny effect where axes move, but the scatterplot doesn't resize.

![Axes move, scatterplot doesn't resize](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/not-resizing-scatterplot.png)

Peculiar isn't it? Try to guess why.

#### Move scales to state

The horizontal axis moves because it's render at `height` vertical coordinate. Datapoints don't move because the scales that position them are calculated once – on component mount.

First step to keeping scales up to date is to move them from component values into state.

{caption: "Move scales into state", line-numbers: false}
```javascript
// Scatterplot.js
class Scatterplot extends React.Component {
  state = {
    xScale: d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, this.props.width]),
    yScale: d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.props.height, 0])
  };
```

Same scale definition code we had before. Linear scales, domain from 0 to 1, using props for ranges. But now they're wrapped in a `state = {}` object and it's `xScale: d3 ...` instead of `xScale = d3 ...`.

Our render function should use these as well. Small change:

{caption: "Render function uses state scales", line-numbers: false}
```javascript
// Scatterplot.js
	render() {
    const { x, y, data, height } = this.props,
      { yScale, xScale } = this.state;

    return (
      <g transform={`translate(${x}, ${y})`}>
        {data.map(([x, y]) => <circle cx={xScale(x)} cy={yScale(y)} r="5" />)}
```

We use destructuring to take our scales from state, then use them when mapping over our data. 

Clicking on the SVG produces the same result as before, but we're almost there. Just one more step.

#### Update scales in `getDerivedStateFromProps`

Last step is to update our scales' ranges in `getDerivedStateFromProps`. This method runs every time React touches our component for any reason.

{caption: "Update scales", line-numbers: false}
```javascript
// Scatterplot.js
class Scatterplot extends React.PureComponent {
	// ..
  static getDerivedStateFromProps(props, state) {
    const { yScale, xScale } = state;

    yScale.range([props.height, 0]);
    xScale.range([0, props.width]);

    return {
      ...state,
      yScale,
      xScale
    };
  }
```

Take scales from state, update ranges with new values, return new state. Nice and easy.

Notice that `getDerivedStateFromProps` is a static method shared by all instances of our Scatterplot component. You have no reference to a `this` and have to calculate new state purely from the `props` and `state` passed into your method.

It's a lot like a Redux reducer, if that helps you think about it. If you don't know what Redux reducers are, don't worry. Just remember to return a new version of component state.

Your Scatterplot should now update its size on every click.

![Scatterplot resizes](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/scatterplot-resizes.png)

<!--- end-lecture -->

<!--- begin-lecture title="Making your components more flexible with render props" -->

## Making your components more flexible with render props

Our scatterplot doesn't look quite as nice as the earlier screenshot. Regular SVG circles with no styling just can't match up.

What if we wanted to render beautiful circles? Or stars? Or maybe something else entirely?

We can use render props to give users of our scatterplot component the power to define how they want datapoints to render. 😱

Think of it as a sort of inversion of control. Another common buzzword are "slots", or renderless components. The idea is that one of our props accepts a React component.

We then use that prop to render our datapoints.

It looks a little like this 👇

```jsx
<Scatterplot
	x={10} y={10}
	data={data}
	datapoint={(props) => <Datapoint {...props} />}
>
```

What's more, we can add interactions and other useful stuff to our `<Datapoint>` and `<Scatterplot>` doesn't have to know anything about it. All the scatterplot cares about is rendering two axes and a bunch of datapoints.

Let's use the render prop approach to make our scatterplot more reusable.

Steps 👇

- pass in a render prop
- use it to render datapoints
- make datapoint component look nice

You can see [my solution on CodeSandbox](https://codesandbox.io/s/j73xlyr8v5). I recommend you follow along with your existing code.

### Pass in a render prop

React components are Just JavaScript. Either a JSX function call or a function that returns some JSX.

That means we can pass them into components via props. Let's do that in App.js

{caption: "Pass render prop into Scatterplot", line-numbers: false}
```javascript
// App.js

import Datapoint from "./Datapoint";

//..
<svg width="800" height="800" onClick={this.onClick}>
  <Scatterplot
    x={50}
    y={50}
    width={width}
    height={height}
    data={data}
    datapoint={({ x, y }) => <Datapoint x={x} y={y} />}
  />
</svg>
```

For extra flexibility and readability we're wrapping our `<Datapoint>` component in another function that accepts `x` and `y` coordinates. This is a common pattern you'll see with render props 👉 it gives you the ability to pass in props from both the rendering component and the component that's setting the render prop.

Say we wanted Datapoint to know something about our App *and* our Scatterplot. The scatterplot calls this function with coordinates. We pass those into `<Datapoint>`. And because the method is defined inside App, we could pass-in anything that's defined in the App. Like perhaps `data`.

Your code will start throwing an error now. Datapoint isn't defined. Don't worry, it's coming soon.

### Use render prop to render datapoints

To use our new `datapoint` render prop, we have to change how we render the scatterplot. Instead of returning a `<circle>` for each iteration of the dataset, we're calling a function passed in from props.

{caption: "Accept a render prop", line-numbers: false}
```javascript
// Scatterplot.js
  render() {
    const { x, y, data, height, datapoint } = this.props,
      { yScale, xScale } = this.state;

    return (
      <g transform={`translate(${x}, ${y})`}>
        {data.map(([x, y]) => datapoint({ 
		        x: xScale(x), 
		        y: yScale(y) 
		    }))}
```

We take the `datapoint` function from props and call it in `data.map` making sure to pass in `x` and `y` as an object. Calling functions with objects like this is a common JavaScript pattern to fake named arguments.

### Make datapoint component look nice

We've got all the rendering, now all we need is the `<Datapoint`  component itself. That goes in a new `Datapoint.js` file.

{caption: "Datapoint file", line-numbers: false}
```javascript
import React from "react";
import styled from "styled-components";

const Circle = styled.circle`
  fill: steelblue;
  fill-opacity: .7;
  stroke: steelblue;
  stroke-width: 1.5px;
`;

class Datapoint extends React.Component {
  render() {
    const { x, y } = this.props;

    return (
      <Circle
        cx={x}
        cy={y}
        r={3}
      />
    );
  }
}

export default Datapoint;
```

I'm using styled-components to define the CSS for my Datapoint. You can use whatever you prefer. I like styled components because they're a good balance between CSS-in-JS and normal CSS syntax.

The component itself renders a styled circle using props for positioning and a radius of 3 pixels.

![Finished scatterplot](scatterplot-finished.png)

For an extra challenge, try rendering circle radius from state and changing datapoint size on mouse over. Make the scatterplot interactive.

<!--- end-lecture -->

<!--- end-section -->

<!--- begin-section title="You're awesome" -->

<!--- begin-lecture title="💪" -->

# You're awesome

You know the basics! 

You can take any D3 example from the internets and wrap it in a React component, *and* you know how to build React+D3 components from scratch. You're amazing. High five! 🖐

The rest of this book is about using these concepts and pushing them to the limits of practicality. We're going to build an interactive visualization of tech salaries compared to median household income. 

Why? Because it piqued my interest, and because it shows why you should call yourself an engineer, not a programmer or a developer. **You're an engineer**. Remember that.

Throughout the example, you'll learn more details of D3, tidbits from React, and the animation chapter is going to blow your mind. 

Super fun!

![Default view](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/full-dataviz.png)

![After a click](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/interaction-dataviz.png)

<!--- end-lecture -->

<!--- end-section -->

<!--- begin-section title="A note about state" -->

<!--- begin-lecture title="Handling state in your React app" -->

{#state-handling-architecture}
# Handling state in your React app

Before I can set you loose on the world, we should talk about managing state. It's where most engineers shoot themselves in the foot.

You'll notice you shot yourself in the foot six months ago when all of a sudden it becomes near impossible to build new features, add functionality, and know what's going on with your app. If you find yourself spending a lot of time confused about why your UI does something, you've shot yourself in the foot.

Don't worry tho, happens to everyone!

I shoot myself in the foot all the time. You can't predict how your app is going to evolve. You can't know how technology is going to improve. Can't know how your team will grow.

Best approach is to optimize for change. 

Otherwise you might have to do a rewrite. Rewrites are bad. One of the most infamous rewrite story is about [The Rewrite that Killed Netscape](http://www.joelonsoftware.com/articles/fog0000000069.html). You might not even have heard of Netscape ;)

Let's save you from that.

<!--- end-lecture -->

<!--- begin-lecture title="Basic architecture we'll use" -->

{#basic-architecture}
## Basic architecture

![Unidirectional data flow](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/unidirectionalflow.png)

We're using a unidirectional data flow architecture with a single source of truth. That means you always know what to expect. Think of your app as a giant circle.

Data goes from your source of truth into your components. Events go from your components into your source of truth. All in one direction

![The basic architecture](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/architecture.png)

Our main App component holds state for your entire application. Anything that multiple components should be aware of lives here. This state flows down the hierarchy via props. Changes happen via callbacks, also passed down through props.

Like this 👇

* The Main Component – `App` – holds the truth
* Truth flows down through props
* Child components react to user events
* They announce changes using callbacks
* The Main Component updates its truth
* Updates flow back down the chain
* UI updates through re-renders

This looks roundabout, but it's amazing. Far better than worrying about parts of the UI growing out of sync with the rest of your app. I could talk your ear off with debugging horror stories, but I'm nice, so I won't.

When a user clicks one of our controls, a `Toggle`, it invokes a callback. This in turn invokes a callback on `ControlRow`, which invokes a callback on `Controls`, which invokes a callback on `App`.

![Callback chain](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/architecture_callbacks.png)

With each hop, the nature of our callback changes. `Toggle`  tells `ControlRow` which entry was toggled, `ControlRow` tells `Controls` how to update the data filter function, and `Controls` gives `App` a composite filter built from all the controls. You'll see how that works in the next chapter.

All you have to remember right now is that callbacks evolve from passing low-level information to high-level business logic. Starts with *"I was clicked"* ends with *"Update visualization filter"*

When the final callback is invoked, `App` updates its repository of truth – `this.state` – and communicates the change back down the chain via props. No additional wiring needed on your part. React's got you covered. 

![Data flows down](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/architecture_dataflow.png)

You can think of it like calling functions with new arguments. Because the functions – components – render the UI, your interface updates.

Because your components are well-made and rely on their props to render, React's engine can optimize these changes. It compares the new and old component trees and decides which components to re-render and which to leave alone.

Functional programming for HTML! 😎

The functional programming concepts we're relying on are called [referential transparency](https://en.wikipedia.org/wiki/Referential_transparency), [idempotent functions](https://en.wikipedia.org/wiki/Idempotence), and [functional purity](https://en.wikipedia.org/wiki/Pure_function). I suggest Googling them if you want to learn the theory behind it all.

<!--- end-lecture -->

<!--- begin-lecture title="What about React Context? Redux? MobX?" -->

## What about React Context? Redux? MobX?

You may have heard of React Context, Redux, MobX and other state handling libraries. They're all great in different ways and the internet can't decide which one is best. Everyone has their own little twist on the story.

And yet the basic principles are all the same:

1. Single source of truth
2. State flows down
3. Updates flow up

Where React Context, Redux, MobX and other libraries help, is how much work it is to build this machinery and keep it running. How much flexibility you get when moving components. Basically how easy it is to change your app later.

Remember the rewrite conundrum?

Our basic approach binds business structure to UI structure. Your state, your props, your callbacks, they all follow the same hierarchy as your UI does.

Want to move the buy button? Great! You have to update the entire chain of components leading from your state to that button.

Everything needs new callbacks and new props.

This is known as prop drilling and fast becomes super tedious. Rewiring your whole app just to move a single button is no fun.

To solve this problem, React Context, Redux, MobX, etc. decouple your business logic from your UI architecture. Take state out of the main component and move it into its own object. Connect everything to that instead.

[picture]

Now it doesn't matter where you move that button. It still triggers the same function on the same state. Every other component that cares about that state updates too.

Different libraries have different details for how that works, but they all follow the same idea and solve the same problem.

---

We're sticking with the basic approach because it's easier to explain, works without additional libraries, and is Good Enough™.

You can see an approach to using Redux in dataviz in the [Animating with React, Redux, and D3 chapter](#animating-react-redux), and we tackle MobX in the [MobX chapter](#refactoring-to-mobx).

<!--- end-lecture -->

<!--- begin-lecture title="How to structure your app" -->

{#structuring-your-app}
# How to structure your app

Our app is built from components. You already know how components work. Where it gets tricky is deciding where one component ends and another beings.

One of the hardest problems in software engineering I'd say. Defining the boundaries and interfaces between objects. Entire books have been written on the subject. 

You'll learn most of it with experience. Just through trying different approaches, seeing what works, and developing your taste. Like a chef gets better at improvisation the more things they try. Or a musician.

To get you started, here's a rule of thumb that I like to use: if you have to use the word "and" to describe what your component does, then it should become two components. If you build the same feature multiple times, turn it into a component.

You can then remix components into larger components where it makes sense, or you can keep them separate. It makes sense to combine when multiple small components have to work together to build a big feature.

This architecture often mimics the design of your UI.

For example: our tech salary visualization is going to use 1 very top level component, 5 major components, and a bunch of child components.

 - `App` is the very top level component; it keeps everything together
 - `Title` renders the dynamic title
 - `Description` renders the dynamic description
 - `Histogram` renders the histogram and has child components for the axis and histogram bars
 - `CountyMap` renders the choropleth map and uses child components for the counties
 - `Controls` renders the rows of buttons that let users explore our dataset

Most of these are specific to our use case, but `Histogram` and `CountyMap` have potential to be used elsewhere. We'll keep that in mind when we build them.

`Histogram`, `CountyMap`, and `Controls` are going to have their own folder inside `src/components/` to help us group major components with their children. An `index.js` file will help with imports.

We'll use a `Meta` folder for all our metadata components like `Title` and `Description`. We don't *have* to do this, but `import { Title, Description } from './Meta'` looks better than separate imports for related-but-different components. Namespacing, if you will.

We want to access every component with `import My Component from './MyComponent'` and render as `<MyComponent {...params} />`. Something is wrong, if a parent component has to know details about the implementation of a child component.

You can read more about these ideas by Googling ["leaky abstractions"](https://en.wikipedia.org/wiki/Leaky_abstraction), ["single responsibility principle"](https://en.wikipedia.org/wiki/Single_responsibility_principle), ["separation of concerns"](https://en.wikipedia.org/wiki/Separation_of_concerns), and ["structured programming"](https://en.wikipedia.org/wiki/Structured_programming). Books from the late 90's and early 2000's (when object-oriented programming was The Future™) have the best curated info in my experience.

<!--- end-lecture -->

---

<!--- begin-lecture title="Congratz!" -->

Congratz! You know everything you need to build visualizations with React and D3. 👏

This is the point in tech books where I run off and start building things on my own. Then I get frustrated, spend hours Googling for answers, and then remember, "Hey! Maybe I should read the rest of the book!"

Reading the rest of the book helps. I'll show you how all this fits together into a larger project.

<!--- end-lecture -->

<!--- end-section -->
