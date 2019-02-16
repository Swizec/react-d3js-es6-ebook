# Appendix B - Browserify-based environment {#appendixB}

When I first wrote this book in the spring of 2015, I came up with a build-and-run system based on Grunt and Browserify. I also suggested using Bower for client-side dependencies.

I now consider that to have been a mistake, and I think Webpack is a much better option. I also suggest using one of the numerous boilerplate projects to get started quickly.

I'm leaving the old chapter here as a curiosity, and to help those stuck in legacy systems. With a bit of tweaking, you *can* use Grunt with Webpack, and Webpack *can* support Bower as a package manager.

## NPM for server-side tools

NPM is node.js’s default package manager. Originally developed as a dependency management tool for node.js projects, it's since taken hold of the JavaScript world as a way to manage the toolbelt.

We’ll use NPM to install the other tools we need.

You can get it by installing node.js from [nodejs.org](http://nodejs.org). Grunt, Bower, and our development server will run in node as well.

Once you’ve got it, create a working directory, navigate to it, and run:

```
$ npm init .
```

This will ask you a few questions and create `package.json` file. It contains some meta data about the project, and more importantly, it has the list of dependencies. This is useful when you return to a project months or years later and can’t remember how to get it running.

It's also great if you want to share the code with others.

And remember, the stub project included with the book already has all of this set up.

## The development server

Production servers are beyond the scope of this book, but we do need a server running locally. You could work on a static website without one, but we’re loading data into the visualization dynamically and that makes browser security models panic.

We’re going to use `live-server`, which is a great static server written in JavaScript. Its biggest advantage is that the page refreshes automatically when CSS, HTML, or JavaScript files in the current directory change.

To install `live-server`, run:

```
$ npm install -g live-server
```

If all went well, you should be able to start a server by running `live-server` in the command line. It’s even going to open a browser tab pointing at `http://localhost:8080` for you.

## Compiling our code with Grunt

Strictly speaking, we’re writing JavaScript and some CSS. We don’t *really* have to compile our code, but it’s easier to work with our code if we do.

Our compilation process is going to do three things:

* compile Less to CSS
* compile JSX to pure JavaScript
* concatenate source files

We have to compile Less because browsers don’t support it natively. We’re not going to use it for anything super fancy, but I prefer having some extra power in my stylesheets. It makes them easier to write.

You can use whatever you want for styling, even plain CSS, but the samples in this book will assume you're using Less.

Compiling JSX is far more important.

JSX is React’s new file format that lets us embed HTML snippets straight in our JavaScript code. You’ll often see render methods doing something like this:

``` {.javascript caption="A basic Render"}
React.render(
    <H1BGraph url="data/h1bs.csv" />,
    document.querySelectorAll('.h1bgraph')[0]
);
```

See, we’re treating HTML - in this case, an H1BGraph component - just like a normal part of our code. I haven’t decided yet if this is cleaner than other templating approaches like Mustache, but it’s definitely much better than manually concatenating strings.

As you’ll see later, it’s also very powerful.

But browsers don’t support this format, so we have to compile it into pure JavaScript. The above code ends up looking like this:

``` {.javascript caption="JSX compile result"}
React.render(
    React.createElement(H1BGraph, {url: “data/h1bs.csv”}),
    document.querySelectorAll(‘.h1bgraph’)[0]
);
```

We could avoid this compilation step by using `JSXTransform`. It can compile JSX to JavaScript in the browser, but it makes our site slower. React will also throw a warning and ask you never to use `JSXTransform` in production.

Finally, we concatenate all of our code into a single file because that makes it quicker to download. Instead of starting a gazillion requests for each and every file, the client only makes a single request.

### Install Grunt

We’re going to power all of this with [Grunt](http://gruntjs.com), which lets us write glorified bash scripts in JavaScript. Its main benefits are a large community that's created plugins for every imaginable thing, and simple JavaScript-based configuration.

To install Grunt and the plugins we need, run:

```
$ npm install -g grunt-cli
$ npm install --save-dev grunt
$ npm install --save-dev grunt-browserify
$ npm install --save-dev grunt-contrib-less
$ npm install --save-dev grunt-contrib-watch
$ npm install --save-dev jit-grunt
$ npm install --save-dev reactify
```

[Browserify](http://browserify.org) will allow us to write our code in modules that we can use with `require(‘foo.js’)`, just like we would in node.js. It’s also going to concatenate the resulting module hierarchy into a single file.

Some people have suggested using [Webpack](http://webpack.github.io/) instead, but I haven't tried it yet. Apparently it's the best thing since bacon because it can even `require()` images.

[Reactify](https://github.com/andreypopp/reactify) will take care of making our JSX files work with Browserify.

[Less](https://github.com/gruntjs/grunt-contrib-less) will compile Less files to CSS, `watch` will automatically run our tasks when files change, and `jit-grunt` will load Grunt plugins automatically so we don't have to deal with that.

### Grunt Config

Now that our tools are installed, we need to configure Grunt in `Gruntfile.js`. If you're starting with the stub project, you've already got this.

We’ll define three tasks:

* `less`, for compiling stylesheets
* `browserify`, for compiling JSX files
* `watch`, for making sure Grunt keeps running in the background

The basic file with no configs should look like this:

``` {.javascript caption="Base Gruntconfig.js"}
module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({ /* ... */ });

    grunt.registerTask('default',
                       ['less', 'browserify:dev', 'watch']);
);
```

We add the three tasks inside `initConfig`:

``` {.javascript caption="Less task config"}
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "build/style.css": "src/style.less"
                }
            }
        },
```

This sets a couple of options for the less compiler and tells it which file we’re interested in.

``` {#browserify-config .javascript caption="Browserify task config"}
        browserify: {
            options: {
                transform: ['reactify', 'debowerify']
            },
            dev: {
                options: {
                    debug: true
                },
                src: 'src/main.jsx',
                dest: 'build/bundle.js'
            },
            production: {
                options: {
                    debug: false
                },
                src: '<%= browserify.dev.src %>',
                dest: 'build/bundle.js'
            }
        },
```

The `reactify` transform is going to transform JSX files into plain JavaScript. The rest just tells `browserify` what our main file is going to be and where to put the compiled result.

I’m going to explain `debowerify` when we talk about client-side package management in the next section.

``` {.javascript caption="Watch task config"}
        watch: {
            styles: {
                files: ['src/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },

            browserify: {
                files: 'src/*.jsx',
                tasks: ['browserify:dev']
            }
        }
```

This tells `watch` which files it needs to watch for changes and what to do with them.

You should now be able to start compiling your code by running `grunt` in the command line. If you didn't start with the stub project, it will complain about missing files. Just create empty files with the names it complains about.

## Managing client-side dependencies with Bower

Client-side dependency management is the final piece in the puzzle.

Traditionally, this is done by dumping all of our JavaScript plugins into some sort of `vendor/` directory or by having a `plugins.js` file and manually copy-pasting code in there.

That approach works fine up until the day you want to update one of the plugins. Then you can’t remember exactly which of the ten plugins with a similar name and purpose you used, or you can no longer find the Github repository.

It's even worse if the plugin’s got some dependencies that also need to be updated. Then you're in for a ride.

This is where Bower comes in. Instead of worrying about any of that, you can just run:

```
$ bower install <something>
```

You could use NPM for this, but Bower can play with any source anywhere. It understands several package repositories, and it can even download code straight from Github.

To begin using Bower, install it and init the project:

```
$ npm install -g bower
$ bower init
```

This will create a `bower.json` file with some basic configuration.

When that’s done, install the four dependencies we need:

```
$ bower install -S d3
$ bower install -S react
$ bower install -S bootstrap
$ bower install -S lodash
```

We’re going to rely heavily on d3 and React. Bootstrap is there to give us some basic styling, and lodash will make it easier to play around with the data.

All of these were installed in the `bower_components/` directory.

This is awesome, but it creates a small problem. If you want to use Browserify to include d3, you have to write something like `require(‘../bower_components/d3/d3.js’);`, which not only looks ugly but also means you have to understand the internal structure of every package.

We can solve this with `debowerify`, which knows how to translate `require()` statements into their full path within `bower_components/`.

You should install it with:

```
$ npm install --save-dev debowerify
```

We already configured Debowerify in the [Grunt config section](#browserify-config) under Browserify. Now we’ll be able to include d3.js with just `require(‘d3’);`. Much better.

## Final check

Congratulations! You should now have a sane work environment.

Running `grunt` will compile your code and keep it compiling. Running `live-server` will start a static file server that auto-updates every time some code changes.

Check that your work directory has at least these files:

* package.json
* Gruntfile.js
* bower.json
* node_modules/
* bower_components/
* src/

I’d suggest adding a `.gitignore` as well. Something like this:

``` {caption=".gitignore"}
bower_components
build/.*
node_modules

```

And you might want to set up your text editor to understand JSX files. I'm using Emacs and `web-mode` is perfect for this type of work.

If `grunt` complains about missing files, that's normal. We're going to create them in the next section. But if it's bugging you too much, just create them as empty files.

You can also refer to the stub project included with the book if something went wrong. If that doesn't help, Google is your friend. You can also poke me on Twitter ([\@Swizec](https://twitter.com/swizec)) or send me an email at [swizec@swizec.com](mailto:swizec@swizec.com).
