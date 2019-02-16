
# Appendixes #

# Appendix A - roll your own environment {#appendixA}

If you already know how to set up the perfect development environment for modern JavaScript, go ahead and skip this section. Otherwise, keep reading.

If you don't know and you don't care about this right now: Use the starter project that came with the book. It's what you would get after following this chapter.

{#the-environment}
# A good work environment
If you already know how to set up the perfect development environment for modern JavaScript, go ahead and skip this section. Otherwise, keep reading.

A good work environment helps us get the most out of our time. We're after three things:

* code should re-compile when we change a file
* page should update automatically when the code changes
* dependencies and modules should be simple to manage

When I first wrote this chapter in April 2015, I suggested a combination of Browserify, Grunt, NPM, and Bower. This was the wrong approach. It was complicated, it wasn't very extensible, and it was slow.

There were no sourcemaps, which meant your browser's error reporting was useless. There was no hot loading, which meant your code had to process a gigantic 80,000 datapoint file every time you made a change.

It was a mess. I'm sorry I told you to use it. The old system is included in [the appendix](#appendix) if you're curious.

The new system is great. I promise. I use it all the time :smiley:

## Bundle with Webpack
Instead of using the old setup, I now think the best choice is to use a combination of Webpack and Babel.

Webpack calls itself a *"flexible unbiased extensible module bundler"*, which sounds like buzzword soup. At its most basic, Webpack gives you the ability to organize code into modules and `require()` what you need, much like Browserify.

Unlike Browserify however, Webpack comes with a sea of built-in features and a rich ecosystem of extensions called plugins. I can't hope to know even half of them, but some of the coolest I've used are plugins that let you `require()` Less files *with* magical Less-to-CSS compilation, plugins for `require`-ing images, and JavaScript minification.

Using Webpack allows us to solve two more annoyances — losing state when loading new code and accurately reporting errors. So we can add two more requirements to our work environment checklist (for a total of five):

  * code should re-compile when we change a file
  * page should update automatically when the code changes
  * dependencies and modules should be simple to manage
  * page shouldn't lose state when loading new code (hot loading)
  * browser should report errors accurately in the right source files (sourcemaps)

## Compile with Babel

Webpack can't do all this alone though – it needs a compiler.

We're going to use Babel to compile our JSX and ES6 code into the kind of code all browsers understand: ES5. If you're not ready to learn ES6, don’t worry; you can read the ES5 version of React+d3.js.

Babel isn't really a compiler because it produces JavaScript, not machine code. That being said, it's still important at this point. According to the JavaScript roadmap, browsers aren't expected to fully support ES6 until some time in 2017. That's a long time to wait, so the community came up with transpilers which let us use some ES6 features *right now*. Yay!

Transpilers are the officially-encouraged stepping stone towards full ES6 support.

To give you a rough idea of what Babel does with your code, here's a fat arrow function with JSX. Don't worry if you don't understand this code yet; we'll go through that later.

```
() => (<div>Hello there</div>)
```

After Babel transpiles that line into ES5, it looks like this:

```
(function () {
  return React.createElement(
    'div',
    null,
    'Hello there'
  );
});
```

Babel developers have created a [playground that live-compiles](https://babeljs.io/repl/) code for you. Have fun.

## Quickstart

The quickest way to set this up is to use Dan Abramov's [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate) project. It's what I use for new projects these days.

If you know how to do this already, skip ahead to the [Visualizing Data with React.js](#the-meat-start) chapter. In the rest of this chapter, I'm going to show you how to get started with the boilerplate project. I'm also going to explain some of the moving parts that make it tick.

## NPM for dependencies and tools

NPM is node.js’s default package manager. Originally developed as a dependency management tool for node.js projects, it's since taken hold of the JavaScript world as a way to manage the toolbelt. With Webpack's growing popularity and its ability to recognize NPM modules, NPM is fast becoming *the* way to manage client-side dependencies as well.

We're going to use NPM to install both our toolbelt dependencies (like Webpack) and our client-side dependencies (like React and d3.js).

You can get NPM by installing node.js from [nodejs.org](http://nodejs.org). Webpack and our dev server will run in node.

Once you have NPM, you can install Webpack globally with:

```
$ npm install webpack -g
```

If that worked, you're ready to go. If it didn't, Google is your friend.

At this point, there are two ways to proceed:

* You can continue with the step-by-step instructions using a boilerplate.
* You can use the stub project included with the book. It has everything ready to go.

## Step-by-step with boilerplate

All it takes to start a project from boilerplate is to clone the boilerplate project, remove a few files, and run the code to make sure everything works.

You will need Git for this step. I assume you have it already because you're a programmer. If you don't, you can get it from [Git's homepage](https://git-scm.com/). For the uninitiated, Git is a source code versioning tool.

Head to a directory of your choosing, and run:

```
$ git clone git@github.com:gaearon/react-transform-boilerplate.git
```

This makes a local copy of the boilerplate project. Now that we've got the base code, we should make it our own.

Our first step is to rename the directory and remove Git's version history and ties to the original project. This will let us turn it into our own project.

```
$ mv react-transform-boilerplate react-d3-example
$ rm -rf react-d3-example/.git
$ cd react-d3-example
```

We now have a directory called `react-d3-example` that contains some config files and a bit of code. Most importantly, it isn't tied to a Git project, so we can make it all ours.

### Make it your own

To make the project our own, we have to change some information inside `package.json`: the name, version, and description.

``` {.json}
{
  // Delete the line(s) between here...
  "name": "react-transform-boilerplate",
  "version": "1.0.0",
  "description": "A new Webpack boilerplate with hot reloading React components, and error handling on module and component level.",
  // ...and here.
  // Insert the line(s) between here...
  "name": "react-d3-example",
  "version": "0.1.0",
  "description": "An example project to show off React and d3 working together",
  // ...and here.
  "scripts": {
```

It's also a good idea to update the `author` field:

``` {.json}
// Delete the line(s) between here...
"author": "Dan Abramov <dan.abramov@me.com> (http://github.com/gaearon)",
// ...and here.
// Insert the line(s) between here...
"author": "Swizec <swizec@swizec.com> (http://swizec.com)
// ...and here.
```

Use your own name, email, and URL. Not mine :smiley:

If you want to use Git to manage source code versioning, now is a good time to start. You can do that by running:

```
$ git init
$ git add .
$ git commit -a -m "Start project from boilerplate"
```

Great. Now we have a project signed in our name.

Our new project comes preconfigured for React and all the other tools and compilers we need to run our code. Install them by running:

```
$ npm install
```

This installs a bunch of dependencies like React, a few Webpack extensions, and a JavaScript transpiler (Babel) with a few bells and whistles. Sometimes, parts of the installation fail. If it happens to you, try re-running `npm install` for the libraries that threw an error. I don't know why this happens, but you're not alone. I've been seeing this behavior for years.

Now that we have all the basic libraries and tools, we have to install two more libraries:

1. `d3` for drawing
2. `lodash` for some utility functions

```
$ npm install --save d3 lodash
```

The `--save` option saves them to `package.json`.

## Add Less compiling

Less is my favorite way to write stylesheets. It looks almost like traditional CSS, but it gives you the ability to use variables, nest definitions, and write mixins. We won't need much of this for the H1B graphs project, but nesting will make our style definitions nicer, and Less makes your life easier in bigger projects.

Yes, there's a raging debate about stylesheets versus inline styling. I like stylesheets for now.

Webpack can handle compiling Less to CSS for us. We need a couple of Webpack loaders and add three lines to the config.

Let's start with the loaders:

```
$ npm install --save style-loader less less-loader css-loader
```

Remember, `--save` adds `style-loader` and `less-loader` to package.json. The `style-loader` takes care of transforming `require()` calls into `<link rel="stylesheet"` definitions, and `less-loader` takes care of compiling LESS into CSS.

To add them to our build step, we have to go into `webpack.config.dev.js`, find the `loaders: [` definition, and add a new object. Like this:

``` {caption="Add LESS loaders"}
module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      // Insert the line(s) between here...
      {
          test: /\.less$/,
          loader: "style!css!less"
      }
      // ...and here.
    ]
```

Don't worry if you don't understand what the rest of this file does. We're going to look at that in the next section.

Our addition tells Webpack to load any files that end with `.less` using `style!css!less`. The `test:` part is a regex that describes which files to match, and the `loader` part uses bangs to chain three loaders. The file is first compiled with `less`, then compiled into `css`, and finally loaded as a `style`.

If everything went well, we should now be able to use `require('./style.less')` to load style definitions. This is great because it allows us to have separate style files for each component, and that makes our code more reusable since every module comes with its own styles.

## Serve static files in development

Our visualization is going to use Ajax to load data. That means the server we use in development can't just route everything to `index.html` – it needs to serve other static files as well.

We have to add a line to `devServer.js`:

``` {caption="Enable static server on ./public"}
app.use(require('webpack-hot-middleware')(compiler));

// Insert the line(s) between here...
app.use(express.static('public'));
// ...and here.

app.get('*', function(req, res) {
```

This tells express.js, which is the framework our simple server uses, to route any URL starting with `/public` to local files by matching paths.

## Webpack nice-to-haves

Whenever I'm working with React, I like to add two nice-to-haves to `webpack.config.dev.js`. They're not super important, but they make my life a little easier.

First, I add the `.jsx` extension to the list of files loaded with Babel. This lets me write React code in `.jsx` files. I know what you're thinking: writing files like that is no longer encouraged by the community, but hey, it makes my Emacs behave better.

``` {caption="Add .jsx to Babel file extensions"}
//
module: {
   loaders: [
     // Delete the line(s) between here...
     {test: /\.js$/},
     // ...and here.
     // Insert the line(s) between here...
     {test: /\.js|\.jsx$/
      // ...and here.
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
     },
     {test: /\.less$/,
      loader: "style!css!less"
     }
   ]
```

We changed the `test` regex to add `.jsx`. You can read in more detail about how these configs work in later parts of this chapter.

Second, I like to add a `resolve` config to Webpack. This lets me load files without writing their extension. It's a small detail, but it makes your code cleaner.

``` {caption="Add resolve to webpack.config.dev.js"}
//
    new webpack.NoErrorsPlugin()
  ],
  // Insert the line(s) between here...
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  // ...and here.
```

It's a list of file extensions that Webpack tries to guess when a path you use doesn't match any files.

## Optionally enable ES7 {#enable-es7}

Examples in this book are written in ES6, also known as ECMAScript2015. If you're using the boilerplate approach or the stub project you got with the book, all ES6 features work in any browser. The Babel 6 compiler makes sure of that by transpiling ES6 into ES5.

The gap between ES5 (2009/2011) and ES6 (2015) has been long, but now the standard has started moving fast once again. In fact, ES7 is promised to be released some time in 2016.

Even though ES7 hasn't been standardized yet, you can already use some of its features if you enable `stage-0` support in Babel. Everything in `stage-0` is stable enough to use in production, but there is a small chance the feature/syntax will change when the new standard becomes official.

You don't need `stage-0` to follow the examples in this book, but I do use one or two syntax sugar features. Whenever we use something from ES7, I will mention the ES6 alternative.

To enable `stage-0`, you have to first install `babel-preset-stage-0`. Like this:

```
$ npm install --save-dev babel-preset-stage-0
```

Then enable it in `.babelrc`:

``` {.json caption="Add stage-0 preset to .babelrc"}
{
  // Delete the line(s) between here...
  "presets": ["react", "es2015"],
  // ...and here.
  // Insert the line(s) between here...
  "presets": ["react", "es2015", "stage-0"],
  // ...and here.
  "env": {
```

That's it. You can use fancy ES7 features in your code and Babel will transpile them into normal ES5 that all browsers support.

Don't worry if you don't understand how `.babelrc` works. You can read more about the environment in the [Environment in depth](#env-in-depth) chapter.

## Check that everything works

Your environment should be ready. Let's try it out. First, start the dev server:

```
$ npm start
```

This command runs a small static file server that's written in node.js. The server ensures that Webpack continues to compile your code when it detects a file change. It also puts some magic in place that hot loads code into the browser without refreshing and without losing variable values.

Assuming there were no errors, you can go to `http://localhost:3000` and see a counter doing some counting. That's the sample code that comes with the boilerplate.

If it worked: Awesome, you got the code running! Your development environment works! Hurray!

If it didn't work: Well, um, poop. A number of things could have gone wrong. I would suggest making sure `npm install` ran without issue, and if it didn't, try Googling for any error messages that you get.

## Remove sample code

Now that we know our development environment works, we can get rid of the sample code inside `src/`. We're going to put our own code files in there.

We're left with a skeleton project that's full of configuration files, a dev server, and an empty `index.html`. This is a good opportunity for another `git commit`.

Done? Wonderful.

In the rest of this chapter, we're going to take a deeper look into all the config files that came with our boilerplate. If you don't care about that right now, you can jump straight to [the meat](#the-meat-start).

## The environment in depth {#env-in-depth}

Boilerplate is great because it lets you get started right away. No setup, no fuss, just `npm install` and away we go.

But you *will* have to change something eventually, and when you do, you'll want to know what to look for. There's no need to know every detail in every config file, but you do have to know enough so that you can Google for help.

Let's take a deeper look at the config files to make any future Googling easier. We're relying on Dan Abramov's `react-transform-boilerplate`, but many others exist with different levels of bells and whistles. I like Dan's because it's simple.

All modern boilerplates are going to include at least two bits:

* the webpack config
* the dev server

Everything else is optional.

### Webpack config

Webpack is where the real magic happens, so this is the most important configuration file in your project. It's just a JavaScript file though, so there's nothing to fear.

Most projects have two versions of this file: a development version and a production version. The first is geared more towards what we need in development – a compile step that leaves our JavaScript easy to debug – while the second is geared towards what we need in production – compressed and uglified JavaScript that's quick to load.

Both files look alike, so we're going to focus on the dev version.

It comes in four parts:

``` {caption="Webpack config structure"}
//
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
  ],
  output: {
  },
  plugins: [
  ],
  module: {
    loaders: []
  }
```

 - **Entry**, which tells Webpack where to start building our project's dependency tree;

 - **Output**, which tells Webpack where to put the result. This is what our index.html file loads;

 - **Plugins**, which tells Webpack which plugins to use when building our code;

 - and **Loaders**, which tells Webpack about the different file loaders we'd like to use.

There's also the `devtool: 'eval'` option, which tells Webpack how to package our files so they're easier to debug. In this case, our code will come inside `eval()` statements, which makes it hot loadable.

Let's go through the four sections one by one.

#### Entry

The entry section of Webpack's config specifies the entry points of our dependency tree. It's an array of files that `require()` all other files.

In our case, it looks like this:

``` {caption="Entry part of webpack.config.dev.js"}
  devtool: 'eval',
  entry: [
    // Insert the line(s) between here...
    'webpack-hot-middleware/client',
    './src/index'
    // ...and here.
```

We specify that `./src/index` is the main file. In the next section, you'll see that this is the file that requires our app and renders it into the page.

The `webpack-hot-middleware/client` line enables Webpack's hot loading. It loads new versions of JavaScript files without reloading the page.

#### Output

The output section specifies which files get the output. Our config is going to put all compiled code into a single `bundle.js` file, but it's common to have multiple output files. If we had an admin dashboard and a user-facing app, this would allow us to avoid loading unnecessary JavaScript for users who don't need every type of functionality.

The config looks like this:

``` {caption="Output part of webpack.config.dev.js"}
  ],
  output: {
    // Insert the line(s) between here...
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
    // ...and here.
```

We define a path, `./dist/`, where compiled files live, say the filename for JavaScript is `bundle.js`, and specify `/static/` as the public path. That means the `<script>` tag in our HTML should use `/static/bundle.js` to get our code, but we should use `./dist/bundle.js` to copy the compiled file.

#### Plugins

There's a plethora of Webpack plugins out there. We're only going to use two of them in our example.

``` {caption="Plugins part of webpack.config.dev.js"}
  },
  plugins: [
    // Insert the line(s) between here...
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    // ...and here.
```

As you might have guessed, this config is just an array of plugin object instances. Both plugins we're using come with Webpack by default. Otherwise, we'd have to `require()` them at the top of the file.

`HotModuleReplacementPlugin` is where the hot loading magic happens. I have no idea how it works, but it's the most magical thing that's ever happened to my coding abilities.

The `NoErrorsPlugin` makes sure that Webpack doesn't error out and die when there's a problem with our code. The internet recommends using it when you rely on hot loading new code.

#### Loaders

Finally, we come to the loaders section. Much like with plugins, there is a universe of Webpack loaders out there, and I've barely scratched the surface.

If you can think of it, there's a loader for it. At my day job, we use a Webpack loader for everything from JavaScript code to images and font files.

For the purposes of this book, we don't need anything that fancy. We just need a loader for JavaScript and styles.

``` {caption="Loaders part of webpack.config.dev.js"}
  ],
  module: {
   loaders: [
       // Insert the line(s) between here...
       {test: /\.js|\.jsx$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
       },
       {test: /\.less$/,
        loader: "style!css!less"
       }
      // ...and here.
    ]
```

Each of these definitions comes in three parts:

 * **`test`**, which specifies the regex for matching files;
 * **`loader` or `loaders`**, which specifies which loader to use for these files. You can compose loader sequences with bangs, `!`;
 * optional **`include`**, which specifies the directory to search for files.

There might be loaders out there with more options, but this is the most basic loader I've seen that covers our bases.

That's it for our very basic Webpack config. You can read about all the other options in [Webpack's own documentation](http://webpack.github.io/docs/).

My friend Juho Vepsäläinen has also written a marvelous book that dives deeper into Webpack. You can find it at [survivejs.com](http://survivejs.com).

### Dev server

The dev server that comes with Dan's boilerplate is based on the Express framework. It's one of the most popular frameworks for building websites in node.js.

Many better and more in-depth books have been written about node.js and its frameworks. In this book, we're only going to take a quick look at some of the key parts.

For example, on line 9, you can see that we tell the server to use Webpack as a middleware. That means the server passes every request through Webpack and lets it change anything it needs.

``` {caption="Lines that tell Express to use Webpack"}
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
```

The `compiler` variable is an instance of Webpack, and `config` is the config we looked at earlier. `app` is an instance of the Express server.

Another important bit of the `devServer.js` file specifies routes. In our case, we want to serve everything from `public` as a static file, and anything else to serve `index.html` and let JavaScript handle routing.

``` {caption="Lines that tell Express how to route requests"}
app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
```

This tells Express to use a static file server for everything in `public` and to serve `index.html` for anything else.

At the bottom, there is a line that starts the server:

``` {caption="Line that starts the server"}
app.listen(3000, 'localhost', function(err) {
```

I know I didn't explain much, but that's as deep as we can go at this point. You can read more about node.js servers, and Express in particular, in [Azat Mardan's books](http://azat.co/). They're great.

### Babel config

Babel works great out of the box. There's no need to configure anything if you just want to get started and don't care about optimizing the compilation process.

But there are [a bunch of configuration options](http://babeljs.io/docs/usage/options/) if you want to play around. You can configure everything from enabling and disabling ES6 features to source maps and basic code compacting and more. More importantly, you can define custom transforms for your code.

We don't need anything fancy for the purposes of our example project – just a few presets. A preset is a single package that enables a bunch of plugins and code transforms. We use them to make our lives easier, but you can drop into a more specific config if you want to.

The best way to configure Babel is through the `.babelrc` file, which looks like this:

``` {caption=".babelrc config"}
{
  "presets": ["react", "es2015", "stage-0"],
  "env": {
    "development": {
      "presets": ["react-hmre"]
    }
  }
}

```

I imagine this file is something most people copy-paste from the internet, but here's what’s happening in our case:

 - `react` enables all React and JSX plugins;
 - `es2015` enables transpiling ES6 into ES5, including all polyfills for semantic features;
 - `stage-0` enables the more experimental ES7 features.

Those are the default presets. For development, we also enable `react-hmre`, which gives us hot loading.

That's it. If you need more granular config, or you want to know what all those presets enable and use, I suggest Googling for them. Be warned, though; the `es2015` preset alone uses 20 different plugins.

### Editor config

A great deal has been written about tabs vs. spaces. It's one of the endless debates we programmers like to have. *Obviously* single quotes are better than double quotes… unless… well… it depends, really.

I've been coding since I was a kid, and there's still no consensus. Most people wing it. Even nowadays when editors come with a built-in linter, people still wing it.

But in recent months (years?), a solution has appeared: the `.eslintrc` file. It lets you define project-specific code styles that are programmatically enforced by your editor.

From what I've heard, most modern editors support `.eslintrc` out of the box, so all you have to do is include the file in your project. Do that and your editor keeps encouraging you to write beautiful code.

The `eslint` config that comes with Dan's boilerplate loads a React linter plugin and defines a few React-specific rules. It also enables JSX linting and modern ES6 modules stuff. By the looks of it, Dan is a fan of single quotes.

``` {caption=".eslintrc for React code"}
Features": {
    "jsx": true,
    "modules": true
  },
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "rules": {
    "quotes": [2, "single"],
    "strict": [2, "never"],
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/react-in-jsx-scope": 2
  },
  "plugins": [
    "react"
  ]
}

```

I haven't really had a chance to play around with linting configs like these to be honest. Emacs defaults have been good to me for years. But these types of configs are a great idea. The biggest problem in a team is syncing everyone's linters, and if you can put a file like this in your Git project - **BAM!**, everyone's always in sync.

You can find a semi-exhaustive list of options in [this helpful gist](https://gist.github.com/cletusw/e01a85e399ab563b1236).

## That's it. Time to play!

By this point, you have a working environment in which to write your code, and you understand how it does what it does. On a high level at least. And you don't need the details until you want to get fancy anyway.

That's how environments are: a combination of cargo culting and rough understanding.

What we care about is that our ES6 code compiles into ES5 so that everyone can run it. We also have it set so that our local version hot loads new code.

In the next section, we're going to start building a visualization.
