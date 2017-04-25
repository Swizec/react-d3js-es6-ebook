# Animation #

Welcome to the animation section. This is where the real fun begins. Demos that look cool and impress your friends.

![](images/es6v2/puking-rainbows.png)

You already know how React and D3 work together, so these demos are going to go faster. You know that we're using React for rendering SVG, and D3 for calculating props. You know how to make your dataviz interactive, and how to handle oodles of data.

Now you're going to learn how to make it dance. To build smooth transitions between states, build complex animations, and how to interact with the user in real-time. 60 frames per second baby!

Our general approach to animation goes like this: Render from state. Change state 60 times per second. Animation!

We're going to use two different ways of changing state so often. The first follows a game loop principle, which gives you more control, but is more tedious. The second is using D3 transitions, which is quicker to build, but gives you less control.

We're going to start with an example or two in CodePen, then build something more involved. But don't worry, no more big huge projects like the [tech salary visualization](#salary-visualization)

# Using a game loop for rich animation

I love game loops. It even sounds fun "game loop". Maybe it's just that whenever I build a game loop, the thing I'm building is fun to play with. 🤔

A game loop is an infinite loop where each iteration renders the next frame of your game or animation. You do your best to complete each iteration in 16 milliseconds and your user gets smooth animation.

As you can imagine, our challenge is to cram all physics and rendering into those 16 milliseconds. The more elements you're rendering, the harder it gets.

## A bouncing ball

Let's get our feet wet with my favorite childhood example: a bouncing ball. 

I must have built dozens of them back in my [Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal) days using [BGI](https://en.wikipedia.org/wiki/Borland_Graphics_Interface). Yes, those Turbo Pascal and BGI are from the 80's. No, I'm not that old, I just started young and with old equipment. Coding for DOS is easier when you're a kid than coding for Windows 95.

Here is a screenshot of our bouncing ball:

![Bouncing Ball](images/es6v2/bouncing-ball.png)

Exciting isn't it? Took me five tries to catch it. Future examples will look better as screenshots, I promise.

I suggest you follow along on CodePen. Here's one I prepared for you earlier: [click me](http://codepen.io/swizec/pen/WRzqvK?editors=0010)

### Step 1: stub it out

We start with a skeleton: An empty `Ball` component, and an `App` component stubbed out to run the game loop.

```javascript
const Ball = ({ x, y }) => (

);

const MAX_H = 750;

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      y: 5,
      vy: 0
    }
  }
  
  componentDidMount() {
    // start game loop
  }
  
  componentWillUnmount() {
    // stop loop
  }
  
  gameLoop() {
    // move ball
  }
  
  render() {
    // render svg
  }
}
```

Nothing renders yet. CodePen complains about missing code and unexpected tokens.

The default state sets our ball's `y` coordinate to `5` and its vertical speed – `vy` – to `0`. Initial speed zero, initial position top. Perfect for a big drop.

### Step 2: The Ball

We can approximate the `Ball` component with a circle. No need to get fancy, we're focusing on the animations part.

```javascript
const Ball = ({ x, y }) => (
  <circle cx={x} cy={y} r={5} />
);
```

Our `Ball` renders at `(x, y)` and has a radius of 5 pixels. The CSS paints it black.

It's these coordinates that we're going to play with to make the ball drop and bounce. Each time, React is going to re-render and move our ball to its new coordinates. Because we change them so quickly, it looks like the ball is animated. You'll see.

### Step 3: Rendering

We need an SVG of appropriate height and a ball inside. All that goes in `App.render`.

```javascript
class App extends Component {
	// ...
  render() {
    return (
      <svg width="100%" height={MAX_H}>
        <Ball x={50} y={this.state.y} />
      </svg>
    )
  }
}
```

We're using `MAX_H`, which is set to 750, because a falling ball needs a lot of room to bounce up and down. You've thrown bouncy balls in a small apartment before haven't you? It's terrifying.

A black ball should show up on your screen. Like this:

![Black ball](images/es6v2/bouncing-ball.png)

### Step 4: The Game Loop

To make the ball bounce, we need to start an infinite loop when our component first renders, change the ball's `y` coordinate on every iteration, and stop the loop when React unmounts our component. Wouldn't want to keep hogging resources would we?

```javascript
componentDidMount() {
    this.timer = d3.timer(() => this.gameLoop());
    this.gameLoop();
}

componentWillUnmount() {
    this.timer.stop();
}

gameLoop() {
    let { y, vy } = this.state;

    if (y > MAX_H) {
        vy = -vy*.87;
    }
    
    this.setState({
        y: y+vy,
        vy: vy+0.3
    })
}
```

We start a new `d3.timer` when our App mounts, then stop it when App unmounts. This way we can be sure there aren't any infinite loops running that we can't see.

You can read details about D3 timers in [d3-timer documentation](https://github.com/d3/d3-timer). The tl;dr version is that they're a lot like JavaScript's native `setInterval`, but pegged to `requestAnimationFrame`. That makes them smoother and friendlier to browser's CPU throttling features.

It basically means our game loop executes every time the browser is ready to repaint. More or less every 16 milliseconds.

We simulate bounce physics in the `gameLoop` function. With each iteration we add vertical speed to vertical position and increase the speed.

Remember high school? `v = v0 + g*t`. Speed equals speed plus acceleration multiplied by time. Our acceleration is gravity, our time is "1 frame".

And acceleration is measured in meters per second per second. Basically the increase in speed observed every second. Real gravity is 10m/s^2, our factor is `0.3`. Discovered when playing around. That's what looked natural.

For the bounce, we look at the `y` coordinate and compare with `MAX_H`. When it's over, we invert the speed vector and multiply with the bounce factor. Again, discovered experimentally when the animation looked natural.

Tweak the factors to see how they affect your animation. Changing the `0.3` value should make gravity feel stronger or weaker, and changing the `0.87` value should affect how high the ball bounces.

Notice that we never look at minimum height to make the ball start falling back down. There's no need. Add `0.3` to a negative value often enough and it turns positive.

Here's a CodePen with the [final bouncy ball code](http://codepen.io/swizec/pen/bgvEvp?editors=0010)

### Step 5: Correcting for time

If you run the CodePen a few times, you'll notice two bugs. The first is that sometimes our ball gets trapped at the bottom of the bounce. We won't fix this one, it's tricky.

The second is that when you slow down your computer, the ball starts lagging. That's not how things behave in real life.

We're dealing with dropped frames.

Modern browsers slow down JavaScript in tabs that aren't focused, on computers running off battery power, when batteries get low ... there's many reasons in the pile. I don't know all of them. If we want our animation to look smooth, we have to account for these effects.

We have to calculate how much time each frame took, and adjust our physics.

```javascript
gameLoop() {
    let { y, vy, lastFrame } = this.state;
    
    if (y > MAX_H) {
        vy = -vy*.87;
    }
    
    let frames = 1;
    
    if (lastFrame) {
        frames = (d3.now()-lastFrame)/(1000/60);
    }
    
    this.setState({
        y: y+vy*frames,
        vy: vy+0.3*frames,
        lastFrame: d3.now()
    })
}
```

We add `lastFrame` to game state and set it with `d3.now()`. This gives us a high resolution timestamp that's pegged to `requestAnimationFrame`. D3 guarantees that every `d3.now()` called within the same frame gets the same timestamp.

`(d3.now()-lastFrame)/16` tells us how many frames were meant to have happened since last iteration. Most of the time this value will be `1`.

We use it as a multiplier for the physics calculations. Our physics should look correct now regardless of browser throttling.

Unfortunately these fixes exacerbate the "ball stuck at bottom" bug. It happens when the ball goes below `MAX_H` and doesn't have enough bounce to get back above `MAX_H` in a single frame.

You can fix it with a flag of some sort. Only bounce, if you haven't bounced in the last N frames. Something like that.

I suggest you play with it on CodePen: [click me for time-fixed bouncy ball](http://codepen.io/swizec/pen/NdYNKj?editors=0010)

# Using transitions for simple animation

Game loops are great when you need fine-grained control. But what, if you just want an element to animate a little bit when a user does something? You don't care about the details, you just want a little flourish.

That's where transitions come in.

Transitions are a way to animate SVG elements by saying *"I want this property to change to this new value and take this long to do it"*. And you can use easing functions to make it look better.

I won't go into details about *why* easing functions are important, but they make movement look more natural. You can read more about it in Disney's [12 Basic Principles of Animation](https://en.wikipedia.org/wiki/12_basic_principles_of_animation). 

The two we can achieve with easing functions are:

1. Squash and Stretch
6. Slow In Slow Out

Let me show you how it works on a small example. We're drawing a field of 50 by 50 circles that "flash" when touched. The end result looks like there's a snake following your cursor.

{#rainbow-snake}
## Rainbow snake

You can play with the code on CodePen, [here](http://codepen.io/swizec/pen/QdVoOg/). Follow along as I explain how it works. Tweak parameters and see what happens :)

### App

The App component needs only a `render` method that returns an SVG. Yes, that means it could've been a functional stateless component.

```javascript
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
```

We're rendering a 600px by 600px SVG, with 50 nodes per row and column. We use D3's `scalePoint` for dot positioning  because it does everything we need. Makes sure they're evenly spaced, gives them padding on the sides, and ensures coordinates are rounded numbers.

Here's a diagram of how `scalePoint` works:

![scalePoint diagram](images/es6v2/pointScale.png)

To render the grid, we use two nested loops going from 0 to N. `d3.range` builds an array for us so we can `.map` over it. We return a `<Dot>` component for each iteration.

Looking at this code: `x={pos(x)} y={pos(y)}` you can see why D3 scales are so neat. All positioning calculation boiled down to a 1-parameter function call. \o/

{aside}
Notice that unlike so far, we didn't mess about with `updateD3` and lifecycle methods. That's useful when we're dealing with large datasets and many re-renders. You don't need the complexity when building something small.
{/aside}

### Dot

The Dot component has more moving parts. It needs a `constructor`, a transition callback – `flash`, a `color` getter, and a `render` method.

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

Guess what transitions are ... props that change over time :)

So we put props in state and render from state. This lets us keep a stable platform while running transitions. It ensures that changes re-rendering `Dot` from above, won't interfere with D3 transitions.

Not super important in our example because those changes never happen. But I had many interesting issues in this [animated typing example](https://swizec.com/blog/using-d3js-transitions-in-react/swizec/6797). We'll look at that one later.

For the `render` method, we return an SVG `<circle>` element positioned at `(x, y)`, with a radius, an `onMouseOver` listener, and a style with the `fill` color depending on `state.colorize`.

#### flash() – the transition

When you mouse over one of the dots, its `flash()` method gets called as an event callback. This is where we transition to pops the circle bigger, then back to normal size.

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

1. We `d3.select` the `<circle>` node. This enables D3 to take over the rendering of this particular DOM node
2. We `setState` to enable colorization. Yes, this triggers a re-render.
3. We start a `transition` that changes the `r` attribute to `20` pixels over a duration of `250` milliseconds.
4. We add an `easeCubicOut` easing function, which makes the animation look more natural
5. When the transition ends, we start another similar transition, but change `r` back to `5`.
6. When *that*'s done, we turn off colorization and trigger another re-render.

If our transition didn't return things back to normal, I would use the `'end'` opportunity, to sync React component state with reality. Something like `this.setState({r: 20})`.

#### get color() – the colorization

Colorization doesn't have anything to do with transitions, but I want to explain how it works. Mostly to remind you that high school math is useful.

Here's what the colored grid looks like:

![](images/es6v2/colored-grid.png)

Colors follow a radial pattern even though `d3.interpolateWarm` takes a single argument in the `[0, 1]` range. We achieve the pattern using [circle parametrization](http://www.mathopenref.com/coordparamcircle.html).

`x^2 + y^2 = r^2`

Calibrate a linear scale to translate between `[0, maxR^2]` and `[0, 1]`, then feed it `x^2 + y^2` and you get the `interpolateWarm` parameter. Magic :)

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

At least I think so. Experiment ;)
 
### More things to try

There's a bunch of things you can improve about this example. I suggest you try them and see how it goes.

We really should have taken the `r` parameter as a property on `<Dot>`, saved it in state as a, say, `baseR`, then made sure the transition returns our dot back to that instead of a magic `5` number. Peppering your code with magic numbers is often a bad idea.

Another improvement could be rendering more circles to provide a tighter grid. That doesn't work so well on CodePen, however. Breaks down with so many nodes. 😔

[https://twitter.com/Swizec/status/829590239458922496]

You could also add transitions to the first time a circle renders. But you need something called `ReactTransitionGroup` to achieve that and it breaks down with this many elements.

Because enter/exit transitions make many data visualizations better, we're going to look at another example just for that. A typing animation where letters fly in and fall out as you type.

{#
# Enter/update/exit animation

Now that you know how to use transitions, it's time to take it up a notch. Enter exit animation. 

Enter/exit animations are the most common use of transitions. They're what happens when a new element enters or exits the picture. For instance in visualizations like this famous [Nuclear Detonation Timeline](https://www.youtube.com/watch?v=LLCF7vPanrY) by Isao Hashimoto. Each new Boom! flashes to look like an explosion.

I don't know how Hashimoto did it, but with React&D3v4 you'd do it with enter/exit transitions. 

Another favorite of mine, is this [animated alphabet](https://bl.ocks.org/mbostock/3808234) example by Mike Bostock, the creator of D3, that showcases enter/update/exit transitions.

That's what we're going to build: An animated alphabet. New letters fall down and are green, updated letters move right or left, and deleted letters are red and fall down.

You can play with a more advanced version [here](http://swizec.github.io/react-d3-enter-exit-transitions/). Same principle as the alphabet, but animates your typing.

![Typing animation screenshot](images/es6v2/typing-screenshot.png)

I wish I could embed a gif ... it's 2017 and this is an electronic book and I still can't embed animations. Silly isn't it?

We're building the alphabet version because the [string diffing algorithm](https://swizec.com/blog/animated-string-diffing-with-react-and-d3/swizec/6952) is a pain to explain. I learned that the hard way when giving workshops on React and D3 ...

![String diffing algorithm sketch](images/es6v2/string-diffing.png)

See? Easy on paper, but the code is long and weird. That, or I'm bad at implementing it. Either way, too tangential to explain here. You can [read the article on it](https://swizec.com/blog/animated-string-diffing-with-react-and-d3/swizec/6952).

{#animated-alphabet}
## Animated alphabet

Our goal is to render a random subset of the alphabet. Every time the set updates old letters transition out, new letters transition in, updated letters transition into a new position. 

We need two components:

 - `Alphabet`, which creates random lists of letters every 1.5 seconds, then maps through them to render `Letter` components
 - `Letter`, which renders an SVG text element, and takes care of its own enter/update/exit transitions

You can see the full code on GitHub [here](https://github.com/Swizec/react-d3-enter-exit-transitions/tree/alphabet).

### The Alphabet component

The `Alphabet` component holds a list of letters in local state and renders a collection of `Letter` components in a loop.

We start with a skeleton like this:

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

We import our dependencies and define the `Alphabet` component. It holds a list of available letters in a static `letters` property, and an empty `alphabet` in local state. We'll need a `componentWillMount` and a `render` method as well.

To showcase enter-update-exit transitions, we want to create a new alphabet every couple of seconds. That's easiest to do in `componentWillMount`:

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

The key property is how React identifies components. Pick wrong and you're gonna have a bad time. I spent many hours debugging and writing workarounds before I realized that basing the key on the index was a Bad Move™. *Obviously*, you want the letter to stay constant in each component and the index to change.

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

Now we're ready for the component that can transition itself into and out of a visualization … without bothering anyone else *or* confusing React.

The skeleton of our `Letter` component looks like this:

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

We start with some imports, and define a `Letter` component with a default state and a default transition. Yes, it feels weird to use `state` for coordinates and styling, but they're properties that change over time. State is the right place to put them.

Defining a default transition saves us some typing later on. Shared transitions can also fix animation glitches with out-of-sync transitions. For that, we'd have to define our default transition in the `Alphabet` component, then pass it into `Letter` as part of props.

All our magic values – default/final `y` coordinate, transition properties, etc. – are good candidates for props. That would make `Alphabet` more flexible, but add needless complexity to this chapter. I'll leave it as an exercise for the reader ;)

### componentWillEnter

We start with the enter transition in `componentWillEnter`.

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

At this point our component is invisible and 60 pixels above the baseline. That's because of the default values for `fillOpacity` and `y` that we set earlier.

To animate our component moving down and becoming visible, we use a d3 transition. 

We start a new transition with `node.transition(this.transition)`, which uses settings from the default transition we defined earlier. Then we define what/how should change with `.attr` and `.style`. 

The resulting transition operates directly on the DOM and doesn't tell React what's going on.

We can sync React's imagination with reality in a "transition is over" callback using `.on('end'`. We use `setState` to update component state, and trigger the main `callback`. React now knows this letter is done appearing.

### componentWillLeave

The exit transition goes in `componentWillLeave` and follows the same principle, except in reverse. It looks like this:

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

### componentWillReceiveProps

The update transition goes into `componentWillReceiveProps` like this:

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

There are instances when the component updates, but its horizontal position doesn't change. Every time we call `setState` for example.

### render

After all that transition magic, you might be thinking *"Holy shit, how do I render this!?"*. I don't blame ya!

But we did the hard work. Rendering is straightforward:

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

## That's it

Boom. We're done. You can play with a more complex version here: [http://swizec.github.io/react-d3-enter-exit-transitions/](http://swizec.github.io/react-d3-enter-exit-transitions/). Github won't let me host different branches separately.

We have an `Alphabet` component that declaratively renders an animated alphabet. Letters transition in and out and jump left and right.

All you need now is a skeleton setup that renders an SVG element and uses the `Alphabet` component.

The key take aways are:

- use d3 for transitions
- use React to manage SVG elements
- use ReactTransitionGroup to get more lifecycle events
- mimic d3's enter/update/exit pattern