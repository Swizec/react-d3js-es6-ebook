
//
// Example 1
//

import React, { Component } from 'react';
// leanpub-start-delete
import logo from './logo.svg';
import './App.css';
// leanpub-end-delete
 +
 +
 +import Preloader from './components/Preloader';

  class App extends Component {
 -  render() {
 -    return (
 -      <div className="App">
 -        <div className="App-header">
 -          <img src={logo} className="App-logo" alt="logo" />
 -          <h2>Welcome to React</h2>
 -        </div>
 -        <p className="App-intro">
 -          To get started, edit <code>src/App.js</code> and save to reload.
 -        </p>
 -      </div>
 -    );
 -  }
 +    state = {
 +        techSalaries: []
 +    }
 +
 +    render() {
 +        if (this.state.techSalaries.length < 1) {
 +            return (
 +                <Preloader />
 +            );
 +        }
 +
 +        return (
 +            <div className="App">
 +
 +            </div>
 +        );
 +    }
  }

  export default App;
