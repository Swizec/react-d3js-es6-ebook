
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
        return !_.isEqual)this.state, nextState);
    }

    render() {
    }
}


//
// Example 2
//
// src/components/Controls/index.js
class Controls extends Component {
    // ...

    updateYearFilter(year, reset) {
        let filter = (d) => d.submit_date`.getFullYear() === year;

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
// src/compo7nents/Controls/index.js
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
                            updateDataFilter={this.updateYearFilter.bind(this)} />
            </div>
        )
    }
}
