//
// Example 1
//
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

module.exports = {
  devtool: 'eval',
  entry: [
    // leanpub-start-insert
    'webpack-hot-middleware/client',
    './src/main'
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
    './src/main'
  ],
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
    './src/main'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
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
    './src/main'
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
  module: {
   loaders: [
       // leanpub-start-insert
       {test: /\.js|.jsx$/,
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
