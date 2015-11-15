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

{linenos=on,starting-line-number=19}
    module: {
        loaders: [{
          test: /\.js$/,
          loaders: ['babel'],
          include: path.join(__dirname, 'src')
        },
				// leanpub-start-insert
				{
           test: /\.less$/,
           loader: "style!css!less"
        }
				// leanpub-end-insert
        ]
    }

Don't worry if you don't understand what the rest of this file does. We're going to look at that in the next section.

Our addition tells Webpack to load any files that end with `.less` using `style!css!less`. The `test:` part is a regex that  describes which files to match, and the `loader` part uses bangs to chain three loaders. The file is first compiled with `less`, then compiled into `css`, and finally loaded as a `style`.

At least that's how I understand it. These loader incantations can get pretty intricate and to be honest, I usually copy paste them from examples in README files.

If we got everything right, we should now be able to use `require('./style.less')` to load style definitions. This is great because it allows us to have separate style files for each component, which makes our code more reusable since every module comes with its own styles.

Wonderful.

In the rest of this chapter, we're going to take a deeper look into all the config files that came with our boilerplate. You should jump straight to [the meat](#the-meat-start), if you don't care about that right now.

## What's in the boilerplate

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

{crop-start-line=3,crop-end-line=18,linenos=off,lang=javascript}
<<[Webpack config structure](code_samples/env/webpack.config.dev.js)

### Dev server

### Babel config

### Editor config