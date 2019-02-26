<!--- begin-section title="Refactor your components with React Hooks" -->

<!--- begin-lecture title="An intro to hooks" -->

# Refactor your components with React Hooks

Hooks launched with great fanfare and community excitement in February 2019. A
whole new way to write React components.

Not a fundamental change, the React team would say, but a mind shift after all.
A change in how you think about state, side effects, and component structure.
You might not like hooks at first. With a little practice they're going to feel
more natural than the component lifecycle model you're used to now.

Hooks exist to:

- help you write less code for little bits of logic
- help you move logic out of your components
- help you reuse logic between components

Some say it removes complexity around the `this` keyword in JavaScript and I'm
not sure that it does. Yes, there's no more `this` because everything is a
function, that's true. But you replace that with passing a lot of function
arguments around and being careful about function scope.

My favorite React Hooks magic trick is that you can and should write your own.
Reusable or not, a custom hook almost always cleans up your code.

Oh and good news! Hooks are backwards compatible. You can write new stuff with
hooks and keep your old stuff unchanged. :ok_hand:

In this section we're going to look at the core React hooks, talk about the
most important hook for dataviz, then refactor our big example from earlier to
use hooks.

You'll need to upgrade React to at least version `16.8.0` to use hooks.

<!--- end-lecture -->

<!--- begin-lecture title="useState, useEffect, and useContext" -->

## useState, useEffect, and useContext

React comes with
[a bunch of basic and advanced hooks](https://reactjs.org/docs/hooks-reference.html).
The core hooks are:

- `useState` for managing state
- `useEffect` for side-effects
- `useContext` for React's context API

Here's how to think about them in a nutshell :point_down:

### useState

The `useState` hook replaces pairs of state getters and setters.

```{.javascript caption="State without hooks"}
class myComponent extends React.Component {
	state = {
	  value: 'default'
	}

	handleChange = (e) => this.setState({
	  value: e.target.value
	})

	render() {
	  const { value } = this.state;

	  return <input value={value} onChange={handleChange} />
	}
}
```

:point_down:

```{.javascript caption="useState hook"}
const myComponent = () => {
  const [value, setValue] = useState('default');

  const handleChange = (e) => setValue(e.target.value)

  return <input value={value} onChange={handleChange} />
}
```

Less code to write and understand.

In a class component you:

- set a default value
- create an `onChange` callback that fires `setState`
- read value from state before rendering etc.

Without modern fat arrow syntax you might run into trouble with binds.

The hook approach moves that boilerplate to React's plate. You call `useState`.
It takes a default value and returns a getter and a setter.

You call that setter in your change handler.

Behind the scenes React subscribes your component to that change. Your
component re-renders.

### useEffect

`useEffect` replaces the `componentDidMount`, `componentDidUpdate`,
`shouldComponentUpdate`, `componentWillUnmount` quadfecta. It's like a
trifecta, but four.

Say you want a side-effect when your component updates, like make an API call.
Gotta run it on mount and update. Want to subscribe to a DOM event? Gotta
unsubscribe on unmount.

Wanna do all this only when certain props change? Gotta check for that.

Class:

```{.javascript caption="Side-effects without hooks"}
class myComp extends Component {
  state = {
	  value: 'default'
	}

	handleChange = (e) => this.setState({
	  value: e.target.value
	})

	saveValue = () => fetch('/my/endpoint', {
		method: 'POST'
		body: this.state.value
	})

	componentDidMount() {
		this.saveValue();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.value !== this.state.value) {
			this.saveValue()
		}
	}

	render() {
	  const { value } = this.state;

	  return <input value={value} onChange={handleChange} />
	}
}
```

:point_down:

```{.javascript caption="useEffect hook"}
const myComponent = () => {
  const [value, setValue] = useState('default');

  const handleChange = (e) => setValue(e.target.value)
  const saveValue = () => fetch('/my/endpoint', {
		method: 'POST'
		body: value
	})

	useEffect(saveValue, [value]);

  return <input value={value} onChange={handleChange} />
}
```

So much less code!

`useEffect` runs your function on `componentDidMount` and `componentDidUpdate`.
And that second argument, the `[value]` part, tells it to run only when `value`
changes.

No need to double check with a conditional. If your effect updates the
component itself through a state setter, the second argument acts as a
`shouldComponentUpdate` of sorts.

When you return a method from `useEffect`, it acts as a `componentWillUnmount`.
Listening to, say, your mouse position looks like this:

```{.javascript caption="A mouse listener hook"}
const [mouseX, setMouseX] = useState();
const handleMouse = (e) => setMouseX(e.screenX);

useEffect(() => {
	window.addEventListener('mousemove', handleMouse);
	return () => window.removeEventListener(handleMouse);
})
```

Neat :okay_hand:

### useContext

`useContext` cleans up your render prop callbacky hell.

```{.javascript caption="Context without hooks"}
const SomeContext = React.createContext()

// ...

<SomeContext.Consumer>
  {state => ...}
</SomeContext.Consumer>
```

:point_down:

```{.javascript caption="Context with hooks"}
const state = useContext(SomeContext)
```

Context state becomes just a value in your function. React auto subscribes to
all updates.

And those are the core hooks. useState, useEffect, and useContext. You can use
them to build almost everything. :okay_hand:

<!--- end-lecture -->

<!--- begin-lecture title="useMemo is your new best friend" -->

## useMemo is your new best dataviz friend

My favorite hook for making React and D3 work together is `useMemo`. It's like
a combination of `useEffect` and `useState`.

Remember how the rest of this course focused on syncing D3's internal state
with React's internal state and complications around large datasets and
speeding up your D3 code to avoid recomputing on every render?

All that goes away with `useMemo` – it memoizes values returned from a function
and recomputes them when particular props change. Think of it like a cache.

Say you have a D3 linear scale. You want to update its range when your
component's width changes.

```{.javascript caption="useMemo for a scale"}
function MyComponent({ data, width }) {
	const scale = useMemo(() =>
		d3.scaleLinear()
			.domain([0, 1])
			.range([0, width])
	), [width])

	return <g> ... </g>
}
```

`useMemo` takes a function that returns a value to be memoized. In this case
that's the linear scale.

You create the scale same way you always would. Initiate a scale, set the
domain, update the range. No fancypants trickery.

`useMemo`'s second argument works much like useEffect's does: It tells React
which values to observe for change. When that value changes, `useMemo` reruns
your function and gets a new scale.

Don't rely on `useMemo` running only once however. Memoization is meant as a
performance optimization, a hint if you will, not as a syntactical guarantee of
uniqueness.

And that's exactly what we want. No more futzing around with
`getDerivedStateFromProps` and `this.state`. Just `useMemo` and leave the rest
to React. :v:

<!--- end-lecture -->

<!--- begin-lecture title="my useD3 hook" -->

## my useD3 hook

Remember when we talked about D3 blackbox rendering? I built a hook for that so
you don't have to mess around with HOCs anymore :)

Read the full docs at [d3blackbox.com](https://d3blackbox.com/)

It works as a combination of `useRef` and `useEffect`. Hooks into component
re-renders, gives you control of the anchor element, and re-runs your D3 render
function on every component render.

You use it like this:

```{.javascript caption="useD3 for quick integrations"}
import { useD3 } from "d3blackbox";
function renderSomeD3(anchor) {
    d3.select(anchor);
    // ...
}

const MyD3Component = ({ x, y }) => {
    const refAnchor = useD3(anchor => renderSomeD3(anchor));
    return <g ref={refAnchor} transform={`translate(${x}, ${y})`} />;
};
```

You'll see how this works in more detail when we refactor the big example to
hooks. We'll use `useD3` to build axes.

<!--- end-lecture -->

<!--- begin-lecture title="Refactoring our big example to hooks" -->

## Refactoring our big example to hooks

I considered writing this section out as text, but I don't think that's the
best way to learn about refactoring. Too many moving pieces. You should watch
the videos :)

As always, they're cut so you can enjoy bitesized pieces.

<!--- end-lecture-->

<!--- end-section -->
