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

### Step 2: CountyMap/index.js

### Step 3: CountyMap/CountyMap.js

### Step 4: CountyMap/County.js

## Render a Histogram of salaries

## Make it understandable - meta info

### Dynamic title

### Dynamic description

### Median household line

## Add user controls for data slicing and dicing

## Rudimentary routing

## Prep for launch