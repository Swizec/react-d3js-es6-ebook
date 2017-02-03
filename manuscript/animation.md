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

Section in the works. Until then, these two articles talk about using transitions to build declarative animations with React and D3.

- [Animated string diffing with React and D3](https://swizec.com/blog/animated-string-diffing-with-react-and-d3/swizec/6952)
- [Using d3js transitions in React](https://swizec.com/blog/using-d3js-transitions-in-react/swizec/6797)