# Speed optimizations #

Welcome to the speed optimization chapter. This is where we make our code harder to read and faster to run.

You might never need any techniques discussed here. 

You already know how to build performant data visualization components. For 99% of applications, plain code that's easy to read and understand is faster than fast code that's hard to read.

You and your team spend most of your time reading code. Optimize for that. The faster you can code, the faster your system can evolve. Leave runtime optimization to React and its ecosystem of library authors for as long as you can get away with.

Do you really need to save that tenth of a second at runtime if it means an extra hour of head scratching every time there's a bug?

Be honest. 😉

That said, there *are* cases where faster code is also easier to read. And there are cases where your visualization is so massive, that you need every ounce of oomph you can get.

For the most part, we're going to talk about three things:

- using Canvas to speed up rendering
- using React-like libraries to speed up the core rendering engine
- avoiding unnecessary computation and redraws
- reaching for WebGL when even Canvas isn't fast enough

We'll start with Canvas because it's the best bang for buck improvement you can make.

# Using canvas

So far we've been rendering our visualizations with SVG. SVG is great because it follows a familiar structure, offers infinitely scalable vector graphics, and works everywhere. There are *some* advanced SVG features you can't use everywhere, but the core is solid.

However, SVG has a big flaw: it's slow.

Anything more than a few hundred SVG nodes and your browser starts to struggle. Especially if those thousands of elements move around.

A web animation panel moderator at ForwardJS once asked me, *"But why would you want thousands of SVG elements?"*. 

It was my first time participating in a panel, stage lights shining upon me, a mildly disinterested audience staring into their phones ... I bombed: *"Errr ... because you can?"*.

![](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/2018/stage_lights.jpg)

What I  *should* have said was: *"Because there have been thousands of UFO sightings, there are thousands of counties in the US, millions of taxi rides, hundreds of millions of people having this or that datapoint. And you want to show change over time."*

That's the real answer.

Sometimes, when you're visualizing data, you have a lot of data. The data changes over time. Animation is the best way to show change over time.

Once upon a time, I worked on a [D3 video course](https://www.packtpub.com/web-development/mastering-d3js-video) for Packt and used UFO sightings as an example. At peak UFO sighting, right before smartphones become a thing, the animation takes up to 2 seconds to redraw a single frame.

Terrible.

So if SVG is slow and you need to animate thousands of elements, what are you to do? HTML5 Canvas.

## Why Canvas

Unlike SVG, HTML5 Canvas lets you draw rasterized images. This means you're no longer operating at the level of shapes because you're working with pixels on the screen.

With SVG and other vector formats, you tell the browser *what* you want to render. With Canvas and other raster formats, you tell the browser *how* you want to render. The browser doesn't know what you're doing; it gets a field of pixel colors and renders them as an image.

That's much faster for computers to handle. In some cases browsers can even use hardware acceleration – the GPU – to render HTML5 Canvas elements. With a bit of care, you can do almost anything you want, even on a mobile phone.

Phones these days have amazing GPUs and kind of terrible CPUs in comparison. The CPU burns more battery, works slower, warms up your phone more, etc.

If SVG wasn't so easy to use, I'd almost suggest going straight to Canvas for any sort of complex animation. Mobile traffic is, what, 60% to 70% of web traffic these days?

## Isn't that too hard?

You might think all this pixel stuff sounds complicated. We've stayed in shape and component land so far. We didn't care about any pixels or rendering details. Draw a rectangle and a wild rectangle appears.

How do you know which pixel should do what when you render with Canvas?

HTML5 Canvas does offer some shape primitives. It has circles and rectangles and things like that, but they suffer from the same problem that SVG does. The browser has to use your CPU to calculate those, and at around 10,000 elements, things break down.

10,000 elements is still a hell of a lot more than the 3,000 or so that SVG gives you.

If your app allows it, you can use sprites: Tiny images copy-pasted on the Canvas as bytestreams. I have yet to find an upper bound for those. My JavaScript became the bottleneck :D

But I'm getting ahead of myself. We'll talk about sprites later.

## The trouble with HTML5 Canvas

The tricky thing with HTML5 Canvas is that the API is low level and that canvas is flat. As far as your JavaScript and React code are concerned, it's a flat image. It could be anything.

The lack of structure makes it difficult to detect clicks on elements, interactions between shapes, when something covers something else, how the user interacts with your stuff and so on Anything that requires understanding what's rendered.

You have to move most of that logic into your data store and manually keep track.

As you can imagine, this becomes cumbersome. And you still can't detect user interaction because all you get is *"User clicked on  coordinate (x, y). Have fun."*

At the same time, the low level API makes abstractions difficult. You can't create components for "this is a map" or "histogram goes here". You're always down to circles and rectangles and basic shapes.

Your code soon looks like the D3.js spaghetti we tried to avoid in the first place.

# Declarative HTML5 Canvas with Konva and react-konva

Enter [Konva](https://konvajs.github.io) and react-konva. All the benefits of declarative code, but rendered on the canvas.

I'm gonna let Anton Lavrenov, the author of Konva, explain:

> Konva is an HTML5 Canvas JavaScript framework that enables high performance animations, transitions, node nesting, layering, filtering, caching, event handling for desktop and mobile applications, and much more.

> You can draw things onto the stage, add event listeners to them, move them, scale them, and rotate them independently from other shapes to support high performance animations, even if your application uses thousands of shapes. Served hot with a side of awesomeness.

That.

It's exactly what we need to push our animated React apps to thousands of elements without spending too much time thinking about the *how* of rendering. Best leave the hairy details to somebody else.

Let's try out two examples:

1. Pushing our particle generator to 20,000 elements
2. An n-body collision simulator built with MobX

{#canvas-react-redux}
## A particle generator pushed to 20,000 elements with Canvas

Our [SVG-based particle generator](#animating-react-redux) caps out at a few thousand elements. Animation becomes slow as times between iterations of our game loop increase.

Old elements leave the screen and get pruned faster than we can create new ones. This creates a natural upper limit to how many elements we can push into the page.

We can render many more elements if we take out SVG and use HTML5 Canvas instead. I was able to push the code up to almost 20,000 smoothly animated elements. Then JavaScript became the bottleneck.

Well, I say JavaScript was the bottleneck, but monitor size plays a role too. It goes up to 20,000 on my laptop screen, juuuust grazes 30,000 on my large desktop monitor, and averages about 17,000 on my iPhone 5SE.

Friends with newer laptops got it up to 35,000.

You can see it in action hosted on [Github pages](http://swizec.github.io/react-particles-experiment/).

We're keeping most of our existing code. The real changes happen in `src/components/index.jsx`, where a Konva stage replaces the `<svg>` element, and in `src/components/Particles.jsx`, where we change what we render. There's a small tweak in the reducer to generate more particles per tick.

You should go into your particle generator directory, install Konva and react-konva, and then make the changes below. Trying things out is better than just reading my code ;)

{caption: "Install Konva", line-numbers: false}
```
$ npm install --save konva react-konva
```

{aside}
react-konva is a thin wrapper on Konva itself. There's no need to think about it as its own thing. For the most part, you can go into the Konva docs, read about something, and it Just Works™ in react-konva.
{/aside}

### Preparing a canvas layer

Our changes start in `src/components/index.jsx`. We have to throw away the `<svg>` element and replace it with a Konva stage.

You can think of a Konva stage as a Canvas element with a bunch of helper methods attached. Some of them Konva uses internally; others are exposed as an API. Functions like exporting to an image file, detecting intersections, etc.

{caption: "Import Konva and set the stage", line-numbers: false}
```javascript
// src/components/index.jsx

// ...
import { Stage } from 'react-konva';

// ...
class App extends Component {
    // ..
    render() {
        return (
            // ..
                     <Stage width={this.props.svgWidth} height={this.props.svgHeight}>
                         <Particles particles={this.props.particles} />

                     </Stage>

                 </div>
                 <Footer N={this.props.particles.length} />
             </div>
        );
    }
}
```

We import `Stage` from `react-konva`, then use it instead of the `<svg>` element in the `render` method. It gets a `width` and a `height`.

Inside, we render the `Particles` component. It's going to create a Konva layer and use low-level Canvas methods to render particles as sprites.

### Using sprites for max redraw speed

Our [SVG-based Particles](#svg-particles) component was simple. Iterate through a list of particles, render a `<Particle>` component for each.

We're going to completely rewrite that. Our new approach goes like this:

0. Cache a sprite on `componentDidMount`
1. Clear canvas
2. Redraw all particles
3. Repeat

Because the new approach renders a flat image, and because we don't care about interaction with individual particles, we can get rid of the `Particle` component. The unnecessary layer of nesting was slowing us down.

The new `Particles` component looks like this:

{caption: "Sprite-based Particles component", line-numbers: false}
```javascript
// src/components/Particles.jsx

import React, { Component } from 'react';
import { FastLayer } from 'react-konva';

class Particles extends Component {
    layerRef = React.createRef();
    
    componentDidMount() {
        this.canvas = this.layerRef.current.canvas._canvas;
        this.canvasContext = this.canvas.getContext('2d');

        this.sprite = new Image();
        this.sprite.src = 'http://i.imgur.com/m5l6lhr.png';
    }

    drawParticle(particle) {
        let { x, y } = particle;

        this.canvasContext.drawImage(this.sprite, 0, 0, 128, 128, x, y, 15, 15);
    }

    componentDidUpdate() {
        let particles = this.props.particles;

        console.time('drawing');
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < particles.length; i++) {
            this.drawParticle(particles[i]);
        }
        console.timeEnd('drawing');
    }

    render() {
        return (
            <FastLayer ref={this.layerRef} listening="false" />
        );
    }
}

export default Particles;
```

40 lines of code is a lot all at once. Let's walk through step by step.

#### componentDidMount

{caption: "componentDidMount method", line-numbers: false}
```javascript
// src/components/Particles.jsx

// ...
componentDidMount() {
    this.canvas = this.refs.layer.canvas._canvas;
    this.canvasContext = this.canvas.getContext('2d');

    this.sprite = new Image();
    this.sprite.src = 'http://i.imgur.com/m5l6lhr.png';
}
```

React calls `componentDidMount` when our component first renders. We use it to set up 3 instance properties.

`this.canvas` is a reference to the HTML5 Canvas element. We get it through a ref to the Konva layer, then spelunk through Konva internals to get the canvas itself. As the `_` prefix indicates, Anton Lavrenov did not intend this to be a public API.

Thanks to JavaScript's permissiveness, we can use it anyway. 🙌

`this.canvasContext` is a reference to our canvas's [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). It's the interface we use to draw basic shapes, perform transformations, and so on. Context is the only part of canvas you ever interact with as a developer.

Why it's not just Canvas, I don't know.

`this.sprite` is a cached image. A small minion that we are going to copy-paste all over as our particle. Creating a new image object with `new Image()` and setting the `src` property downloads our sprite from the internet into browser memory.

It looks like this:

![Our minion particle](http://i.imgur.com/m5l6lhr.png)

You might think it's unsafe to copy references to rendered elements into component properties like that, but it's okay. Our render function always renders the same thing, so the reference never changes. It just makes our code cleaner.

Should our component unmount and re-mount, React will call `componentDidMount` again and update our reference.

#### drawParticle

{caption: "drawParticle code", line-numbers: false}
```javascript
// src/components/Particles.jsx

// ...
drawParticle(particle) {
    let { x, y } = particle;

    this.canvasContext.drawImage(this.sprite, 0, 0, 128, 128, x, y, 15, 15);
}
```

`drawParticle` draws a single particle on the canvas. It gets coordinates from the `particle` argument and uses `drawImage` to copy our sprite into position.

We use the whole sprite, corner `(0, 0)` to corner `(128, 128)`. That's how big our sprite is. And we copy it to position `(x, y)` with a width and height of `15` pixels.

`drawImage` is the fastest method I've found to put pixels on canvas. I don't know why it's so fast, but here's a [helpful benchmark](https://jsperf.com/canvas-drawimage-vs-putimagedata/3) so you can see for yourself.

#### componentDidUpdate

{caption: "componentDidUpdate code", line-numbers: false}
```javascript
// src/components/Particles.jsx

// ...
componentDidUpdate() {
    let particles = this.props.particles;

    console.time('drawing');
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < particles.length; i++) {
        this.drawParticle(particles[i]);
    }
    console.timeEnd('drawing');
}
```

`componentDidUpdate` is where the magic happens. React calls this lifecycle method every time our list of particles changes. *After* the `render` method.

Just like the D3 blackbox approach, we move rendering out of the `render` method and into `componentDidUpdate`.

Here's how it works:

1. `this.canvasContext.clearRect` clears the entire canvas from coordinate `(0, 0)` to coordinate `(width, height)`. We delete everything and make the canvas transparent.
2. We iterate our `particles` list with a `for` loop and call `drawParticle` on each element.

Clearing and redrawing the canvas is faster than moving individual particles. For loops are faster than `.map` or any other form of iteration. I tested. A lot.

Open your browser console and see how long each frame takes to draw. The `console.time` - `console.timeEnd` pair measures how long it takes your code to get from `time` to `timeEnd`. You can have as many of these timers running as you want as long as you give them different names.

#### render

{caption: "render code", line-numbers: false}
```javascript
// src/components/Particles.jsx

// ...
render() {
    return (
        <FastLayer ref={this.layerRef} listening="false" />
    );
}
```

After all that work, our `render` method is quite short. 

We render a Konva `FastLayer`, give it a `ref` and turn off `listening` for mouse events. That makes the fast layer even faster.

Ideas for this combination of settings came from Konva's official [performance tips](https://konvajs.github.io/docs/performance/All_Performance_Tips.html) documentation. This makes sense when you think about it.

A `FastLayer` is faster than a `Layer`. It's in the name. Ignoring mouse events means you don't have to keep track of elements. It reduces computation.

This was empirically the fastest solution with the most particles on screen.

### But why, Swizec?

I'm glad you asked. This was a silly example. I devised the experiment because at my first React+D3 workshop somebody asked, *"What if we have thousands of datapoints, and we want to animate all of them?"*. I didn't have a good answer.

Now I do. You put them in Canvas. You drive the animation with a game loop. You're good.

You can even do it as an overlay. Have an SVG for your graphs and charts, overlay with a transparent canvas for your high speed animation.

{#billiards-simulation}
## Build a declarative billiards simulation with MobX, Canvas, and Konva

![Billiards game](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/billiards-start.png)

We're building a small game. You have 11 glass balls – marbles, if you will. Grab one, throw it at the others, watch them bounce around. There is no score, but it looks cool, and it's a fun way to explore how Konva and React give you interactive Canvas features.

We're using React and Konva to render our 11 marbles on an HTML5 Canvas element, MobX to drive the animation loop, and D3 to help with collision detection. Because this example is declarative, we can split it into two parts:

- Part 1: Rendering the marbles
- Part 2: Building the physics

You can see the finished [code on Github](https://github.com/Swizec/declarative-canvas-react-konva) and play around with a [hosted version](https://swizec.github.io/declarative-canvas-react-konva/) of the code you're about to build.

I know this example comes late in the book, and you're feeling like you know all there is to React and visualizations. You can think of this example as practice. Plus it's a good way to learn the basics of MobX.

### Decorators

Before we begin, let me tell you about decorators. 

MobX embraces them to make its API easier to use. You can use MobX without decorators, but decorators make it better. 

A couple years ago, decorators got very close to becoming an official spec, then got held back. I don't know *why*, but they're a great feature whose syntax is unlikely to change. So even if MobX has to change its implementation when decorators do land in the JavaScript spec, you're not likely to have to change anything.

You can think of decorators as function wrappers. Instead of code like this:

{caption: "Decoratorless function wrapping", line-numbers: false}
```javascript
inject('store', ({ store }) => <div>A thing with {store.value}</div>);
```

You can write the same code like this:

{caption: "Function wrapping with decorators", line-numbers: false}
```javascript
@inject('store')
({ store }) => <div>A thing with {store.value}</div>
```

Not much of a difference, but it becomes better looking when you work with classes or combine multiple decorators. That's when they shine. No more `})))}))` at the end of your functions.

By the way, `inject` is to MobX much like `connect` is to Redux. I'll explain in a bit.

### Part 0: Some setup

Because decorators aren't in the JavaScript spec, we have to tweak how we start our project. We can still use `create-react-app`, but there's an additional step.

You should start a new project like this:

{caption: "Create the billiards game project", line-numbers: false}
```
$ create-react-app billiards-game --scripts-version custom-react-scripts
```

This creates a new directory with a full setup for React. Just like you're used to.

The addition of `--scripts-version custom-react-scripts` employs @kitze's [custom-react-scripts](https://github.com/kitze/custom-react-scripts) project to give us more configuration options. Like the ability to enable decorators.

We enable them in the `.env` file. Add this line:

{caption: "Add to .env settings", line-numbers: false}
```
// billiards-game/.env
// ...
REACT_APP_DECORATORS=true
```

No installation necessary. I think `custom-react-scripts` uses the `transform-decorators-legacy` Babel plugin behind the scenes. It's pre-installed, and we enable it with that `.env` change.

Before we begin, you should install some other dependencies as well:

{caption: "Install libraries", line-numbers: false}
```
$ npm install --save konva react-konva mobx mobx-react d3-timer d3-scale d3-quadtree
```

This gives you Konva, MobX, and the parts of D3 that we need. You're now ready to build the billiards game.

### A quick MobX primer

Explaining MobX in detail is beyond the scope of this book. You can learn it by osmosis as you follow the code in our billiards example.

That said, here's a quick rundown of the concepts we're using.

MobX is based on reactive programming. There are values that are observable and functions that react when those values change. MobX ensures only the minimal possible set of observers is triggered on every change.

So, we have:

`@observable` – a property whose changes observers subscribe to
`@observer` – a component whose `render()` method observes values
`@computed` – a method whose value can be fully derived from observables
`@action` – a method that changes state, analogous to a Redux reducer
`@inject` – a decorator that injects global stores into a component's props

That's all you need to know. Once your component is an `@observer`, you never have to worry about *what* it's observing. MobX ensures it reacts to changes in values used during rendering.

Making your component an observer and injecting the global store is the same as using `connect` in Redux. It gives your component access to your state, and it triggers a re-render when something  changes.

Importantly, it *doesn't* trigger a re-render when something that the component isn't using changes. That little tidbit is what makes many other reactive libraries difficult to use.

### Part 1: Rendering our marbles

Our marbles render on Canvas using Konva. Each marble is its own sprite rendered as a Konva element. This makes it easier to implement user and marble interactions.

Rendering happens in 3 components:

- `App` holds everything together
- `MarbleList` renders a list of marbles
- `Marble` renders an individual marble

We're also using 2 MobX stores:

- `Sprite` to load the marble sprite and define coordinates within
- `Physics` as our physics engine

`Sprite` and `Physics` are hold almost all of our game logic. A bit of drag & drop logic goes in the `Marble` component. Other than that, all our components are presentational. They get props and render stuff.

Let's start with `App` and work our way down.

#### App

Our `App` component doesn't do much. It imports MobX stores, triggers sprite loading, and starts the game loop.

{caption: "The App component", line-numbers: false}
```javascript
// src/components/App.js

import React, { Component } from 'react';
import { Provider as MobXProvider, observer } from 'mobx-react';

import Physics from '../logic/Physics';
import Sprite from '../logic/Sprite';
import MarbleList from './MarbleList';

@observer
class App extends Component {
    componentDidMount() {
        Sprite.loadSprite(() => Physics.startGameLoop());
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Elastic collisions</h2>
                    <p>Rendered on canvas, built with React and Konva</p>
                </div>
                <div className="App-intro">
                    <MobXProvider physics={Physics} sprite={Sprite}>
                        <MarbleList />
                    </MobXProvider>
                </div>
            </div>
        );
    }
}

export default App;
```

We import our dependencies: React itself, a `MobXProvider` that's similar to the Redux provider (puts stuff in react context), both of our MobX stores which export singleton instances, and the main `MarbleList` component.

`App` itself is a full featured component that initiates sprite loading in `componentDidMount` and calls `startGameLoop` when the sprite is ready. We know the sprite is ready because it calls a callback. You'll see how that works in a bit.

The `render` method outputs some descriptive text and the `MarbleList` component wrapped in a `MobXProvider`. The provider puts instances of our stores – `sprite` and `physics` – in React context.

This makes them available to all child components via the `inject` decorator.

#### MarbleList

`MarbleList` is an important component that renders the whole game, yet it can still be small and functional. Every prop it needs comes from our two stores.

Like this:

{caption: "MarbleList component", line-numbers: false}
```javascript
// src/components/MarbleList.js

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Stage, Layer, Group } from 'react-konva';

import Marble from './Marble';

const MarbleList = inject('physics', 'sprite')(observer(({ physics, sprite }) => {
    const { width, height, marbles } = physics;
    const { marbleTypes } = sprite;

    return (
        <Stage width={width} height={height}>
            <Layer>
                <Group>
                    {marbles.map(({ x, y, id }, i) => (
                        <Marble x={x}
                                y={y}
                                type={marbleTypes[i%marbleTypes.length]}
                                draggable="true"
                                id={id}
                                key={`marble-${id}`} />
                    ))}
                </Group>
            </Layer>
        </Stage>
    );
}));

export default MarbleList;
```

We import dependencies and create a `MarbleList` component. Instead of decorators, we're using with functional composition.

This shows you that MobX *can* work without decorators, but there's no deep reason behind this choice. Over time, I've developed a preference for composition for functional components and decorators for class-based components.

`inject` takes values out of context and puts them in component props. `observer` declares that our component observes those props and reacts to them.

It's generally a good idea to use both `inject` and `observer` together. I have yet to find a case where you need just one or the other.

The rendering itself takes values out of our stores and returns a Konva `Stage` with a single `Layer`, which contains a `Group`. Inside this group is our list of marbles.

Each marble gets a position, a `type` that defines how it looks, an `id`, and a `key`. We set `draggable` to `true` so Konva knows that this element is draggable.

Yes, that means we get draggability on an HTML5 Canvas without any extra effort. I like that.

#### Marble

Each `Marble` component renders a single marble and handles dragging and dropping. That's how you "shoot" marbles.

Dragging and dropping creates a vector that accelerates, or shoots, the marble in a certain direction with a certain speed. Putting this logic in the component itself makes sense because the rest of our game only cares about that final vector. 

The Marble component looks like this:

{caption: "Marble component", line-numbers: false}
```javascript
// src/components/Marble.js

import React, { Component } from 'react';
import { Circle } from 'react-konva';
import { inject, observer } from 'mobx-react';

@inject('physics', 'sprite') @observer
class Marble extends Component {
    onDragStart = () => {
        // set drag starting position
    }

    onDragMove = () => {
        // update marble position
    }

    onDragEnd = () => {
        // shoot the marble
    }

    render() {
        const { sprite, type, draggable, id, physics } = this.props;
        const MarbleDefinitions = sprite.marbleDefinitions;
        const { x, y, r } = physics.marbles[id];

        return (
            <Circle x={x} y={y} radius={r}
                    fillPatternImage={sprite.sprite}
                    fillPatternOffset={MarbleDefinitions[type]}
                    fillPatternScale={{ x: r*2/111, y: r*2/111 }}
                    shadowColor={MarbleDefinitions[type].c}
                    shadowBlur="15"
                    shadowOpacity="1"
                    draggable={draggable}
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                    onDragMove={this.onDragMove}
                    ref="circle"
                    />
        );
    }
}

export default Marble;
```

We `@inject` both stores into our component and make it an `@observer`. The `render` method takes values out of our stores and renders a Konva `Circle`. The circle uses a chunk of our sprite as its background, has a colorful shadow, and has a bunch of drag callbacks.

Those callbacks make our game playable.

In `onDragStart`, we store the starting position of the dragged marble. In `onDragMove`, we update the marble's position in the store, which makes it possible for other marbles to bounce off of ours while it's moving, and in `onDragEnd`, we shoot the marble.

Shoot direction depends on how we dragged. That's why we need the starting positions.

Drag callbacks double as MobX actions. Makes our code simpler. Instead of specifying an extra `@action` in the MobX store, we manipulate the values directly.

MobX makes this okay. It keeps everything in sync and our state easy to understand. MobX even batches value changes before triggering re-renders.

The code inside those callbacks is pretty mathsy.

{caption: "Dragging callbacks", line-numbers: false}
```javascript
// src/components/Marble.js

class Marble extends Component {
    onDragStart = () => {
        const { physics, id } = this.props;

        this.setState({
            origX: physics.marbles[id].x,
            origY: physics.marbles[id].y,
            startTime: new Date()
        });
    }

    onDragMove = () => {
        const { physics, id } = this.props;
        const { x, y } = this.refs.circle.attrs;

        physics.marbles[id].x = x;
        physics.marbles[id].y = y;
    }

    onDragEnd = () => {
        const { physics } = this.props,
              circle = this.refs.circle,
              { origX, origY } = this.state,
              { x, y } = circle.attrs;


        const delta_t = new Date() - this.state.startTime,
              dist = (x - origX) ** 2 + (y - origY) ** 2,
              v = Math.sqrt(dist)/(delta_t/16); // distance per frame (= 16ms)

        physics.shoot({
           x: x,
           y: y,
           vx: (x - origX)/(v/3), // /3 is a speedup factor
           vy: (y - origY)/(v/3)
           }, this.props.id);
    }

    // ...
}
```

In `onDragStart`, we store original coordinates and start time in local state. These are temporary values that nothing outside this user action cares about. Local state makes sense.

We'll use them to determine how far the user dragged our marble.

In `onDragMove` we update the MobX store with new coordinates for this particular marble. You might think we're messing with mutable state here, and we *might* be, but these are MobX observables. They're wrapped in setters that ensure everything is kept in sync, changes logged, observers notified, etc.

`onDragEnd` shoots the marble. We calculate drag speed and direction, then we call the `shoot()` action on the `physics` store.

The math we're doing is called [euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) by the way. Distance between two points is the root of the sum of squares of distance on each axis.

#### Sprite store

Now that we know how rendering works, we need to load our sprite. It's an icon set I bought online. Can't remember where or who from.

Here's what it looks like:

![Marbles sprite](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/monster-marbles-sprite-sheets.jpg)

To use this sprite, we need two things:

1. A way to tell where on the image each marble lies
2. A MobX store that loads the image into memory

The first is a `MarbleDefinitions` dictionary. We used it in `Marble` component's render method. If you're playing along, you should copy paste this. Too much typing :)

{caption: "MarbleDefinitions dictionary", line-numbers: false}
```javascript
// src/logic/Sprite.js

const MarbleDefinitions = {
    dino: { x: -222, y: -177, c: '#8664d5' },
    redHeart: { x: -222, y: -299, c: '#e47178' },
    sun: { x: -222, y: -420, c: '#5c96ac' },

    yellowHeart: { x: -400, y: -177, c: '#c8b405' },
    mouse: { x: -400, y: -299, c: '#7d7e82' },
    pumpkin: { x: -400, y: -420, c: '#fa9801' },

    frog: { x: -576, y: -177, c: '#98b42b' },
    moon: { x: -575, y: -299, c: '#b20717' },
    bear: { x: -576, y: -421, c: '#a88534' }
};

export { MarbleDefinitions };
```

Each type of marble has a name, a coordinate, and a color. The coordinate tells us where on the sprite image it is, and the color helps us create a nice shadow.

All values painstakingly assembled by hand. You're welcome. 😌

The MobX store that loads our sprite into memory and helps us use it looks like this:

{caption: "Sprite store", line-numbers: false}
```javascript
// src/logic/Sprite.js

import { observable, action, computed } from 'mobx';
import MarbleSprite from '../monster-marbles-sprite-sheets.jpg';

class Sprite {
    @observable sprite = null;

    @action loadSprite(callback = () => null) {
        const sprite = new Image();
        sprite.src = MarbleSprite;

        sprite.onload = () => {
            this.sprite = sprite;

            callback();
        };
    }

    @computed get marbleTypes() {
        return Object.keys(MarbleDefinitions);
    }

    @computed get marbleDefinitions() {
        return MarbleDefinitions;
    }
}

export default new Sprite();
```

A MobX store is a JavaScript object. It has `@observable` values, `@actions`, and `@computed` getters. That's all there is to it.

No complicated reducers and action generators. Just JavaScript functions and properties. There's plenty going on behind the scenes, but we don't have to think about it.

That's why I like MobX more than Redux. Feels easier to use 🤫

In the `Sprite` store, we have an `@observable sprite`. Changing this value triggers a re-render in al `@observer` components that rely on it. In our case that's every marble.

Then we have a `loadSprite` action. It creates a new `Image` object and loads the sprite. After the image loads, we set `this.sprite`.

The `@computed` getters make it easier to access `MarbleDefinitions`. `marbleTypes` gives us a list of available types of marbles and `marbleDefinitions` returns the definitions object.

Running your code won't work just yet. We need the physics store first because it defines marble positions.

### Part 2: Building the physics

Our whole physics engine fits into a single MobX store. It contains the collision detection, marble movement calculations, and drives the game loop itself.

The general approach goes like this:

1. Have an observable array of marbles
2. Run a `simulationStep` on each `requestAnimationFrame` using `d3.timer`
3. Change marble positions and speed
4. MobX observables and observers trigger re-renders of marbles that move

The [whole Physics store](https://github.com/Swizec/declarative-canvas-react-konva/blob/master/src/logic/Physics.js) is some 120 lines of code. We'll go slow. Here's the skeleton:

{caption: "Physics skeleton", line-numbers: false}
```javascript
// src/logic/Physics.js

class Physics {
    @observable MarbleR = 25;
    @observable width = 800;
    @observable height = 600;
    @observable marbles = [];
    timer = null;

    @computed get initialPositions() {

    }

    @action startGameLoop() {

    }

    @action simulationStep() {

    }

    @action shoot({ x, y, vx, vy }, i) {

    }
}
```

We have four observable properties, a `timer`, a `@computed` property for initial positions, and 3 actions. `startGameLoop` starts our game, `simulationStep` holds the main logic, and `shoot` shoots a particular marble.

Let's walk through.

#### initialPositions

{caption: "initialPositions function", line-numbers: false}
```javascript
// src/logic/Physics.js
class Physics {
		// ..
    @computed get initialPositions() {
        const { width, height, MarbleR } = this,
              center = width/2;

        const lines = 4,
              maxY = 200;

        let marbles = range(lines, 0, -1).map(y => {
            if (y === lines) return [{ x: center, y: maxY,
                                       vx: 0, vy: 0, r: this.MarbleR}];

            const left = center - y*(MarbleR+5),
                  right = center + y*(MarbleR+5);

            return range(left, right, MarbleR*2+5).map(x => ({
                x: x,
                y: maxY-y*(MarbleR*2+5),
                vx: 0,
                vy: 0,
                r: this.MarbleR
            }));
        }).reduce((acc, pos) => acc.concat(pos), []);

        marbles = [].concat(marbles, {
            x: width/2,
            y: height-150,
            vx: 0,
            vy: 0,
            r: this.MarbleR
        });

        marbles.forEach((m, i) => marbles[i].id = i);

        return marbles;
    }
    // ..
}
```

Believe it or not, this is like one of those *"Arrange things in a triangle"* puzzles you'd see in an old Learn How To Program book. Or a whiteboard interview.

It took me 3 hours to build. Easy to get wrong, fiddly to implement.

We start with a `range` of numbers. From `lines` to `0` in descending order. We iterate through this list of rows and change each into a list of marbles.

4 marbles in the first row, 3 in the next, all the way down to 1 in last row.

For each row, we calculate how much space we have on the `left` and `right` of the center and make a `range` of horizontal positions from `left` to `right` with a step of "1 marble size". Using these positions and the known row, we create marbles as needed.

We use a `.reduce` to flatten nested arrays and add the last marble. That's a corner case I couldn't solve elegantly, but I'm sure it's possible.

In the end, we add an `id` to each marble. We're using index as the id, that's true, but that still ensures we use consistent values throughout our app. Positions in the array may change.

#### shoot and startGameLoop

{caption: "shoot and startGameLoop functions", line-numbers: false}
```javascript
// src/logic/Physics.js
class Physics {
    // ...

    @action startGameLoop() {
        this.marbles = this.initialPositions;

        this.timer = timer(() => this.simulationStep());
    }

    // ...

    @action shoot({ x, y, vx, vy }, i) {
        const maxSpeed = 20;

        this.marbles[i].x = x;
        this.marbles[i].y = y;
        this.marbles[i].vx = vx < maxSpeed ? vx : maxSpeed;
        this.marbles[i].vy = vy < maxSpeed ? vy : maxSpeed;
    }
}
```

`shoot` and `startGameLoop` are the simplest functions in our physics engine. `startGameLoop` gets the initial `marbles` array and starts a D3 timer. `shoot` updates a specific marble's coordinates and speed vector.

👌

#### simulationStep – where collisions collision

Here comes the fun part. The one with our game loop.

There's also a video explaining how this works 👉 [Watch it on YouTube](https://www.youtube.com/watch?v=H84fmXjTElM). With hand-drawn sketches that explain the math, and I think that's neat.

{caption: "Full simulationStep function", line-numbers: false}
```javascript

@action simulationStep() {
    const { width, height, MarbleR } = this;

    const moveMarble = ({x, y, vx, vy, id}) => {
        let _vx = ((x+vx < MarbleR) ? -vx : (x+vx > width-MarbleR) ? -vx : vx)*.99,
            _vy = ((y+vy < MarbleR) ? -vy : (y+vy > height-MarbleR) ? -vy : vy)*.99;

        // nearest marble is a collision candidate
        const subdividedSpace = quadtree().extent([[-1, -1],
                                                   [this.width+1, this.height+1]])
                                          .x(d => d.x)
                                          .y(d => d.y)
                                          .addAll(this.marbles
                                                      .filter(m => id !== m.id)),
              candidate = subdividedSpace.find(x, y, MarbleR*2);

        if (candidate) {

            // borrowing @air_hadoken's implementation from here:
            // https://github.com/airhadoken/game_of_circles/blob/master/circles.js#L64
            const cx = candidate.x,
                  cy = candidate.y,
                  normx = cx - x,
                  normy = cy - y,
                  dist = (normx ** 2 + normy ** 2),
                  c = (_vx * normx + _vy * normy) / dist * 2.3;

            _vx = (_vx - c * normx)/2.3;
            _vy = (_vy - c * normy)/2.3;

            candidate.vx += -_vx;
            candidate.vy += -_vy;
            candidate.x += -_vx;
            candidate.y += -_vy;
        }

        return {
            x: x + _vx,
            y: y + _vy,
            vx: _vx,
            vy: _vy
        }
    };

    this.marbles.forEach((marble, i) => {
        const { x, y, vx, vy } = moveMarble(marble);

        this.marbles[i].x = x;
        this.marbles[i].y = y;
        this.marbles[i].vx = vx;
        this.marbles[i].vy = vy;
    });
}
```

That's a lot of code 😅. Let's break it down.

You can think of `simulationStep` as a function and a loop. At the bottom, there is a `.forEach` that applies a `moveMarble` function to each marble.

{caption: "Loop through marbles", line-numbers: false}
```javascript
    this.marbles.forEach((marble, i) => {
        const { x, y, vx, vy } = moveMarble(marble);

        this.marbles[i].x = x;
        this.marbles[i].y = y;
        this.marbles[i].vx = vx;
        this.marbles[i].vy = vy;
    });
```

We iterate over the list of marbles, feed them into `moveMarble`, get new properties, and save them in the main marbles array. MobX *should* allows us to change these values inside `moveMarble` and let MobX observables do the heavy lifting, but more explicit code is easier to read. 


##### moveMarble

`moveMarble` is itself a hairy function. Stuff happens in 3 steps:

1. Handle collisions with walls
2. Find collision with closest other marble
3. Handle collision with marble

**Handling collisions with walls** happens in two lines of code. One per axis. 

{caption: "Detecting wall collisions", line-numbers: false}
```javascript
let _vx = ((x+vx < MarbleR) ? -vx : (x+vx > width-MarbleR) ? -vx : vx)*.99,
    _vy = ((y+vy < MarbleR) ? -vy : (y+vy > height-MarbleR) ? -vy : vy)*.99;
```

Nested ternary expressions are kinda messy, but good enough. If a marble is beyond any boundary, we reverse its direction. We *always* apply a `.99` friction coefficient so that marbles slow down.

**Finding collisions** with the next closest marble happens using a quadtree. Since we don't have too many marbles, we can build a new quadtree every time.

{aside}
A quadtree is a way to subdivide space into areas. It lets us answer the question of "What's close enough to me to possibly touch me?" without making too many position comparisons.

Checking every marble with every other marble produces 81 comparisons. Versus 2 comparisons using a quadtree.
{/aside}

{caption: "Finding collision candidates", line-numbers: false}
```javascript
// nearest marble is a collision candidate
const subdividedSpace = quadtree().extent([[-1, -1],
                                           [this.width+1, this.height+1]])
                                  .x(d => d.x)
                                  .y(d => d.y)
                                  .addAll(this.marbles
                                              .filter(m => id !== m.id)),
      candidate = subdividedSpace.find(x, y, MarbleR*2);
```

We're using [`d3-quadtree`](https://github.com/d3/d3-quadtree) for the quadtree implementation. It takes an `extent`, which tells it how big our space is. An `x` and `y` accessor tells it how to get coordinates out of our marble objects, and we use `addAll` to fill the quadtree with marbles.

To avoid detecting each marble as colliding with itself, we take each marble out of our list before feeding the quadtree.

Once we have a quadtree, we use `.find` to look for the nearest marble within two radiuses – `MarbleR*2` – of the current marble. That's exactly the one we're colliding with! :smile:

**Handling collisions with marbles** involves math. The sort of thing you think you remember from high school, and suddenly realize you don't when the time comes to use it.

Code looks like this:

{caption: "Handling marble collisions", line-numbers: false}
```javascript
if (candidate) {

    // borrowing @air_hadoken's implementation from here:
    // https://github.com/airhadoken/game_of_circles/blob/master/circles.js#L64
    const cx = candidate.x,
          cy = candidate.y,
          normx = cx - x,
          normy = cy - y,
          dist = (normx ** 2 + normy ** 2),
          c = (_vx * normx + _vy * normy) / dist * 2.3;

    _vx = (_vx - c * normx)/2.3;
    _vy = (_vy - c * normy)/2.3;

    candidate.vx += -_vx;
    candidate.vy += -_vy;
    candidate.x += -_vx;
    candidate.y += -_vy;
}

return {
    x: x + _vx,
    y: y + _vy,
    vx: _vx,
    vy: _vy
}
```

Ok, the `return` statement isn't about handling collisions. It updates the current marble.

The rest looks like magic. I implemented it and it still looks like magic.

You can think of `[normx, normy]` as a vector that points from current marble to collision candidate. It gives us bounce direction. We use the [euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) formula to calculate the length of this vector. The distance between the centers of both marbles.

Then we calculate the [dot product](https://en.wikipedia.org/wiki/Dot_product) between our marble's speed vector and the collision direction vector. And we normalize it by distance. Multiplying distance by `2` accounts for there being two marbles in the collision. That extra `.3` made the simulation look better.

Fiddling and experimentation are your best tools for magic values like that 😉

Then we use the dot product scalar to adjust the marble's speed vector. Dividing by `2` takes into account that half the energy goes to the other marble. This is true because we assume their masses are equal.

Finally, we update the `candidate` marble and make sure it bounces off as well. We do it additively because that's how it happens in real life.

Two marbles traveling towards each other in exactly opposite directions with exactly the same speed, will stop dead and stay there. As soon as there's any misalignment, deflection happens. If one is stationary, it starts moving. If it's moving in the same direction, it speeds up… etc.

The end result is [a decent-looking simulation of billiards](https://swizec.github.io/declarative-canvas-react-konva/). 

{#fractal-tree}
# Using a React alternative like Preact or Inferno

We've been using React so far, and that's worked great. React is fast, easy to use, and not too hard to understand. However, two alternative frameworks promise the ease of React, but faster with a smaller footprint.

[**Preact**](https://github.com/developit/preact) looks just like React when you're using it, but the smaller code footprint means your apps open faster. Performing fewer sanity checks at runtime makes it faster to run too. Async rendering can make your apps feel even faster.

[**Inferno**](https://github.com/infernojs/inferno) also promises to look just like React when you're using it, but its sole purpose in life is to be faster. According to its maintainers, converting to Inferno can improve performance of your real-world app by up to 110%.

Both Preact and Inferno have a `-compat` project that lets you convert existing React projects without any code modifications. While React has gotten much faster in recent years, so have Preact and Inferno. You should give them a try.

I know Uber uses Preact for their Uber lite mobile app.

## Stress test your framework with a recursive fractal

To show you how these speed improvements look in real life, I've devised a stress test. A [pythagorean fractal tree](https://en.wikipedia.org/wiki/Pythagoras_tree_(fractal) that moves around when you move your mouse.

![Pythagorean tree](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/pythagorean-tree.png)

It's a great stress test because a render like this is the worst case scenario for tree-based rendering. You have 2048 SVG nodes, deeply nested, that all change props and re-render with every change.

You can see [the full code on Github](https://github.com/Swizec/react-fractals). We're going to focus on the recursive `<Pythagoras>` component.

### How you too can build a dancing tree fractal

Equipped with basic trigonometry, you need 3 ingredients to build a dancing tree:

- a recursive `<Pythagoras>` component
- a mousemove listener
- a memoized next-step-props calculation function

We're using a `<Pythagoras>` component for each square and its two children, a D3 mouse listener, and some math that a reader helped me with. We need D3 because its mouse listeners automatically calculate mouse position relative to SVG coordinates. [Memoization](https://en.wikipedia.org/wiki/Memoization) in the math function helps us keep our code faster.

The `<Pythagoras>` component looks like this:

{caption: "Recursive <Pythagoras> component", line-numbers: false}
```
const Pythagoras = ({ w, x, y, heightFactor, lean, left, right, lvl, maxlvl }) => {
    if (lvl >= maxlvl || w < 1) {
        return null;
    }

    const { nextRight, nextLeft, A, B } = memoizedCalc({
        w: w,
        heightFactor: heightFactor,
        lean: lean
    });

    let rotate = '';

    if (left) {
        rotate = `rotate(${-A} 0 ${w})`;
    }else if (right) {
        rotate = `rotate(${B} ${w} ${w})`;
    }

    return (
        <g transform={`translate(${x} ${y}) ${rotate}`}>
            <rect width={w} height={w}
                  x={0} y={0}
                  style={{fill: interpolateViridis(lvl/maxlvl)}} />

            <Pythagoras w={nextLeft}
                        x={0} y={-nextLeft}
                        lvl={lvl+1} maxlvl={maxlvl}
                        heightFactor={heightFactor}
                        lean={lean}
                        left />

            <Pythagoras w={nextRight}
                        x={w-nextRight} y={-nextRight}
                        lvl={lvl+1} maxlvl={maxlvl}
                        heightFactor={heightFactor}
                        lean={lean}
                        right />

        </g>
    );
};
```

We break out of recursion when we get too deep or try to draw an invisible square. Otherwise we:

- use `memoizedCalc` to do the mathematics
- define different `rotate()` transforms for the `left` and `right` branches
- return an SVG `<rect>` for the current rectangle, and two `<Pythagoras>` elements for each branch.

Most of this code deals with passing props  to children, which isn't the most elegant approach, but it works. The rest is about positioning branches so corners match up.

![Corners matching up](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/pythagoras-corners-match-up.png)

#### The math

I don't _really_ understand this math, but I sort of know where it's coming from. It's the [sine law](https://en.wikipedia.org/wiki/Law_of_sines) applied correctly. The part I failed at [when I tried](https://swizec.com/blog/fractals-react/swizec/7233) to do it myself.

{caption: "Trigonometry that moves our fractal", line-numbers: false}
```
const memoizedCalc = function () {
    const memo = {};

    const key = ({ w, heightFactor, lean }) => [w,heightFactor, lean].join('-');

    return (args) => {
        const memoKey = key(args);

        if (memo[memoKey]) {
            return memo[memoKey];
        }else{
            const { w, heightFactor, lean } = args;

            const trigH = heightFactor*w;

            const result = {
                nextRight: Math.sqrt(trigH**2 + (w * (.5+lean))**2),
                nextLeft: Math.sqrt(trigH**2 + (w * (.5-lean))**2),
                A: Math.deg(Math.atan(trigH / ((.5-lean) * w))),
                B: Math.deg(Math.atan(trigH / ((.5+lean) * w)))
            };

            memo[memoKey] = result;
            return result;
        }
    }
}();
```

We expanded the basic law of sines with a dynamic `heightFactor` and `lean` adjustment. We'll control those with mouse movement.

To improve performance our `memoizedCalc` function has an internal data store that maintains a hash of every argument tuple and its result. So when we call `memoizedCalc` with the same arguments multiple times, it reads from cache instead of recalculating.

At 11 levels of recursion, `memoizedCalc` is called 2,048 times and only returns 11 different results. Great candidate for memoization if I ever saw one.

Of course, a benchmark would be great here. Maybe `sqrt`, `atan`, and `**` aren't *that* slow, and our real bottleneck is redrawing all those nodes on every mouse move. Hint: it totally is.

Our ability to memoize calculation also means that we could, in theory, flatten our rendering. Instead of recursion, we could use iteration and render in layers. Squares at each level are the same, just at different `(x, y)` coordinates.

This, however, would be far too tricky to implement.

#### The mouse listener

Inside [`App.js`](https://github.com/Swizec/react-fractals/blob/master/src/App.js), we add a mouse event listener. We use D3's because it gives us SVG-relative position calculation out of the box. With React's, we'd have to do the hard work ourselves.

{caption: "Reacting to mouse movement", line-numbers: false}
```
// App.js
state = {
        currentMax: 0,
        baseW: 80,
        heightFactor: 0,
        lean: 0
    };

componentDidMount() {
	d3select(this.refs.svg)
	   .on("mousemove", this.onMouseMove.bind(this));
}

onMouseMove(event) {
	const [x, y] = d3mouse(this.refs.svg),

	scaleFactor = scaleLinear().domain([this.svg.height, 0])
														 .range([0, .8]),

	scaleLean = scaleLinear().domain([0, this.svg.width/2, this.svg.width])
													 .range([.5, 0, -.5]);

	this.setState({
		heightFactor: scaleFactor(y),
		lean: scaleLean(x)
	});
}

// ...

render() {
	// ...
	<svg ref="svg"> //...
	<Pythagoras w={this.state.baseW}
						  h={this.state.baseW}
						  heightFactor={this.state.heightFactor}
					   lean={this.state.lean}
					   x={this.svg.width/2-40}
					   y={this.svg.height-this.state.baseW}
					   lvl={0}
					   maxlvl={this.state.currentMax}/>
}
```

A few things happen here:

- we set initial `lean` and `heightFactor` to `0`
- in `componentDidMount`, we use `d3.select` and `.on` to add a mouse listener
- we define an `onMouseMove` method as the listener
- render the first `<Pythagoras>` using values from `state`

The `lean` parameter tells us which way the tree is leaning and how much, the `heightFactor` tells us how high those triangles should be. We control both with the mouse position.

That happens in `onMouseMove`:

{caption: "Moving the fractal as user moves mouse", line-numbers: false}
```
onMouseMove(event) {
	const [x, y] = d3mouse(this.refs.svg),

	scaleFactor = scaleLinear().domain([this.svg.height, 0])
														 .range([0, .8]),

	scaleLean = scaleLinear().domain([0, this.svg.width/2, this.svg.width])
													 .range([.5, 0, -.5]);

	this.setState({
		heightFactor: scaleFactor(y),
		lean: scaleLean(x)
	});
}
```

`d3mouse` - an imported `mouse` function from `d3-selection` - gives us cursor position relative to the SVG element. Two linear scales give us `scaleFactor` and `scaleLean` values, which we put into component state.

When we feed a change to `this.setState`, it triggers a re-render of the entire tree, our `memoizedCalc` function returns new values, and the final result is a dancing tree.

![Dancing Pythagoras tree](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/pythagoras-dancing.gif)

Beautious. :heart_eyes:

## Trying the stress test in Preact and Inferno

The Pythagoras tree example got converted into 6 different UI libraries: React, Preact, Inferno, Vue, Angular 2, and CycleJS.

Mostly by the creators of those libraries themselves because they're awesome and much smarter than I am. You can see the result, in gifs, on [my blog here](https://swizec.com/blog/animating-svg-nodes-react-preact-inferno-vue/swizec/7311).

We're focusing on React-like libraries, so here's a rundown of changes required for Preact and Inferno with links to full code.

### Preact

Implemented by Jason Miller, creator of Preact. [Full code on Github](https://github.com/developit/preact-fractals)

![](https://raw.githubusercontent.com/Swizec/react-d3js-es6-ebook/2018-version/manuscript/resources/images/es6v2/preact-pythagora.gif)

Jason used the `preact-compat` layer to make Preact pretend that it's React. This might impact performance.

What I love about the Preact example is that it uses async rendering to look smoother. You can see the redraw cycle lag behind the mouse movement producing curious effects.

I like it.

Here's how he did it: [full diff on github](https://github.com/Swizec/react-fractals/compare/master...developit:master)

In `package.json`, he added `preact`, `preact-compat`, and preact -compat clones for React libraries. I guess you need the latter so you don't have to change your imports.

He changed the functional `Pythagoras` component into a stateful component to enable async rendering.

{caption: "Change <Pythagoras> to a class", line-numbers: false}
```
// src/Pythagoras.js
export default class {
	render(props) {
		return Pythagoras(props);
	}
}
```

And enabled debounced asynchronous rendering:

{caption: "Debounce rendering", line-numbers: false}
```
// src/index.js
import { options } from 'preact';
options.syncComponentUpdates = false;

//option 1:  rIC + setTimeout fallback
let timer;
options.debounceRendering = f => {
    clearTimeout(timer);
    timer = setTimeout(f, 100);
    requestIdleCallback(f);
};
```

My favorite part is that you can use Preact as a drop-in replacement for React and it Just Works™ *and* works well. This is promising for anyone who wants a quick win in their codebase.

### Inferno

Implemented by Dominic Gannaway, creator of Inferno. [Full code on Github](https://github.com/trueadm/inferno-fractals)

You *can* use Inferno as a drop-in replacement for React, and I did when I tried to build this myself. Dominic says that impacts performance, though, so he made a proper fork. You can see the [full diff on Github](https://github.com/Swizec/react-fractals/compare/master...trueadm:master)

Dominic changed all `react-scripts` references to `inferno-scripts`, and it's a good sign that such a thing exists. He also changed the `react` dependency to `inferno-beta36`, but I'm sure it's out of beta by the time you're reading this. The experiment was done in December 2016.

From there, the main changes are to the imports – React becomes Inferno – and he changed some class methods to bound fat arrow functions. Probably a stylistic choice.

He also had to change a string-based ref into a callback ref. Inferno doesn't do string-based refs for performance reasons, and we need refs so we can use D3 to detect mouse position on SVG.

{caption: "Change ref to callback", line-numbers: false}
```
// src/App.js

class App extends Component {
	// ...
	svgElemeRef = (domNode) => {
		this.svgElement = domNode;
	}
	// ...
	render() {
		// ..
		<svg width={this.svg.width} height={this.svg.height} ref={this.svgElemeRef }>
	}
```

In the core `Pythagoras` component, he added two Inferno-specific props: `noNormalize` and `hasNonKeyedChildren`.

According to [this issue](https://github.com/trueadm/inferno/issues/565), `noNormalize` is a benchmark-focused flag that improves performance, and I can't figure out what `hasNonKeyedChildren` does. I assume both are performance optimizations for the Virtual DOM diffing algorithm.
