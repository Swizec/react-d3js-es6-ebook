# Animation #

Welcome to the animation section. This is where the real fun begins. Demos that look cool, impress your friends, and sound good at the dinner table.

At my dinner table at least ...

![](images/es6v2/puking-rainbows.png)

You already know how React and D3 work together, so these examples are going to go faster. You know that we're using React for rendering SVG and D3 for calculating props. You know how to make your dataviz interactive and how to handle oodles of data.

Now you're going to learn how to make it dance. Smooth transitions between states, complex animations, interacting with users in real-time. 60 frames per second, baby!

Animation looks like this in a nutshell:

- render something
- change it 60 times per second

When that happens humans perceive smooth motion. You can go as low as 24 frames per second, like old TVs used to, but that often looks jaggeddy on modern monitors.

You're about to learn two different approaches to building these animations. Using game loops and using transitions.

1. Game loops give you more control
2. Transitions are easier to implement

We're starting with an example or two in CodeSandbox, then building some bigger stuff. No more big huge projects like the [tech salary visualization](#salary-visualization), though. Takes too long to set up and doesn't focus on animation.

{#game-loop}
# Using a game loop for rich animation

Game loops are fun! They're my favorite. They even sound fun: "game loop". Doesn't it sound fun to go build a game loop? Maybe it's because I've always used game loops when building something fun to play with.

At its core, a game loop is an infinite loop where each iteration renders the next frame of your animation.

The concept comes from the video game industry. At some point they realized that building game engines is much easier when you think about each frame as its own static representation of your game state.

You take every object in the game and render it. Then you throw it all away, make small adjustments, and render again.

This turns out to be both faster to run and easier to implement than diffing scenes and figuring out what moves and what doesn't. Of course as you get more objects on the screen it becomes silly to re-render the immovable background every time.

But you don't have to worry about that. That's React's job. 

React can figure out a diff between hierarchical representations of your scene and re-render the appropriate objects.

That's a hard engineering problem, but you can think of it this way:

1. Render a DOM from state
2. Change some values in state
3. Trigger a re-render

Make those state changes fast enough and you get 60 frames per second. The hard part then becomes thinking about your movement as snapshots in time.

When something speeds up, what does that mean for changes in its position?

## A bouncing ball game loop example

Let's get our feet wet with my favorite childhood example: a bouncing ball.

I must have built dozens of them back in my [Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal) days using [BGI](https://en.wikipedia.org/wiki/Borland_Graphics_Interface). Endless afternoons playing with different parameters in my bouncy ball examples. 

Yes, those Turbo Pascal and BGI are from the 80's. No, I'm not that old. I started young and with old equipment. Coding for DOS is easier when you're a kid than coding for Windows 95.

Here is a screenshot of our bouncing ball:

![Bouncing Ball](images/es6v2/bouncing-ball.png)

Exciting, isn't it? Took me five tries to catch it. Future examples will look better as screenshots, I promise.

I suggest you follow along on CodeSandbox. Here's one I prepared for you earlier: [click me](https://codesandbox.io/s/rrwz67jl04)

### Step 1: stub out App and Ball

We start with a skeleton: An `App` component rendering a `BouncingBall` component inside an SVG, and a `Ball` component.

{caption: "App component", line-numbers: false}
```javascript
// index.js
import React from "react";
import { render } from "react-dom";

import BouncingBall from "./BouncingBall";

const App = () => (
  <div>
    <svg width="800" height="600">
      <BouncingBall max_h={600} />
    </svg>
  </div>
);

render(<App />, document.getElementById("root"));
```

App imports dependencies, imports `BouncingBall`, renders it all into a `root` DOM node. CodeSandbox gives us most of this code by default.

{caption: "Ball component", line-numbers: false}
```javascript
// Ball.js
import React from "react";

const Ball = ({ x, y }) => <circle cx={x} cy={y} r="5" />;

export default Ball;
```

We're calling it a ball, but eh it's a just a circle. You can make this more fun if you want. Right now it's a black SVG circle that renders at a specified `x, y` coordinate with a radius of `5` pixels.

It's these coordinates that we're going to play with to make the ball drop and bounce. Each time, React is going to re-render and move our ball to its new coordinates. Because we change them so quickly, it looks like the ball is animated. You'll see.

---

Those are the boring components. The animation game loop fun happens in `BouncingBall`.

### Step 2: Stub out BouncingBall

We encapsulate everything in this component so that `App` doesn't have to know about the details of our animation. App declaratively renders a bouncing ball and that's it.

{caption: "BouncingBall component stub", line-numbers: false}
```javascript
import React, { Component } from "react";
import * as d3 from "d3";

class BouncingBall extends Component {
  constructor() {
    super();

    this.state = {
      y: 5,
      vy: 0
    };
  }

  componentDidMount() {
    // start game loop
    this.timer = d3.timer(this.gameLoop);
  }

  componentWillUnmount() {
    // stop loop
    this.timer.stop();
  }

  gameLoop = () => {
    // move ball by vy
    // increase vy to accelerate
  }

  render() {
    // render Ball at position y
    return <g />;
  }
}

export default BouncingBall;
```

Nothing renders yet and we're set up to get started.

We start with default state: vertical position `y=5`, vertical speed `vy=0`.

`componentDidMount` fires off a d3 timer and `componentWillUnmount` stops it so we don't have unwanted code running in the background. The timer calls `this.gameLoop` every 16 milliseconds, which translates to about 60 frames per second.

D3 timers work like JavaScript's own `setInterval`, but their implementation is more robust. They use `requestAnimationFrame` to save computer resources when possible, and default to `setInterval` otherwise.

Unlike `setInterval` timers are also synced so their frames match up, can be restarted, stopped, etc. You should default to favoring `d3.timer` over `setInterval` or hacking your own `requestAnimationFrame` implementation.

### Step 3: Rendering

To render our Ball we have to tweak BouncingBall's `render` method. A small change. Try it yourself first.

{caption: "Render ball", line-numbers: false}
```javascript
// BouncingBall.js
import Ball from "./Ball"

class App extends Component {
	// ...
	render() {
    // render Ball at position y
    return <g><Ball x={10} y={this.state.y} /></g>
  }
}
```

Import our `Ball` component, render it at `x=10` and use `this.state.y` for the vertical coordinate.

A black ball shows up on your screen. Like this:

![Black ball](images/es6v2/bouncing-ball.png)

### Step 4: The Game Loop

Our game loop is already running. It's that `d3.timer` we started on component mount.

What do you think we should do every time `gameLoop` is called?

Move the ball. Accelerate. Bounce it back. 🏀

The physics is tricky to think about. Few students at my workshops figure this one out and that's the point: Game loop gives you control. All the control.

{caption: "Bouncy ball at 60fps", line-numbers: false}
```javascript
// BouncingBall.js
	componentDidMount() {
	    // start game loop
	    this.timer = d3.timer(this.gameLoop);
	}
	
	componentWillUnmount() {
	    this.timer.stop();
	}
	
	gameLoop = () => {
    let { y, vy } = this.state;

    if (y > this.props.max_h) {
      vy = -vy * .87;
    }

    this.setState({
      y: y + vy,
      vy: vy + 0.3
    })
  }
```

Our `gameLoop` method is called every 16 milliseconds give or take. Sometimes more, if the computer is busy, low on batter, or the tab is left inactive for too long

Bounce physics go like this: 

- add vertical speed, `vy`, to position, `y`
- increased `vy` by amount of acceleration
- if position is more than max, bounce
- bounce means invert speed
- bounce means energy loss, reduce speed by 13%

High school physics my friend. You might not remember. 

Speed tells you how much an object moves per unit of time. Our speed starts at 5 pixels per frame.

Acceleration tells you how much speed increases per unit of time. Gravity makes you fall 10 meters per second faster every second. Our gravity looks best at 0.3 pixels per frame.

Bounce is what really breaks people's brains.

I think it's one of Newton's laws? Or a derivation from there. Bouncing means balls maintain the same speed, but change direction. Our wall is perpendicular to the path of travel, so the speed inverts.

We add some energy loss to make the bounce more realistic.

Gravity acceleration points the same downwards direction as always. Except now it's slowing down the ball instead of speeding it up.

Eventually speed reaches zero and the ball starts falling again.

![Magic](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)

Here's a CodeSandbox with the [final bouncy ball code](https://codesandbox.io/s/o4vk8zkn96).

Experiment with multiple balls. Start them at different heights. Play with different factors in those equations. It's fun if you're a nerd like me.

### Step 5: Correcting for time

If you run the CodeSandbox a few times, you'll notice two bugs. 

1) Sometimes our ball gets trapped at the bottom of the bounce. We won't fix this one; it's tricky.

2) When you slow down your computer, the ball lags. That's not how things behave in real life.

We're dealing with dropped frames.

Modern browsers slow down JavaScript in tabs that aren't focused, on computers running off batteries, when batteries get low… many different reasons. To make our animation silky smooth, we have to take this into account.

That involves calculating how many frames we dropped and adjusting our physics.

{caption: "Adjust for frame drops", line-numbers: false}
```javascript
// BouncingBall.js
  gameLoop = () => {
    let { y, vy, lastFrame } = this.state;

    let frames = 1;

    if (lastFrame) {
      frames = (d3.now() - lastFrame) / (1000 / 60);
    }

    for (let i = 0; i < frames; i++) {
      if (y > this.props.max_h) {
        vy = -vy * 0.87;
      }

      y = y + vy;
      vy = vy + 0.3;
    }

    this.setState({
      y,
      vy,
      lastFrame: d3.now()
    });
  };

```

We add `lastFrame` to game state and set it with `d3.now()`. This gives us a high resolution timestamp that's pegged to `requestAnimationFrame`. D3 guarantees that every `d3.now()` called within the same frame gets the same timestamp.

`(d3.now()-lastFrame)/16` tells us how many frames were meant to have happened since last iteration. Most of the time, this value will be `1`.

We use `frames` to simulate as many frames as we need in a quick loop. Run the same calculations with the same height checks. This simulates the missing frames and makes our animation look smooth.

Try it out on CodeSandbox: [click me for time-fixed bouncy ball](https://codesandbox.io/s/8n3p6720wl)

## Game loop recap

You now know how to build a game loop and use it to run custom animations. 👏

- render from state
- change state 60 times per second
- reason about movement in snapshots
- deal with dropped frames
- complete control

Complete control is nice, but the mental acrobatics are not. Getting game loops just right is hard.

And that's why I recommend transitions in most cases. Transitions can handle all of that for you out of the box.

# Using transitions for simple animation

Game loops are great for fine-grained control. And when all you need is a little flourish on user action, that's where transitions shine.

No details, just keyframes.

Transitions let you animate SVG elements by saying *"I want this property to change to this new value and take this long to do so"*.

Start-end keyframes are the simplest. You define the starting position. Start a transition. Define the end position. D3 figures out the rest. Everything from calculating the perfect rate of change to match your start and end values and your duration, to *what* to change and handling dropped frames.

Quite magical.

You can also sequence transitions to create complex keyframe-based animation. Each new transition definition is like a new keyframe. D3 figures out the rest.

Better yet, you can use easing functions to make your animation look more natural. Make rate of change follow a mathematical curve to create smooth natural movement.

You can read more about the *why* of easing functions in Disney's [12 Basic Principles of Animation](https://en.wikipedia.org/wiki/12_basic_principles_of_animation). Bottom line is that it makes your animation feel natural.

*How* they work is hard to explain. You can grok part of it in my [Custom transition tweens](https://swizec.com/blog/silky-smooth-piechart-transitions-react-d3js/swizec/8258) article.

But don't worry about it. All you have to know is that many easing functions exist. [easings.net](https://easings.net/) lists the common ones. D3 implements everything on that list.

![Common easing functions](images/2018/easings.net.png)

Let's try an example: A swipe transition.

{#swipe-transition}
## Swipe transition

Our goal is to build a declarative component fully controlled by props. We pass in the `x` coordinate and the coordinate figures out the rest.

We shouldn't care about the transition or how long it takes. That's up to the component. We just change the `x`.

You can see it in action [on CodeSandbox, here](https://codesandbox.io/s/618mr9r6nr). Tweak params, see what happens. Follow along as I explain how it works.

### App

The App component only needs  a `render` method that returns an SVG. Yes, that means it could've been a functional stateless component.

{caption: "App render method", line-numbers: false}
```javascript
class App extends Component {
  render() {
    const width = 600,
          N = 50,
          pos = d3.scalePoint()
                  .domain(d3.range(N))
                  .range([0, width])
                  .padding(5)
                  .round(true);
    
    return (
      <svg width="600" height="600">
        {d3.range(N).map(x => 
           d3.range(N).map(y =>
             <Dot x={pos(x)} y={pos(y)} key={`${x}-${y}`} 
                  maxPos={width} />
        ))}
      </svg>
    )
  }
}
```

We're rendering a 600px by 600px SVG, with 50 nodes per row and column. We use D3's `scalePoint` for dot positioning because it does everything we need. It makes sure they're evenly spaced, gives them padding on the sides, and ensures coordinates are rounded numbers.

Here's a diagram of how `scalePoint` works:

![scalePoint diagram](images/es6v2/pointScale.png)

To render the grid, we use two nested loops going from 0 to N. `d3.range` builds an array for us so we can `.map` over it. We return a `<Dot>` component for each iteration.

Looking at this code: `x={pos(x)} y={pos(y)}`, you can see why D3 scales are so neat. All positioning calculation boiled down to a 1-parameter function call. \\o/

{aside}
Notice that unlike thus far, we didn't mess about with `updateD3` and lifecycle methods. That's useful when we're dealing with large datasets and many re-renders. You don't need the complexity when building something small.
{/aside}

### Dot

The Dot component has more moving parts. It needs a `constructor`, a transition callback – `flash`, a `color` getter, and a `render` method.

{caption: "Dot component skeleton", line-numbers: false}
```javascript
class Dot extends Component {
  constructor(props) {
    super(props);
    
    this.state = Object.assign({}, 
                               props,
                               {r: 5});
  }
  
  flash() {
		// transition code
  }
  
  get color() {
    // color calculation
  }
  
  render() {
    const { x, y, r, colorize } = this.state;
    
    return <circle cx={x} cy={y} r={r} 
             ref="circle" onMouseOver={this.flash.bind(this)}
             style={{fill: colorize ? this.color : 'black'}} />
  }
}
```

We initialize state in the component `constructor`. The quickest approach is to copy all `props` to `state`, even though we don't need all props to be in state.

Normally, you want to avoid state and render all components from props. Functional principles, state is bad, and all that. But as [Freddy Rangel](https://twitter.com/frangel85) likes to say *"State is for props that change over time"*.

Guess what transitions are… props that change over time :)

So we put props in state and render from state. This lets us keep a stable platform while running transitions. It ensures that changes re-rendering `Dot` from above won't interfere with D3 transitions.

It's not *super* important in our example because those changes never happen. But I had many interesting issues in this [animated typing example](https://swizec.com/blog/using-d3js-transitions-in-react/swizec/6797). We'll look at that one later.

For the `render` method, we return an SVG `<circle>` element positioned at `(x, y)` with a radius, an `onMouseOver` listener, and a style with the `fill` color depending on `state.colorize`.

#### flash() – the transition

When you mouse over one of the dots, its `flash()` method gets called as an event callback. This is where we transition to pop the circle bigger then back to normal size.

{caption: "Main Dot transition effect", line-numbers: false}
```javascript
  flash() {
    let node = d3.select(this.refs.circle);

    this.setState({colorize: true});

    node.transition()
        .attr('r', 20)
        .duration(250)
        .ease(d3.easeCubicOut)
        .transition()
        .attr('r', 5)
        .duration(250)
        .ease(d3.easeCubicOut)
        .on('end', () => this.setState({colorize: false}));
  }
```

Here's what happens:

1. We `d3.select` the `<circle>` node. This enables D3 to take over the rendering of this particular DOM node.
2. We `setState` to enable colorization. Yes, this triggers a re-render.
3. We start a `transition` that changes the `r` attribute to `20` pixels over a duration of `250` milliseconds.
4. We add an `easeCubicOut` easing function, which makes the animation look more natural
5. When the transition ends, we start another similar transition, but change `r` back to `5`.
6. When *that's* done, we turn off colorization and trigger another re-render.

If our transition didn't return things back to normal, I would use the `'end'` opportunity to sync React component state with reality. Something like `this.setState({r: 20})`.

#### get color() – the colorization

Colorization doesn't have anything to do with transitions, but I want to explain how it works. Mostly to remind you that high school math is useful.

Here's what the colored grid looks like:

![](images/es6v2/colored-grid.png)

Colors follow a radial pattern even though `d3.interpolateWarm` takes a single argument in the `[0, 1]` range. We achieve the pattern using [circle parametrization](http://www.mathopenref.com/coordparamcircle.html).

`x^2 + y^2 = r^2`

Calibrate a linear scale to translate between `[0, maxR^2]` and `[0, 1]`, then feed it `x^2 + y^2`, and you get the `interpolateWarm` parameter. Magic :smile:

{caption: "Radial coloring effect", line-numbers: false}
```javascript
  get color() {
    const { x, y, maxPos } = this.state;
    
    const t = d3.scaleLinear()
                .domain([0, 1.2*maxPos**2])
                .range([0, 1]);
    
    return d3.interpolateWarm(t(x**2 + y**2));
  }
```

We calibrate the `t` scale to `1.2*maxPos**2` for two reasons. First, you want to avoid square roots because they're slow. Second, adding the `1.2` factor changes how the color scale behaves and makes it look better.

At least I think so. Experiment :wink:

### More things to try

There's a bunch of things you can improve about this example. I suggest you try them and see how it goes.

We really should have taken the `r` parameter as a property on `<Dot>`, saved it in state as a, say, `baseR`, then made sure the transition returns our dot back to that instead of a magic `5` number. Peppering your code with magic numbers is often a bad idea.

Another improvement could be rendering more circles to provide a tighter grid. That doesn't work so well on CodePen, however. Breaks down with so many nodes. :disappointed:

[Use this link to see a video](https://twitter.com/Swizec/status/829590239458922496)

You could also add transitions to the first time a circle renders. But you need something called `ReactTransitionGroup` to achieve that, and it breaks down with this many elements.

Because enter/exit transitions make many data visualizations better, we're going to look at another example just for that. A typing animation where letters fly in and fall out as you type.

{#enter-exit-animation}
# Enter/update/exit animation

Now that you know how to use transitions, it's time to take it up a notch. Enter/exit animation.

Enter/exit animations are the most common use of transitions. They're what happens when a new element enters or exits the picture. For instance, in visualizations like this famous [Nuclear Detonation Timeline](https://www.youtube.com/watch?v=LLCF7vPanrY) by Isao Hashimoto. Each new Boom! flashes to look like an explosion.

I don't know how Hashimoto did it, but with React & D3v4, you'd do it with enter/exit transitions.

Another favorite of mine is this [animated alphabet](https://bl.ocks.org/mbostock/3808234) example by Mike Bostock, the creator of D3, that showcases enter/update/exit transitions.

That's what we're going to build: An animated alphabet. New letters fall down and are green, updated letters move right or left, and deleted letters are red and fall down.

You can play with a more advanced version [here](http://swizec.github.io/react-d3-enter-exit-transitions/). Same principle as the alphabet, but it animates your typing.

![Typing animation screenshot](images/es6v2/typing-screenshot.png)

I wish I could embed a gif… it's 2017, and this is an electronic book, and I still can't embed animations. Silly, isn't it?

We're building the alphabet version because the [string diffing algorithm](https://swizec.com/blog/animated-string-diffing-with-react-and-d3/swizec/6952) is a pain to explain. I learned that the hard way when giving workshops on React and D3…

![String diffing algorithm sketch](images/es6v2/string-diffing.jpg)

See? Easy on paper, but the code is long and weird. That, or I'm bad at implementing it. Either way, it's too tangential to explain here. You can [read the article on it](https://swizec.com/blog/animated-string-diffing-with-react-and-d3/swizec/6952).

{#animated-alphabet}
## Animated alphabet

Our goal is to render a random subset of the alphabet. Every time the set updates, old letters transition out, new letters transition in, and updated letters transition into a new position.

We need two components:

 - `Alphabet`, which creates random lists of letters every 1.5 seconds, then maps through them to render `Letter` components
 - `Letter`, which renders an SVG text element and takes care of its own enter/update/exit transitions

You can see the full code on GitHub [here](https://github.com/Swizec/react-d3-enter-exit-transitions/tree/alphabet).

### The Alphabet component

The `Alphabet` component holds a list of letters in local state and renders a collection of `Letter` components in a loop.

We start with a skeleton like this:

{caption: "Alphabet skeleton", line-numbers: false}
```javascript
// src/components/Alphabet.js
import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import * as d3 from 'd3';

import Letter from './Letter';

class Alphabet extends Component {
    static letters = "abcdefghijklmnopqrstuvwxyz".split('');
    state = {alphabet: []};

    componentWillMount() {
        // alphabet shuffling
    }

    render() {
        // spits out SVG
    }
}

export default Alphabet;
```

We import our dependencies and define the `Alphabet` component. It holds a list of available letters in a static `letters` property and an empty `alphabet` in local state. We'll need a `componentWillMount` and a `render` method as well.

To showcase enter-update-exit transitions, we want to create a new alphabet every couple of seconds. That's easiest to do in `componentWillMount`:

{caption: "Alphabet game loop", line-numbers: false}
```javascript
// src/components/Alphabet/index.js
    componentWillMount() {
        d3.interval(() => this.setState({
           alphabet: d3.shuffle(Alphabet.letters)
                       .slice(0, Math.floor(Math.random() * Alphabet.letters.length))
                       .sort()
        }), 1500);
    }
```

We use `d3.interval( //.., 1500)` to call a function every 1.5 seconds. It's the same as `setInterval`, but friendlier to batteries and CPUs because it pegs to `requestAnimationFrame`. On each period, we shuffle the available letters, slice out a random amount, sort them, then update component state with `setState`.

This ensures our alphabet is both random and in alphabetical order.

Starting the interval in `componentWillMount` ensures it only runs when our Alphabet is on the page. You should stop these sorts of intervals in `componentWillUnmount` in real life. It's okay to skip that step in a short experiment, but it could lead to strange behavior in real world code if your component gets mounted and unmounted several times without a page refresh.

Our declarative transitions magic starts in the `render` method.

{caption: "Letter rendering", line-numbers: false}
```javascript
// src/components/Alphabet/index.js
    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        return (
            <g transform={transform}>
                <ReactTransitionGroup component="g">
                    {this.state.alphabet.map((l, i) => (
                        <Letter letter={l} i={i} key={`letter-${l}`} />
                     ))}
                </ReactTransitionGroup>
            </g>
        );
    }
```

An SVG transformation moves our alphabet into the specified `(x, y)` position. We map through `this.state.alphabet` inside a `<ReactTransitionGroup>` component. I'll explain why in a bit. Inside the loop, each `Letter` gets its current text – `letter` – and index – `i`. We *have to* define the `key` attribute based on the letter – `l`.

We assume the parent component renders `<Alphabet>` inside an `<svg>` tag.

#### The key property

The key property is how React identifies components. Pick wrong, and you're gonna have a bad time. I spent many hours debugging and writing workarounds before I realized that basing the key on the index was a Bad Move™. *Obviously*, you want the letter to stay constant in each component and the index to change.

That's how x-axis transitions work. You're moving the letter into a specific place in the alphabet. You'll see what I mean when we look at the `Letter` component.

#### ReactTransitionGroup

Wrapping our list of `Letter`s in `ReactTransitionGroup` gives us fine-grained access to the component lifecycle. It's a low-level API from React add-ons that expands our kingdom of lifecycle hooks.

In addition to knowing when the component mounts, updates, and unmounts, we get access to `componentWillEnter`, `componentWillLeave`, and a few others. Notice something familiar?

`componentWillEnter` is the same as d3's `.enter()`, `componentWillLeave` is the same as d3's `.exit()`, and `componentWillUpdate` is the same as d3's `.update()`.

"The same" is a strong word – they're analogous. D3's hooks operate on entire selections – groups of components – while React's lifecycle hooks operate on each component individually. In D3, an overlord dictates what happens; in React, each component knows what to do.

That makes React code easier to understand.

`ReactTransitionGroup` gives us [even more hooks](https://facebook.github.io/react/docs/animation.html), but we don't need them for this example. I like that in both `componentWillEnter` and `componentWillLeave` we can use the callback to explicitly say *"The transition is done. React, back to you"*.

Many thanks to Michelle Tilley for writing about `ReactTransitionGroup` [on StackOverflow](http://stackoverflow.com/questions/29977799/how-should-i-handle-a-leave-animation-in-componentwillunmount-in-react).

### The Letter component

Now we're ready for the component that can transition itself into and out of a visualization… without bothering anyone else *or* confusing React.

The skeleton of our `Letter` component looks like this:

{caption: "Letter component skeleton", line-numbers: false}
```javascript
// src/components/Alphabet/Letter.js

import React, { Component } from 'react';
import * as d3 from 'd3';

const ExitColor = 'brown',
      UpdateColor = '#333',
      EnterColor = 'green';

class Letter extends Component {
    state = {
        y: -60,
        x: 0,
        color: EnterColor,
        fillOpacity: 1e-6
    }
    transition = d3.transition()
                   .duration(750)
                   .ease(d3.easeCubicInOut);

    componentWillEnter(callback) {
        // start enter transition, then callback()
    }

    componentWillLeave(callback) {
        // start exit transition, then callback()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.i != nextProps.i) {
           // start update transition
        }
    }

    render() {
       // spit out a <text> element
    }
};

export default Letter;
```

We start with some imports and define a `Letter` component with a default state and a default transition. Yes, it feels weird to use `state` for coordinates and styling, but they're properties that change over time. State is the right place to put them.

Defining a default transition saves us some typing later on. Shared transitions can also fix animation glitches with out-of-sync transitions. For that, we'd have to define our default transition in the `Alphabet` component, then pass it into `Letter` as part of props.

All our magic values – default/final `y` coordinate, transition properties, etc. – are good candidates for props. That would make `Alphabet` more flexible but add needless complexity to this chapter. I'll leave it as an exercise for the reader ;)

#### componentWillEnter

We start with the enter transition in `componentWillEnter`.

{caption: "Enter transition", line-numbers: false}
```javascript
// src/components/Alphabet/Letter.js
    componentWillEnter(callback) {
        let node = d3.select(this.refs.letter);

        this.setState({x: this.props.i*32});

        node.transition(this.transition)
            .attr('y', 0)
            .style('fill-opacity', 1)
            .on('end', () => {
                this.setState({y: 0,
                               fillOpacity: 1,
                               color: UpdateColor});
                callback()
            });
    }
```

We use `d3.select` to turn our `letter` ref into a d3 selection, which enables us to manipulate the DOM using d3. Then we update `this.state.x` with the current index and letter width. The width is a value that we Just Know™.

We keep our letter's `x` coordinate in `this.state` to avoid jumpiness. The `i` prop updates on each render, but we want to transition into the new position slowly. You'll see how that works in the `componentWillReceiveProps` section.

At this point, our component is invisible and 60 pixels above the baseline. That's because of the default values for `fillOpacity` and `y` that we set earlier.

To animate our component moving down and becoming visible, we use a d3 transition.

We start a new transition with `node.transition(this.transition)`, which uses settings from the default transition we defined earlier. Then we define what/how should change with `.attr` and `.style`.

The resulting transition operates directly on the DOM and doesn't tell React what's going on.

We can sync React's imagination with reality in a "transition is over" callback using `.on('end'`. We use `setState` to update component state, and trigger the main `callback`. React now knows this letter is done appearing.

#### componentWillLeave

The exit transition goes in `componentWillLeave` and follows the same principle, except in reverse. It looks like this:

{caption: "Leave transition", line-numbers: false}
```javascript
// src/components/Alphabet/
    componentWillLeave(callback) {
        let node = d3.select(this.refs.letter);

        this.setState({color: ExitColor});

        node.transition(this.transition)
            .attr('y', 60)
            .style('fill-opacity', 1e-6)
            .on('end', () => {
                this.setState({y: 60,
                               fillOpacity: 1e-6});
                callback()
            });
    }
```

This time, we update state to change the `color` instead of `x`. That's because `x` doesn't change.

The exit transition itself is an inverse of the enter transition. An exiting letter moves further down and becomes invisible. Once the transition is over, we update state for consistency's sake, and we tell React it can remove the component.

On second though, we might not need to update state in this case. The component goes bye-bye anyway…

#### componentWillReceiveProps

The update transition goes into `componentWillReceiveProps` like this:

{caption: "Update transition", line-numbers: false}
```javascript
// src/components/Alphabet/Letter.js
    componentWillReceiveProps(nextProps) {
        if (this.props.i !== nextProps.i) {
            let node = d3.select(this.refs.letter);

            this.setState({color: UpdateColor});

            node.transition(this.transition)
                .attr('x', nextProps.i*32)
                .on('end', () => this.setState({x: nextProps.i*32}));
        }
    }
```

You know the pattern by now, don't you? Update state, do transition, sync state with reality after transition.

In this case, we change the `color`, then we move the letter into its new horizontal position.

We could have done all of this in `componentWillUpdate` as well.  However, we can't do it in `componentDidUpdate`. We need to know both the current index *and* the new index. It helps us decide whether to transition or not.

There are instances when the component updates but its horizontal position doesn't change. Every time, we call `setState` for example.

#### render

After all that transition magic, you might be thinking *"Holy shit, how do I render this!?"*. I don't blame ya!

But we did the hard work. Rendering is straightforward:

{caption: "Letter render method", line-numbers: false}
```javascript
// src/components/Alphabet/Letter.js
    render() {
        const { x, y, fillOpacity, color } = this.state;

        return (
            <text dy=".35em"
                  x={x}
                  y={y}
                  style={{fillOpacity: fillOpacity,
                          fill: color,
                          font: 'bold 48px monospace'}}
                  ref="letter">
                {this.props.letter}
            </text>
        );
    }
```

We return an SVG `<text>` element rendered at an `(x, y)` position with a `color` and `fillOpacity` style. It shows a single letter given by the `letter` prop.

As mentioned, using state for `x`, `y`, `color`, and `fillOpacity` feels weird. It's the simplest way I've found to communicate between the `render` and lifecycle methods.

### That's it

Boom. We're done. You can play with a more complex version here: [http://swizec.github.io/react-d3-enter-exit-transitions/](http://swizec.github.io/react-d3-enter-exit-transitions/). Github won't let me host different branches separately.

We have an `Alphabet` component that declaratively renders an animated alphabet. Letters transition in and out and jump left and right.

All you need now is a skeleton setup that renders an SVG element and uses the `Alphabet` component.

The key takeaways are:

- use d3 for transitions
- use React to manage SVG elements
- use ReactTransitionGroup to get more lifecycle events
- mimic d3's enter/update/exit pattern
