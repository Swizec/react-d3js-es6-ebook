{#the-environment}
# A good work environment

Before we begin, we need a good work environment. We're after three things:

 * code should re-compile when we change a file
 * page should update automatically when the code changes
 * a good way to manage dependencies and modules

When I first wrote this chapter in April 2015, I suggested using a combination of Browserify, Grunt, NPM, and Bower. This was the wrong approach. It was complicated to set up, wasn't very extensible, and took a while to compile everything.

The project this book is based on takes almost 7 seconds to compile, and Grunt's file change detection isn't as smooth as it could be. Plus you then have to wait for `live-server` to detect the compiled files' change. 

When there's an error in your code, the browser has no idea where it happened because it only sees the compiled file.

To make matters worse, your page loses state every time it auto-reloads. Twice per file change - first when the server sees a file has changed, then when Grunt compiles the code and changes the compiled file.
  
It's a mess. I'm sorry I told you to use it. The old system is included in [the appendix](#appendix) for the curious and those stuck in legacy environments.

If you already know how to set up the perfect development environment for modern JavaScript work, then you should skip this section.

## Bundle with Webpack, compile with Babel

Webpack calls itself a *"flexible unbiased extensible module bundler"*, which doesn't say much and sounds like buzzword soup. At its most basic, it gives you the ability to organize code into modules and 'require()' what you need. Much like Browserify.

But unlike Browserify, Webpack comes with a sea of built-in features, and a rich ecosystem of extensions called plugins. I can't hope to know even half of them, but some of the coolest I've used are plugins that let you 'require()' Less files *with* magic Less-to-CSS compilation, plugins for require-ing images, and JavaScript minification.

Webpack can solve two more annoyances - losing state when loading new code, and accurately reporting errors. We add two more requirements for a total of five:

  * code should re-compile when we change a file
  * page should update automatically when the code changes
  * a good way to manage dependencies and modules
  * page shouldn't lose state when loading new code
  * browser should report errors accurately in the right source files

The quickest way to set this up is using Dan Abramov's [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate) project. It's what I use for new projects these days.

If you know how to do that, skip ahead to the [Visualizing data with React.js](#the-meat-start) chapter. In the rest of this chapter, I'm going to show you how to get started with the boilerplate project, and explain all the moving parts.

## NPM for installing dependencies

NPM is node.js’s default package manager. Originally developed as a dependency management tool for node.js projects, it's since taken hold of the JavaScript world as a way to manage the tool belt, and with Webpack's growing popularity, a way to manage client-side dependencies as well.

That's because Webpack automatically recognizes NPM modules. Which means we are going to use NPM to both install our toolbelt dependencies (like Webpack), and our client-side dependencies (like React and d3.js).

You can get NPM by installing node.js from [nodejs.org](http://nodejs.org). Webpack and our dev server will run in node.

Once you have NPM, you can install Webpack globally with:

{linenos=off}
    $ npm install webpack -g

If that worked well, you're ready to go. If it didn't, Google is your friend.

## Starting with boilerplate

All it takes to start a project from boilerplate is to clone the boilerplate project, remove a few files, and run the code to make sure everything works.

You will need Git for this step. I assume you have it already because you're a programmer. You can get it from [Git's homepage](https://git-scm.com/), if you don't. It's a source code versioning tool by the way.

Go to a directory of your choosing, and run:

{linenos=off}
    $ git clone git@github.com:gaearon/react-transform-boilerplate.git

This makes a local copy of the boilerplate project. Now that we've got the base code, we should make it our own.

The first step is to rename the directory and remove Git's version history and ties to the original project, which will allow us to turn it into our own project.

{linenos=off}
    $ mv react-transform-boilerplate react-d3-example
    $ rm -rf react-d3-example/.git
    $ cd react-d3-example

We now have a directory called `react-d3-example` that contains some config files, a bit of code, and isn't tied to a Git project.

### Make it your own

To make it our own, we have to change some information inside `package.json`: the name, version, and description.

{linenos=off,lang=json}
		{
			// leanpub-start-delete
		  "name": "react-transform-boilerplate",
		  "version": "1.0.0",
		  "description": "A new Webpack boilerplate with hot reloading React components, and error handling on module and component level.",
			// leanpub-end-delete
			// leanpub-start-insert
		  "name": "react-d3-example",
		  "version": "0.1.0",
		  "description": "An example project to show off React and d3 working together",
			// leanpub-end-insert
		  "scripts": {

It's a good idea to update the `author` field:

{linenos=off,lang=json}
		// leanpub-start-delete
    "author": "Dan Abramov <dan.abramov@me.com> (http://github.com/gaearon)",
		// leanpub-end-delete
		// leanpub-start-insert
		"author": "Swizec <swizec@swizec.com> (http://swizec.com)
		// leanpub-end-insert

Use your own name, email, and URL. Not mine :)

If you want to use Git to manage source code versioning, now is a good time to start. You can do that by running:

{linenos=off}
    $ git init
    $ git add .
    $ git commit -a -m "Start project from boilerplate"

Great, now we have a project signed in our own name.

It comes preconfigured for React and all the other tools and compilers we need to run our code. Install them by running:

{linenos=off}
    $ npm install

This will install a bunch of depedencies like React, a few Webpack extensions, and a JavaScript transpiler (Babel) with a few bells and whistles. Parts of the installation sometimes fail, try re-running `npm install` just for the libraries that threw an error. I don't know why this happens, but I've been seeing this behavior for years.

Now that we have all the basic libraries and tools we need to run our code, we have to install two more: `d3` for drawing, and `autobind-decorator`, which I will explain later.

{linenos=off}
    $ npm install --save d3 autobind-decorator

The `--save` option saves them to `package.json`.

## Check that it works

You should be good to go. Start the dev server:

{linenos=off}
    $ npm start

This command runs a small static file server written in node.js. The server makes sure to keep Webpack compiling your code when it detects a file change. It also puts some magic in place that hot loads code into the browser without refreshing, and without losing variable values.

I don't know how that part works.

Assuming there were no errors, you can go to `http://localhost:3000` and see a counter doing some counting. That's the sample code that comes with the boilerplate.

If it worked: Awesome, you got the code running! The development environment works, yay!

If it didn't work: Poop. A number of things could have gone wrong. I would suggest making sure `npm install` ran fine, and Googling for any error messages that you get.

## Remove sample code, add LESS

Now that we know our development environment works, we can get rid of the sample code inside `src/`. We're going to put our own code files in there.

We're left with a skeleton project that's full of configuration files, a dev server, and an empty `index.html`. This is a good opportunity for another `git commit`.

### Add LESS compiling

Less is my favorite way to write stylesheets. It looks almost like traditional CSS, but gives you the ability to use variables, nest definitions, and write mixins. We won't need much of this for the H1B graphs project, but nesting will make our style definitions nicer, and LESS will make your life easier in bigger projects.

Webpack can handle compiling LESS to CSS for us. We just have to install a couple of Webpack loaders, and add three lines to the config.

Let's start with the loaders:

{linenos=off}
   $ npm install --save style-loader less-loader

Remember, `--save` adds `style-loader` and `less-loader` to package.json. The `style-loader` takes care of transforming `require()` calls into `<link rel="stylesheet"` definitions, and `less-loader` takes care of compiling LESS into CSS.

To add them to our build step, we have to go into `webpack.config.dev.js`, find the `loaders: [` definition and add a new object. Like this:

{crop-start-line=4,crop-end-line=17,linenos=on,starting-line-number=19,lang=javascript}
<<[Add LESS loaders](code_samples/env/webpack.config.dev.js)

Don't worry if you don't understand what the rest of this file does. We're going to look at that in the next section.

Our addition tells Webpack to load any files that end with `.less` using `style!css!less`. The `test:` part is a regex that  describes which files to match, and the `loader` part uses bangs to chain three loaders. The file is first compiled with `less`, then compiled into `css`, and finally loaded as a `style`.

At least that's how I understand it. These loader incantations can get pretty intricate and to be honest, I usually copy paste them from examples in README files.

If we got everything right, we should now be able to use `require('./style.less')` to load style definitions. This is great because it allows us to have separate style files for each component, which makes our code more reusable since every module comes with its own styles.

Wonderful.

In the rest of this chapter, we're going to take a deeper look into all the config files that came with our boilerplate. You should jump straight to [the meat](#the-meat-start), if you don't care about that right now.

## What's in the environment

Boilerplate is great because it lets you get started right away.  No setup, no fuss, just `npm install` and away we go.

But you *will* have to change something eventually, and when you do, you'll want to know what to look for. There's no need to know every detail about every config file, but you do have to know enough so that you can Google for help.

Let's take a deeper look at the config files to make future googling easier. We're relying on Dan Abramov's `react-transform-boilerplate`, but many others exist with different amounts of bells and whistles. I like Dan's because it's simple.

All modern boilerplates are going to include at least two bits:

* the webpack config
* the dev server

Everything else is optional.

### Webpack config

Wepback is where the real magic happens so this is the most important configuration file in your project. It's just a JavaScript file though so there's nothing to fear.

Most projects have two versions of this file: a dev version, and a prod version. The first is geared more towards what we need in development - a compile step that leaves our JavaScript easy to debug - while the second is geared towards what we need in production - compressed and uglified JavaScript that's quick to load.

Since both files are so similar, we're only going to look at the dev version.

It comes in four parts:

{crop-start-line=22,crop-end-line=36,linenos=off,lang=js}
<<[Webpack config structure](code_samples/env/webpack.config.dev.js)

 - Entry, which tells Webpack where to start building our project's dependency tree.

 - Output, which tells Webpack where to put the result. This is what our index.html file loads.

 - Plugins, which tells Webpack what plugins to use when building our code.

 - Loaders, which tells Webpack about the different file loaders we'd like to use.

There's also the `devtool: 'eval'` option, which tells Webpack how to package our files so they're easier to debug. In this case our code will come inside `eval()` statements, which makes it hot loadable.

Let's go through the four sections one by one.

#### Entry

The entry section of Webpack's config specifies the entry points of our dependency tree. It's an array of files that `require()` all other files.

In our case, it looks like this:

{crop-start-line=46,crop-end-line=51,linenos=off,lang=js}
<<[Entry part of webpack.config.dev.js](code_samples/env/webpack.config.dev.js)

We specify that `./src/main` is the main file. Index is another common name. In the next section you'll see that this is the file that requires our app and renders it into the page.

The `webpack-hot-middleware/client` line enables Webpack's hot loading, which can load new versions of JavaScript files without reloading the page.

If we wanted to compile multiple independent apps with a single Webpack config file, we could add more files. A common example is when you have a separate admin dashboard app for some users, and a friendly end-user app for others.

#### Output

The output section specifies which files to output to. Our config is going to put all compiled code into a single `bundle.js` file, but it's common to have multiple output files. In the case of an admin dashboard and a user-facing app that would allow us to avoid loading unnecessary JavaScript for users who don't need that functionality.

The config looks like this:

{crop-start-line=73,crop-end-line=79,linenos=off,lang=js}
<<[Output part of webpack.config.dev.js](code_samples/env/webpack.config.dev.js)

We define a path, `./dist/`, where compiled files live, say the filename for JavaScript is `bundle.js`, and specify `/static/` as the public path. That means the `<script>` tag in our HTML should use `/static/bundle.js` to get our code, but we should use `./dist/bundle.js` to copy the compiled file.

#### Plugins

There's a plethora of Webpack plugins out there and to be honest I haven't even begun to explore them all. We're only going to use two of them in our example.

{crop-start-line=104,crop-end-line=109,linenos=off,lang=js}
<<[Plugins part of webpack.config.dev.js](code_samples/env/webpack.config.dev.js)

As you might have guessed, this config is just an array of plugin object instances. Both plugins we're using come with Webpack by default, otherwise we'd have to `require()` them at the top of the file.

`HotModuleReplacementPlugin` is where the hot loading magic happens. I have no idea how it works, but it's the most magical thing that's ever happened to my coding abilities.

The `NoErrorsPlugin` makes sure that Webpack doesn't error out and die when there's a problem with our code. The internet recommends using it when you rely on hot loading new code.

#### Loaders

Finally we come to the loaders section. Much like with plugins, there is a universe of Webpack loaders out there, that I've barely started to explore.

If you can think of it, there's a loader for it. In my day job we use a Webpack loader for everything from JavaScript code, to images and font files.

But for the purposes of this book, we don't need anything that fancy; just JavaScript and styles.

{crop-start-line=136,crop-end-line=148,linenos=off,lang=js}
<<[Loaders part of webpack.config.dev.js](code_samples/env/webpack.config.dev.js)

Each of these definitions comes in three parts:

 * `test`, which specifies the regex for matching files.
 * `loader` or `loaders`, which specifies which loader to use for these files. You can compose loader sequences with bangs, `!`. 
 * optional `include`, which specifies the directory to search for files

There might be loaders out there with more options, but this is the basic I've seen in all of them.

That's it for our very basic Webpack config. You can read about all the other options in [Webpack's own documentation](http://webpack.github.io/docs/).

My friend Juho Vepsäläinen has also written a marvelous book that dives deeper into Webpack. You can find it at [survivejs.com](http://survivejs.com).

### Dev server

The dev server that comes with Dan's boilerplate is based on the Express framework. It's a popular framework for building websites in node.js, but that's not important. Other boilerplates use different approaches.

Many better and more in depth books have been written about node.js and its frameworks. In this book, we're going to take a quick look at some of the key parts.

For example, on line 9, you can see that we tell the server to use Webpack for ... things. It's been a few versions since I wrote an Express server for scratch, so I usually cargo cult this part.

{crop-start-line=9,crop-end-line=14,linenos=on,starting-line-number=9,lang=js}
<<[Lines that tell Express to use Webpack](code_samples/env/devServer.js)

The `compiler` variable is an instance of Webpack, and `config` is the config we looked at earlier. `app` is an instance of the Express server.

Another important bit of the `devServer.js` file specifies routes. In our case, we want to serve everything from `public` as a static file, and anything else to serve `index.html` and let JavaScript handle routing.

{crop-start-line=16,crop-end-line=20,linenos=on,starting-line-number=16,lang=js}
<<[Lines that tell Express how to route requests](code_samples/env/devServer.js)

This tells Express to use a static file server everything in `public`, and to serve `index.html` for anything else.

At the bottom there is a line that starts the server:

{crop-start-line=22,crop-end-line=22,linenos=on,starting-line-number=22,lang=js}
<<[Line that starts the server](code_samples/env/devServer.js)

I know I didn't explain much, but that's as deep as we can go at this point. You can read more about node.js servers, and Express in particular in [Azat Mardan's books](http://azat.co/). They're pretty great.

### Babel config

### Editor config