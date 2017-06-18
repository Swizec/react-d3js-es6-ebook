
//
// Example 1
//
// src/components/Meta/Title.js
import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { mean as d3mean, extent as d3extent } from 'd3-array';

import USStatesMap from './USStatesMap';

class Title extends Component {
    get yearsFragment() {
    }

    get USstateFragment() {
    }

    get jobTitleFragment() {
    }

    get format() {
    }

    render() {
    }
}

export default Title;


//
// Example 2
//
// src/components/Meta/Title.js
class Title extends Component {
    get yearsFragment() {
        const year = this.props.filteredBy.year;

        return year === '*' ? "" : `in ${year}`;
    }

    getteFragment() {
        const USstate = this.props.filteredBy.USstate;

        return USstate === '*' ? "" : USStatesMap[USstate.toUpperCase()];
    }

    // ...

    get format() {
        return scaleLinear()
                 .domain(d3extent(this.props.data, d => d.base_salary))
                 .tickFormat();
    }
}

//
// Example 3
//
// src/components/Meta/Title.js
class Title extends Component {
    // ...
    get jobTitleFragment() {
        const { jobTitle, year } = this.props.filteredBy;
        let title = "";

        if (jobTitle === '*') {
            if (year === '*') {
                title = "The average H1B in tech pays";
            }else{
                title = "The average tech H1B paid";
            }
        }else{
            if (jobTitle === '*') {
                title = "H1Bs in tech pay";
            }else{
                title = `Software ${jobTitle}s on an H1B`;

                if (year === '*') {
                    title += " make";
                }else{
                    title += " made";
                }
            }
        }

        return title;
    }
    // ...
}

//
// Example 4
//
// src/components/Meta/Title.js
class Title extends Component {
    // ...
    render() {
        const mean = this.format(d3mean(this.props.data, d => d.base_salary));

        let title;

        if (this.yearsFragment && this.USstateFragment) {
            title = (
                <h2>
                    In {this.USstateFragment}, {this.jobTitleFragment} ${mean}/year {this.yearsFragment}
                </h2>
            );
        }else{
            title = (
                <h2>
                    {this.jobTitleFragment} ${mean}/year {this.USstateFragment ? `in ${this.stateFragment}` : ''} {this.yearsFragment}
                </h2>
            );
        }

        return title;
    }
}
