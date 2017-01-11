# A big example project #

# Visualizing 176,113 US tech salaries

We're going to build this:

![](images/es6v2/full-dataviz.png)

It's an interactive visualization app with a choropleth map and a histogram comparing tech salaries with median household income in the area. Users can filter by three different parameters – year, job title, and US state – to get a more detailed view.

![](images/es6v2/interaction-dataviz.png)

It's going to be great.

At this point, I assume you've used `create-react-app` to set up your environment. Check the [getting started](#getting-started) section if you haven't. I'll also assume you've read the [basics chapter](#the-meat-start). I'm still going to explain what we're doing, but knowing the basics helps.

I suggest you follow along, keep `npm start` running, and watch your visualization change in real time as you code. It's rewarding as hell.

If you get stuck, you can use my [react-d3js-step-by-step Github repo](https://github.com/Swizec/react-d3js-step-by-step) to jump between steps. The [9 tags](https://github.com/Swizec/react-d3js-step-by-step/releases) correspond to the code at the end of each step. Download the first tag and run `npm install` to skip the initial setup.

If you want to see how this project evolved over 22 months, check [the original repo](https://github.com/Swizec/h1b-software-salaries). The [create-react-app](https://github.com/Swizec/h1b-software-salaries/tree/create-react-app) branch has the code you're about to build.

## Show a Preloader

![Preloader screenshot](images/es6v2/preloader-screenshot.png)

Our preloader is a screenshot of the final result. Usually you'd have to wait until the end of the project to make that, but I'll just give you mine. Starting with the preloader makes sense for two reasons:

1. It's nicer than watching a blank screen while data loads
2. It's a good sanity check for our environment

We're using a screenshot of the final result because the full dataset takes a few seconds to load, parse, and render. It looks better if visitors see something informative while they wait.

Make sure you've installed [all dependencies](#install-dependencies) and that `npm start` is running.

We're building the preloader in 3 steps:

1. Get the image
2. Make the `Preloader` component
3. Update `App`
4. Load Bootstrap styles in `index.js`

### Step 1: Get the image

Download [my screenshot from Github](https://raw.githubusercontent.com/Swizec/react-d3js-step-by-step/798ec9eca54333da63b91c66b93339565d6d582a/src/assets/preloading.png) and save it in `src/assets/preloading.png`. It goes in the `src/assets/` directory because we're going to `import` it in JavaScript, which makes it part of our source code, and I like to put non-javascript files in `assets`. It keeps the project organized.

### Step 2: Preloader component

The `Preloader` is a component that pretends it's the `App`, and it renders a static title, description, and a screenshot of our end result. It goes in `src/components/Preloader.js`.

We'll put all of our components in `src/components/`.

We start the component off with some imports, an export, and a functional stateless component that returns an empty div element.

{crop-start: 5, crop-end: 17, format: javascript}
![Preloader skeleton](code_samples/es6v2/compnents/Preloader.js)

We `import` React (which we need to make JSX syntax work) and the `PreloaderImg` for our image. We can import images because of the Webpack configuration that comes with `create-react-app`. The image loader puts a file path in the `PreloaderImg` constant.

At the bottom, we `export default Preloader` so that we can use it in `App.js` as `import Preloader`. I like to use default exports when the file exports a single thing and named exports when we have multiple things. You'll see that play out in the rest of this project.

The `Preloader` function takes no props because we don't need any, and it returns an empty `div`. Let's fill it in.

{crop-start: 22, crop-end: 35, format: javascript}
![Preloader content](code_samples/es6v2/components/Preloader.js)

We're cheating again because I copy-pasted that from the finished example. You wouldn't have anywhere to get this yet.

The code itself looks like plain HTML. We have the usual tags - `h1`, `p`, `b`, `img`, and `h2`. That's what I like about using JSX. It feels familiar.

But look at the `img` tag: the `src` attribute is dynamic, defined by `PreloaderImg`, and the `style` attribute takes an object, not a string. That's because JSX is more than HTML; it's JavaScript. You can put any JavaScript entity you need in those props.

That will be one of the cornerstones of our sample project.

### Step 3: Update App

To use our new `Preloader` component, we have to edit `src/App.js`. Let's start by removing the defaults that came with `create-react-app` and importing our `Preloader` component.

{crop-start: 5, crop-end: 35, format: javascript}
![Revamp App.js](code_samples/es6v2/App.js)

We removed the logo and style imports, added an import for `Preloader`, and gutted everything out of the `App` class. It's a great starting point for a default app, but it has served its purpose.

Let's define a default `state` and a `render` method that uses our `Preloader` component when there's no data.

{crop-start: 40, crop-end: 62, format: javascript}
![Render the preloader](code_samples/es6v2/App.js)

With modern ES6+ classes, we can define properties directly in the class without going through the constructor method. This makes our code cleaner and easier to read.

You might be wondering whether `state` is now a class static property, or if it's bound to `this` for each object. It works the way we need it to: bound to each `this` instance. I don't know *why* it works that way because it's hard to Google for these things when you can't remember the name, but I do know it works. Tried and battle tested :)

We set `techSalaries` to an empty array, then use `render` to check whether it's empty. It then renders either the `Preloader` component or a blank `<div>`. Rendering your preloaders when there's no data makes sense even if you haven't yet built your data loading.

If you have `npm start` running, your preloader should show up on screen.

![Preloader without Bootstrap styles](preloader-without-styles-screenshot.png)

Hmm ... that's not very pretty. Let's fix it.

### Step 4: Load Bootstrap styles

We're going to use Bootstrap styles to avoid reinventing the wheel. We're ignoring their JavaScript widgets and the amazing integration built by the [react-bootstrap](http://react-bootstrap.github.io/) team. All we need are the stylesheets.

They'll make the fonts look better, help with layouting, and make buttons look like buttons.

We add them in `src/index.js`.

{crop-start: 5, crop-end: 18, format: javascript}
![Add bootstrap in index.js](code_samples/es6v2/index.js)

This is another benefit of using Webpack: `import`-ing stylesheets. These imports turn into `<style>` tags with CSS in their body at runtime.

This is also a good opportunity to see how simple the `index.js` file is. It requires our `App`, and it uses `ReactDOM` to render it into the page. That's it.

You should now see your beautiful preloader on screen.

![Preloader screenshot](images/es6v2/preloader-screenshot.png)

If you don't, try comparing your changes to this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/798ec9eca54333da63b91c66b93339565d6d582a).

## Asynchronously load data

## Render a choropleth map of the US

## Render a Histogram of salaries

## Make it understandable - meta info

### Dynamic title

### Dynamic description

### Median household line

## Add user controls for data slicing and dicing

## Rudimentary routing

## Prep for launch
