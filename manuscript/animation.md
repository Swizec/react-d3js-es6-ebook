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



### Step 5: Correcting for time

# Using transitions for simple animation
