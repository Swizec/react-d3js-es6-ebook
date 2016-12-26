
//
// Example 1
//
// src/App.js
import React, { Component } from 'react';
// markua-start-delete
import logo from './logo.svg';
import './App.css';
// markua-end-delete

// markua-start-insert
import Preloader from './components/Preloader';
// markua-end-insert

class App extends Component {
    // markua-start-delete
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
    // markua-end-delete
}

export default App;


//
// Example 2
//
// src/App.js
class App extends Component {
    // markua-start-insert
    state = {
        techSalaries: []
    }

    render() {
        if (this.state.techSalaries.length < 1) {
            return (
                <Preloader />
            );
        }

        return (
            <div className="App">

            </div>
        );
    }
    // markua-end-insert
}


//
// Example 3
//
// src/App.js
import React, { Component } from 'react';
// markua-start-insert
import * as d3 from 'd3';
import _ from 'lodash';
// markua-end-insert

import Preloader from './components/Preloader';
// markua-start-insert
import { loadAllData } from './DataHandling';
// markua-end-insert

// src/App.js
class App extends Component {
    state = {
        techSalaries: [],
        // markua-start-insert
        countyNames: [],
        medianIncomes: []
    }

    componentWillMount() {
        loadAllData(data => this.setState(data));
    }
    // markua-end-insert


    // src/App.js
    render() {
         if (this.state.techSalaries.length < 1) {
             return (
                 <Preloader />
             );
          }

        return (
            // markua-start-delete
            <div className="App">
            // markua-end-delete
            // markua-start-insert
            <div className="App container">
                <h1>Loaded {this.state.techSalaries.length} salaries</h1>
            // markua-end-insert
            </div>
        );
    }
}
