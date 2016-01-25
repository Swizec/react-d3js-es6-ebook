//
// Example 1
//
import React, { Component } from 'react';
import _ from 'lodash';

class Controls extends Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Controls;


//
// Example 2
//
import React, { Component } from 'react';
import _ from 'lodash';

// leanpub-start-insert
import ControlRow from './ControlRow';
// leanpub-end-insert

class Controls extends Component {
    render() {
        // leanpub-start-insert
        let getYears = (data) => {
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
        }
        // leanpub-end-insert

        return (
            <div>
                // leanpub-start-insert
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                            updateDataFilter={() => true} />
                // leanpub-end-insert
            </div>
        )
    }
}

export default Controls;


//
// Example 3
//
import React, { Component } from 'react';
import _ from 'lodash';

import ControlRow from './ControlRow';

class Controls extends Component {
    // leanpub-start-insert
    constructor() {
        super();

        this.state = {
            yearFilter: () => true,
            year: '*',
        };
    }

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date.getFullYear() == year;

        if (reset || !year) {
            filter = () => true;
            year = '*';
        }

        this.setState({yearFilter: filter,
                       year: year});
    }
    // leanpub-end-insert

    render() {
        let getYears = (data) => {
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
        }

        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                // leanpub-start-delete
                            updateDataFilter={() => true} />
                // leanpub-end-delete
                // leanpub-start-insert
                            updateDataFilter={::this.updateYearFilter} />
                // leanpub-end-insert
            </div>
        )
    }
}

export default Controls;


//
// Example 4
//
import React, { Component } from 'react';
import _ from 'lodash';

import ControlRow from './ControlRow';

class Controls extends Component {
    constructor() {
        super();

        this.state = {
            yearFilter: () => true,
            year: '*',
        };
    }

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date.getFullYear() == year;

        if (reset || !year) {
            filter = () => true;
            year = '*';
        }

        this.setState({yearFilter: filter,
                       year: year});
    }

    componentDidUpdate() {
        window.location.hash = [this.state.year || '*',
                                this.state.state || '*',
                                this.state.jobTitle || '*'].join("-");

        this.props.updateDataFilter(
            ((filters) => {
                return (d) =>  filters.yearFilter(d)
                            && filters.jobTitleFilter(d)
                            && filters.stateFilter(d);
            })(this.state)
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    render() {
        let getYears = (data) => {
            return _.keys(_.groupBy(data,
                                    (d) => d.submit_date.getFullYear()))
                    .map(Number);
        }

        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                            updateDataFilter={::this.updateYearFilter} />
            </div>
        )
    }
}

export default Controls;


/// ----

import React, { Component } from 'react';
import _ from 'lodash';

import ControlRow from './ControlRow';

class Controls extends Component {
    constructor() {
        super();

        this.state = {
            yearFilter: () => true,
            jobTitleFilter: () => true,
            stateFilter: () => true,
            year: '*',
            state: '*',
            jobTitle: '*'
        };
    }

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date.getFullYear() == year;

        if (reset || !year) {
            filter = () => true;
            year = '*';
        }

        this.setState({yearFilter: filter,
                       year: year});
    }

    updateJobTitleFilter(title, reset) {
        var filter = (d) => d.clean_job_title == title;

        if (reset || !title) {
            filter = () => true;
            title = '*';
        }

        this.setState({jobTitleFilter: filter,
                       jobTitle: title});
    }

    updateStateFilter(state, reset) {
        var filter = (d) => d.state == state;

        if (reset || !state) {
            filter = () => true;
            state = '*';
        }

        this.setState({stateFilter: filter,
                       state: state});
    }

    // leanpub-start-insert
    componentDidUpdate() {
        this.props.updateDataFilter(
            ((filters) => {
                return (d) =>  filters.yearFilter(d);
            })(this.state)
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }
    // leanpub-end-insert

    render() {
        let getYears = (data) => _.keys(_.groupBy(data,
                                                  (d) => d.submit_date.getFullYear()))
                                  .map(Number);

        let getJobTitles = (data) => _.keys(_.groupBy(data, (d) => d.clean_job_title));


        let getStates = (data) => _.sortBy(_.keys(_.groupBy(data, (d) => d.state)));


        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleNames={getYears}
                            hashPart="0"
                            updateDataFilter={::this.updateYearFilter} />

                <ControlRow data={this.props.data}
                            getToggleNames={getJobTitles}
                            hashPart="2"
                            updateDataFilter={::this.updateJobTitleFilter} />

                <ControlRow data={this.props.data}
                            getToggleNames={getStates}
                            hashPart="1"
                            updateDataFilter={::this.updateStateFilter}
                            capitalize="true" />
            </div>
        )
    }
}

export default Controls;
