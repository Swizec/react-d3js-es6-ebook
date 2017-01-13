# A big example project #

# Visualizing 176,113 US tech salaries

We're going to build this:

![](images/es6v2/full-dataviz.png)

An interactive visualization app with a choropleth map and a histogram comparing tech salaries with median household income in the area. Users can filter by three different parameters – year, job title, and US state – to get a more detailed view.

![](images/es6v2/interaction-dataviz.png)

It's going to be great.

At this point I assume you've used `create-react-app` to set up your environment. Check the [getting started](#getting-started) section, if you haven't. And I assume you've read the [basics chapter](#the-meat-start). I'm still going to explain what we're doing, but knowing the basics helps.

I suggest you follow along, keep `npm start` running, and watch your visualization change in real time as you code. It's rewarding as hell.

If you get stuck, you can use my [react-d3js-step-by-step Github repo](https://github.com/Swizec/react-d3js-step-by-step) to jump between steps. The [9 tags](https://github.com/Swizec/react-d3js-step-by-step/releases) correspond to the code at the end of each step. Download the first tag and run `npm install` to skip the initial setup.

If you want to see how this project evolved over 22 months, check [the original repo](https://github.com/Swizec/h1b-software-salaries). The [create-react-app](https://github.com/Swizec/h1b-software-salaries/tree/create-react-app) branch has the code you're about to build.

## Show a Preloader

![Preloader screenshot](images/es6v2/preloader-screenshot.png)

Our preloader is a screenshot of the final result. Usually you'd have to wait until the end of the project to make that, but I'll just give you mine. Starting with the preloader makes sense for two reasons:

1. It's nicer than watching a blank screen while data loads
2. It's a good sanity check for our environment

We're using a screenshot of the final result, because the full dataset takes a few seconds to load, parse, and render. It looks better if visitors see something informative while they wait. 

Make sure you've installed [all dependencies](#install-dependencies) and that `npm start` is running.

We're building the preloader in 3 steps:

1. Get the image
2. Make the `Preloader` component
3. Update `App`
4. Load Bootstrap styles in `index.js`

### Step 1: Get the image

Download [my screenshot from Github](https://raw.githubusercontent.com/Swizec/react-d3js-step-by-step/798ec9eca54333da63b91c66b93339565d6d582a/src/assets/preloading.png) and save it in `src/assets/preloading.png`. It goes in the `src/assets/` directory because we're going to `import` it in JavaScript, which makes it part of our source code, and I like to put non-javascript files in `assets`. Keeps the project organized.

### Step 2: Preloader component

The `Preloader` is a component that pretends it's the `App`, and renders a static title, description, and a screenshot of our end result. It goes in `src/components/Preloader.js`.

We'll put all of our components in `src/components/`.

We start the component off with some imports, an export, and a functional stateless component that returns an empty div element.

{crop-start: 5, crop-end: 17, format: javascript}
![Preloader skeleton](code_samples/es6v2/compnents/Preloader.js)

We `import` React, which we need to make JSX syntax work, and the `PreloaderImg` for our image. We can import images because of the Webpack configuration that comes with `create-react-app`. The image loader puts a file path in the `PreloaderImg` constant.

At the bottom we `export default Preloader`, so that we can use it in `App.js` as `import Preloader`. I like to use default exports when the file exports a single thing, and named exports when we have multiple. You'll see that play out in the rest of this project.

The `Preloader` function takes no props, because we don't need any, and returns an empty `div`. Let's fill it in.

{crop-start: 22, crop-end: 35, format: javascript}
![Preloader content](code_samples/es6v2/components/Preloader.js)

We're cheating again because I copy pasted that from the finished example. You wouldn't have anywhere to get this yet.

The code itself looks like plain HTML. We have the usual tags - `h1`, `p`, `b`, `img`, and `h2`. That's what I like about using JSX. It feels familiar.

But look at the `img` tag: the `src` attribute is dynamic, defined by `PreloaderImg`, and the `style` attribute takes an object, not a string. That's because JSX is more than HTML, it's JavaScript. You can put any JavaScript entity you need in those props.

That will be one of the cornerstones of our sample project.

### Step 3: Update App

To use our new `Preloader` component, we have to edit `src/App.js`. Let's start by removing the defaults that came with `create-react-app`, and importing our `Preloader` component.

{crop-start: 5, crop-end: 35, format: javascript}
![Revamp App.js](code_samples/es6v2/App.js)

We removed the logo and style imports, added an import for `Preloader`, and gutted everything out of the `App` class. It's a great starting point for a default app, but it's served its purpose.

Let's define a default `state` and a `render` method that uses our `Preloader` component when there's no data.

{crop-start: 40, crop-end: 62, format: javascript}
![Render the preloader](code_samples/es6v2/App.js)

With modern ES6+ classes we can define properties directly in the class without going through the constructor method. This makes our code cleaner and easier to read.

You might be wondering whether `state` is now a class static property, or bound to `this` for each object. It works the way we need it to: bound to each `this` instance. I don't know *why* it works that way because it's hard to Google for these things when you can't remember the name, but I do know it works. Tried and battle tested :)

We set `techSalaries` to an empty array, then in `render` check whether it's empty and render either the `Preloader` component, or a blank `<div>`. Rendering your preloaders when there's no data makes sense even if you haven't yet built your data loading.

If you have `npm start` running, your preloader should show up on screen.

![Preloader without Bootstrap styles](preloader-without-styles-screenshot.png)

Hmm ... that's not very pretty. Let's fix it.

### Step 4: Load Bootstrap styles

We're going to use Bootstrap styles to avoid reinventing the wheel. We're ignoring their JavaScript widgets, and even the amazing integration built by the [react-bootstrap](http://react-bootstrap.github.io/) team. All we need are the stylesheets.

They'll make the fonts look better, help with layouting, and making buttons look like buttons.

We add them in `src/index.js`.

{crop-start: 5, crop-end: 18, format: javascript}
![Add bootstrap in index.js](code_samples/es6v2/index.js)

Another benefit of using Webpack: `import`-ing stylesheets. These imports turn into `<style>` tags with CSS in their body at runtime. 

This is also a good opportunity to see how simple the `index.js` file is. It requires our `App`, and uses `ReactDOM` to render it into the page. That's it.

You should now see your beautiful preloader on screen.

![Preloader screenshot](images/es6v2/preloader-screenshot.png)

If you don't, try comparing your changes to this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/798ec9eca54333da63b91c66b93339565d6d582a).

## Asynchronously load data

Great! We have a preloader, time to load some data. 

We'll use D3's built-in data loading methods, and tie their callbacks into React's component lifecycle. You could talk to a REST API in the same way. Neither D3 nor React care what the datasource is.

First, you need the data files. I scraped the tech salary info from [h1bdata.info](http://h1bdata.info/), the median household incomes from the US census datasets, and US map data from Mike Bostock's github repositories. I used some elbow grease and python scripts to tie the datasets together. 

You can read about the scraping on my blog [here](https://swizec.com/blog/place-names-county-names-geonames/swizec/7083), [here](https://swizec.com/blog/facts-us-household-income/swizec/7075), and [here](https://swizec.com/blog/livecoding-24-choropleth-react-js/swizec/7078). But it's not the subject of this book.

You should download the 6 datafiles from [the step-by-step repository on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/8819d9c38b4aef0a0c569e493f088ff9c3bfdf33). Put them in the `public/data` directory in your project.

### Step 1: Prep App.js

Let's set up our `App` component first. That way you'll see results as soon data loading starts to work.

We start by importing our data loading method - `loadAllData` - and both D3 and Lodash. We'll need them later.

{crop-start: 67, crop-end: 78, format: javascript}
![Import d3, lodash, and our data loader](code_samples/es6v2/App.js)

You already know the normal imports. Importing with `{}` is how we import named exports, which lets us get multiple things from the same file. You'll see how the export side works in Step 2.

{crop-start: 79, crop-end: 91, format: javascript}
![Initiate data loading in App.js](code_samples/es6v2/App.js)

We initiate data loading inside the `App` class's `componentWillMount` lifecycle hook. It fires right before React mounts our component into the DOM. Seems like a good place to start loading data, but some say it's an anti-pattern.

I like tying it to component mount when using the [basic architecture](#basic-architecture), and in a more render agnostic place when using Redux or MobX for state management.

To initiate data loading we call the `loadAllData` function, which we're defining next, then use `this.setState` in a callback. This updates `App`'s state and triggers a re-render, which updates our entire visualization via props.

We also took this opportunity to add two more entries to our `state`: `countyNames`, and `medianIncomes`.

Let's add a "Data loaded" indicator to the `render` method. That way we'll know when data loading works.

{crop-start: 94, crop-end: 112, format: javascript}
![Data loaded indicator](code_samples/es6v2/App.js)

We added the `container` class to the main `<div>` and added an `<h1>` tag to show how many datapoints were loaded. The `{}` pattern denotes a dynamic value in JSX. You've seen this in props so far, but it works in tag bodies as well.

With all of this done, you should see an error overlay.

![DataHandling.js not found error overlay](images/es6v2/datahandling-error.png)

These nice error overlays come with `create-react-app`. They make it so you never have to check the terminal where `npm start` is running. A big improvement thanks to the React team at Facebook.

Let's build that file and fill it with our data loading logic.

### Step 2: Prep data parsing functions

We're putting data loading logic in a file separate from `App.js` because it's a bunch of functions that work together and don't have much to do with the `App` component. 

We start the file with two imports and four data parsing functions:
- `cleanIncomes`, which parses each row of household income data
- `dateParse`, which we use for parsing dates
- `cleanSalary`, which parses each row of salary data
- `cleanUSStateName`, which parses US state names

{crop-start: 5, crop-end: 43, format: javascript}
![Data parsing functions](code_samples/es6v2/DataHandling.js)

You'll see those `d3` and `lodash` imports a lot.

The data parsing functions all follow the same approach: Take a row of data as `d`, return a dictionary with nicer key names, and cast any numbers or dates into appropriate formats. They all come in as strings.

Doing the parsing and the nicer key names now makes the rest of our codebase simpler because we don't have to deal with this all the time. For example `entry.job_title`{format: javascript} is nicer to read and type than `entry['job title']`{format: javascript}.

### Step 3: Load the datasets

Now that we have our data parsing functions, we can use D3 to load the data with ajax requests.

{crop-start: 47, crop-end: 58, format: javascript}
![Data loading](code_samples/es6v2/DataHandling.js)

Here you can see another ES6 trick: default argument values. If `callback` is falsey, we set it to `_.noop` - a function that does nothing. This lets us later call `callback()` without worrying whether it was given as an argument.

`d3.queue` lets us call multiple asynchronous functions and wait for them all to finish. By default it runs all functions in parallel, but that's configurable through an argument - `d3.queue(1)` for one at a time, `2` for two, etc. In our case, without an argument, it runs all tasks in parallel.

We define 5 tasks to run with `.defer`, then wait for them to finish with `.await`. The tasks themselves are D3's data loading functions that fire an Ajax request to the specified URL, parse the data into a JavaScript dictionary, and use the given row parsing function to polish the result.

For instance, `.defer(d3.csv, 'data/county-median-incomes.csv', cleanIncomes)`{format: javascript}, uses `d3.csv` to make an Ajax request to `data/county-median-incomes.csv`, parse the CSV file into an array of JavaScript dictionaries, and uses `cleanIncomes` to further parse each row the way we specified earlier.

D3 supports formats like `json`, `csv`, `tsv`, `text`, and `xml` out of the box. You can make it work with custom data sources through the underlying `request` API.

PS: we're using the shortened salary dataset to make page reloads faster while building our project.

### Step 4: Tie the datasets together

If you put a `console.log` in the `.await` callback above, you'll see a bunch of data. Each argument - `us`, `countyNames`, `medianIncomes`, `techSalaries`, `USstateNames` - holds the entire parsed dataset from the corresponding file.

To tie them together and prepare a dictionary for `setState` back in the `App` component, we need to add some logic, but not much. We're going to build a dictionary of county household incomes and remove any empty salaries.

{crop-start: 63, crop-end: 90, format: javascript}
![Tie the datasets together](code_samples/es6v2/DataHandling.js)

The first line should be one of those `cleanX` functions like we had above. I'm not sure how I missed it.

Then we have the county median income map building. It looks like weird code because of the indentation but it's not that bad. We `filter` the `medianIncomes` array to discard any incomes whose `countyName` we can't find. I made sure all names are unique when building the datasets.

We use `forEach` to walk through the filtered array, find the correct `countyID`, and add the entry to `medianIncomesMap`. When we're done, we have a large dictionary that maps county ids to their household income data.

At the end, we filter `techSalaries` to remove any empty values - the `cleanSalaries` function returns `null` when a salary is either undefined or absurdly high.

Then we call `callback` with a dictionary of the new datasets. To make future access quicker, we use `_.groupBy` to build dictionary maps of counties by county name, and by US state.

You should now see how many salary entries the shortened dataset contains.

![Data loaded screenshot](images/es6v2/data-loaded-screenshot.png)

If that didn't work, try comparing your changes to this [diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/9f113cdd3bc18535680cb5a4e87a3fd45743c9ae).

{#choropleth-map}
## Render a choropleth map of the US

Now that we have our data, it's time to start drawing pictures - a choropleth map. That's a map that uses colored geographical areas to encode data.

In our case, we're going to show the delta between median household salary in a statistical county, and the average salary of a single tech worker on a visa. The darker the blue, the higher the difference.

![Choropleth map with shortened dataset](images/es6v2/choropleth-map-shortened-dataset.png)

There's a lot of gray on this map because the shortened dataset doesn't span that many counties. There's going to be plenty in the full choropleth too, but less.

Turns out immigration visa opportunities for techies aren't evenly distributed throughout the country. Who knew.

Just like before, we're going to start with changes in our `App` component, then build the new bit. This time a `CountyMap` component spread into three files: 

- `CountyMap/index.js`, to make imports easier
- `CountyMap/CountyMap.js`, for overall map logic
- `CountyMap/County.js`, for individual county polygons

### Step 1: Prep App.js

You might guess the pattern already: add an import, add a helper method or two, update `render`.

{crop-start: 119, crop-end: 126, format: javascript}
![Import CountyMap component](code_samples/es6v2/App.js)

That imports the `CountyMap` component from `components/CountyMap/`. Your browser should show an error overlay about some file or another not existing until we're done.

In the `App` class itself, we add a `countyValue` method. It takes a county entry and a map of tech salaries, and returns the delta between median household income and a single tech salary.

{crop-start: 129, crop-end: 144, format: javascript}
![App.countyValue method](code_samples/es6v2/App.js)

We use `this.state.medianIncomes` to get the median household salary, and the `techSalariesMap` input to get salaries for a specific census area. Then we use `d3.median` to calculate the  median value for salaries, and return a two-element dictionary with the result.

`countyID` specifies the county and `value` is the delta that our choropleth displays. 

In the `render` method, we'll do three things:

 - prep a list of county values
 - remove the "data loaded" indicator
 - render the map

{crop-start: 146, crop-end: 183, format: javascript}
![Render the CountyMap component](code_samples/es6v2/App.js)

We call our dataset `filteredTechSalaries` because we're going to add filtering in the [subchapter about adding user controls](#user-controls). Using the proper name now means less code to change later. The magic of foresight :)

We use `_.groupBy` to build a dictionary mapping each `countyID` to an array of salaries, and use our `countyValue` method to build an array of counties for our map.

We set `zoom` to `null` for now. This also will come into effect later.

In the `return` statement, we remove the "data loaded" indicator, and add an `<svg>` element that's `1100` pixels wide, and `500` pixels high. Inside, we put the `CountyMap` component with a bunch of properties. Some dataset stuff, some sizing and positioning stuff.

### Step 2: CountyMap/index.js

We use `index.js` for one reason alone: Make imports and debugging easier. I learned the lesson the hard way so you don't have to.

{format: javascript}
![CountyMap index.js](code_samples/es6v2/components/CountyMap/index.js)

We export the default import from `./CountyMap.js`. That's it.

This allows us to import `CountyMap` from the directory without knowing about internal file structure. We *could* put all the code in this `index.js` file, but then stack traces are hard to read.

Putting a lot of code into `<directory>/index.js` files means that when you're looking at a stack trace, or opening different source files inside the browser, they're all going to be named `index.js`. Life is easier when components live inside a file named the same as the component you're using.

### Step 3: CountyMap/CountyMap.js

Now here comes the fun part - declaratively drawing a map. You'll see why I love using React for dataviz.

We're using the [full-feature integration](#full-feature-integration) and a lot of D3 magic for maps. I'm always surprised by how little code it takes to draw a map with D3.

Start with the imports: React, D3, lodash, topojson, the County component.

{crop-start: 5, crop-end: 12, format: javascript}
![Import CountyMap dependencies](code_samples/es6v2/components/CountyMap/CountyMap.js)

Out of these, we haven't built `County` yet, and you haven't seen `topojson` before. It's a way of defining geographical data with JSON. We're going to use the `topojson` library to translate our geographical datasets into GeoJSON, which is another way of defining geo data with JSON. 

I don't know why there are two, but TopoJSON produces smaller files, and GeoJSON can be fed directly into D3's geo functions. ¯\_(ツ)_/¯

Maybe it's a case of [competing standards](https://xkcd.com/927/).

#### Constructor

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

`quantize` is a D3 scale. We've mentioned the basics of scales in the [D3 Axis example](#blackbox-axis). This one splits a domain into 9 quantiles, and assigns them specific values from the `range`.

Let's say our domain goes from 0 to 90. Calling the scale with any number between 0 and 9 would return 1. 10 to 19 returns 2 and so on. We'll use it to pick colors from an array.

#### updateD3

Keeping all of this up to date is easy, but we'll make it harder by adding a zoom feature. It won't work until we implement the filtering, but hey, we'll already have it by then! :D

{crop-start: 65, crop-end: 91, format: javascript}
![CountyMap updateD3](code_samples/es6v2/components/CountyMap/CountyMap.js)

There's a lot going on here.

The first part is okay. It `translates`, i.e. moves, the projection to the center of our drawing area, and sets a scale property. The value was discovered experimentally and is different for every projection.

Then we do some weird stuff if `zoom` is defined.

We get the list of all US state features in our geo data, find the one we're `zoom`-ing on, and use the `geoPath.centroid` method to calculate its center point. This gives us a new coordinate to `translate` our projection onto.

The calculation in `.translate()` helps us align the center point of our `zoom` US state with the center of the drawing area.

While all this is going on, we also tweak the `.scale` property to make the map bigger. This creates a zooming effect.

At the end of the `updateD3` function, we update the quantize scale's domain with new values. Using `d3.quantile` lets us offset the scale to produce a more interesting map. The values were discovered experimentally - they cut off the top and bottom of the range because there isn't much there. This brings higher contrast to the richer middle of the range.

#### render

After all that work, the `render` method is a breeze. We prep the data, then loop through it and render `County` elements.

{crop-start: 93, crop-end: 122, format: javascript}
![CountyMap render](code_samples/es6v2/components/CountyMap/CountyMap.js)

We use the topojson library to grab data out of the `usTopoJson` dataset. `.mesh` calculates a mesh for US states - thin line around the edges. `.feature` calculates the features for each county - fill in with color. 

Mesh and feature aren't tied to states or counties by the way. It's just a matter of what you get back: borders or flat areas. What you need depends on what you're building.

We use `_.fromPairs` to build a dictionary that maps county identifiers to their values. Building it beforehand makes our code faster. You can read some details about the speed optimizations [here](https://swizec.com/blog/optimizing-react-choropleth-map-rendering/swizec/7302).

As promised, all we have to do in the `return` statement is loop through the list of `counties` and render `County` components. Each gets a bunch of attributes and will return a `<path>` element that looks like a specific county.

For the US state borders, we use a single `<path>` element and use `this.geoPath` to generate the `d` property.

### Step 4: CountyMap/County.js

The `County` component itself is built out of two parts: imports and color constants, and a component that returns a `<path>`. We did all the hard calculation work in `CountyMap`.

{crop-start: 5, crop-end: 22, format: javascript}
![Imports and color constants](code_samples/es6v2/components/CountyMap/County.js)

We import React and lodash, then define some color constants. I got the `ChoroplethColors` from some example online, and `BlankColor` is a pleasant gray.

Now we need the `County` component itself.

{crop-start: 27, crop-end: 51, format: javascript}
![County component](code_samples/es6v2/components/CountyMap/County.js)

The `render` method uses the `quantize` scale to pick the right color, and returns a `<path>` element. `geoPath` generates the `d` attribute, we set style to `fill` the color, and give our path a `title`. 

`shouldComponentUpdate` is more interesting. It's a React lifecycle method that lets us specify which prop changes are relevant to our component re-rendering.

`CountyMap` passes complex props - `quantize`, `geoPath`, and `feature` - which are pass-by-reference instead of pass-by-value. That means React can't see when they produce different values, just when they are different instances.

This can lead to all 3,220 counties re-rendering every time a user does anything. But they only have to re-render if we change the map zoom, or the county gets a new value.

Using `shouldComponentUpdate` like this we can go from 3,220 DOM updates to the order of a few hundred. Big improvement in speed.

--- 

And with that, your browser should show you a map.

![Choropleth map with shortened dataset](images/es6v2/choropleth-map-shortened-dataset.png)

Turns out tech job visas just aren't that well distributed geographically. Most counties come out grey even with the full dataset.

If that didn't work, consult [this diff on Github](https://github.com/Swizec/react-d3js-step-by-step/commit/f4c1535e9c9ca4982c8f3c74cff9f739eb08c0f7).

## Render a Histogram of salaries

Knowing the median salary is great and all, but it doesn't tell you much about what you can expect. You need to know the distribution to see if it's more likely you'll get 140k or 70k.

That's what histograms are for. Give them a bunch of data and they show its distribution. We're going to build one like this:

![Basic histogram](images/es6v2/basic-histogram.png)

In the shortened dataset, 35% of tech salaries fall between $60k and $80k, 26% between $80k and $100k etc. Throwing a random dice using this as your [random distribution](https://en.wikipedia.org/wiki/Probability_distribution), you're far more likely to get 60k-80k than 120k-140k. Turns out this is a great way to gauge situations.

It's where fun statistics like "More people die from vending machines than shark attacks" come from. Which are you afraid of, vending machines or sharks? Stats say your answer should be [heart disease](https://www.cdc.gov/nchs/fastats/deaths.htm). ;)

Anyway, let's build a histogram. We'll start with changes in `App.js`, make a `Histogram` component using the [full-feature approach](#full-feature-integration), then add an `Axis` using the [blackbox HOC approach](#blackbox-hoc). We're also going to add some CSS, finally.

### Step 1: Prep App.js

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

### Step 2: CSS changes

As mentioned, opinions vary on the best way to do styling in React apps. Some say stylesheets per component, some say styling inside JavaScript, others swear by global app styling.

The truth is somewhere in between. Do what best fits your project and team. We're going to stick to global stylesheets because it's simplest.

Start by emptying out `src/App.css`. All that came with `create-react-app` must go. We don't need it.

Then add these 29 lines:

{crop-start: 4, crop-end: 33, format: css}
![App.css stylesheet](code_samples/es6v2/App.css)

We won't go into details about CSS here. Many better books have been written about it.

Generally speaking, we're making `.histogram` rectangles – the bars – blue, and labels white `12px` font. `button`s and `.row`s have some spacing. This for the user controls we'll add. And the `.mean` line is a dotted grey with grey `11px` text.

Yes, this is more CSS than we need for just the histogram. We're already here, might as well add it.

Adding the CSS before building the Histogram means it's going to come out beautiful the first time around.

### Step 3: Histogram component

### Step 4: HistogramBar (sub)component

### Step 5: Axis HOC


## Make it understandable - meta info

### Dynamic title

### Dynamic description

### Median household line

{#user-controls}
## Add user controls for data slicing and dicing

## Rudimentary routing

## Prep for launch