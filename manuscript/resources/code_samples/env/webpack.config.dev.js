//
// Example 1
//
// ./webpack.config.dev.js
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

//
// Example 2
//
// ./webpack.config.dev.js
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
};

//
// Example 3
//
var path = require('path');
var webpack = require('webpack');

// ./webpack.config.dev.js
module.exports = {
  devtool: 'eval',
  entry: [
    // leanpub-start-insert
    'webpack-hot-middleware/client',
    './src/index'
    // leanpub-end-insert
  ],
  output: {
  },
  plugins: [
  ],
  module: {
    loaders: []
  }
};

//
// Example 4
//
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  // ./webpack.config.dev.js
  output: {
    // leanpub-start-insert
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
    // leanpub-end-insert
  },
  plugins: [
  ],
  module: {
    loaders: []
  }
};

//
// Example 5
//
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  // ./webpack.config.dev.js
  plugins: [
    // leanpub-start-insert
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    // leanpub-end-insert
  ],
  module: {
    loaders: []
  }
};

//
// Example 6
//
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  // ./webpack.config.dev.js
  module: {
   loaders: [
       // leanpub-start-insert
       {test: /\.js|\.jsx$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
       },
       {test: /\.less$/,
        loader: "style!css!less"
       }
      // leanpub-end-insert
    ]
  }
};

//
// Example 7
//
// ./webpack.config.dev.js
module: {
   loaders: [
       // leanpub-start-delete
       {test: /\.js$/,
       // leanpub-end-delete
       // leanpub-start-insert
       {test: /\.js|\.jsx$/
       // leanpub-end-insert
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
       },
       {test: /\.less$/,
        loader: "style!css!less"
       }
    ]
  }


//
// Example 8
//
// ./webpack.config.dev.js
    new webpack.NoErrorsPlugin()
  ],
  // leanpub-start-insert
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  // leanpub-end-insert
  module: {
