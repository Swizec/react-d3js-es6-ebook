
//
// Example 1
//
// src/components/Controls/index.js
import React, { Component } from 'react';
import _ from 'lodash';

import ControlRow from './ControlRow';

class Controls extends Component {
    state = {
        yearFilter: () => true,
        year: '*'
    }

    updateYearFilter(year, rest) {
    }

    componentDidUpdate() {
        this.reportUpdateUpTheChain();
    }

    reportUpdateUpTheChain() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    render() {
    }
}

export default Controls;


//
// Example 2
//
// src/components/Controls/index.js
class Controls extends Component {
    // ...

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date.getFullYear() === year;

        if (reset || !year) {
            filter = () => true;
            year = '*';
        }

        this.setState({yearFilter: filter,
                       year: year});
    }

    // ...

    reportUpdateUpTheChain() {
        this.props.updateDataFilter(
            ((filters) => {
                return (d) =>  filters.yearFilter(d);
            })(this.state),
            {
                year: this.state.year
            }
        );
    }

    // ...
}


//
// Example 3
//
// src/components/Controls/index.js
class Controls extends Component {
    // ...

    render() {
        const data = this.props.data;

        const years = new Set(data.map(d => d.submit_date.getFullYear()));

        return (
            <div>
                <ControlRow data={data}
                            toggleNames={Array.from(years.values())}
                            picked={this.state.year}
                            updateDataFilter={this.updateYearFilter.bind(this)}
                            />
            </div>
        )
    }
}


//
// Example 4
//
// src/components/Controls/index.js
class Controls extends Component {
    // ...
    render() {
        const data = this.props.data;

        const years = new Set(data.map(d => d.submit_date.getFullYear())),
              // markua-start-insert
              jobTitles = new Set(data.map(d => d.clean_job_title)),
              USstates = new Set(data.map(d => d.USstate));
              // markua-end-insert

        return (
            <div>
                <ControlRow data={data}
                            toggleNames={Array.from(years.values())}
                            picked={this.state.year}
                            updateDataFilter={this.updateYearFilter.bind(this)}
                            />

            // markua-start-insert
                <ControlRow data={data}
                            toggleNames={Array.from(jobTitles.values())}
                            picked={this.state.jobTitle}
                            updateDataFilter={this.updateJobTitleFilter.bind(this)} />

                <ControlRow data={data}
                            toggleNames={Array.from(USstates.values())}
                            picked={this.state.USstate}
                            updateDataFilter={this.updateUSstateFilter.bind(this)}
                            capitalize="true" />
                // markua-end-insert
            </div>
        )
    }
}


//
// Example 5
//
// src/components/Controls/index.js
class Controls extends Component {
    state = {
        yearFilter: () => true,
        year: '*',
        // markua-start-insert
        jobTitleFilter: () => true,
        jobTitle: '*',
        USstateFilter: () => true,
        USstate: '*'
        // markua-end-insert
    }

    // ...
    updateJobTitleFilter(title, reset) {
        let filter = (d) => d.clean_job_title === title;

        if (reset || !title) {
            filter = () => true;
            title = '*';
        }

        this.setState({jobTitleFilter: filter,
                       jobTitle: title});
    }

    updateUSstateFilter(USstate, reset) {
        let filter = (d) => d.USstate === USstate;

        if (reset || !USstate) {
            filter = () => true;
            USstate = '*';
        }

        this.setState({USstateFilter: filter,
                       USstate: USstate});
    }
    // ...
}


//
// Example 6
//
// src/components/Controls/index.js
class Controls extends Component {
    // ...
    reportUpdateUpTheChain() {
        this.props.updateDataFilter(
            ((filters) => {
                return (d) =>  filters.yearFilter(d)
                // markua-start-insert
                    && filters.jobTitleFilter(d)
                    && filters.USstateFilter(d);
                // markua-end-insert
            })(this.state),
            {
                year: this.state.year,
                // markua-start-insert
                jobTitle: this.state.jobTitle,
                USstate: this.state.USstate
                // markua-end-insert
            }
        );
    }
    // ...
}


//
// Example 7
//
// src/components/Controls/index.js
class Controls extends Component {
    // ...
    componentDidMount() {
        let [year, USstate, jobTitle] = window.location
                                              .hash
                                              .replace('#', '')
                                              .split("-");

        if (year !== '*' && year) {
            this.updateYearFilter(Number(year));
        }
        if (USstate !== '*' && USstate) {
            this.updateUSstateFilter(USstate);
        }
        if (jobTitle !== '*' && jobTitle) {
            this.updateJobTitleFilter(jobTitle);
        }
    }

    componentDidUpdate() {
        window.location.hash = [this.state.year || '*',
                                this.state.USstate || '*',
                                this.state.jobTitle || '*'].join("-");

        this.reportUpdateUpTheChain();
    }
    // ...
}
