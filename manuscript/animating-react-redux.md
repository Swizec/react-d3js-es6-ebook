<!--- begin-section title="Animating with React, Redux, and D3" -->

<!--- begin-lecture title="Redux animation intro" -->

{#animating-react-redux}
# Animating with React, Redux, and d3

And now for some pure nerdy fun: A particle generator… or, well, as close as you can get with React and D3. You'd need WebGL for a *real* particle generator.

We're making tiny circles fly out of your mouse cursor. Works on mobile with your finger, too.

To see the particle generator in action, [go here](http://swizec.github.io/react-particles-experiment/). Github won't let me host different branches, so you'll see the advanced 20,000 particle version from next chapter.

We're using the [game loop](https://swizec1.teachable.com/courses/react-for-data-visualization/lectures/6906604#game-loop) approach to animation and Redux to store the state tree and drive changes for each frame.

You can see the full code [on GitHub](https://github.com/Swizec/react-particles-experiment). I've merged the SVG and Canvas branches. Redux part is the same, some parameters differ. We're focusing on the Redux part because that's what's new.

It's going to be great.

{aside}
Code in this example uses the `.jsx` file extension. I originally wrote it back when that was still a thing, and while I did update everything to React 16+, I felt that changing filenames was unnecessary.
{/aside}

<!--- end-lecture -->

<!--- begin-lecture title="Here's how it works" -->

## Here's how it works

We use **React to render everything**: the page, the SVG element, the particles inside. This lets us tap into React's algorithms that decide which nodes to update and when to garbage collect old nodes.

Then we use some **d3 calculations and event detection**. D3 has great random generators, so we take advantage of that. D3's mouse and touch event handlers calculate coordinates relative to our SVG. We need those, but React's click handlers are based on DOM nodes, which don't correspond to `(x, y)` coordinates. D3 looks at real cursor position on screen.

All **particle coordinates are in a Redux store**. Each particle also has a movement vector. The store holds some useful flags and general parameters, as well. This lets us treat animation as data transformations. I'll show you what that means.

We use **actions to communicate user events** like creating particles, starting the animation, changing mouse position, and so on. On each requestAnimationFrame, we **dispatch an "advance animation" action**.

On each action, the **reducer calculates a new state** for the whole app. This includes **new particle positions** for each step of the animation.

When the store updates, **React flushes changes** via props and because **coordinates are state, the particles move**.

The result is smooth animation. Just like the game loop example from before.

<!--- end-lecture -->

<!--- begin-lecture title="Some basic terminology" -->

## Some basic terminology

We're about to throw around some terms. You'll understand what they mean in detail after this chapter.

Until then, here's a quick glossary so you don't feel lost:

**The store, or the state**, is Redux state. Held globally and shared by all components. It's like the App local state from earlier chapters.

**Actions** are packets of information that tell us what happened.

**Reducers** are functions that take the current state and an action, and use that information to generate a new state.

Got it? No worries. You will soon :)

<!--- end-lecture -->

<!--- begin-lecture title="3 presentation components" -->

## 3 presentation components

We start with the presentation components because they're the simplest. To render a collection of particles, we need:

- a stateless `Particle`
- a stateless `Particles`
- a class-based `App`

None of them contain state, but `App` has to be a class-based component so that we can use `componentDidMount`. We need it to attach D3 event listeners.

### Particle

The `Particle` component is a circle. It looks like this:

{caption: "Particle component", line-numbers: false}
```javascript
// src/components/Particles/Particle.jsx
import React from 'react';

const Particle = ({ x, y }) => (
	<circle cx={x} cy={y} r="1.8" />
);

export default Particle;
```

It takes `x` and `y` coordinates and returns an SVG circle.

{#svg-particles}
### Particles

The `Particles` component isn't much smarter – it returns a list of circles wrapped in a grouping element, like this:

{caption: "Particles list", line-numbers: false}
```javascript
// src/components/Particles/index.jsx
import React from 'react';
import Particle from './Particle';

const Particles = ({ particles }) => (
	<g>{particles.map(particle =>
		<Particle key={particle.id} {...particle} />
		)}
	</g>
);

export default Particles;
```

Walk through the array of particles, render a Particle component for each. Declarative rendering that you've seen before :)

We can take an array of `{id, x, y}` objects and render SVG circles. Now comes our first fun component: the `App`.

### App

`App` takes care of rendering the scene and attaching d3 event listeners. It gets actions via props and ties them to mouse events. You can think of actions as callbacks that work on the global data store directly. No need to pass them through many levels of props.

The rendering part looks like this:

{caption: "App component", line-numbers: false}
```javascript
// src/components/index.jsx

import React, { Component } from 'react';
import { select as d3Select, mouse as d3Mouse, touches as d3Touches } from 'd3';

import Particles from './Particles';
import Footer from './Footer';
import Header from './Header';

class App extends Component {
  // ..
	render() {
		return (
			<div onMouseDown={e => this.props.startTicker()} style={{overflow: 'hidden'}}>
			     <Header />
			     <svg width={this.props.svgWidth}
			          height={this.props.svgHeight}
			          ref="svg"
			          style={{background: 'rgba(124, 224, 249, .3)'}}>
			         <Particles particles={this.props.particles} />
			     </svg>
			     <Footer N={this.props.particles.length} />
			 </div>
		);
	}
}

export default App;
```

There's more going on, but the gist is that we return a `<div>` with a `Header`, a `Footer`, and an `<svg>`. Inside `<svg>`, we use `Particles` to render many circles. The Header and Footer components are just some helpful text.

Notice that the core of our rendering function only says *"Put all Particles here, please"*. There's nothing about what's moved, what's new, or what's no longer needed. We don’t have to worry about that.

We get a list of coordinates and naively render some circles. React takes care of the rest.

Oh, and we call `startTicker()` when a user clicks on our scene. No reason to have the clock running *before* any particles exist.

#### D3 event listeners

To let users generate particles, we have to wire up some functions in `componentDidMount`. That looks like this:

{caption: "Event listeners", line-numbers: false}
```javascript
// src/components/index.jsx

class App extends Component {
    svgWrap = React.createRef();
    
    componentDidMount() {
        let svg = d3Select(this.svgWrap.current);

        svg.on('mousedown', () => {
            this.updateMousePos();
            this.props.startParticles();
        });
        svg.on('touchstart', () => {
            this.updateTouchPos();
            this.props.startParticles();
        });
        svg.on('mousemove', () => {
            this.updateMousePos();
        });
        svg.on('touchmove', () => {
            this.updateTouchPos();
        });
        svg.on('mouseup', () => {
            this.props.stopParticles();
        });
        svg.on('touchend', () => {
            this.props.stopParticles();
        });
        svg.on('mouseleave', () => {
            this.props.stopParticles();
        });
    }

    updateMousePos() {
        let [x, y] = d3Mouse(this.svgWrap.current);
        this.props.updateMousePos(x, y);
    }

    updateTouchPos() {
        let [x, y] = d3Touches(this.svgWrap.current)[0];
        this.props.updateMousePos(x, y);
    }
```

There are several events we take into account:

- `mousedown` and `touchstart` turn on particle generation
- `mousemove` and `touchmove` update the mouse location
- `mouseup`, `touchend`, and `mouseleave` turn off particle generation

Inside our event callbacks, we use `updateMousePos` and `updateTouchPos` to update Redux state. They use `d3Mouse` and `d3Touches` to get `(x, y)` coordinates for new particles relative to our SVG element and call Redux actions passed-in via props. The particle generation step uses this data as each particle's initial position. 

You'll see that in the next section. I agree, it smells kind of convoluted, but it's for good reason: We need a reference to a mouse event to get the cursor position, and we want to decouple particle generation from event handling.

Remember, React isn't smart enough to figure out mouse position relative to our drawing area. React knows that we clicked a DOM node. [D3 does some magic](https://github.com/d3/d3-selection/blob/master/src/mouse.js) to find exact coordinates.

Touch events return lists of coordinates. One for each finger. We use only the first coordinate because shooting particles out of multiple fingers would make this example too hard.

That's it for rendering and user events. [107 lines of code](https://github.com/Swizec/react-particles-experiment/blob/svg-based-branch/src/components/index.jsx).

<!--- end-lecture -->

<!--- begin-lecture title="6 Redux Actions" -->

## 6 Redux Actions

Redux actions are a fancy way of saying *"Yo, a thing happened!"*. They're functions you call to get structured metadata that's passed into Redux reducers.

Our particle generator uses 6 actions:

1. `tickTime` steps our animation to the next frame
2. `tickerStarted` fires when everything begins
3. `startParticles` fires when we hold down the mouse
4. `stopParticles` fires when we release
5. `updateMousePos` keeps mouse position saved in state
6. `resizeScreen` saves new screen size so we know where edges lie

Our actions look something like this:

{caption: "A Redux action", line-numbers: false}
```javascript
export function updateMousePos(x, y) {
    return {
        type: UPDATE_MOUSE_POS,
        x: x,
        y: y
    };
}
```

A function that accepts params and returns an object with a type and meta data. Technically this is an action generator and the object is an action, but that distinction has long since been lost in the community.

Actions *must* have a `type`. Reducers use the type to decide what to do. The rest is optional.

You can see [all the actions on GitHub](https://github.com/Swizec/react-particles-experiment/blob/master/src/actions/index.js).

I find this to be the least elegant part of Redux. Makes sense in large applications, but way too convoluted for small apps. Simpler alternatives exist like doing it yourself with React Context.

<!--- end-lecture -->

<!--- begin-lecture title="1 Container component" -->

## 1 Container component

Containers are React components that talk to the Redux data store.

You can think of presentation components as templates that render stuff and containers as smart-ish views that talk to controllers. Or maybe they're the controllers.

Sometimes it's hard to tell. In theory presentation components render and don't think, containers communicate and don't render. Redux reducers and actions do the thinking.

I'm not sure this separation is necessary in small projects. 

Maintaining it can be awkward and sometimes cumbersome in mid-size projects, but I'm sure it makes total sense at Facebook scale. We're using it in this project because the community has decided that's the way to go.

We use the idiomatic `connect()` approach. Like this:

{caption: "Main container component", line-numbers: false}
```javascript
// src/containers/AppContainer.jsx

import { connect } from "react-redux";
import React, { Component } from "react";
import * as d3 from "d3";

import App from "../components";
import {
    tickTime,
    tickerStarted,
    startParticles,
    stopParticles,
    updateMousePos
} from "../actions";

class AppContainer extends Component {
    startTicker = () => {
        const { isTickerStarted } = this.props;

        if (!isTickerStarted) {
            console.log("Starting ticker");
            this.props.tickerStarted();
            d3.timer(this.props.tickTime);
        }
    };

    render() {
        const { svgWidth, svgHeight, particles } = this.props;

        return (
            <App
                svgWidth={svgWidth}
                svgHeight={svgHeight}
                particles={particles}
                startTicker={this.startTicker}
                startParticles={this.props.startParticles}
                stopParticles={this.props.stopParticles}
                updateMousePos={this.props.updateMousePos}
            />
        );
    }
}

const mapStateToProps = ({
    generateParticles,
    mousePos,
    particlesPerTick,
    isTickerStarted,
    svgWidth,
    svgHeight,
    particles
}) => ({
    generateParticles,
    mousePos,
    particlesPerTick,
    isTickerStarted,
    svgWidth,
    svgHeight,
    particles
});

const mapDispatchToProps = {
    tickTime,
    tickerStarted,
    startParticles,
    stopParticles,
    updateMousePos
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);
```

I love the smell of boilerplate in the morning. 👃

We import dependencies and define `AppContainer` as a class-based React `Component` so we have somewhere to put the D3 interval. The render method outputs our `<App>` component using a bunch of props to pass relevant actions and values.

The `startTicker` method is a callback we pass into App. It runs on first click and starts the D3 interval if necessary. Each interval iteration triggers the `tickTime` action.

### AppContainer talks to the store

{caption: "The Reduxy part", line-numbers: false}
```javascript
// src/containers/AppContainer.jsx

const mapStateToProps = ({
    generateParticles,
    mousePos,
    particlesPerTick,
    isTickerStarted,
    svgWidth,
    svgHeight,
    particles
}) => ({
    generateParticles,
    mousePos,
    particlesPerTick,
    isTickerStarted,
    svgWidth,
    svgHeight,
    particles
});

const mapDispatchToProps = {
    tickTime,
    tickerStarted,
    startParticles,
    stopParticles,
    updateMousePos
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);
```

We're using the `connect()` idiom to connect our AppContainer to the Redux store. It's a higher order component that handles all the details of connection to the store and staying in sync.

We pass two arguments into connect. This returns a higher order component function, which we wrap around AppContainer.

The first argument is **mapStateToProps**. It accepts current state as an argument, which we immediately deconstruct into interesting parts, and returns a key:value dictionary. Each key becomes a component prop with the corresponding value.

You'd often use this opportunity to run ad-hoc calculations, or combine parts of state into single props. No need for that in our case, just pass it through.

#### Dispatching actions

**mapDispatchToProps** is a dictionary that maps props to actions. Each prop turns into an action generator wrapped in a `store.dispatch()` call. To fire an action inside a component we just call the function in that prop.

But Swiz, we're not writing key:value dictionaries, we're just listing stuff!

That's a syntax supported in most modern JavaScript environments, called object literal property value shorthand. Our build system expands that `mapDispatchToProps` dictionary into something like this:

{caption: "Compiler expands our dictionaries", line-numbers: false}
```javascript
const mapDispatchToProps = {
    tickTime: tickTime,
    tickerStarted: tickerStarted,
    startParticles: startParticles,
    stopParticles: stopParticles,
    updateMousePos: updateMousePos
};
```

And you thought previous code had a lot of boilerplate ... imagine if this was how you'd do it in real life 😛

`connect` wraps each of these action generators in `store.dispatch()` calls. You can pass the resulting function into any component and fire actions by calling that method.

#### The Redux loop

To make a change therefore, a Redux loop unfolds:

1. Call our action triggerer, passed in through props
2. Calls the generator, gets a `{type: ...}` object
3. Dispatches that object on the store
4. Redux calls the reducer
5. Reducer creates new state
6. Store updates triggering React's engine to flow updates through the props

So that's the container. 71 lines of boilerplate pretty code.

The remaining piece of the puzzle is our reducer. Two reducers in fact.

<!--- end-lecture -->

<!--- begin-lecture title="2 Redux Reducers" -->

## 2 Redux Reducers

With the actions firing and the drawing done, it's time to look at the business logic of our particle generator. We'll get it done in just 33 lines of code and some change.

Well, it's a bunch of change. But the 33 lines that make up `CREATE_PARTICLES` and `TIME_TICK` changes are the most interesting. The rest just flips various flags.

All our logic and physics goes in the reducer. [Dan Abramov says](http://redux.js.org/docs/basics/Reducers.html) to think of reducers as the function you'd put in `.reduce()`. Given a state and a set of changes, how do I create the new state?

A "sum numbers" example would look like this:

{caption: "Reducer concept", line-numbers: false}
```javascript
let sum = [1,2,3,4].reduce((sum, n) => sum+n, 0);
```

For each number, take the previous sum and add the number.

Our particle generator is a more advanced version of the same concept: Takes current application state, incorporates an action, and returns new application state.

Start with a default state and some D3 random number helpers.

{caption: "Default state and constants", line-numbers: false}
```javascript
import { randomNormal } from "d3";

const Gravity = 0.5,
    randNormal = randomNormal(0.3, 2),
    randNormal2 = randomNormal(0.5, 1.8);

const initialState = {
    particles: [],
    particleIndex: 0,
    particlesPerTick: 30,
    svgWidth: 800,
    svgHeight: 600,
    isTickerStarted: false,
    generateParticles: false,
    mousePos: [null, null],
    lastFrameTime: null
};
```

Using D3's `randomNormal` random number generator creates a better random distribution than using JavaScript's own `Math.random`. The rest is a bunch of default state 👇

- `particles` holds an array of particles to draw
- `particleIndex` defines the ID of the next generated particle
- `particlesPerTick` defines how many particles we create on each requestAnimationFrame
- `svgWidth` is the width of our drawing area
- `svgHeigh` is the height
- `isTickerStarted` specifies whether the animation is running
- `generateParticles` turns particle generation on and off
- `mousePos` defines the origination point for new particles
- `lastFrameTime` helps us compensate for dropped frames

To manipulate all this state, we use two reducers and manually combine them. Redux does come with a `combineReducers` function, but I wanted to keep our state flat and that doesn't fit `combineReducers`'s view of how life should work.

{caption: "Combining two reducers", line-numbers: false}
```javascript
// src/reducers/index.js

// Manually combineReducers
export default function(state = initialState, action) {
    return {
        ...appReducer(state, action),
        ...particlesReducer(state, action)
    };
}
```

This is our reducer. It takes current `state`, sets it to `initialState` if undefined, and an action. To create new state, it spreads the object returned from `appReducer` and from `particlesReducer` into a new object. You can combine as many reducers as you want in this way.

The usual `combineReducers` approach leads to nested hierarchical state. That often works great, but I wanted to keep our state flat.

Lesson here is that there are no rules. You can make your reducers whatever you want. Combine them whichever way fits your use case. As long as you take a state object and an action and return a new state object.

`appReducer` will handle the constants and booleans and drive the metadata for our animation. `particlesReducer` will do the hard work of generating and animating particles.

### Driving the basics with appReducer

Our `appReducer` handles the boring actions with a big switch statement. These are common in the Redux world. They help us decide what to do based on action type.

{caption: "appReducer big switch", line-numbers: false}
```javascript
// src/reducers/index.js
function appReducer(state, action) {
    switch (action.type) {
        case "TICKER_STARTED":
            return Object.assign({}, state, {
                isTickerStarted: true,
                lastFrameTime: new Date()
            });
        case "START_PARTICLES":
            return Object.assign({}, state, {
                generateParticles: true
            });
        case "STOP_PARTICLES":
            return Object.assign({}, state, {
                generateParticles: false
            });
        case "UPDATE_MOUSE_POS":
            return Object.assign({}, state, {
                mousePos: [action.x, action.y]
            });
        case "RESIZE_SCREEN":
            return Object.assign({}, state, {
                svgWidth: action.width,
                svgHeight: action.height
            });
        default:
            return state;
    }
}
```

Gotta love that boilerplate 😛

Even though we're only changing values of boolean flags and two-digit arrays, *we have to create a new state*. Redux relies on application state being immutable.

Well, JavaScript doesn't have real immutability. We pretend and make sure to never change state without making a new copy first. There are libraries that give you proper immutable data structures, but that's a whole different course.

We use `Object.assign({}, ...` to create a new empty object, fill it with the current state, then overwrite specific values with new ones. This is fast enough even with large state trees thanks to modern JavaScript engines.

Note that when a reducer doesn't recognize an action, it has to return the same state it received. Otherwise you end up wiping state. 😅

So that's the boilerplatey state updates. Manages starting and stopping the animation, flipping the particle generation switch, and resizing our viewport.

The fun stuff happens in `particleReducer`.

### Driving particles with particleReducer

Our particles live in an array. Each particle has an id, a position, and a vector. That tells us where to draw the particle and how to move it to its future position.

On each tick of the animation we have to:

1. Generate new particles
2. Remove particles outside the viewport
3. Move every particle by its vector

We can do all that in one big reducer, like this:

{caption: "The particles logic", line-numbers: false}
```javascript
// src/reducers/index.js
function particlesReducer(state, action) {
    switch (action.type) {
        case "TIME_TICK":
            let {
                    svgWidth,
                    svgHeight,
                    lastFrameTime,
                    generateParticles,
                    particlesPerTick,
                    particleIndex,
                    mousePos
                } = state,
                newFrameTime = new Date(),
                multiplier = (newFrameTime - lastFrameTime) / (1000 / 60),
                newParticles = state.particles.slice(0);

            if (generateParticles) {
                for (let i = 0; i < particlesPerTick; i++) {
                    let particle = {
                        id: state.particleIndex + i,
                        x: mousePos[0],
                        y: mousePos[1]
                    };

                    particle.vector = [
                        particle.id % 2 ? -randNormal() : randNormal(),
                        -randNormal2() * 3.3
                    ];

                    newParticles.unshift(particle);
                }

                particleIndex = particleIndex + particlesPerTick + 1;
            }

            let movedParticles = newParticles
                .filter(p => {
                    return !(p.y > svgHeight || p.x < 0 || p.x > svgWidth);
                })
                .map(p => {
                    let [vx, vy] = p.vector;
                    p.x += vx * multiplier;
                    p.y += vy * multiplier;
                    p.vector[1] += Gravity * multiplier;
                    return p;
                });

            return {
                particles: movedParticles,
                lastFrameTime: new Date(),
                particleIndex
            };
        default:
            return {
                particles: state.particles,
                lastFrameTime: state.lastFrameTime,
                particleIndex: state.particleIndex
            };
    }
}
```

That's a lot of code, I know. Let me explain :)

The first part takes important values out of `state`, calculates the dropped frame multiplier, and makes a new copy of the particles array with `.slice(0)`. That was the fastest way I could find.

Then we generate new particles.

We loop through `particlesPerTick` particles, create them at `mousePos` coordinates, and insert at the beginning of the array. In my tests that performed best. Particles get random movement vectors.

This randomness is a Redux faux pas. Reducers are supposed to be functionally pure: produce the same result every time they are called with the same argument values. Randomness is impure.

We don't need our particle vectors to be deterministic, so I think this is fine. Let's say our universe is stochastic instead 😄

{aside}
Stochastic means that our universe/physic simulation is governed by probabilities. You can still model such a universe and reason about its behavior. A lot of real world physics is stochastic in nature.
{/aside}

We now have an array full of old and new particles. We remove all out-of-bounds particles with a `filter`, then walk through what's left to move each particle by its vector.

To simulate gravity, we update vectors' vertical component using our `Gravity` constant. That makes particles fall down faster and faster creating a nice parabola.

Our reducer is done. Our particle generator works. Our thing animates smoothly. \\o/

<!--- end-lecture -->

<!--- begin-lecture title="What we learned" -->

## What we learned

Building a particle generator in React and Redux, we made three important discoveries:

1. **Redux is much faster than you'd think**. Creating a new copy of the state tree on each animation loop sounds crazy, but it works. Most of our code creates shallow copies, which explains the speed.
2. **Adding to JavaScript arrays is slow**. Once we hit about 300 particles, adding new ones becomes slow. Stop adding particles and you get smooth animation. This indicates that something about creating particles is slow: either adding to the array, or creating React component instances, or creating SVG DOM nodes.
3. **SVG is also slow**. To test the above hypothesis, I made the generator create 3000 particles on first click. The animation speed is *terrible* at first and becomes okayish at around 1000 particles. This suggests that making shallow copies of big arrays and moving existing SVG nodes around is faster than adding new DOM nodes and array elements. [Here's a gif](http://i.imgur.com/ug478Me.gif)

----

There you go: Animating with React, Redux, and D3. Kind of a new superpower 😉

Here's the recap:

- React handles rendering
- D3 calculates stuff, detects mouse positions
- Redux handles state
- element coordinates are state
- change coordinates on every `requestAnimationFrame`
- animation!

Now let's render to canvas and push this sucker to 20,000 smoothly animated elements. Even on a mobile phone.

<!--- end-lecture -->

<!--- end-section -->
