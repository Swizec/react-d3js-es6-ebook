{#salary-visualization}
# A big example project - 176,113 tech salaries visualized #

We're going to build this:

![](images/es6v2/full-dataviz.png)

It's an interactive visualization app with a choropleth map and a histogram comparing tech salaries with median household income in the area. Users can filter by three different parameters – year, job title, and US state – to get a more detailed view.

![](images/es6v2/interaction-dataviz.png)

It's going to be great.

At this point, I assume you've used `create-react-app` to set up your environment. Check the [getting started](#getting-started) section if you haven't. I'll also assume you've read the [basics chapter](#the-meat-start). I'm still going to explain what we're doing, but knowing the basics helps.

I suggest you follow along, keep `npm start` running, and watch your visualization change in real time as you code. It's rewarding as hell.

If you get stuck, you can use my [react-d3js-step-by-step Github repo](https://github.com/Swizec/react-d3js-step-by-step) to jump between steps. The [9 tags](https://github.com/Swizec/react-d3js-step-by-step/releases) correspond to the code at the end of each step. Download the first tag and run `npm install` to skip the initial setup.

If you want to see how this project evolved over 22 months, check [the original repo](https://github.com/Swizec/h1b-software-salaries). The [create-react-app](https://github.com/Swizec/h1b-software-salaries/tree/create-react-app) branch has the code you're about to build.

# Show a Preloader

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

## Step 1: Get the image

Download [my screenshot from Github](https://raw.githubusercontent.com/Swizec/react-d3js-step-by-step/798ec9eca54333da63b91c66b93339565d6d582a/src/assets/preloading.png) and save it in `src/assets/preloading.png`. It goes in the `src/assets/` directory because we're going to `import` it in JavaScript (which makes it part of our source code), and I like to put non-JavaScript files in `assets`. It keeps the project organized.

## Step 2: Preloader component

The `Preloader` is a component that pretends it's the `App` and renders a static title, description, and a screenshot of our end result. It goes in `src/components/Preloader.js`.

We'll put all of our components in `src/components/`.

We start the component off with some imports, an export, and a functional stateless component that returns an empty div element.

{crop-start: 5, crop-end: 17, format: javascript}
![Preloader skeleton](code_samples/es6v2/compnents/Preloader.js)

We `import` React (which we need to make JSX syntax work) and the `PreloaderImg` for our image. We can import images because of the Webpack configuration that comes with `create-react-app`. The image loader puts a file path in the `PreloaderImg` constant.

At the bottom, we `export default Preloader` so that we can use it in `App.js` as `import Preloader`. I like to use default exports when the file exports a single thing and named exports when we have multiple. You'll see that play out in the rest of this project.

The `Preloader` function takes no props (because we don't need any) and returns an empty `div`. Let's fill it in.

{crop-start: 22, crop-end: 35, format: javascript}
![Preloader content](code_samples/es6v2/components/Preloader.js)

We're cheating again because I copy-pasted that from the finished example. You wouldn't have anywhere to get this yet.

The code itself looks like plain HTML. We have the usual tags - `h1`, `p`, `b`, `img`, and `h2`. That's what I like about using JSX. It feels familiar.

But look at the `img` tag: the `src` attribute is dynamic, defined by `PreloaderImg`, and the `style` attribute takes an object, not a string. That's because JSX is more than HTML; it's JavaScript. You can put any JavaScript entity you need in those props.

That will be one of the cornerstones of our sample project.

## Step 3: Update App

To use our new `Preloader` component, we have to edit `src/App.js`. Let's start by removing the defaults that came with `create-react-app` and importing our `Preloader` component.

{crop-start: 5, crop-end: 35, format: javascript}
![Revamp App.js](code_samples/es6v2/App.js)

We removed the logo and style imports, added an import for `Preloader`, and gutted everything out of the `App` class. It's a great starting point for a default app, but it's served its purpose.

Let's define a default `state` and a `render` method that uses our `Preloader` component when there's no data.

{crop-start: 40, crop-end: 62, format: javascript}
![Render the preloader](code_samples/es6v2/App.js)

With modern ES6+ classes, we can define properties directly in the class without going through the constructor method. This makes our code cleaner and easier to read.

You might be wondering whether `state` is now a class static property or if it's bound to `this` for each object. It works the way we need it to: bound to each `this` instance. I don't know *why* it works that way because it's hard to Google for these things when you can't remember the name, but I know it works. Tried and battle tested :)

We set `techSalaries` to an empty array, then in `render` check whether it's empty and render either the `Preloader` component or a blank `<div>`. Rendering your preloaders when there's no data makes sense even if you still need to build your data loading.

If you have `npm start` running, your preloader should show up on screen.

![Preloader without Bootstrap styles](preloader-without-styles-screenshot.png)

Hmm… that's not very pretty. Let's fix it.

## Step 4: Load Bootstrap styles

We're going to use Bootstrap styles to avoid reinventing the wheel. We're ignoring their JavaScript widgets and the amazing integration built by the [react-bootstrap](http://react-bootstrap.github.io/) team. All we need are the stylesheets.

They'll make the fonts look better, help with layouting, and make buttons look like buttons.

We add them in `src/index.js`.

{crop-start: 5, crop-end: 18, format: javascript}
![Add bootstrap in index.js](code_samples/es6v2/index.js)

Another benefit of using Webpack: `import`-ing stylesheets. These imports turn into `<style>` tags with CSS in their body at runtime.

This is also a good opportunity to see how simple the `index.js` file is. It requires our `App` and uses `ReactDOM` to render it into the page. That's it.

You should now see your beautiful preloader on screen.

![Preloader screenshot](images/es6v2/preloader-screenshot.png)

If you don't, try comparing your changes to this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/798ec9eca54333da63b91c66b93339565d6d582a).

# Asynchronously load data

Great! We have a preloader. Time to load some data.

We'll use D3's built-in data loading methods and tie their callbacks into React's component lifecycle. You could talk to a REST API in the same way. Neither D3 nor React care what the datasource is.

First, you need the data files. I scraped the tech salary info from [h1bdata.info](http://h1bdata.info/), the median household incomes from the US census datasets, and US map data from Mike Bostock's github repositories. I used some elbow grease and python scripts to tie the datasets together.

You can read about the scraping on my blog [here](https://swizec.com/blog/place-names-county-names-geonames/swizec/7083), [here](https://swizec.com/blog/facts-us-household-income/swizec/7075), and [here](https://swizec.com/blog/livecoding-24-choropleth-react-js/swizec/7078). But it's not the subject of this book.

You should download the 6 datafiles from [the step-by-step repository on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/8819d9c38b4aef0a0c569e493f088ff9c3bfdf33). Put them in the `public/data` directory in your project.

## Step 1: Prep App.js

Let's set up our `App` component first. That way you'll see results as soon data loading starts to work.

We start by importing our data loading method - `loadAllData` - and both D3 and Lodash. We'll need them later.

{crop-start: 67, crop-end: 78, format: javascript}
![Import d3, lodash, and our data loader](code_samples/es6v2/App.js)

You already know the normal imports. Importing with `{}` is how we import named exports, which lets us get multiple things from the same file. You'll see how the export side works in Step 2.

{crop-start: 79, crop-end: 91, format: javascript}
![Initiate data loading in App.js](code_samples/es6v2/App.js)

We initiate data loading inside the `App` class's `componentWillMount` lifecycle hook. It fires right before React mounts our component into the DOM. Seems like a good place to start loading data, but some say it's an anti-pattern.

I like tying it to component mount when using the [basic architecture](#basic-architecture), and in a more render agnostic place when using Redux or MobX for state management.

To initiate data loading, we call the `loadAllData` function, which we're defining next, then use `this.setState` in a callback. This updates `App`'s state and triggers a re-render, which updates our entire visualization via props.

We also took this opportunity to add two more entries to our `state`: `countyNames`, and `medianIncomes`.

Let's add a "Data loaded" indicator to the `render` method. That way we'll know when data loading works.

{crop-start: 94, crop-end: 112, format: javascript}
![Data loaded indicator](code_samples/es6v2/App.js)

We added the `container` class to the main `<div>` and added an `<h1>` tag to show how many datapoints were loaded. The `{}` pattern denotes a dynamic value in JSX. You've seen this in props so far, but it works in tag bodies as well.

With all of this done, you should see an error overlay.

![DataHandling.js not found error overlay](images/es6v2/datahandling-error.png)

These nice error overlays come with `create-react-app`. They make it so you never have to check the terminal where `npm start` is running. A big improvement thanks to the React team at Facebook.

Let's build that file and fill it with our data loading logic.

## Step 2: Prep data parsing functions

We're putting data loading logic in a file separate from `App.js` because it's a bunch of functions that work together and don't have much to do with the `App` component.

We start the file with two imports and four data parsing functions:
- `cleanIncomes`, which parses each row of household income data
- `dateParse`, which we use for parsing dates
- `cleanSalary`, which parses each row of salary data
- `cleanUSStateName`, which parses US state names

{crop-start: 5, crop-end: 43, format: javascript}
![Data parsing functions](code_samples/es6v2/DataHandling.js)

You'll see those `d3` and `lodash` imports a lot. [@Swizec: Should you mention those imports in the list?]

The data parsing functions all follow the same approach: Take a row of data as `d`, return a dictionary with nicer key names, and cast any numbers or dates into appropriate formats. They all come in as strings.

Doing the parsing and the nicer key names now makes the rest of our codebase simpler because we don't have to deal with this all the time. For example, `entry.job_title`{format: javascript} is nicer to read and type than `entry['job title']`{format: javascript}.

## Step 3: Load the datasets

Now that we have our data parsing functions, we can use D3 to load the data with Ajax requests.

{crop-start: 47, crop-end: 58, format: javascript}
![Data loading](code_samples/es6v2/DataHandling.js)

Here you can see another ES6 trick: default argument values. If `callback` is false, we set it to `_.noop` - a function that does nothing. This lets us later call `callback()` without worrying whether it was given as an argument.

`d3.queue` lets us call multiple asynchronous functions and wait for them all to finish. By default, it runs all functions in parallel, but that's configurable through an argument - `d3.queue(1)` for one at a time, `2` for two, etc. In our case, without an argument, it runs all tasks in parallel.

We define 5 tasks to run with `.defer` then wait for them to finish with `.await`. The tasks themselves are D3's data loading functions that fire an Ajax request to the specified URL, parse the data into a JavaScript dictionary, and use the given row parsing function to polish the result.

For instance, `.defer(d3.csv, 'data/county-median-incomes.csv', cleanIncomes)`{format: javascript}, uses `d3.csv` to make an Ajax request to `data/county-median-incomes.csv`, parses the CSV file into an array of JavaScript dictionaries, and uses `cleanIncomes` to further parse each row the way we specified earlier.

D3 supports formats like `json`, `csv`, `tsv`, `text`, and `xml` out of the box. You can make it work with custom data sources through the underlying `request` API.

PS: we're using the shortened salary dataset to make page reloads faster while building our project.

{#tie-datasets-together}
## Step 4: Tie the datasets together

If you put a `console.log` in the `.await` callback above, you'll see a bunch of data. Each argument - `us`, `countyNames`, `medianIncomes`, `techSalaries`, `USstateNames` - holds the entire parsed dataset from the corresponding file.

To tie them together and prepare a dictionary for `setState` back in the `App` component, we need to add a little big of logic. We're going to build a dictionary of county household incomes and remove any empty salaries.

{crop-start: 63, crop-end: 90, format: javascript}
![Tie the datasets together](code_samples/es6v2/DataHandling.js)

The first line should be one of those `cleanX` functions like we had above. I'm not sure how I missed it.

Then we have the county median income map building. It looks like weird code because of the indentation, but it's not that bad. We `filter` the `medianIncomes` array to discard any incomes whose `countyName` we can't find. I made sure all the names are unique when I was building the datasets.

We use `forEach` to walk through the filtered array, find the correct `countyID`, and add the entry to `medianIncomesMap`. When we're done, we have a large dictionary that maps county ids to their household income data.

At the end, we filter `techSalaries` to remove any empty values - the `cleanSalaries` function returns `null` when a salary is either undefined or absurdly high.

Then we call `callback` with a dictionary of the new datasets. To make future access quicker, we use `_.groupBy` to build dictionary maps of counties by county name and by US state.

You should now see how many salary entries the shortened dataset contains.

![Data loaded screenshot](images/es6v2/data-loaded-screenshot.png)

If that didn't work, try comparing your changes to this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/9f113cdd3bc18535680cb5a4e87a3fd45743c9ae).

{#choropleth-map}
# Render a choropleth map of the US

Now that we have our data, it's time to start drawing pictures - a choropleth map. That's a map that uses colored geographical areas to encode data.

In this case, we're going to show the delta between median household salary in a statistical county and the average salary of a single tech worker on a visa. The darker the blue, the higher the difference.

![Choropleth map with shortened dataset](images/es6v2/choropleth-map-shortened-dataset.png)

There's a lot of gray on this map because the shortened dataset doesn't span that many counties. There's going to be plenty in the full choropleth too, but not as much as there is here.

Turns Out™ immigration visa opportunities for techies aren't evenly distributed throughout the country. Who knew?

Just like before, we're going to start with changes in our `App` component, then build the new bit. This time, a `CountyMap` component spread into three files:

- `CountyMap/index.js`, to make imports easier
- `CountyMap/CountyMap.js`, for overall map logic
- `CountyMap/County.js`, for individual county polygons

## Step 1: Prep App.js

You might guess the pattern already: add an import, add a helper method or two, update `render`.

{crop-start: 119, crop-end: 126, format: javascript}
![Import CountyMap component](code_samples/es6v2/App.js)

That imports the `CountyMap` component from `components/CountyMap/`. Until we're done, your browser should show an error overlay about some file or another not existing.

In the `App` class itself, we add a `countyValue` method. It takes a county entry and a map of tech salaries, and it returns the delta between median household income and a single tech salary.

{crop-start: 129, crop-end: 144, format: javascript}
![App.countyValue method](code_samples/es6v2/App.js)

We use `this.state.medianIncomes` to get the median household salary and the `techSalariesMap` input to get salaries for a specific census area. Then we use `d3.median` to calculate the  median value for salaries and return a two-element dictionary with the result.

`countyID` specifies the county and `value` is the delta that our choropleth displays.

In the `render` method, we'll do three things:

 - prep a list of county values
 - remove the "data loaded" indicator
 - render the map

{crop-start: 146, crop-end: 183, format: javascript}
![Render the CountyMap component](code_samples/es6v2/App.js)

We call our dataset `filteredTechSalaries` because we're going to add filtering in the [subchapter about adding user controls](#user-controls). Using the proper name now means less code to change later. The magic of foresight :)

We use `_.groupBy` to build a dictionary mapping each `countyID` to an array of salaries, and we use our `countyValue` method to build an array of counties for our map.

We set `zoom` to `null` for now. This also will come into effect later.

In the `return` statement, we remove the "data loaded" indicator, and we add an `<svg>` element that's `1100` pixels wide and `500` pixels high. Inside, we put the `CountyMap` component with a bunch of properties. Some dataset stuff, some sizing and positioning stuff.

## Step 2: CountyMap/index.js

We use `index.js` for one reason alone: to make imports and debugging easier. I learned this lesson the hard way so you don't have to.

{format: javascript}
![CountyMap index.js](code_samples/es6v2/components/CountyMap/index.js)

We export the default import from `./CountyMap.js`. That's it.

This allows us to import `CountyMap` from the directory without knowing about internal file structure. We *could* put all the code in this `index.js` file, but then stack traces are hard to read.

Putting a lot of code into `<directory>/index.js` files means that when you're looking at a stack trace, or opening different source files inside the browser, they're all going to be named `index.js`. Life is easier when components live inside a file named the same as the component you're using.

## Step 3: CountyMap/CountyMap.js

Now here comes the fun part - declaratively drawing a map. You'll see why I love using React for dataviz.

We're using the [full-feature integration](#full-feature-integration) and a lot of D3 magic for maps. I'm always surprised by how little code it takes to draw a map with D3.

Start with the imports: React, D3, lodash, topojson, the County component.

{crop-start: 5, crop-end: 12, format: javascript}
![Import CountyMap dependencies](code_samples/es6v2/components/CountyMap/CountyMap.js)

Out of these, we haven't built `County` yet, and you haven't seen `topojson` before. It's a way of defining geographical data with JSON. We're going to use the `topojson` library to translate our geographical datasets into GeoJSON, which is another way of defining geo data with JSON.

I don't know why there are two, but TopoJSON produces smaller files, and GeoJSON can be fed directly into D3's geo functions. ¯\\_(ツ)_/¯

Maybe it's a case of [competing standards](https://xkcd.com/927/).

### Constructor

Let's stub out the `CountyMap` component then fill it in with logic.

{crop-start: 13, crop-end: 40, format: javascript}
![CountyMap stub](code_samples/es6v2/components/CountyMap/CountyMap.js)

We'll set up default D3 state in `constructor` and keep it up to date in `updateD3`. To avoid repetition, we call `updateD3` in the constructor as well.

We need three D3 objects to build a choropleth map: a geographical projection, a path generator, and a quantize scale for colors.

{crop-start: 46, crop-end: 59, format: javascript}
![D3 objects for a map](code_samples/es6v2/components/CountyMap/CountyMap.js)

You might remember geographical projections from high school geography. They map a sphere to a flat surface. We use `geoAlbersUsa` because it's made specifically to draw maps of the USA.

You can see the other projections D3 offers on the [d3-geo Github page](https://github.com/d3/d3-geo#projections).

The `geoPath` generator takes a projection and returns a function that generates the `d` attribute of `<path>` elements. This is the most general way to specify SVG shapes. I won't go into explaining the `d` here, but it's [an entire DSL](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).

`quantize` is a D3 scale. We've mentioned the basics of scales in the [D3 Axis example](#blackbox-axis). This one splits a domain into 9 quantiles and assigns them specific values from the `range`.

Let's say our domain goes from 0 to 90. Calling the scale with any number between 0 and 9 would return 1. 10 to 19 returns 2 and so on. We'll use it to pick colors from an array.

### updateD3

Keeping all of this up-to-date is easy, but we'll make it harder by adding a zoom feature. It won't work until we implement the filtering, but hey, we'll already have it by then! :D

{crop-start: 65, crop-end: 91, format: javascript}
![CountyMap updateD3](code_samples/es6v2/components/CountyMap/CountyMap.js)

There's a lot going on here.

The first part is okay. It `translates` (i.e. moves) the projection to the center of our drawing area and sets a scale property. The value was discovered experimentally and is different for every projection.

Then we do some weird stuff if `zoom` is defined.

We get the list of all US state features in our geo data, find the one we're `zoom`-ing on, and use the `geoPath.centroid` method to calculate its center point. This gives us a new coordinate to `translate` our projection onto.

The calculation in `.translate()` helps us align the center point of our `zoom` US state with the center of the drawing area.

While all of this is going on, we also tweak the `.scale` property to make the map bigger. This creates a zooming effect.

At the end of the `updateD3` function, we update the quantize scale's domain with new values. Using `d3.quantile` lets us offset the scale to produce a more interesting map. The values were discovered experimentally - they cut off the top and bottom of the range because there isn't much there. This brings higher contrast to the richer middle of the range.

### render

After all of that work, the `render` method is a breeze. We prep the data then loop through it and render `County` elements.

{crop-start: 93, crop-end: 122, format: javascript}
![CountyMap render](code_samples/es6v2/components/CountyMap/CountyMap.js)

We use the topojson library to grab data out of the `usTopoJson` dataset. `.mesh` calculates a mesh for US states - a thin line around the edges. `.feature` calculates the features for each county - fill in with color.

Mesh and feature aren't tied to states or counties by the way. It's just a matter of what you get back: borders or flat areas. What you need depends on what you're building.

We use `_.fromPairs` to build a dictionary that maps county identifiers to their values. Building it beforehand makes our code faster. You can read some details about the speed optimizations [here](https://swizec.com/blog/optimizing-react-choropleth-map-rendering/swizec/7302).

As promised, all we have to do in the `return` statement is loop through the list of `counties` and render `County` components. Each gets a bunch of attributes and will return a `<path>` element that looks like a specific county.

For the US state borders, we use a single `<path>` element and use `this.geoPath` to generate the `d` property.

## Step 4: CountyMap/County.js

The `County` component itself is built out of two parts: imports and color constants, and a component that returns a `<path>`. We did all the hard calculation work in `CountyMap`.

{crop-start: 5, crop-end: 22, format: javascript}
![Imports and color constants](code_samples/es6v2/components/CountyMap/County.js)

We import React and lodash, then define some color constants. I got the `ChoroplethColors` from some example online, and `BlankColor` is a pleasant gray.

Now we need the `County` component itself.

{crop-start: 27, crop-end: 51, format: javascript}
![County component](code_samples/es6v2/components/CountyMap/County.js)

The `render` method uses the `quantize` scale to pick the right color and returns a `<path>` element. `geoPath` generates the `d` attribute, we set style to `fill` the color, and we give our path a `title`.

`shouldComponentUpdate` is more interesting. It's a React lifecycle method that lets us specify which prop changes are relevant to our component re-rendering.

`CountyMap` passes complex props - `quantize`, `geoPath`, and `feature` - which are pass-by-reference instead of pass-by-value. That means React can't see when they produce different values, just when they are different instances.

This can lead to all 3,220 counties re-rendering every time a user does anything. But they only have to re-render if we change the map zoom or if the county gets a new value.

Using `shouldComponentUpdate` like this we can go from 3,220 DOM updates to the order of a few hundred. Big improvement in speed.

---

And with that, your browser should show you a map.

![Choropleth map with shortened dataset](images/es6v2/choropleth-map-shortened-dataset.png)

Turns out tech job visas just aren't that well distributed geographically. Most counties come out grey even with the full dataset.

If that didn't work, consult [this diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/f4c1535e9c9ca4982c8f3c74cff9f739eb08c0f7).

{#histogram-of-salaries}
# Render a Histogram of salaries

Knowing the median salary is great and all, but it doesn't tell you much about what you can expect. You need to know the distribution to see if it's more likely you'll get 140k or 70k.

That's what histograms are for. Give them a bunch of data and they show its distribution. We're going to build one like this:

![Basic histogram](images/es6v2/basic-histogram.png)

In the shortened dataset, 35% of tech salaries fall between $60k and $80k, 26% between $80k and $100k etc. Throwing a random dice using this as your [random distribution](https://en.wikipedia.org/wiki/Probability_distribution), you're far more likely to get 60k-80k than 120k-140k. Turns out this is a great way to gauge situations.

It's where fun statistics like "More people die from vending machines than shark attacks" come from. Which are you afraid of, vending machines or sharks? Stats say your answer should be [heart disease](https://www.cdc.gov/nchs/fastats/deaths.htm). ;)

Anyway, let's build a histogram. We'll start with changes in `App.js`, make a `Histogram` component using the [full-feature approach](#full-feature-integration), then add an `Axis` using the [blackbox HOC approach](#blackbox-hoc). We're also going to add some CSS, finally.

## Step 1: Prep App.js

You know the drill don't you? Import some stuff, add it to the `render()` method in our `App` component.

{crop-start: 190, crop-end: 204, format: javascript}
![Histogram imports](code_samples/es6v2/App.js)

We import `App.css` and the `Histogram` component. That's what I love about using Webpack - you can import CSS in JavaScript. We got the setup with `create-react-app`.

There are different schools of thought about how CSS should be used. Some say each component should have its own CSS files and that that's the whole reason we want JS-based imports anyway. Others think we shouldn't use CSS at all and should do styling in JavaScript.

Me, I don't know. I like the idea of components coming with their own styling, but I find that makes them less reusable. Apps often want to specify their own styling.

Maybe a combination of default per-component styling and app-level overrides? Depends on your use case I guess.

With the imports done, we can add `Histogram` to `App`'s render method.

{crop-start: 205, crop-end: 235, format: javascript}
![Render Histogram in App](code_samples/es6v2/App.js)

We render the `Histogram` component with a bunch of props. They specify the dimensions we want, positioning, and pass data to the component. We're using `filteredSalaries` even though we haven't set up the filtering yet. One less line of code to change later :)

That's it. `App` is ready to render our `Histogram`.

Your browser should now show an error complaining about missing files.

{#histogram-css}
## Step 2: CSS changes

As mentioned, opinions vary on the best way to do styling in React apps. Some say stylesheets per component, some say styling inside JavaScript, others swear by global app styling.

The truth is somewhere in between. Do what best fits your project and team. We're going to stick to global stylesheets because it's simplest.

Start by emptying out `src/App.css`. All that came with `create-react-app` must go. We don't need it.

Then add these 29 lines:

{crop-start: 4, crop-end: 33, format: css}
![App.css stylesheet](code_samples/es6v2/App.css)

We won't go into details about CSS here. Many better books have been written about it.

Generally speaking, we're making `.histogram` rectangles – the bars – blue, and labels white `12px` font. `button`s and `.row`s have some spacing. This for the user controls we'll add. And the `.mean` line is a dotted grey with grey `11px` text.

Yes, this is more CSS than we need for just the histogram. We're already here, might as well add it.

Adding our CSS before building the Histogram means it's going to look beautiful the first time around.

## Step 3: Histogram component

We're following the [full-feature integration](#full-feature-integration) approach for our Histogram component. React talks to the DOM, D3 calculates the props.

We'll use two components:
1. `Histogram` handles the general layout, dealing with D3, and translating raw data into a histogram
2. `HistogramBar` draws a single bar and labels it

Let's start with the basics, a `Histogram` directory and an `index.js` file. It makes importing easier while keeping our code organized. I like to use dirs for components made out of multiple files.

{crop-start: 5, crop-end: 8, format: javascript}
![Histogram index.js](code_samples/es6v2/components/Histogram/index.js)

Import `Histogram` from `./Histogram` and export it as the `default` export. You could do it with a re-export: `export { default } from './Histogram'`. Not sure why I picked the long way. It's not much more readable.

Great, now we need the `Histogram.js` file. We start with some imports, a default export, and a stubbed out `Histogram` class.

{crop-start: 5, crop-end: 33, format: javascript}
![Histogram component stub](code_samples/es6v2/components/Histogram/Histogram.js)

We need React and D3, and we set up `Histogram`. The `constructor` calls React's base constructor using `super()`, and defers to `updateD3` to init default D3 properties. `componentWillReceiveProps` defers to `updateD3` to ensure D3 state stays in sync with React, and we'll use `makeBar` and `render` to render the SVG.

{class: discussion}
{blurb}
A note about D3 imports: D3v4 is split into multiple packages. We're using a `*` import here to get everything, because that's easier to use. You should import specific packages when possible . It leads to smaller compiled code sizes and makes it easier for you and others to see what each file is using.
{/blurb}

### constructor

Now we should add D3 object initialization to the `constructor`. We need a D3 histogram and two scales. One for chart width and one for vertical positioning.

{crop-start: 35, crop-end: 48, format: javascript}
![D3 initialization in Histogram constructor](code_samples/es6v2/components/Histogram/Histogram.js)

We've talked about scales before. Put in a number, get out a number. In this case we're using linear scales for sizing and positioning.

`d3.histogram` is new in D3v4. It's a generator that takes a dataset and returns a histogram-shaped dataset. An array of arrays where the top level are bins and meta data, and the children are "values in this bin".

You might know it as `d3.layout.histogram` from D3v3. I think the updated API is easier to use. You'll see what I mean in the `updateD3` method.

### updateD3

{crop-start: 54, crop-end: 72, format: javascript}
![updateD3 method in Histogram](code_samples/es6v2/components/Histogram/Histogram.js)

First, we configure the `histogram` generator. We use `thresholds` to specify how many bins we want, and `value` to specify a value accessor function. We get both from props passed into the `Histogram` component.

In our case that's 20 bins and the value accessor returns each data point's `base_salary`.

Then we call `this.histogram` on our dataset and use a `.map` to get an array of bins and count how many values went in each. We need them to configure our scales.

If you print the result of `this.histogram()`, you'll see an array structure where each entry holds metadata about the bin, and the values it contains.

![console.log(this.histogram())](images/es6v2/histogram-data-screenshot.png)

We use this data to set up our scales. 

`widthScale` has a range from the smallest (`d3.min`) bin to the biggest (`d3.max`), and a range of `0` to width less a margin. We'll use it to calculate bar sizes.

`yScale` has a range from `0` to the biggest `x1` coordinate we can find in a bin. Bins go from `x0` to `x1`, which reflects the fact that most histograms are horizontally oriented. Ours is vertical so labels are easier to read. The range goes from `0` to the maximum height less a margin.

Now let's render this puppy.

### render

{crop-start: 78, crop-end: 92, format: javascript}
![Histogram.render](code_samples/es6v2/components/Histogram/Histogram.js)

We set up a `translate` SVG transform and run our histogram generator. Yes, that means we're running it twice for every update. Once in `updateD3` and once in `render`.

I tested making it more efficient, and didn't see much improvement in overall performance. It did make the code more complex, though.

Our render method returns a `<g>` grouping element transformed to the position given in props and walks through the `bars` array, calling `makeBar` for each. Later we're going to add an `Axis` as well.

This is a great example of React's declarativeness. We have a bunch of stuff and all it takes to render is a loop. No worrying about how it renders, where it goes, or anything like that. Walk through data, render, done.

### makeBar

`makeBar` is a function that takes a histogram bar's metadata and returns a `HistogramBar` component. We use it to make the declarative loop more readable.

{crop-start: 98, crop-end: 114, format: javascript}
![Histogram.makeBar](code_samples/es6v2/components/Histogram/Histogram.js)

See, we're calculating `props` and feeding them into `HistogramBar`. Putting it in a separate function just makes the `.map` construct in `render` easier to read. There's a lot of props to calculate.

Some, like `axisMargin` we pass through, others like `width` and `height` we calculate using our scales.

Setting the `key` prop is important. React uses it to tell the bars apart and only re-render those that change.

## Step 4: HistogramBar (sub)component

Before we can see the histogram, we need another component: `HistogramBar`. We *could* have shoved all of it in the `makeBar` function, but I think it makes sense to keep it separate.

I like to put subcomponents like this in the same file as the main component. You can put it in its own file, if you feel that's cleaner. You'll have to add an `import` if you do that.

{crop-start: 120, crop-end: 150, format: javascript}
![HistogramBar component](code_samples/es6v2/components/Histogram/Histogram.js)

As far as functional stateless components go, this one's pretty long. Most of it goes into deciding how much precision to render in the label, so it's okay.

We start with an SVG translate – you'll see this a lot – and a default `label`. Then we update the label based on the bar size and its value.

When we have a label we like, we return a `<g>` grouping element with a rectangle and a text. Both positioned based on the `width` and `height` of the bar.

You should now see a histogram.

![Histogram without axis](images/es6v2/histogram-without-axis.png)

## Step 5: Axis HOC

Our histogram is pretty, but needs an axis to be useful. You've already implemented an axis when we talked about [blackbox integration](#blackbox-axis). We're going to use the same approach and copy those concepts into the real project.

### D3blackbox

We start with the D3blackbox higher order component. Same as before, except we put it in `src/components`. Then again, I should probably just suck it up and make an npm package for it.

{crop-start: 5, crop-end: 18, format: javascript}
![D3blackbox HOC](code_samples/es6v2/components/D3blackbox.js)

Take a `D3render` function, call it on `componentDidMount` and `componentDidUpdate` to keep things in sync, and render a positioned anchor element for `D3render` to hook into.

### Axis component

With `D3blackbox`, we can reduce the `Axis` component to a wrapped function. We're implementing the `D3render` method.

{crop-start: 5, crop-end: 19, format: javascript}
![Axis component using D3blackbox](code_samples/es6v2/components/Histogram/Axis.js)

We use D3's `axisLeft` generator, configure its `tickFormat`, give it a `scale` to use, and specify how many `ticks` we want. Then `select` the anchor element rendered by `D3blackbox`, and `call` the axis generator on it.

Yes, this `Axis` works only for our specific use case. That's okay! No need to make things general when you're using them only once.

### Add it to Histogram

To render our new `Axis`, we have to add it to the `Histogram` component. The process takes two steps:

1. Import `Axis` component
2. Render it

{crop-start: 155, crop-end: 183, format: javascript}
![Import and render Axis](code_samples/es6v2/components/Histogram/Histogram.js)

We import our `Axis` component and add it to `Histogram`'s `render` method with some props. It takes an `x` and `y` coordinate, the `data`, and a `scale`.

An axis appears.

![Basic histogram with axis](images/es6v2/basic-histogram.png)

If that didn't work, try comparing your changes to this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/02a40899e348587a909e97e8f18ecf468e2fe218).

# Make it understandable - meta info

You've come so far! There's a US map and a histogram. They're blue and shiny and you look at them and you go *"Huh?"*.

The key to a good data visualization is telling users what it means. You can do that with a title and a description. Just tell them. The picture is there to give support to the words. The words are there to tell you what's in the picture.

Let's add those words.

We're adding a dynamic title and description, and a median line on the histogram. Dynamic because we're adding user controls later and we want the pictures and the words to stay in sync.

At the end of this section, you'll have a full visualization of the shortened dataset.

![Full visualization without user controls](images/es6v2/dataviz-without-controls.png)

## Dynamic title

We begin with the title because it shows up first.

We start with an import in `App.js` and add it to the render method. You know the drill :)

{crop-start: 241, crop-end: 274, format: javascript}
![Adding Title to main App component](code_samples/es6v2/App.js)

Ok I lied. We did a lot more than just imports and adding a render.

We also set up the `App` component for future user controlled data filtering. The `filteredBy` key in `state` tells us what the user is filtering by. There 3 options: `USstate`, `year`, and `jobTitle`. We set them to "everything" by default.

We added them now so that we can immediately write our `Title` component in a filterable way. Means we don't have to make changes later.

As you can see, the props `Title` takes are `data` and `filteredBy`.

### Prep Meta component

Before we begin the `Title` component, there's a few things to take care of. Our meta components work together for a common purpose – showing meta data. Grouping them in a directory makes sense.

So we make a `components/Meta` directory and add an `index.js`. It makes importing easier.

{crop-start: 5, crop-end: 6, format: javascript}
![Meta index.js](code_samples/es6v2/components/Meta/index.js)

You're right, using re-exports looks better than the roundabout way we used in `Histogram/index.js`. Lesson learned.

You need the `USStatesMap` file as well. It translates US state codes to full names. You should [get it from Github](https://github.com/Swizec/react-d3js-step-by-step/blob/4f94fcd1c3caeb0fc410636243ca99764e27c5e6/src/components/Meta/USStatesMap.js) and save it as `components/Meta/USStatesMap.js`. 

We'll use it when creating titles and descriptions.

### Implement Title

We're building two types of titles based on user selection. If both `years` and `US state` were selected, we return `In {US state}, the average {job title} paid ${mean}/year in {year}`. If not, we return `{job title} paid ${mean}/year in {state} in {year}`.

I know, it's confusing. They look like the same sentence turned around. Notice the *and*. First option when *both* are selected, second when either or.

We start with imports, a stub, and a default export.

{crop-start: 5, crop-end: 29, format: javascript}
![Title component stub](code_samples/es6v2/components/Meta/Title.js)

We import only what we need from D3's `d3-scale` and `d3-array` packages. I consider this best practice until you're importing so much that it gets messy to look at.

In the `Title` component we have 4 getters and a render. Getters are ES6 functions that work like dynamic properties. You specify a function without arguments, and use it without `()`. It's pretty neat.

#### The getters

1. `yearsFragment` describes the selected year
2. `USstateFragment` describes the selected US state
3. `jobTitleFragment` describes the selected job title
4. `format` returns a number formatter

We can implement `yearsFragment`, `USstateFragment`, and `format` in one code sample. They're short.

{crop-start: 35, crop-end: 55, format: javascript}
![3 short getters in Title](code_samples/es6v2/components/Meta/Title.js)

In both `yearsFragment` and `USstateFragment`, we get the appropriate value from Title's `filteredBy` prop, then return a string with the value, or an empty string. 

We rely on D3's built-in number formatters to build `format`. Linear scales have the one that turns `10000` into `10,000`. Tick formatters don't work well without a `domain`, so we define it. We don't need a range because we never use the scale itself.

`format` returns a function, which makes it a [higher order function](https://en.wikipedia.org/wiki/Higher-order_function). Being a getter makes it really nice to use: `this.format()`. Looks just like a normal function call :D

The `jobTitleFragment` getter is conceptually no harder than `yearsFragment` and `USstateFragment`, but comes with a few more conditionals.

{crop-start: 61, crop-end: 91, format: javascript}
![Title.jobTitleFragment](code_samples/es6v2/components/Meta/Title.js)

Ho boy, so many ifs.

We're dealing with the `(jobTitle, year)` combination. Each influences the other when building the fragment, for a total 4 different options.

#### The render

We put all this together in the `render` method. A conditional decides which of the two situations we're in, and we return an `<h2>` tag with the right text.

{crop-start: 96, crop-end: 119, format: javascript}
![Title.render](code_samples/es6v2/components/Meta/Title.js)

Calculate the mean value using `d3.mean` with a value accessor, turn it into a pretty number with `this.format`, then use one of two string patterns to make a `title`.

And a title appears.

![Dataviz with title](images/es6v2/dataviz-with-title.png)

If it doesn't, consult [this diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/4f94fcd1c3caeb0fc410636243ca99764e27c5e6).

## Dynamic description

You know what, the dynamic description component is pretty much the same as the title. Just longer and more complex and using more code. It's interesting, but not super relevant to the topic of this book.

So rather than explain it all here, I'm going to give you a link to the [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/032fe6e988b903b6d86a60d2f0404456785e180f)

We use the same approach as before:

1. Add imports in `App.js`
2. Add component to `App` render
3. Add re-export to `components/Meta/index.js`
4. Implement component in `components/Meta/Description.js`
5. Use getters for sentence fragments
6. Play with conditionals to construct different sentences

142 lines of mundane code. 

All the interesting complexity goes into finding the richest city and county. That part looks like this:

```javascript
const byCounty = _.groupBy(this.props.data, 'countyID'),
      medians = this.props.medianIncomesByCounty;

let ordered = _.sortBy(
    _.keys(byCounty)
     .map(county => byCounty[county])
     .filter(d => d.length/this.props.data.length > 0.01),
    items => d3mean(items,
                    d => d.base_salary) - medians[items[0].countyID][0].medianIncome);

let best = ordered[ordered.length-1],
    countyMedian = medians[best[0].countyID][0].medianIncome;
```

We group the dataset by county, then sort counties by their income delta. We look only at counties that are bigger than 1% of the entire dataset. And we define income delta as the difference between a county's median household income and the median tech salary in our dataset.

Now that I think about it, this is not very efficient. We should've just looked for the maximum value. That would've been faster, but hey, it works :)

We use basically the same process to get the best city.

Yes, you're right. These should both have been separate functions. Putting them in the `countyFragment` method smells funny.

If you follow along the [description Github diff](https://github.com/Swizec/react-d3js-step-by-step/commit/032fe6e988b903b6d86a60d2f0404456785e180f), or copy pasta, your visualization should now have a description.

![Dataviz with Title and Description](images/es6v2/dataviz-with-description.png)

Another similar component is the `GraphDescription`. It shows a small description on top of each chart that explains how to read the picture. Less "Here's a key takeaway" more "color means X".

You can follow this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/37b5222546c3f8f58f3147ce0bef6a3c1afe1b47) to implement it. Same approach as `Title` and `Description`.

![Dataviz with all descriptions](images/es6v2/dataviz-with-all-descriptions.png)

## Median household line

Now here's a more interesting component, the median dotted line. It gives us a direct comparison between the histogram's distribution and the median household income in an area. I'm not sure people understand it at a glance, but I think it's cool.

We're using the [full-feature integration](#full-feature-integration) approach, and prepping `App.js` first, then implementing the component.

### Step 1: App.js

Inside `src/App.js`, we first have to add an import, then extract the median household value from state, and in the end, add `MedianLine` to the render method.

Let's see if we can do it in a single code block :)

{crop-start: 281, crop-end: 315, format: javascript}
![Adding MedianLine to App.js](code_samples/es6v2/App.js)

You probably don't remember `medianIncomesByUSState` anymore. We set it up way back when [tying datasets together](#tie-datasets-together). It groups our salary data by US state.

See, using good names helps :)

When rendering `MedianLine`, we give it sizing and positioning props, the dataset, a `value` accessor, and the median value to show. Yes, we can make it smart enough to calculate the median, but the added flexibility of a prop felt right.

### Step 2: MedianLine

The `MedianLine` component looks a lot like what you're already used to. Some imports, a `constructor` that sets up D3 objects, an `updateD3` method that keeps them in sync, and a `render` method that outputs SVG.

{crop-start: 5, crop-end: 32, format: javascript}
![MedianLine component stub](code_samples/es6v2/components/MedianLine.js)

Standard stuff, right? You've seen it all before. Bear with me, please. I know you're great, but I gotta explain this for everyone else :)

We have the base wiring for a D3-enabled component, and we set up a linear scale that we'll use for vertical positioning. The scale has a `domain` from `0` to `max` value in dataset, and a range from `0` to height less margins.

{crop-start: 38, crop-end: 58, format: javascript}
![MedianLine render](code_samples/es6v2/components/MedianLine.js)

We use the median value from props, or calculate our own, if needed. Just like I promised.

We also set up a `translate` SVG transform and the `medianLabel`. The return statement builds a `<g>` grouping element, transformed to our desired position, containing a `<text>` for our label, and a `<path>` for the line.

But how we get the `d` attribute for the path, that's interesting. We use a `line` generator from D3.

```javascript
line = d3.line()([[0, 5],
                  [this.props.width, 5]]);
```

It comes from the [d3-shape](https://github.com/d3/d3-shape#lines) package and generates splines, or polylines. By default it takes an array of points and builds a line through all of them. A line from `[0, 5]` to `[width, 5]` in our case.

That makes it span the entire width and leaves 5px of room for the label. We're using a `transform` on the entire group to vertically position the final element.

We're using `d3.line` in the most basic way possible, but it's really flexible. You can even build curves.

Remember, we styled the `medianLine` when we did [histogram styles](#histogram-css) earlier.

```css
.mean text {
    font: 11px sans-serif;
    fill: grey;
}

.mean path {
    stroke-dasharray: 3;
    stroke: grey;
    stroke-width: 1px;
}
```

The `stroke-dasharray` is what makes it dashed. `3` means each `3px` dash is followed by a `3px` blank. You can use [any pattern you like](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray).

You should now see a median household salary line overlaid on  your histogram.

![Median line over histogram](code_samples/es6v2/dataviz-with-everything.png)

Yep, almost everyone in tech makes more than the median household. Crazy huh? I think it is.

If that didn't work, consult the [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/1fd055e461184fb8dc8dd509edb3a6a683c995fe).

{#user-controls}
# Add user controls for data slicing and dicing

Now comes the fun part. All that extra effort we put into making our components aware of filtering. It all comes down to this: User controls.

Here's what we're building:

![User controlled filters](code_samples/es6v2/controls.png)

A set of filters for users to slice and dice our visualization. The shortened dataset gives you 2 years, 12 job titles, and 50 US states. You'll get 5 years and many more job titles with the full dataset.

We're using the [architecture we discussed](#basic-architecture) earlier to make it work. Clicking buttons updates a filter function and communicates it all the way up to the `App` component. `App` then uses it to update `this.state.filteredSalaries`, which triggers a re-render and updates our dataviz.

![Architecture sketch](images/es6v2/architecture_callbacks.jpg)

We're building in 4 steps, top to bottom:

1. Update `App.js` with filtering and a `<Controls>` render
2. Build a `Controls` component, which builds the filter based on inputs
3. Build a `ControlRow` component, which handles a row of buttons
4. Build a `Toggle` component, which is a button

We'll go through the files linearly. Makes them easier for me to explain, easier for you to understand, but means there's going to be a long period where all you're seeing is an error like this:

![Controls error during coding](images/es6v2/controls-error.png)

If you want to see what's up during this process, just remove an import or two and maybe a thing from render. For instance, it's complaining about `ControlRow` in this screenshot. Remove the `ControlRow` import on top, and delete `<ControlRow ... />` from render. Error goes away and you see what you're doing.

## Step 1: Update App.js

All right, you know the drill. Add imports, tweak some things, add to render. We have to import `Controls`, set up filtering, update the map's `zoom` prop, and render a white rectangle and `Controls`.

The white rectangle makes it so the zoomed-in map doesn't cover up the histogram. I'll explain when we get there.

{crop-start: 321, crop-end: 354, format: javascript}
![Imports and filter updates in App.js](code_samples/es6v2/App.js)

We import the `Controls` component and add a default `salariesFilter` function to `this.state`. The `updateDataFilter` method passes the filter function and `filteredBy` dictionary from arguments to App state. We'll use it as a callback in `Controls`.

The rest of filtering setup happens in the render method.

{crop-start: 360, crop-end: 388, format: javascript}
![Filtering data and updating map zoom in App render](code_samples/es6v2/App.js)

We add a `.filter` call to `filteredSalaries`, which uses our `salariesFilter` method to throw out anything that doesn't fit. Then we set up `zoom`, if a US state was selected.

We built the `CountyMap` component to focus on a given US state.  Finding the centroid of a polygon, re-centering the map, and increasing the sizing factor. Creates a nice zoom effect.

![Zoom effect](images/es6v2/zoom-effect.png)

And here's the downside of this approach. SVG doesn't know about element boundaries, it just renders stuff.

![Zoom without white rectangle](images/es6v2/zoom-without-rectangle.png)

See, it goes under the histogram. Let's fix that and add the `Controls` render while we're at it.

{crop-start: 394, crop-end: 421, format: javascript}
![](code_samples/es6v2/App.js)

Rectangle, `500` to the right, `0` from top, `600` wide and `500` tall, with a white background. Gives the histogram an opaque background so it doesn't matter what the map is doing.

We render the `Controls` component just after `</svg>` because it's not an SVG component – uses normal HTML. Unlike the other components, it needs our entire dataset as `data`. We use the `updateDataFilter` prop to say which callback function it should call when a new filter is ready.

If this seems roundabout, I guess it kinda is. But it makes our app easier to componentize and keeps the code relatively unmessy. Imagine putting everything we've done so far in `App`. What a mess that'd be! :D

## Step 2: Build Controls component

The `Controls` component builds our filter function and filteredBy dictionary based on what the user clicks.

It renders 3 rows of controls and builds filtering out of the singular choice each row reports. That makes the `Controls` component kind of repetitive and a leaky abstraction to boot.

In theory it would be better for each `ControlRow` to return a function and `Controls` built a composed function out of them. Better abstraction, but I think harder to understand.

We can live with a leaky abstraction and repetitive code. Right? :)

To keep the book from getting repetitive, we're going to build everything for a `year` filter first. Then I'll show you how to add `USstate` and `jobTitle` filters as well. Once you have one working, the rest is easy.

Make a `Controls` directory in `src/components/` and let's begin. The main `Controls` component goes in the `index.js` file.

### Stub Controls

{crop-start: 5, crop-end: 33, format: javascript}
![Controls stubbed for year filter](code_samples/es6v2/components/Controls/index.js)

We start with some imports and a `Controls` class. Inside, we define default `state` with an always-true `yearFilter` and an asterisk for `year`.

We also need an `updateYear` function, which we'll use to update the filter, a `reportUpdateUpTheChain` function called in `componentDidUpdate`, a `shouldComponentUpdate` check, and a `render` method.

Yes, we could have put everything in `reportUpdateUpTheChain` into `componentDidUpdate`. It's separate because the name is more descriptive that way. And I was experimenting with some optimizations that didn't pan out, but decided to keep the name.

I'll explain how it works and why we need `shouldComponentUpdate` after we implement the logic.

### Filter logic

{crop-start: 39, crop-end: 69, format: javascript}
![Year filtering logic in Controls](code_samples/es6v2/components/Controls/index.js)

When a user picks a year, the `ControlRow` components calls our `updateYearFilter` function where we build a new partial filter function. The `App` component uses it inside a `.filter` call so we have to return `true` for elements we want to keep, and `false` for elements we don't.

Comparing `submit_date.getFullYear()` with `year` achieves that. 

We use the `reset` argument to reset filters back to defaults, which allows users to unselect an option. 

When we have the `year` and `filter` we update component state with `this.setState`. This triggers a re-render and calls the `componentDidUpdate` method, which calls `reportUpdateUpTheChain`.

`reportUpdateUpTheChain` then calls `this.props.updateDataFilter`, which is a callback method on `App`. We defined it earlier – it needs a new filter method and a `filteredBy` dictionary.

The code looks tricky because we're playing with higher order functions. We're making a new arrow function that takes a dictionary of filters as an argument and returns a new function that `&&`s them all. We invoke it immediately with `this.state` as the argument.

It looks silly when there's just one filter, but I promise it makes sense.

Now, because we used `this.setState` to trigger a callback up component stack, and because that callback triggers a re-render in `App`, which might trigger a re-render down here ... because of that, we need `shouldComponentUpdate`. It prevents infinite loops. React isn't smart enough on its own because we're using complex objects in `state`.

{aside}
JavaScript's equality check compares objects on the reference level. So `{a: 1} == {a: 1}` returns `false` because the operands are different objects even though they look the same.
{/aside}

### Render

Great, we have the logic. We should render the rows of controls we've been talking about.

{crop-start: 75, crop-end: 93, format: javascript}
![Render the year ControlRow](code_samples/es6v2/components/Controls/index.js)

This is once more generalized code, but used for a single example. The `year` filter.

We build a `Set` of years in our dataset, then render a `ControlRow` using props to give it our `data`, a set of `toggleNames`, a callback to update the filter, and which entry is `picked` right now. This enables us to maintain the data-flows-down, events-bubble-up architecture we've been using.

If you don't know about `Set`s, they're new ES6 data structures that ensure every entry is unique. Just like a mathematical set. They're supposed to be pretty fast.

## Step 3: Build ControlRow component

Now let's build the `ControlRow` component. It renders a row of controls and ensures that only one at a time is selected.

We'll start with a stub and go from there.

{crop-start: 5, crop-end: 26, format: javascript}
![ControlRow stub](code_samples/es6v2/components/Controls/ControlRow.js)

We start with imports, big surprise, then make a stub with 5 methods. Can you guess what they are?

- `componentWillMount` sets up some initial state that needs props
- `componentWillReceiveProps` calls `makePick` if a pick is set from above
- `makePick` is the `Toggle` click callback
- `_addToggle` is a rendering helper method
- `render` renders a row of buttons

{crop-start: 53, crop-end: 72, format: javascript}
![State setup](code_samples/es6v2/components/Controls/ControlRow.js)

React triggers the `componentWillMount` lifecycle hook right before it first renders our component. Mounts it into the DOM, if you will. This is a opportunity for any last minute state setup.

We take the list of `toggleNames` from props and use Lodash's `zipObject` function to create a dictionary that we save in `state`. Keys are toggle names, values are booleans that tell us whether a particular toggle is currently picked.

You might think this is unnecessary, but it makes our app faster. Instead of running the comparison function for each toggle on every render, we build the dictionary, then perform quick lookups when rendering. Yes, `===` is a fast operator even with the overhead of a function call, but what if it was more complex? 

The habit of using appropriate data structures is a good habit. :)

In `componentWillReceiveProps`, we check if the `picked` value has changed, and if it has, we call `makePick` to mimic user action. This allows global app state to override local component state. It's what you'd expect in a unidirectional data flow architecture like the one we're using.

{crop-start: 32, crop-end: 47, format: javascript}
![makePick implementation](code_samples/es6v2/components/Controls/ControlRow.js)

`makePick` changes `state.toggleValues` when the user clicks a toggle. It takes two arguments: a toggle name and the new value.

We use Lodash's `mapValues` to iterate the `name: boolean` dictionary and construct a new one with updated values. Everything that isn't `picked` gets set to `false`, and the one `picked` item becomes `true`, if `newState` is `true`.

You're right if you think this is unnecessary. We could have just changed the current picked element to `false` and the new one to `true`. But I'm not entirely certain React would pick up on that. Play around and test it out :)

Next we have a case of a misleading comment. We're calling `props.updateDataFilter` to communicate filter changes up the chain. The comment is talking about `!newState` and why it's not `newState`. --> because the 2nd argument in `updateDataFilter` is called `reset`. We're only resetting filters if `newState` is false since that means a toggle was unclicked without a new one being selected.

Does that make sense? It's hard to explain without waving my arms around.

With `this.setState`, we update state and trigger a re-render, which highlights a new button as being selected.

{crop-start: 78, crop-end: 109, format: javascript}
![Render a row of controls](code_samples/es6v2/components/Controls/ControlRow.js)

Rendering happens in two functions: `_addToggle`, which is a helper, and `render`, which is the main render. 

In `render`, we set up two `div`s with Bootstrap classes. The first is a `row`, the second a full-width column. I tried using a column for each button, but it was annoying to manage and used too much space.

Inside the divs, we map over all toggles and use `_addToggle` to render each of them. 

`_addToggle` renders a `Toggle` component with a `label`, `name`, `value` and `onClick` callback. The label is just a prettier version of the name, which also serves as a key in our `toggleValues` dictionary. It's going to be the `picked` attribute in `makePick`.

Your browser should continue showing an error, but it should change to talking about the `Toggle` component instead of `ControlRow`.

![](images/es6v2/toggle-error.png)

Let's build it.

## Step 4: Build Toggle component

The last piece of the puzzle – the Toggle component. A button that turns on and off.

{crop-start: 5, crop-end: 28, format: javascript}
![Toggle component](code_samples/es6v2/components/Controls/Toggle.js)

As always, we start with the imports, and extend React's base Component to make a new one. Small components like this are often perfect candidates for functional stateless components, but we need the click handler.

`handleClick` calls the `onClick` callback given in props, using the `name` and `!value` to identify this button and toggle its value. 

`render` sets up a Bootstrap classname: `btn` and `btn-default` make an element look like a button, and the conditional `btn-primary` makes it blue. If you're not familiar with Bootstrap classes, you should check [their documentation](http://getbootstrap.com/).

Then we render a `<button>` tag and, well, that's it. A row of year filters appears in the browser.

![A row of year filters](images/es6v2/year-filter-row.png)

Our shortened dataset only spans 2012 and 2013. The full dataset goes up to 2016.

If that didn't work, consult this [diff on GitHub](https://github.com/Swizec/react-d3js-step-by-step/commit/a45c33e172297ca1bbcfdc76733eae75779ebd7f).

## Step 5: Add US state and Job Title filters

With all that done, we can now add two more filters: US states and job titles. Our `App` component is already set up to use them, we just have to add them to the `Controls` component.

We'll start with the `render` method, then handle the parts I said earlier would look repetitive.

{crop-start: 99, crop-end: 133, format: javascript}
![Adding two more rows to Controls](code_samples/es6v2/components/Controls/index.js)

Ok, this part is plenty repetitive too.

We create new sets for `jobTitles` and `USstates`, then rendered two more `ControlRow` elements with appropriate attributes. They get `toggleNames` for building the buttons, `picked` to know which is active, an `updateDataFilter` callback, and we tell US states to render capitalized.

The implementations of those `updateDataFilter` callbacks follow the same pattern as `updateYearFilter`.

{crop-start: 139, crop-end: 166, format: javascript}
![New updateDataFilter callbacks](code_samples/es6v2/components/Controls/index.js)

Yes, they're basically the as `updateYearFilter`. Only difference is a changed `filter` function and using different keys in `setState()`. 

Why separate functions then? No need to get fancy. It would've made the code harder to read.

Our last step is to add these new keys to the `reportUpdateUpTheChain` function.

{crop-start: 172, crop-end: 194, format: javascript}
![Add new filters to main state update](code_samples/es6v2/components/Controls/index.js)

We add them to the filter condition with `&&` and expand the `filteredBy` argument.

Two more rows of filters show up.

![All the filters](all-filters.png)

👏

Again, if it didn't work, consult [the diff on GitHub](https://github.com/Swizec/react-d3js-step-by-step/commit/a45c33e172297ca1bbcfdc76733eae75779ebd7f).

# A small speed optimization

We're expecting a big dataset and we're recalculating our data *and* redrawing hundreds of map elements all the time. We can fix this situation with a carefully placed `shouldComponentUpdate` to avoid updates when it shouldn't.

It goes in the main `App` component and performs a quick check for changes in the filters.

{crop-start: 427, crop-end: 443, format: javascript}
![shouldComponentUpdate in App.js](code_samples/es6v2/App.js)

We take current salaries and filters from `state` and compare them with future state, `nextState`. To guess changes in the salary data, we compare lengths, and to see changes in filters, we compare values for each key. 

This comparison works well enough and makes the visualization faster by avoiding unnecessary re-renders.

You shouldn't really notice any particular change with the shortened dataset, but if things break, consult the [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/b58218eb2f18d6ce9a789808394723ddd433ee1d).

# Rudimentary routing

Imagine this. A user finds your dataviz, clicks around, and finds an interesting insight. They share it with their friends.

*"See! I was right! This link proves it"*

*"Wtf are you talking about?"*

*"Oh ... uuuuh ... you have to click this and then that and then you'll see. I'm legit winning our argument"*

*"Holy shit! Kim Kardashian just posted a new snap with her weird dog"*

Let's help our intrepid user out and make the dataviz linkable. We should store the current `filteredBy` state in the URL and be able to restore from a link.

There are many ways to achieve this, [ReactRouter](https://github.com/ReactTraining/react-router) comes to mind, but the quickest is to implement our own rudimentary routing. We'll add some logic to manipulate and read the URL hash.

Easiest place to put this logic is next to the existing filter logic inside the `Controls` component. Better places exist from a "low-down components shouldn't play with global stuff" perspective, but that's okay.

{crop-start: 200, crop-end: 225, format: javascript}
![Adding rudimentary routing](code_samples/es6v2/components/Controls/index.js)

We use the `componentDidMount` lifecycle hook to read the URL when our component first renders on the page. Presumably when the page loads, but could be later. It doesn't really matter *when*, just that we update our filter the first chance we get.

`window.location.hash` gives us the hash part of the URL and we clean it up and split it into three parts: `year`, `USstate`, and `jobTitle`. If the URL is `localhost:3000/#2013-CA-manager`, then `year` becomes `2013`, `USstate` becomes `CA`, and `jobTitle` becomes `manager`.

We make sure each value is valid and use our existing filter update callbacks to update the visualization. Just like it was the user clicking a button.

In `componentDidUpdate` we now update the URL hash as well as call `reportUpdateUpTheChain`. Updating the hash just takes assigning a new value to `window.location.hash`.

You should now see the URL changing as you click around.

![Changing URL hash](images/es6v2/changing-url.png)

There's a bug with some combinations in 2013 that don't have enough data. It will go away when we use the full dataset.

If it doesn't work at all, consult the [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/2e8fb070cbee5f1e942be8ea42fa87c6c0379a9b).

# Prep for launch

You've built a great visualization. Congratz! It's time to put it online and share with the world. 

To do that, we're going to use Github pages because our app is a glorified static website. There's no backend so all we need is something to serve our HTML, JavaScript, and CSV. Github pages is perfect for that.

It's free, works well with `create-react-app`, and can withstand a lot of traffic. You don't want to worry about traffic when your app gets on top of HackerNews or Reddit.

There's a few things we should take care of:

- setting up deployment
- adding a page title
- adding some copy
- twitter and facebook cards
- an SEO tweak for search engines
- use the full dataset

## Setting up deployment

You'll need a Github repository. If you're like me, writing all this code without version control or off-site backup made you nervous and you already have one.

For everyone else, head over to Github, click the green `New Repository` button and give it a name. Then copy the commands it gives you and run them in your console.

It should be something like this:

```
$ git init
$ git commit -m "My entire dataviz"
$ git remote add origin git://github ...
$ git push origin -u master
```

If you've been git-ing locally without pushing, then you need only the `git remote add` and `git push origin` commands. This puts your code on Github. Great idea for anything you don't want to lose if your computer craps out.

Every Github repository comes with an optional Github pages setup. The easiest way for us to use it, is with the `gh-pages` npm module.

Install it with this command:

```
$ npm install --save-dev gh-pages
```

Add two lines to package.json:

```json
// package.json
// markua-start-insert
"homepage": "https://<your username>.github.io/<your repo name>"
// markua-end-insert
"scripts": {
	"eject": "react-scripts eject",
	// markua-start-insert
	"deploy": "npm run build && gh-pages -d build"
	// markua-end-insert
}
```

We've been ignoring the `package.json` file so far, but it's a pretty important file. It specifies all of our project's dependencies, meta data for npm, and scripts that we run locally. This is where `npm start` is defined, for instance.

We add a `deploy` script that runs `build` and a `gh-pages` deploy, and specify a `homepage` URL. The URL tells our build script how to set up URLs for static files in `index.html`.

Github pages URLs follow a `https://<your username>.github.io/<your repo name>` schema. For instance, mine is `https://swizec.github.io/react-d3js-step-by-step`. Yours will be different.

You can deploy with `npm run deploy`. Make sure all changes are committed. We'll do it together when we're done setting up.

## Twitter and Facebook cards and SEO

How your visualization looks on social media matters more than you'd think. Does it have a nice picture, a great description, and a title, or does it look like a random URL? Those things matter.

And they're easy to set up. No excuse.

We're going to poke around `public/index.html` for the first time. Add titles, twitter cards, facebook open graph things, and so on.

{crop-start: 3, crop-end: 19, format: html}
![Basic SEO](code_samples/es6v2/index.html)

We add a `<title>` and a `canonical` URL. Titles configure what shows up in browser tabs and the canonical URL is there to tell search engines that this is the main and most important URL for this piece of content. Especially important for when people copy paste your stuff and put it on other websites.

But I messed up here and used the wrong URL. This knocks down rankings for the original version of this visualization but oh well :)

In the body root tag, we add some copy pasted text from our dataviz. You'll recognize the default title and description.

As soon as React loads, these get overwritten with our preloader, but it's good to have them here for any search engines that aren't running JavaScript yet. I think both Google and Bing are capable of running our React app and getting text from there, but you never know.

To make social media embeds look great, we'll use [Twitter card](https://dev.twitter.com/cards/types/summary-large-image) and [Facebook OpenGraph](https://developers.facebook.com/docs/sharing/webmasters) meta tags. I think most other websites just rely on these since most people use them. They go in the `<head>` of our HTML.

{crop-start: 23, crop-end: 41, format: javascript}
![Add FB and Twitter cards](code_samples/es6v2/index.html)

Much of this code is repetitive. Both Twitter and Facebook want the same info, but they're stubborn and won't read each other's formats. You can copy all of this, but make sure to change `og:url`, `og:site_name`, `article:publisher`, `fb:admins`, `og:image`, `twitter:site`, `twitter:image`, and `twitter:creator`. They're you specific.

The URLs you should change to the `homepage` URL you used above. The rest you should change to use your name and Twitter/Facebook handles. I'm not sure *why* it matters, but I'm sure it does.

An important one is `fb:admin`. It enables admin features on your site, if you add their social plugins. If you don't, it probably doesn't matter.

You're also going to need a thumbnail image. I made mine by taking a screenshot of the final visualization. Put it in `public/thumbnail.png`.

Now when somebody shares your dataviz on Twitter or Facebook, it's going to look something like this:

![Dataviz Twitter card](images/es6v2/twitter-card.png)

## Full dataset

One more step left to do. Use the whole dataset!

Go into `src/DataHandling.js` and change one line:

{crop-start: 95, crop-end: 106, format: javascript}
![Switch to full dataset](code_samples/es6v2/DataHandling.js)

We change the file name and that's that. Full dataset locked and loaded. Dataviz ready to go.

# Launch!

To show your dataviz to the world, make sure you've committed all changes. Using `git status` shows you anything you've forgotten.

Then run:

```
$ npm run deploy
```

You'll see a bunch of output

![Deploy output](images/es6v2/npm-run-deploy.png)

And you're ready to go. Your visualization is online. My URL is `https://swizec.github.io/react-d3js-step-by-step/`, yours is different. Visit it and you'll see what you've built. Share it and others will see it too.

![Deployed dataviz](images/es6v2/deployed-dataviz.png)

Congratz! You've built and deployed your first React and D3v4 dataviz. You're amazing \o/

Thanks for following along with the meaty part of my book. You're now well equipped to make cool things.

In the next section, we're going to look at building animations.