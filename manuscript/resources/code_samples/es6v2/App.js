
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


//
// Example 4
//
// src/App.js
import Preloader from './components/Preloader';
import { loadAllData } from './DataHandling';

// markua-start-insert
import CountyMap from './components/CountyMap';
// markua-end-insert

class App extends Component {

    // src/App.js
    countyValue(county, techSalariesMap) {
        const medianHousehold = this.state.medianIncomes[county.id],
              salaries = techSalariesMap[county.name];

        if (!medianHousehold || !salaries) {
            return null;
        }

        const median = d3.median(salaries, d => d.base_salary);

        return {
            countyID: county.id,
            value: median - medianHousehold.medianIncome
        };
    }

    // src/App.js
    render() {
        if (this.state.techSalaries.length < 1) {
            return (
                <Preloader />
            );
        }

        // markua-start-insert
        const filteredSalaries = this.state.techSalaries,
              filteredSalariesMap = _.groupBy(filteredSalaries, 'countyID'),
              countyValues = this.state.countyNames.map(
                  county => this.countyValue(county, filteredSalariesMap)
              ).filter(d => !_.isNull(d));

        let zoom = null;
        // markua-end-insert

          return (
              <div className="App container">
                // markua-start-delete
                <h1>Loaded {this.state.techSalaries.length} salaries</h1>
                // markua-end-delete
                // markua-start-insert
                <svg width="1100" height="500">
                    <CountyMap usTopoJson={this.state.usTopoJson}
                               USstateNames={this.state.USstateNames}
                               values={countyValues}
                               x={0}
                               y={0}
                               width={500}
                               height={500}
                               zoom={zoom} />
                </svg>
                // markua-end-insert
              </div>
          );
      }
}


//
// Example 5
//
// src/App.js
import _ from 'lodash';

// markua-start-insert
import './App.css';
// markua-end-insert

import Preloader from './components/Preloader';
import { loadAllData } from './DataHandling';

import CountyMap from './components/CountyMap';
// markua-start-insert
import Histogram from './components/Histogram';
// markua-end-insert

// src/App.js
// ...
render() {
    // ...
    return (
        <div className="App container">
            <h1>Loaded {this.state.techSalaries.length} salaries</h1>
            <svg width="1100" height="500">
                <CountyMap usTopoJson={this.state.usTopoJson}
                           USstateNames={this.state.USstateNames}
                           values={countyValues}
                           x={0}
                           y={0}
                           width={500}
                           height={500}
                           zoom={zoom} />
                // markua-start-insert
                <Histogram bins={10}
                           width={500}
                           height={500}
                           x="500"
                           y="10"
                           data={filteredSalaries}
                           axisMargin={83}
                           bottomMargin={5}
                           value={d => d.base_salary} />
                // markua-end-insert
            </svg>
        </div>
    );
}


//
// Example 6
//
// src/App.js
import CountyMap from './components/CountyMap';
import Histogram from './components/Histogram';
// markua-start-insert
import { Title } from './components/Meta';
// markua-end-insert

class App extends Component {
    state = {
        techSalaries: [],
        countyNames: [],
        medianIncomes: [],
        // markua-start-insert
        filteredBy: {
            USstate: '*',
            year: '*',
            jobTitle: '*'
        }
        // markua-end-insert
    }

    // ...

    render() {
        // ..
        return (
            <div className="App container">
                // markua-start-insert
                <Title data={filteredSalaries}
                       filteredBy={this.state.filteredBy} />
                // markua-end-insert
                // ...
            </div>
        )
    }
}


//
// Example 7
//
// src/App.js
import Histogram from './components/Histogram';
import { Title, Description, GraphDescription } from './components/Meta';
// markua-start-insert
import MedianLine from './components/MedianLine';
// markua-end-insert

class App extends Component {
    // ...
    render() {
        // ...
        let zoom = null,
            // markua-start-insert
            medianHousehold = this.state.medianIncomesByUSState['US'][0]
                                  .medianIncome;
            // markua-end-insert

        return (
            // ...
            <svg width="1100" height="500">
                <CountyMap // ... />
                <Histogram // ... />
                // markua-start-insert
                <MedianLine data={filteredSalaries}
                            x={500}
                            y={10}
                            width={600}
                            height={500}
                            bottomMargin={5}
                            median={medianHousehold}
                            value={d => d.base_salary} />
                // markua-end-insert
            </svg>
        )
    }
}


//
// Example 8
//
// src/App.js
import MedianLine from './components/MedianLine';

// markua-start-insert
import Controls from './components/Controls';
// markua-end-insert

class App extends Component {
    state = {
        // ...
        medianIncomes: [],
        // markua-start-insert
        salariesFilter: () => true,
        // markua-end-insert
        filteredBy: {
            // ...
        }
    }

    // ...

    // markua-start-insert
    updateDataFilter(filter, filteredBy) {
        this.setState({
            salariesFilter: filter,
            filteredBy: filteredBy
        });
    }
    // markua-end-insert

    render() {
        // ...
    }
}


//
// Example 9
//
// src/App.js
class App extends Component {
    // ...

    render() {
        // ...
        // markua-start-delete
        const filteredSalaries = this.state.techSalaries
        // markua-end-delete
        // markua-start-insert
        const filteredSalaries = this.state.techSalaries
                                     .filter(this.state.salariesFilter)
        // markua-end-insert

        // ...

        let zoom = null,
            medianHousehold = // ...
        // markua-start-insert
        if (this.state.filteredBy.USstate !== '*') {
            zoom = this.state.filteredBy.USstate;
            medianHousehold = d3.mean(this.state.medianIncomesByUSState[zoom],
                                      d => d.medianIncome);
        }
        // markua-end-insert

        // ...
    }
}


//
// Example 10
//
// src/App.js
class App extends Component {
    // ...

    render() {
        // ...

        return (
            <div //...>
                <svg //...>
                    <CountyMap //... />

                    // markua-start-insert
                    <rect x="500" y="0"
                          width="600"
                          height="500"
                          style={{fill: 'white'}} />
                    // markua-end-insert

                    <Histogram //... />
                    <MedianLine //.. />
                </svg>

                // markua-start-insert
                <Controls data={this.state.techSalaries}
                          updateDataFilter={this.updateDataFilter.bind(this)} />
                // markua-end-insert
            </div>
        )
    }
}


//
// Example 11
//
// src/App.js
class App extends Component {
    // ...
    shouldComponentUpdate(nextProps, nextState) {
        const { techSalaries, filteredBy } = this.state;

        const changedSalaries =
        (techSalaries && techSalaries.length)
            !== (nextState.techSalaries
                && nextState.techSalaries.length);

        const changedFilters = Object.keys(filteredBy)
                                     .some(
                                         k => filteredBy[k]
                                         !== nextState.filteredBy[k]
                                     );

        return changedSalaries || changedFilters;
    }
    // ...
}
