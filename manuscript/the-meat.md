## Asynchronously loading data

Great, we’ve got a rendering component. Now we need to load some data so we can
make a visualization. If you still don't have `public/data/h1bs.csv`, now is
the time to get it. You can find it on Github
[here](https://github.com/Swizec/h1b-software-salaries) or in the stub project
included with the book.

We’re going to use d3.js’s built-in data-loading magic and hook it into React’s
component lifecycle for a seamless integration. You could implement calls to a
REST API in the same way.

We start by adding three methods to `H1BGraph` in
`src/components/H1BGraph/index.jsx`:

```{.javascript caption="Base methods to load data"}
        super();

        this.state = {
            rawData: []
        };
    }

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
    }
    // ...and here.

    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

export default H1BGraph;

//
```

With ES6 classes, we no longer use `getInitialState` to set the initial state
of our component. That job goes to the constructor - a function that's called
every time our class is instantiated into an object. We use `super()` first to
call the parent's constructor, which is React's `Component` constructor in this
case.

After calling `super()`, we can use `this.state` as a dictionary that holds our
component's current state. It's best to avoid using state as much as possible
and rely on props instead.

Next we have `componentWillMount`, which is a component lifecycle function that
React calls just before mounting (also known as rendering) our component into
the page. This is where you'd want to fit any last minute preparations before
rendering.

It's also a great moment to start loading data, especially when you have 12MB
of data like we do. We don’t want to load that unless we know for sure that the
component is being rendered.

We’re going to put d3.js’s data-loading magic in `loadRawData`. The reason we
have a separate function and don't stick everything into `componentWillMount`
is flexibility – we can call the function whenever we want without messing with
React's built-in functions.

We use `d3.csv` to load our dataset because it's in CSV format. `d3.csv`
understands CSV well enough to turn it into an array of dictionaries, using the
first row as keys. If our data was JSON, we'd use `d3.json`, `d3.html` for
HTML, etc. You can find the full list of data loaders in d3's documentation.

```{.javascript caption="Load data with d3.csv"}
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          });
        // ...and here.
    }

    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
```

This asynchronously loads a CSV file, parses it, and returns the result in the
`rows` argument to the callback. The callback is an ES6 fat arrow, which is
syntax sugar for `function () { // .. }.bind(this)` – a function bound to
current scope. We're going to use these often.

Inside the callback, we check for errors, and if everything went well, we use
`this.setState()` to save the loaded data into our component's state. Calling
`setState()` triggers a re-render and should generally be avoided because
relying on state can lead to inconsistencies in your UI. It’s very appropriate
to store 12MB of raw data as state, though.

We're now going to be able to access our data with `this.state.rawData`.
Hooray!

### Data cleanup

Datasets are often messy and annoying to work with. After a naive load like
that, our data uses keys with spaces in them and everything is a string.

We can add some cleanup in one fell swoop:

```{.javascript caption="Data cleanup"}
        d3.csv(this.props.url)
            // Insert the line(s) between here...
          .row((d) => {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      clean_job_title: this.cleanJobs(d['job title']),
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          })
            // ...and here.
          .get((error, rows) => {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          });
    }

    render() {
        return (
            <div>
                <svg>
                </svg>
```

Using `.row()`, we’ve given a callback to `d3.csv` that tells it how to change
every row that it reads. Each row is fed into the function as a raw object, and
whatever the function returns goes into the final result.

We're changing objects that look like this:

```{.javascript caption="Raw CSV rows"}
  {
      "employer": "american legalnet inc",
      "submit date": "7/10/2013",
      "start date": "8/1/2013",
      "case status": "certified",
      "job title": "software",
      "base salary": "80000",
      "salary to": "",
      "city": "encino",
      "state": "ca"
  }
```

Into objects that look like this:

```{.javascript caption="Cleaned CSV rows"}
  {
      "employer": "american legalnet inc",
      "submit_date": Date("2013-07-09T22:00:00.000Z"),
      "start_date": Date("2013-07-31T22:00:00.000Z"),
      "case_status": "certified",
      "job_title": "software",
      "clean_job_title": "other",
      "base_salary": 80000,
      "salary_to": null,
      "city": "encino",
      "state": "ca"
  }
```

We cleaned up the keys, parsed dates into `Date()` objects using d3's built-in
date formatters, and made sure numbers are numbers. If a row didn’t have a
`base_salary`, we filtered it out by returning `null`.

### Add visual feedback that loading is happening

Loading and parsing 81,000 data points takes some time. Let's tell users what
they're waiting for with some explainer text.

```{.javascript caption="Loading indicator"}
        }
        // ...and here.

        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

export default H1BGraph;

//
// Example 7
//
```

The `render` method returns different elements based on whether or not we’ve
got some data. We access the data as `this.state.rawData` and rely on the
re-render triggered by `this.setState` to get rid of the loading notice.

If you’ve kept `npm start` running in the background, your browser should flash
the loading text then go blank.

![Loading message](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/loading_message.png)

Marvelous.

## Making your first dataviz component – a Histogram

Now that our data is loading, it’s time to start drawing. We’ll start with a
basic histogram, then add an axis and an indicator for the mean value (also
known as the "average").

A histogram component isn't unique to our project, so we're going to build it
as a standalone component. Create a new directory `src/components/Histogram/`
with an empty `index.jsx` file.

We use `index.jsx` as a convenience to make our component easier to import, so
we won't put any logic in here. The file looks like this:

```{.javascript caption="src/components/Histogram/index.jsx"}
import Histogram from './Histogram';

export default Histogram;

```

It imports and exports `Histogram`. Now the rest of our project can use
`import Histogram from '../Histogram'` without understanding the internal file
structure of our component. Users of your components should never have to know
how you organized your component internally.

### A blank Histogram component

We start with a blank `Histogram` component in
`src/components/Histogram/Histogram.jsx`, like this:

```{.javascript caption="Empty histogram"}
import React, { Component } from 'react';
import d3 from 'd3';

class Histogram extends Component {
    render() {
        let translate = `translate(0, ${this.props.topMargin})`;

        return (
            <g className="histogram" transform={translate}>
            </g>
        );
    }
}

export default Histogram;


```

Just like in `H1BGraph`, we first required some external libraries - React and
d3, created a class with a `render()` method, and added it to our exports. This
lets other parts of the codebase use it by calling
`import Histogram from './Histogram'`.

Right now, the `render()` method contains only an empty grouping, `<g>`,
element. These are much like divs in HTML; they hold elements together to make
them easier to reference. Unlike divs, however, they don't come with any
concept of formatting or sizing.

The grouping element has a class `histogram` (which we'll use later for
styling) and uses the `transform` attribute to move into position via the
`translate` property.

SVG transforms are a powerful tool, but teaching you all about them goes beyond
the scope of this book. We're only going to use the `translate()` property,
which specifies a new `x, y` position for the given element.

We used ES6's string templates to create `transform`'s value. These are denoted
with backticks and evaluate any JavaScript you put into `${}`. It's a great
alternative to concatenating strings, but don't go crazy with these, lest you
won't understand what your code is doing six months from now when you have to
fix a bug.

In this case, we're using this SVG transformation to give our Histogram some
room to breathe. Exactly how much room comes from `this.props.topMargin` – a
property specified by whomever renders our `Histogram` component. Something
like this: `<Histogram topMargin={100} />`.

### d3.js for \[dataviz\] calculations

We're going to build our histogram with d3.js’s built-in histogram layout. It’s
smart enough to do everything on its own: data binning, calculating positions
and dimension of histogram bars, and a few other tidbits. We just have to give
it some data and some configuration.

The issue is that d3.js achieves this magic through state. Almost any time you
use a d3 function or layout, it has some internal state that it uses to reduce
boilerplate.

For instance, all d3 layouts let you define a value accessor. You define it by
calling the `.value()` method like this: `.value((d) => d.some.deep.value)`.
After that, the layout always knows how to get the correct value from your
data.

This is great when you're using d3 alone. It means there's less code to write.

It's less great when you're using React and want to avoid state. The best
approach I've found to mitigate this issue is to rely on three methods:
`constructor`, `componentWillReceiveProps`, and `update_d3`. Like this:

```{.javascript caption="D3.js management functions"}
class Histogram extends Component {
    // Insert the line(s) between here...
    constructor(props) {
        super();

        this.histogram = d3.layout.histogram();
        this.widthScale = d3.scale.linear();
        this.yScale = d3.scale.linear();

        this.update_d3(props);
    }

    componentWillReceiveProps(newProps) {
        this.update_d3(newProps);
    }

    update_d3(props) {
    }
    // ...and here.

    render() {
        let translate = `translate(0, ${this.props.topMargin})`;

        return (
            <g className="histogram" transform={translate}>
            </g>
        );
    }
}

export default Histogram;
```

In `constructor()`, we create the d3 objects and give them any defaults we know
about. Then we call `this.update_d3`. In `componentWillReceiveProps()`, we call
`this.update_d3` every time props change. `update_d3()` does the heavy
lifting - it updates d3 objects using current component properties.

The other approach to this state problem would be to create new objects on
every `render()`, but that feels wasteful. Maybe I'm just old fashioned.

We're going to use the same pattern for all our components that touch d3.js
heavily.

This time, `update_d3()` does its heavy lifting like this:

```{.javascript caption="update_d3 function body"}
        this.histogram
            .bins(props.bins)
            .value(props.value);

        let bars = this.histogram(props.data),
            counts = bars.map((d) => d.y);

        this.widthScale
            .domain([d3.min(counts), d3.max(counts)])
            .range([9, props.width-props.axisMargin]);

        this.yScale
            .domain([0, d3.max(bars.map((d) => d.x+d.dx))])
            .range([0, props.height-props.topMargin-props.bottomMargin]);
        // ...and here.
    }

    render() {
        let translate = `translate(0, ${this.props.topMargin})`;

        return (
```

If you’re used to d3.js, this code should look familiar. We update the number
of bins in our histogram with `.bins()` and give it a new value accessor with
`.value()`. It tells the layout how to get the datapoint from each data object.

We’re making our `Histogram` component more reusable by passing in the value
function from our properties. The less we assume about what we’re doing, the
better.

Then, we call `this.histogram()` to ask d3's histogram layout to do its magic.
If you print the result in `bars`, you'll see it's an array of arrays that have
some properties.

{title="Histogram printout",linenos=off} // console.log(bars) in update_d3()
[Array[26209], Array[48755], // ...] 0: Array[26209][0 … 9999] [10000 …
19999][20000 … 26208] dx: 69999.273 length: 26209 x: 14.54 y: 26209

Each array holds:

- data for its respective histogram bin
- a `dx` property for bar thickness
- a `length`, which is the number of items in this bin
- an `x` coordinate
- a `y` coordinate

We'll use these to draw our histogram bars.

Before we can do that, we have to update our scales. You can think of scales as
mathematical functions that map a domain to a range. Domain tells them the
extent of our data; range tells them the extent of our drawing area. If you
have a linear scale with a domain `[0, 1]` and a range `[1, 2]` and you call
`scale(0.5)`, you will get `1.5`.

To define the correct domains, we first get the `counts` of elements in each
bin. Then we use `min`/`max` helpers to find the smallest and largest values.
In case of height, we had to add each bar's thickness to its position to find
the max.

To define the ranges, we relied on chart dimension properties.

Notice how we use the `x` position to define the domain for our `yScale`?
That's because our histogram is going to be horizontal.

We can do that so simply because scales don't care about anything. They map a
domain to a range; how you use that is up to you.

Scales are my favorite. You'll see why when we start drawing.

### React for the SVG output

Great, our scales are ready to help us draw. Let's add the drawing bit to
`render()`.

```{.javascript caption="Add histogram bars to SVG"}
            bars = this.histogram(this.props.data);
            // ...and here.

        return (
            <g className="histogram" transform={translate}>
                // Insert the line(s) between here...
                <g className="bars">
                    {bars.map(::this.makeBar)}
                </g>
                // ...and here.
            </g>
        );
    }
}

export default Histogram;

```

Even though we’ve already calculated our histogram data in `update_d3()`, we
calculate it again in `render()`. This lets us avoid using state and triggering
unnecessary re-renders. It seems wasteful at first, but think about it: which
is quicker? Re-rendering twice on every prop change, or running a d3 function
twice?

It's not immediately obvious which one uses less processing power, but we
prefer avoiding state because it saves _our_ brain cycles. Those are almost
always more expensive than computer cycles.

We also add a new grouping element for the histogram bars. You'll see why we
need a group inside a group later.

The coolest part is that we can `.map()` through our histogram data even though
we're inside XML. That's the magic of JSX – JavaScript and XML living together
as one.

We could have put the entire `makeBar` function in here, but that would make
our code hard to read.

One last trick is using ES7's double-colon operator. It's syntax sugar for
`this.makeBar.bind(this)`. Remember, even though we're using ES6 classes, we
still have to bind callbacks to `this` scope manually.

You can use this syntax sugar if you [enabled `stage-0`](#enable-es7) in the
chapter about your dev environment.

Now we need the `makeBar` method. It looks like this:

```{.javascript caption="The makeBar helper method"}
        let props = {percent: percent,
                     x: this.props.axisMargin,
                     y: this.yScale(bar.:satisfied:,
                     width: this.widthScale(bar.y),
                     height: this.yScale(bar.dx),
                     key: "histogram-bar-"+bar.x+"-"+bar.y}

        return (
            <HistogramBar {...props} />
        );
    }
    // ...and here.

    render() {
        let translate = `translate(0, ${this.props.topMargin})`,
            bars = this.histogram(this.props.data);

        return (
            <g className="histogram" transform={translate}>
```

This code uses `Histogram`'s properties and scales to calculate attributes for
each bar, then passes the `props` object to a subcomponent called
`HistogramBar` using a spread - `{...props}`. You can think of it as shorthand
for writing
`percent={percent} x={this.props.axisMargin} y={this.yScale(bar.:satisfied:} …`.

This is similar to ES6 spreads, but it’s better because it supports objects as
well as arrays and function arguments.

Now, let’s add the `HistogramBar` subcomponent.

```{.javascript caption="HistogramBar component"}
        return (
            <g transform={translate} className="bar">
                <rect width={this.props.width}
                      height={this.props.height-2}
                      transform="translate(0, 1)">
                </rect>
                <text textAnchor="end"
                      x={this.props.width-5}
                      y={this.props.height/2+3}>
                    {label}
                </text>
            </g>
        );
    }
}

//
// Example 7
//
class HistogramBar extends Component {
    render() {
        let translate = `translate(${this.props.x}, ${this.props.y})`,
```

There's nothing special here: we take some properties and return a grouping
element with a rectangle and a text label. Components like these are great
candidates for functional stateless components - components defined as
functions which render something and don't think too much.

To do that, we would replace
`class Foo extends Component { ... render() { return (<Stuff />) } }` with
`const Foo () => <Stuff />`. I left it as an exercise for the reader :smiley:

Anyway, in `HistogramBar`, we used an ES6 string template to build the
`transform` property, and we added some ad-hoc vertical padding to the bar to
make it look better. We also used some ad-hoc calculations to place the `text`
element at the end of the bar. This makes our histogram easier to read because
every bar has its percentage rendered on the crucial right edge.

Some bars are going to be too small to fit the entire label. Let's avoid
rendering it in those cases.

```{.javascript caption="Adjust label for small bars"}
        if (this.props.percent < 1) {
            label = this.props.percent.toFixed(2)+"%";
        }

        if (this.props.width < 20) {
            label = label.replace("%", "");
        }

        if (this.props.width < 10) {
            label = "";
        }
        // ...and here.

        return (
            <g transform={translate} className="bar">
                <rect width={this.props.width}
                      height={this.props.height-2}
                      transform="translate(0, 1)">
                </rect>
                <text textAnchor="end"
                      x={this.props.width-5}
                      y={this.props.height/2+3}>
                    {label}
                </text>
            </g>
        );
    }
}


//
// Example 8
//

import React, { Component } from 'react';
```

We add some decimal points if we’re showing small numbers, and we remove the
label when there isn't enough room. Perfect.

### Adding Histogram to the main component

Despite our magnificent `Histogram` component, the page is still blank. We have
to go back to `H1BGraph/index.jsx` and tell `H1BGraph` to render the component
we've just made.

First, we have to import our `Histogram` at the top of `H1Bgraph/index.jsx`
like this:

```{.javascript caption="Require Histogram"}
import d3 from 'd3';

// Insert the line(s) between here...
import Histogram from '../Histogram';
// ...and here.

class H1BGraph extends Component {
```

This works so well because of the `Histogram/index.jsx` file we created, which
lets us `import` a directory instead of worrying about the specific files
inside.

Then, we can add the histogram component to our `render` method.

```{.javascript caption="Render the histogram component"}
        // Insert the line(s) between here...
        let params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: (d) => d.base_salary
        },
            fullWidth = 700;
        // ...and here.

        return (
            <div>
                // Delete the line(s) between here...
                <svg>
                // ...and here.
                // Insert the line(s) between here...
                <svg width={fullWidth} height={params.height}>
                    <Histogram {...params} data={this.state.rawData} />
                    // ...and here.
                </svg>
            </div>
        );
    }
}

export default H1BGraph;

//
// Example 8
//
import React, { Component } from 'react';
```

We put all our props in a `params` dictionary: dimensions, number of bins,
value accessor. It makes our code easier to read.

Inside the `return` statement, we make sure our `<svg>` element has a width and
a height, and we add the `<Histogram .. />` component. Once more, we use the
spread trick to pass many `params` at once. We keep `data` as a separate
attribute to make it more apparent that this component uses data.

If you kept `npm start` running, your browser should show something like this:

![Unstyled Histogram](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/unstyled_histogram.png)

Wow. So much effort went into those labels, and you can't even see them. Let's
add some styling to `src/components/Histogram/style.less` to make the Histogram
prettier:

```{.css caption="style.less"}
@import (inline) "../bower_components/bootstrap/dist/css/bootstrap.min.css";

.histogram {
    .bar {
        rect {
            fill: steelblue;
            shape-rendering: crispEdges;
        }
        text {
            fill: #fff;
            font: 12px sans-serif;
        }
    }
}

//
```

Make sure to `require` the styles in `H1Bgraph/index.jsx`:

```{.javascript caption="Require style.less"}
//
import React, { Component } from 'react';
import d3 from 'd3';

import Histogram from '../Histogram';
// Insert the line(s) between here...
import Controls from './Controls';
```

Now you should see a histogram like this:

![Basic Histogram](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/base_histogram.png)

## Wrapping a pure-d3 element in React - an Axis

Axes are my favorite feat of d3.js magic right after scales. You call a
function, set some parameters, and **BAM**, you’ve got an axis.

The axis automatically adapts to your data, draws the ticks, and labels them.
Axes achieve this by using scales for all computation. The nice consequence of
this is that you can turn a linear axis into a logarithmic axis by changing the
scale it uses.

Despite how easy axes are to use, they're pretty complex to build from scratch.
So we're not going to bother and use a dirty little trick instead – give d3.js
control of the DOM. Just this once.

The same approach works for wrapping any d3.js visualization in a React
component.

Let's start with a blank component for the axis in
`src/components/Histogram/Axis.jsx`. It's a good candidate for a general
component as well.

```{.javascript caption="Base axis component"}
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Axis extends Component {
    render() {
        let translate = `translate(${this.props.axisMargin-3}, 0)`;
        return (
            <g className="axis" transform={translate}>
            </g>
        );
    }
}

export default Axis;

```

As always, we start with the imports, then define a class - `Axis` – and export
it. We add `ReactDOM` to the usual `d3` and `React` imports because we'll need
it to give d3.js a reference to our DOM node. It can't take over without a DOM
node.

Inside the `Axis` component, we define a `render` method which returns an empty
grouping element and uses an SVG transform to emulate margins and padding. We
have to do this so d3 has something to play with when it's rendering the axis.

Just like in the `Histogram` component, we integrate d3 into our component
using the `constructor`, `componentWillReceiveProps`, and `update_d3` methods.

```{.javascript caption="Axis default properties"}
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Axis extends Component {
    constructor(props) {
        super();

        this.yScale = d3.scale.linear();
        this.axis = d3.svg.axis()
                      .scale(this.yScale)
                      .orient("left")
                      .tickFormat((d) => "$"+this.yScale.tickFormat()(d));

        this.update_d3(props);
    }

    componentWillReceiveProps(newProps) {
        this.update_d3(newProps);
    }

    update_d3(props) {
        // Insert the line(s) between here...
        this.yScale
            .domain([0,
                     d3.max(props.data.map((d) => d.x+d.dx))])
```

In the `constructor`, we define a new linear axis for the `y` coordinate, and
some default properties for the axis:

- it uses the linear scale
- renders labels on the left
- prepends the scale's tickFormat with a `$` sign

Yes, scales have tick formatters. They take care of rendering numbers nicely.
It's awesome.

We let `update_d3` take care of the rest. The same delegation happens in the
`componentWillReceiveProps` lifecycle method. The combination of these two
methods calling `update_d3` ensures our d3 objects stay up to date.

The logic in `update_d3` looks like this:

```{.javascript caption="Update axis state"}
                      .scale(this.yScale)
                      .orient("left")
                      .tickFormat((d) => "$"+this.yScale.tickFormat()(d));

        this.update_d3(props);
    }

    componentWillReceiveProps(newProps) {
        this.update_d3(newProps);
    }

    update_d3(props) {
        // Insert the line(s) between here...
        this.yScale
            .domain([0,
                     d3.max(props.data.map((d) => d.x+d.dx))])
            .range([0, props.height-props.topMargin-props.bottomMargin]);
```

Just like the previous section, we have to tell `yScale` the extent of our data
and drawing area. We don't have to tell the axis; it knows because the scale
knows. Isn't that neat? I think it's neat.

We _do_ have to get around some of the axis's smartness though. By default, an
axis only renders a couple of ticks and labels to keep the visualization less
cluttered. That would make our histogram look weird.

So we ask for the same number of ticks as there are bars, and we give a list of
specific values. The axis tries to find "reasonable" label values otherwise.

Ok, we have our axis in memory. Now here's the dirty trick:

```{.javascript caption="The dirty trick for embedding d3 renders"}
            .range([0, props.height-props.topMargin-props.bottomMargin]);

        this.axis
            .ticks(props.data.length)
            .tickValues(props.data
                             .map((d) => d.:satisfied:
                             .concat(props.data[props.data.length-1].x
                                    +props.data[props.data.length-1].dx));
    }

    // Insert the line(s) between here...
    componentDidUpdate() { this.renderAxis(); }
    componentDidMount() { this.renderAxis(); }
```

I’m sure this goes against everything React designers fought for, but it works.
We hook into the `componentDidUpdate` and `componentDidMount` callbacks with a
`renderAxis` method. This ensures `renderAxis` gets called every time our
component has to re-render.

In `renderAxis`, we use `ReactDOM.findDOMNode()` to find this component's DOM
node. We feed the node into `d3.select()`, which is how node selection is done
in d3 land, then `.call()` the axis. The axis then adds a bunch of SVG elements
inside our node.

As a result, we re-render the axis from scratch on every update. This is
inefficient because it goes around React's fancy tree diffing algorithms, but
it works well enough.

Before we add our new `Axis` component to the Histogram, we need some styling
in `src/components/H1BGraph/style.less`:

```{.css caption="Styling the axis"}
//
.histogram {
    .bar {
        rect {
            fill: steelblue;
            shape-rendering: crispEdges;
        }
        text {
            fill: #fff;
            font: 12px sans-serif;
        }
    }
    // Insert the line(s) between here...
    .axis {
        path, line {
            fill: none;
            stroke: #000;
            shape-rendering: crispEdges;
        }
        text {
            font: 10px sans-serif;
        }
    }
    // ...and here.
}
```

Great. Now we head back to the Histogram file
(`src/components/Histogram/Histogram.jsx`) and add Axis to the imports, then
add it to the render method.

```{.javascript caption="Add Axis to Histogram imports"}
            label = this.props.percent.toFixed(0)+'%';

        if (this.props.percent < 1) {
            label = this.props.percent.toFixed(2)+"%";
        }

```

That’s it. Your histogram should look like this:

![Histogram with axis](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/axis_histogram.png)

If it doesn't, you should send me an email, and I'll try to help.

Next up: making the histogram interactive.

## Interacting with the user

We’ve got a histogram with an axis and the building blocks to make as many as
we want. Awesome!

But our histogram looks weird. Most of our data falls into the first three
bars, and a lone outlier stretches the data range too far.

We could remove the outlier, but let's be honest: statisticians should worry
about statistical anomalies; we’re here to draw pretty pictures.

It's better to let users explore the dataset themselves -> filters! Let users
limit their view to just the parts they care about. This solves our problem of
finding outliers and gives users more freedom. And they might even spend more
time on our site!

Win-win-win.

We're going to make controls that let users filter data by year. Then, in order
to show you how reusable React components are, we're going to add filtering by
US state as well. In the full example, I also added filtering by job title, but
that would take too long to explain here. The code is easy, but the dataset is
a mess.

![Events flow up through callbacks](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/architecture_events.jpg)

Remember, we talked about using a Flux-like approach in our
[architecture](#the-architecture). That means:

- user events flow up the component hierarchy via callbacks
- the main component changes its data state
- React propagates data changes back down through component props

![Updated data flows back down](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/architecture_updates.jpg)

The only difference between this bi-directional data-flow and a true Flux
architecture is that in a true Flux architecture, the data store is separate
from the main component. As a result, everyone has a way to affect changes
directly on the data store, which means we don't have to mess about with
callbacks.

That turns out to be easier to manage when you have a lot of interacting
components. Because our example is so simple using Flux isn't really worth the
extra code.

To get a better idea of Flux's pros and cons, you can read this side-by-side
comparison of React+Flux (130 lines) and pure jQuery (10 lines)
[I wrote in October 2015](https://swizec.com/blog/reactflux-can-do-in-just-137-lines-what-jquery-can-do-in-10/swizec/6740).
It's based on a simple form example.

### Adding user controls

Our controls are going to look like rows of toggleable buttons. Each row
represents a filter – year and US state – and each button represents a value.
When the button is "on", our histogram shows only the entries that have that
value. Each row can have only one active value.

The end result will be something like this:

![Histogram with buttons](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/buttons_histogram.png)

We'll build the controls out of three components:

- `Controls`, which holds the controls together
- `ControlRow`, which is a row of buttons
- `Toggle`, which is a toggle-able button

These components live in a `Controls` subdirectory of `H1BGraph` –
`src/components/H1BGraph/Controls`. We could build controls as a standalone
component, and in a way we will, but for now it's easier to assume they're a
specific solution to a specific problem.

Before diving in, let's render `Controls` in `H1BGraph.render`. It's going to
break the build, but you'll see things added to the page in real-time as you
code. I love it when that happens.

```{.javascript caption="Add Controls to H1BGraph.render"}
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: (d) => d.base_salary
        },
            fullWidth = 700;

        return (
            <div>
                <svg width={fullWidth} height={params.height}>
                    <Histogram {...params} data={this.state.rawData} />
                </svg>
                // Insert the line(s) between here...
                <Controls data={this.state.rawData} updateDataFilter={() => true} />
                // ...and here.
            </div>
        );
    }
}

export default H1BGraph;


//
// Example 10
//
import React, { Component } from 'react';
import d3 from 'd3';

```

Notice we added `Controls` outside the `<svg>` element. That's because they
aren't a part of the visualization. Not of the graphical part at least.

We used props to give our `Controls` component some data (which it will use to
generate the buttons) and a filter update callback. This function doesn't do
anything yet. We'll add that in a bit when we talk about
[propagating events](#propagating-events) back up the chain. For now, it's here
so that we have something to call without throwing an exception.

Don't forget to import controls at the top of the file.

```{.javascript caption="Import Controls"}
        this.state = {
            rawData: []
        };
    }

    componentWillMount() {
        this.loadRawData();
```

Great. If you've kept `npm start` running in the background, your browser
should start panicking right now. That's because `Controls/index.jsx` doesn't
exist.

Let's make it: start with imports, a class, a render method, and exports. Like
this:

```{.javascript caption="Controls component stub"}
import React, { Component } from 'react';
import _ from 'lodash';

class Controls extends Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Controls;

```

Your browser should stop panicking now. Instead, it shows a blank `<div>` under
your histogram.

Now we add the first `ControlRow` and break the page all over again.

```{.javascript caption="Year ControlRow in Controls"}
        // Insert the line(s) between here...
        let getYears = (data) => {
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
        }
        // ...and here.

        return (
            <div>
                // Insert the line(s) between here...
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                            updateDataFilter={() => true} />
                // ...and here.
            </div>
        )
    }
}

export default Controls;

```

We define a function called `getYears` that can go through our dataset and find
all of the year values. The `groupBy` creates a dictionary with years as keys,
`keys` returns the dictionary's keys, and `map(Number)` makes sure they're all
numbers so we won't have to worry about that later.

Then we add a `ControlRow` component to the return statement. As props, we gave
it our dataset, the `getYears` function so it can decide which buttons to
render, and a dummy update filter callback.

We'll define the filter when we look at
[propagating events](#propagating-events) back up the chain.

And, of course, don't forget to import `ControlRow`.

```{.javascript caption="Import ControlRow"}
import _ from 'lodash';

// Insert the line(s) between here...
import ControlRow from './ControlRow';
// ...and here.

class Controls extends Component {
    render() {
```

Perfect. Your browser should start panicking again.

Let's calm your browser down and create
`src/components/H1BGraph/Controls/ControlRow.jsx`.

```{.javascript caption="Stubbed ControlRow component"}
import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">

                </div>
            </div>
        );
    }
}

export default ControlRow;

```

Start with imports, define a class, render some empty divs, export class. The
usual.

Before your browser stops panicking, we also need the Toggle component in
`src/components/H1BGraph/Controls/Toggle.jsx`.

```{.javascript caption="Stubbed Toggle component"}
import React, { Component } from 'react';

class Toggle extends Component {
    render() {
        return null;
    }
}

export default Toggle;

```

Your browser should stop panicking now, and there should be some divs within
divs under the histogram.

To make controls show up, we first have to add toggles to `ControlRow`, then
make sure the Toggle component returns a visible button.

#### A row of buttons

Adding buttons to `ControlRow` isn't too hard.

The `getToggleNames` function in our props gives us a list of button names, and
the `Toggle` component renders a button. All we need is a loop that places the
buttons.

Let's go back to `src/components/H1BGraph/Controls/ControlRow.jsx` and add it.

```{.javascript caption="Loop through toggle names"}
            <div className="row">
                <div className="col-md-12">
                    // Insert the line(s) between here...
                    {this.props
                         .getToggleNames(this.props.data)
                         .map((name) => this._addToggle(name))}
                    // ...and here.
                </div>
            </div>
        );
    }
}

export default ControlRow;
```

This code calls `getToggleNames` with the data in our props, and it calls
`this._addToggle` on every value. Once again, notice the power of JSX – we can
embed a JavaScript incantation right inside what looks like HTML code.

Now we need to define the `_addToggle` function, which returns a Toggle
component. We do this in a function call so the code is easier to read.

```{.javascript caption="Create a Toggle"}
    // Insert the line(s) between here...
    _addToggle(name) {
        let key = `toggle-${name}`,
            label = name;

        if (this.props.capitalize) {
            label = label.toUpperCase();
        }

        return (
            <Toggle label={label}
                    name={name}
                    key={key}
                    value={this.state.toggleValues[name]}
                    onClick={::this.makePick} />
        );
    }
    // ...and here.

    render() {
        return (
```

We return a `<Toggle>` component with some properties:

- `label` for the visible label
- `name` for the button's name property
- `key` is something React needs to tell similar components apart; it has to be
  unique
- `value` for the button's initial value state
- `onClick` for the click callback

These follow conventions for standard HTML form elements. It's the standard I
got used to, and there's no need to re-invent the wheel.

We also capitalize the first letter of the label if that flag is set in our
props. This is where those `String` class helpers we defined earlier help us
out.

Now that we set an `onClick` callback, we have to stub the function lest we
break the build. We also have to define some initial state because we used
`this.state.toggleValues`. It's easier than checking if the variable exists
every time.

```{.javascript caption="makePick and default state"}

    }

    componentWillMount() {
        let toggles = this.props.getToggleNames(this.props.data),
            toggleValues = _.zipObject(toggles,
                                       toggles.map(() => false));

        this.state = {toggleValues: toggleValues};
    }
    // ...and here.

    _addToggle(nme) {
        let key = `toggle-${name}`,
            label = name;

```

We keep `makePick` empty for now because we'll define it later in the
[propagating events section](#propagating-events). It's there just to keep
things working.

Using `componentWillMount` to define the default state is an exception. You're
supposed to define it in the class constructor, but we don't have access to
props there. You can't populate an object property before the property exists.
Remember, constructors are called while an object is still being created.

Yes, this tells us we're doing something wrong. Didn't we say all state lies in
the top component? We did. But we can create a smoother user experience if we
grit our teeth and make some compromises. User experience trumps perfect
engineering.

If you're not used to lodash's functional approach, the code in
`componentWillMount` might look strange. It loops through the values returned
by `getToggleNames` and builds a dictionary – or object – with those names as
keys, and `false` as the value.

We're later going to use `this.state.toggleValues` in combination with the
`makePick` callback to ensure users can only select one value per row of
toggles.

#### Toggle-able buttons

After all that, we still don't have anything to show to the user. `ControlRow`
tries to render a bunch of buttons, but our `Toggle` component returns `null`
every time.

Let's go back to `src/components/H1BGraph/Controls/Toggle.jsx` and make it
work. Here's what we need to do:

- render a button
- define its class based on toggle-ness
- handle click events
- eagerly update toggle-ness on clicks

Handling toggle-ness is going to be the tricky part. We want the buttons to
feel fast while also responding to upstream data changes.

First, let's render the button. We add a few lines to the `render` method:

```{.javascript caption="Toggle renders a button"}

class Toggle extends Component {
    render() {
        // Delete the line(s) between here...
        return null;
        // ...and here.
        // Insert the line(s) between here...
        let className = "btn btn-default";

        if (this.state.value) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={::this.handleClick}>
                {this.props.label}
            </button>
        );
        // ...and here.
    }
}

export default Toggle;


```

We're using a basic HTML `<button>` element and giving it some React magic
properties. `className` is an alias for the DOM `class` attribute. This naming
is necessary because in JavaScript, `class` is a reserved symbol. `onClick`
defines a click event handler similar to using `$('selector').click(do_thing)`.

React gives us the important event handlers in its `onSomething` magic
properties. They might look like DOM Level 2 event handlers from the early
2000's, but their implementation is cleaner. Don't worry if, like me, you've
spent the past 10 years of your life avoiding `onclick`. It's back. It's good.
It's okay. I promise it has all the merits of using the _"find element, attach
listener"_ approach.

On line 8 of that example, we change the button's color based on
`this.state.value`. (`btn-primary` is the Bootstrap class that makes buttons
blue.)

```{.javascript caption="Toggle color switch"}
        if (this.state.value) {
            className += " btn-primary";
        }

        return (
```

We only check `this.state.value` for now. Don't worry about props vs. state
issues in the `render` method. That comes next.

We need three different functions to make this work smoothly:

- `constructor`, which sets default state
- `componentWillReceiveProps`, which updates internal state when props update
- `handleClick`, which is the click event callback

```{.javascript caption="State and click handling in Toggle"}
    constructor() {
        super();

        this.state = {value: false};
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    }

    handleClick(event) {
       let newValue = !this.state.value;
       this.setState({value: newValue});
    }
    // ...and here.

    render() {
        let className = "btn btn-default";

        if (this.state.value) {
```

You know the drill by now: `constructor` sets initial state dictionary to
`{value: false}`, `componentWillReceiveProps` updates it when a new value comes
down from above. This lets us have internal state _and_ defer to global
application state when needed.

The `handleClick` function toggles that same internal state. If it's `true`, it
becomes `false` and vice-versa. Calling `setState` triggers a re-render and our
button changes color.

Magic.

Using both state and props lets us change buttons the moment a user clicks them
without waiting for the rest of the page to react. This makes user interactions
snappier. Snappier interactions make users happy.

You should see a row of buttons under your histogram. Each can be toggled on
and off, but nothing else happens yet.

### Propagating events through the hierarchy {#propagating-events}

If we want the histogram to change when users toggle buttons, we have to
propagate those click events through the hierarchy. The information being
propagated is going to change each step of the way. This will reflect semantic
changes in its meaning.

Toggles say something happened.

ControlRow says what happened.

Controls explains how to filter.

H1BGraph filters.

Our `Toggle` component is pretty much wired up already. It responds to user
events in the `handleClick` method. Telling `ControlRow` that something
happened is as easy as adding a function call.

```{.javascript caption="Call event callback in handleClick"}
        // Insert the line(s) between here...
        this.props.onClick(this.props.name, newValue);
        // ...and here.
    }

    render() {
        let className = "btn btn-default";

```

Notice how we can just call functions given in props? I love that. It's the
simplest approach to inter-component interaction that I've ever seen.

I know we have a leaky abstraction right here. The parent component gives us a
callback via props, and the first argument is also a prop. Why does the toggle
have to tell its name to the callback, when the callback comes from the same
place that the name does?

Because it makes our code simpler.

Let me show you. We implement the `makePick` function back in
`src/components/H1BGraph/Controls/ControlRow.jsx`, like this:

```{.javascript caption="makePick function in ControlRow component"}

        toggleValues = _.mapValues(toggleValues,
                                   (value, key) => newState && key == picked);

        // if newState is false, we want to reset
        this.props.updateDataFilter(picked, !newState);

        this.setState({toggleValues: toggleValues});
        // ...and here.
    }

    componentWillMount() {
        let toggles = this.props.getToggleNames(this.props.data),
            toggleValues = _.zipObject(toggles,
                                       toggles.map(() => false));
```

Two things happen:

1. We make sure only one value can be turned on at a time
2. We call `updateDataFilter` with the new value

For both of these, we need the clicked toggle's name. When we use `_.mapValues`
to reconstruct the `toggleValues` dictionary, the name tells us which field
should be set to `true`. When we call `updateDataFilter`, it tells us the value
we're filtering by.

Remember, we collected toggle names out of possible values for each filter. In
the case of filtering by year, each year value became a toggle button.

If you click on a button now, you'll see it disables the others. When
`this.state.toggleValues` changes, it triggers a re-render, which pushes new
props down to `Toggle` components, which then re-render themselves with the new
`className`.

Neat.

---

Now we can go back to `src/components/H1BGraph/Controls/index.jsx` and
implement that `updateDataFilter` callback we stubbed earlier.

We have to change the callback definition in `render`.

```{.javascript caption="Change ControlRow callback"}
        }

        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                // Delete the line(s) between here...
                            updateDataFilter={() => true} />
                // ...and here.
                // Insert the line(s) between here...
                            updateDataFilter={::this.updateYearFilter} />
                // ...and here.
            </div>
        )
    }
}

export default Controls;


//
```

It’s the same sort of code as always. If you don't like the `::` syntax sugar
from ES7, you can use `this.updateDataFilter.bind(this)` instead.

Now here's the interesting part: we'll have to hold the current year filter
function and value in memory, the component's state. We have to do this so that
we can build complex filters on multiple properties.

Each time a user clicks a toggle button, we only know the current selection and
property. We don't want to delete the filtering on, say, US state.

We need some default state in the constructor.

```{.javascript caption="Default filter state"}
        super();

        this.state = {
            yearFilter: () => true,
            year: '*',
        };
    }

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date.getFullYear() == year;

```

`yearFilter` is a dummy function, and `year` is an asterisk. It could be
anything, but a few months from now, you will still recognize an asterisk as an
“anything goes” value.

With that done, we need the `updateYearFilter` function itself. It looks like
this:

```{.javascript caption="updateYearFilter function"}
            filter = () => true;
            year = '*';
        }

        this.setState({yearFilter: filter,
                       year: year});
    }
    // ...and here.

    render() {
        let getYears = (data) => {
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
```

Our filter is a function that checks for equality between the year in a datum
and the year argument to `updateYearFilter` function itself. This works because
of JavaScript's wonderful scoping, which means that functions carry their
entire scope around. No matter where we pass the filter function to, the local
variables that existed where it was defined are always there.

This might lead to memory leaks. This may be why Chrome takes almost 10
gigabytes of memory on my laptop. Or maybe I keep too many tabs open. Who knows
...

If the year is not defined, or reset is explicitly set to `true`, we reset the
filter back to default values.

Almost there! We're handling the in-state representation of the year filter.
Now we have to tell the parent component, `H1BGraph`.

We do that in the `componentDidUpdate` lifecycle method. As you can guess,
React calls it on every re-render; triggered every time we use `this.setState`.

```{.javascript caption="Propagate filter changes up the hierarchy"}
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }
    // ...and here.

    render() {
```

For every update, we call `this.props.updateDataFilter`, which is the change
callback defined by `H1BGraph` when it renders `Controls`. As the sole
argument, we give it our filter wrapped in another function.

This looks (and is) far too complicated. It makes more sense when we add
another filter. Hint: this is where we combine multiple filters into a single
function.

Whatever you do, _DON'T_ click a button yet. Your code will go into an infinite
loop and crash your browser tab.

That's because when React decides whether to update your component or not, it
only performs a shallow state and props comparison. Because we rely on function
changes, we need a better comparison.

```{.javascript caption="Prevent infinite loops"}
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
        }

        return (
            <div>
```

With `shouldComponentUpdate`, we can define a custom comparison function. In
our case, using Lodash's `isEqual` between current and future state is good
enough.

Crisis averted! Click away.

Just one thing left to do before the graph starts changing for every click: use
the new filters to filter data before rendering.

Go to `src/components/H1BGraph/index.jsx` and add this function:

```{.javascript caption="Filter update callback"}

        let params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
```

Guess what it does? It stores the new filter in `this.state`.

Of course, this means we need a default filter in the constructor as well.

```{.javascript caption="Default dataFilter"}

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
        let dateFormat = d3.time.format("%m/%d/%Y");

        d3.csv(this.props.url)
          .row((d) => {
              if (!d['base salary']) {
                  return null;
```

The default is a function that always says _"Yup, leave it in."_.

Now let's add all the heavy lifting to the `render` method. It looks like this:

```{.javascript caption="Rendering filter data"}
            bottomMargin: 5,
            value: (d) => d.base_salary
        },
            fullWidth = 700;

        // Insert the line(s) between here...
        let filteredData = this.state.rawData
                               .filter(this.state.dataFilter);
        // ...and here.

        return (
            <div>
                <svg width={fullWidth} height={params.height}>
                    // Delete the line(s) between here...
                    <Histogram {...params} data={this.state.rawData} />
                    // ...and here.
                    // Insert the line(s) between here...
                    <Histogram {...params} data={filteredData} />
                    // ...and here.
                </svg>
                // Delete the line(s) between here...
                <Controls data={this.state.rawData} updateDataFilter={() => true} />
                // ...and here.
                // Insert the line(s) between here...
                <Controls data={this.state.rawData} updateDataFilter={::this.updateDataFilter} />
                // ...and here.
            </div>
        );
    }
}

export default H1BGraph;


//
// Example 11
//
import React, { Component } from 'react';
import d3 from 'd3';

import Histogram from '../Histogram';
import Controls from './Controls';
// Insert the line(s) between here...
```

A few things changed:

1. We pass our data through a filter
2. We feed filtered data into the `Histogram`
3. We give `Controls` the correct callback

Yes, this means we filter the data from scratch every time the page re-renders
for whatever reason. It turns out this is pretty fast and works well enough,
even with tens of thousands of data points.

There you go. A histogram that changes its shape when you click a button.

Amazing.

Now, let me show you just how reusable React components can be.

## Component reusability

All right, we have a filter for years. It looks like a row of buttons and users
can select a specific year to focus the histogram.

Let's look at how reusable we've made the `ControlRow` component by adding
another filter - US states.

Here's a quick rundown of what we're going to do:

1. Add another `ControlRow` to `Controls`
2. Build a list of US states from the data
3. Add an `updateUSStateFilter` function to `Controls`
4. Add `USstateFilter` to component state
5. Include `USstateFilter` in `componentDidUpdate`

That's all we need: a few lines of copy-pasted code in
`src/components/H1BGraph/Controls/index.jsx`. There are no changes necessary to
either `ControlRow` or `Toggle`, nor are there any changes for the graph
itself.

Adding a new `ControlRow` and building a list of US states might look familiar
by now.

```{.javascript caption="Add another ControlRow"}
        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                            updateDataFilter={::this.updateYearFilter} />
                // Insert the line(s) between here...
                <ControlRow data={this.props.data}
                            getToggleNames={getUSStates}
                            updateDataFilter={::this.updateUSStateFilter}
                            capitalize="true" />
                // ...and here.
            </div>
        )
    }
}

export default Controls;


/// ----

import React, { Component } from 'react';
import _ from 'lodash';

import ControlRow from './ControlRow';

```

We add a new `ControlRow` to render, give it a function that extracts US states
from the data, and create a new update callback, which we'll define next.

```{.javascript caption="Add a US state filter update"}
        this.setState({USstateFilter: filter,
                       USstate: state});
    }
    // ...and here.

    componentDidUpdate() {
        this.props.updateDataFilter(
            ((filters) => {
                return (d) =>  filters.yearFilter(d)
                    // Insert the line(s) between here...
                    && filters.USstateFilter(d)
                    // ...and here.
            })(this.state)
        );
    }
```

The new update filter callback is a copy-paste of `updateYearFilter` with a few
keywords changed. We _could_ have been clever about it and implemented dynamic
magic that would let us get away with a single function, but it's unnecessary.
It also makes the code both harder to explain and harder to understand a few
months later.

Avoid cleverness when you code. It's too hard to debug.

Now let's add the new US state filter to the main callback in
`componentDidUpdate`.

```{.javascript caption="Include the new filter in the main callback"}

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    render() {
        let getYears = (data) => {
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
        }
```

See, all that trouble of wrapping filters in extra functions pays off. We can
compose many filters into a single expression.

Finally, we need to define a default state for the US state filter. We do that
in the class constructor.

```{.javascript caption="Add default value for US state filter"}
            USstateFilter: () => true,
            USstate: '*'
            // ...and here.
        };
    }

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date.getFullYear() == year;

        if (reset || !year) {
            filter = () => true;
            year = '*';
        }

```

Same as the year filter, different key names.

If all went well, you should have a histogram with two rows of filters
underneath. Users can choose a year _and_ a US state to filter by.

![Histogram with two filters](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/more_buttons_histogram.png)

## Making disparate components act together

If you came this far, you have a nice histogram of H1B salaries in the software
industry. It's blue and there's an axis. Everything renders on the front-end
and changes when the user picks a specific year or US state.

But we’re missing something. A good visualization needs a title and a
description. The title tells users what they’re looking at, and the description
gives them the story.

As great as people are at understanding pictures, it goes much better when you
flat-out _tell_ them what they’re looking at.

That data flow-down architecture we built is the key to making disparate
components act together. Because there is only one repository of truth, and
because every component renders from props, we can make every component on the
page change when data changes.

We can make the title and description change together with the histogram, which
means they're always accurate and specific to what users see. They never have
to think hard about the story behind the data; we just tell them.

Marvelous.

---

We're going to build two components - a Title and a Description. They're going
to share some common methods, which we'll put in a base component.

Let's start with the base component. It goes in
`src/components/H1BGraph/Meta/BaseComponent.jsx`.

```{.javascript caption="Stubbed base component"}
import React, { Component } from 'react';
import d3 from 'd3';
import _ from 'lodash';

export default class Meta extends Component {
    getYears(data) {

    }

    getUSStates(data) {

    }

    getFormatter(data) {

    }
}

```

The `BaseComponent` exports a `Meta` class which is all about common getters
that both `Title` and `Description` are going to use. Extending from `Meta`
will put functions from here into local scope so we can do stuff like
`this.getYears()` and it calls the function from `Meta`.

Neat, huh? I think it is.

The function bodies themselves aren't too hard. They go through the dataset and
return lists of values. `getYears` returns all year values, `getUSStates`
returns all US states, and `getFormatter` returns a salary value formatter.

```{.javascript caption="The entire Meta base component"}
    getYears(data) {
        // Insert the line(s) between here...
        data || (data = this.props.data);

        return _.keys(_.groupBy(this.props.data,
                                (d) => d.submit_date.getFullYear())
        );
        // ...and here.
    }

    getUSStates(data) {
        // Insert the line(s) between here...
        data || (data = this.props.data);

        return _.keys(_.groupBy(this.props.data,
                                (d) => d.state)
        );
        // ...and here.
    }

    getFormatter(data) {
        // Insert the line(s) between here...
        data || (data = this.props.data);

        return d3.scale.linear()
                 .domain(d3.extent(this.props.data,
                                   (d) => d.base_salary))
                 .tickFormat();
        // ...and here.
    }
}


```

This is nothing we haven't done before. Sprinkle some lodash functions for
traversals and groupings, and use some d3 linear scale magic for the formatter.

Let's stub out the `Title` and `Description` components so we can add them to
`H1BGraph` and let hot loading do its magic. We want to see what we're doing in
real time.

`Title` goes in `src/components/H1BGraph/Meta/Title.jsx`.

```{.javascript caption="Stubbed Title component"}
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Title extends Meta {
    render() {
        let title = (<h2>This is a title</h2>);


        return title;
    }
}

export default Title;

```

For now we return a dummy title so we get something rendering. Notice that we
extended from `Meta` instead of `Component` like before.

`Description` goes in `src/components/H1BGraph/Meta/Description.jsx`.

```{.javascript caption="Stubbed Description component"}
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    render() {
        return (
            <p className="lead">This is a description</p>
        )
    }
}

export default Description;

```

Same as before – a dummy description and a few basic imports.

Both of those files imported a `StatesMap` file alongside `BaseComponent`.
That's a mapping of US state shortcodes to full names.

You can get it from my github
[here](https://github.com/Swizec/h1b-software-salaries/blob/e032f5b131af4659c5f9a0981b9d85054d2b5a17/src/components/H1BGraph/Meta/StatesMap.jsx).
It was a pain in the ass to make, so I don't suggest doing it yourself. Put it
in `src/components/H1BGraph/Meta/StatesMap.jsx`. If you're using the stub
project, it's already there.

One last bit we need is a `src/components/H1BGraph/Meta/index.jsx` file to make
importing easier.

```{.javascript caption="Meta/index.jsx"}

import * as T from './Title';
import * as D from './Description';

export class Title extends T.default {};
export class Description extends D.default {};
```

This looks weird. We have to do some roundabout hand waving so that we can both
import and export classes with the same name. These are the so-called
pass-through imports.

I don't know if that's the best way to do it, but it's what I came to after
hours of banging my head against a wall. You can read the background behind
these four lines of code
[on my blog](https://swizec.com/blog/theres-a-bug-in-es6-modules/swizec/6753).

### Add Title and Description to the main view

Now that everything's stubbed out, adding the Title and Description components
to the main view doesn't take much. We have to add three lines of code.

The import:

```{.javascript caption="Import Title and Description"}
    }

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
```

The render:

```{.javascript caption="Add Title and Description to render method"}
}

export default H1BGraph;


// ----


import React, { Component } from 'react';
import d3 from 'd3';

import { Title, Description } from './Meta';
import Histogram from '../Histogram';
import Mean from './Mean';
import Controls from './Controls';

```

That's it. If you have `npm start` running in the background, you should see
something like this now:

![Histogram with dummy title and description](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/dummy_title_description.png)

### The title

Our titles are going to follow a formula like: “In <US state>, H1B workers in
the software industry made \$x/year in <year>”.

We start with the year fragment:

```{.javascript caption="getYearsFragment function"}
    // Insert the line(s) between here...
    getYearsFragment() {
        let years = this.getYears(),
            title;

        if (years.length > 1) {
            title = "";
        }else{
            title = `in ${years[0]}`;
        }

        return title;
    }

    getUSStateFragment() {
```

We get the list of years in the current data and return either an empty string
or `in Year`. If there’s only one year, we assume it’s been filtered by year.

We make the same assumption for the US state fragment.

```{.javascript caption="getUSStateFragment function"}
            title;


        if (states.length > 1) {
            title = "";
        }else{
            title = `in ${StatesMap[states[0].toUpperCase()]}`;
        }

        return title;
    }
    // ...and here.

    render() {
        let title = (<h2>This is a title</h2>);

        return title;
```

Great, that's the two dynamic pieces we need. Let's put them together in the
`render` method.

```{.javascript caption="Title render method"}
        // ...and here.
        // Insert the line(s) between here...
        let mean = d3.mean(this.props.data, (d) => d.base_salary),
            format = this.getFormatter();

        let
            yearsFragment = this.getYearsFragment(),
            USstateFragment = this.getUSStateFragment(),
            title;

        if (yearsFragment && USstateFragment) {
            title = (
                <h2>{USstateFragment}, H1B workers in the software industry made ${format(mean)}/year {yearsFragment}</h2>
            );
        }else{
            title = (
                <h2>H1B workers in the software industry {yearsFragment.length ? "made" : "make"} ${format(mean)}/year {USstateFragment} {yearsFragment}</h2>
            );
        }
        // ...and here.

        return title;
    }
}

export default Title;

```

There’s plenty going on here, but the gist of it is that big `if` statement:

- if both the years and US state fragments have content, our title is "In
  <State>, blahblah made \$X/year in <Year>"
- if one or neither have content, our title is "Blahblah <made/make> \$X/year
  <in State / in Year>"

The `$X/year` comes from combining the average salary in our dataset,
calculated with `d3.mean`, and the number formatter. The rest is about plugging
both fragments in the right parts of the string.

Note that in the second case, we still have to render both fragments because we
don't know which one has content. They're syntactically interchangeable at this
point. The sentence works the same if it ends "in California" or "in 2014".

Your histogram should look like this:

![Histogram with title](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/titled_histogram.png)

Let's fix that description.

### The description

Our descriptions won’t be much more complicated than the titles. We'll need a
sentence or two explaining what the histogram is showing and comparing it to
the previous year.

We need two helper functions to get all data for a specific year or US state.
This will help us do the last year look-backs.

```{.javascript caption="Description's getAllData functions"}
class Description extends Meta {
    // Insert the line(s) between here...
    getAllDataByYear(year, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.submit_date.getFullYear() == year);
    }

    getAllDataByUSState(USstate, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.state == USstate);
    }
    // ...and here.

    render() {
```

Not much happens here. They're just filter functions.

The `getPreviousYearFragment` function is more interesting.

```{.javascript caption="Description getPreviousYearFragment function"}
    getPreviousYearFragment() {
        let years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            let year = years[0],
                lastYear = this.getAllDataByYear(year-1),
                USstates = this.getUSStates();


            if (USstates.length == 1) {
                lastYear = this.getAllDataByState(USstates[0], lastYear);
            }

            if (this.props.data.length/lastYear.length > 2) {
                let times_more = (this.props.data.length/lastYear.length).toFixed();

                fragment = `, ${times_more} times more than the year before`;
            }else{
                let percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

                fragment = `, ${Math.abs(percent)}% ${percent > 0 ? "more" : "less"} than the year before`;
            }
        }

        return fragment;
    }
    // ...and here.
```

Whoa, there’s so much going on. First, we get all the years in filtered data,
then:

- if there's more than one, we stop
- if it's the first year in our dataset, we stop
- otherwise:
  - we get all datapoints for last year
  - get US states in filtered data
  - filter `lastYear` by US state if user filtered by that as well
  - if the factor between this and last year is big, return "X times more"
    fragment
  - otherwise return "X% more/less" fragment

That wasn't too bad, was it? I'm sure better ways exist to generate
human-readable text based on parameters, but there's no need to be fancy.

We also need the year and US state fragments, same as the title. Their
functions look like this:

```{.javascript caption="Year and US state fragment functions"}
    // Insert the line(s) between here...
    getYearFragment() {
        let years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    }

    getUSStateFragment() {
        let states = this.getUSStates(),
            fragment;

        if (states.length > 1) {
            fragment = "US";
        }else{
            fragment = StatesMap[states[0].toUpperCase()];
        }

        return fragment;
    }
```

You already know this code from the `Title` component. The only difference is
in the strings produced. This is also why we can't throw these two functions
into `BaseComponent`.

Now that we have all of the helper functions, it's time to put them together.
We do that in the `render` method, like this:

```{.javascript caption="Description render function"}

    render() {
        // Insert the line(s) between here...
        let formatter = this.getFormatter(),
            mean = d3.mean(this.props.data,
                           (d) => d.base_salary),
            deviation = d3.deviation(this.props.data,
                                     (d) => d.base_salary);

        let yearFragment = this.getYearFragment(),
            USStateFragment = this.getUSStateFragment(),
            previousYearFragment = this.getPreviousYearFragment(),
            N = formatter(this.props.data.length),
            min_salary = formatter(mean-deviation),
            max_salary = formatter(mean+deviation);
        // ...and here.

        return (
            // Delete the line(s) between here...
            <p className="lead">This is a description</p>
            // ...and here.
            // Insert the line(s) between here...
            <p className="lead">{yearFragment.length ? yearFragment : "Since 2012"} the {USStateFragment} software industry {yearFragment.length ? "gave" : "has given"} jobs to {N} foreign nationals{previousYearFragment}. Most of them made between ${min_salary} and ${max_salary} per year.</p>
            // ...and here.
        );
    }
```

That is one beast of a return statement right there.

It's not too bad when you take a closer look. The description can start with
either "Since 2012" or "In <Year>". Then it adds the selected US state, the
correct tense of "to give", the number `N` of H1Bs in our dataset, and the
previous year fragment. In the end, it adds info about the one standard
deviation spread of salaries for selected year and US state.

We got those numbers using d3's default math functions. Assuming salaries
follow a normal distribution, 68% of them fall within this 1-standard-deviation
range.

This is the sort of assumption that would make a statistics professor cry. But
I think it's good enough. Given enough datapoints, everything becomes normally
distributed according to the
[central limit theorem](https://en.wikipedia.org/wiki/Central_limit_theorem)
anyway.

You should have a histogram with a nice description now:

![Histogram with description](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/description_histogram.png)

Woohoo, you’ve made a histogram of H1B salaries with a title and description
and everything changes when the visualization changes. You’re amazing!

Now you know how to make React and d3.js work together. \\o/

In the next section, we're going to look at something fancier - advanced
animations, using Redux, and a potential way to make simple games.
