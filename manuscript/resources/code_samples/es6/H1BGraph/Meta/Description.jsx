
//
// Example 1
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    render() {
        return (
            <p className="lead">This is a description</p>
        )
    }
}

export default Description;

//
// Example 2
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    // leanpub-start-insert
    getAllDataByYear(year, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.submit_date.getFullYear() == year);
    }

    getAllDataByUSState(USstate, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.state == USstate);
    }
    // leanpub-end-insert

    render() {
        return (
            <p className="lead">This is a description</p>
        )
    }
}

export default Description;


//
// Example 3
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    getAllDataByYear(year, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.submit_date.getFullYear() == year);
    }

    getAllDataByUSState(USstate, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.state == USstate);
    }

    // leanpub-start-insert
    getPreviousYearFragment() {
        let years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            let year = years[0],
                lastYear = this.getAllDataByYear(year-1),
                USstates = this.getUSStates();


            if (USstates.length == 1) {
                lastYear = this.getAllDataByState(USstates[0], lastYear);
            }

            if (this.props.data.length/lastYear.length > 2) {
                let times_more = (this.props.data.length/lastYear.length).toFixed();

                fragment = `, ${times_more} times more than the year before`;
            }else{
                let percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

                fragment = `, ${Math.abs(percent)}% ${percent > 0 ? "more" : "less"} than the year before`;
            }
        }

        return fragment;
    }
    // leanpub-end-insert

    render() {
        return (
            <p className="lead">This is a description</p>
        )
    }
}

export default Description;


//
// Example 4
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    getAllDataByYear(year, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.submit_date.getFullYear() == year);
    }

    getAllDataByUSState(USstate, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.state == USstate);
    }

    getPreviousYearFragment() {
        let years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            let year = years[0],
                lastYear = this.getAllDataByYear(year-1),
                USstates = this.getUSStates();


            if (USstates.length == 1) {
                lastYear = this.getAllDataByState(USstates[0], lastYear);
            }

            if (this.props.data.length/lastYear.length > 2) {
                let times_more = (this.props.data.length/lastYear.length).toFixed();

                fragment = `, ${times_more} times more than the year before`;
            }else{
                let percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

                fragment = `, ${Math.abs(percent)}% ${percent > 0 ? "more" : "less"} than the year before`;
            }
        }

        return fragment;
    }

    // leanpub-start-insert
    getYearFragment() {
        let years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    }

    getUSStateFragment() {
        let states = this.getUSStates(),
            fragment;

        if (states.length > 1) {
            fragment = "US";
        }else{
            fragment = StatesMap[states[0].toUpperCase()];
        }

        return fragment;
    }
    // leanpub-end-insert

    render() {
        return (
            <p className="lead">This is a description</p>
        )
    }
}

export default Description;


//
// Example 5
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    getAllDataByYear(year, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.submit_date.getFullYear() == year);
    }

    getAllDataByUSState(USstate, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.state == USstate);
    }

    getPreviousYearFragment() {
        let years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            let year = years[0],
                lastYear = this.getAllDataByYear(year-1),
                USstates = this.getUSStates();


            if (USstates.length == 1) {
                lastYear = this.getAllDataByState(USstates[0], lastYear);
            }

            if (this.props.data.length/lastYear.length > 2) {
                let times_more = (this.props.data.length/lastYear.length).toFixed();

                fragment = `, ${times_more} times more than the year before`;
            }else{
                let percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

                fragment = `, ${Math.abs(percent)}% ${percent > 0 ? "more" : "less"} than the year before`;
            }
        }

        return fragment;
    }

    getYearFragment() {
        let years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    }

    getUSStateFragment() {
        let states = this.getUSStates(),
            fragment;

        if (states.length > 1) {
            fragment = "US";
        }else{
            fragment = StatesMap[states[0].toUpperCase()];
        }

        return fragment;
    }

    render() {
        // leanpub-start-insert
        let formatter = this.getFormatter(),
            mean = d3.mean(this.props.data,
                           (d) => d.base_salary),
            deviation = d3.deviation(this.props.data,
                                     (d) => d.base_salary);

        let yearFragment = this.getYearFragment(),
            USStateFragment = this.getUSStateFragment(),
            previousYearFragment = this.getPreviousYearFragment(),
            N = formatter(this.props.data.length),
            min_salary = formatter(mean-deviation),
            max_salary = formatter(mean+deviation);
        // leanpub-end-insert

        return (
            // leanpub-start-delete
            <p className="lead">This is a description</p>
            // leanpub-end-delete
            // leanpub-start-insert
            <p className="lead">{yearFragment.length ? yearFragment : "Since 2012"} the {USStateFragment} software industry {yearFragment.length ? "gave" : "has given"} jobs to {N} foreign nationals{previousYearFragment}. Most of them made between ${min_salary} and ${max_salary} per year.</p>
            // leanpub-end-insert
        );
    }

}

export default Description;


// ---
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';


class Description extends Meta {
    getAllDataByYear(year, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.submit_date.getFullYear() == year);
    }

    getAllDataByJobTitle(jobTitle, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.clean_job_title == jobTitle);
    }

    getAllDataByState(state, data) {
        data || (data = this.props.allData);

        return data.filter((d) => d.state == state);
    }

    getYearFragment() {
        let years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    }

    getPreviousYearFragment() {
        let years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            let year = years[0],
                lastYear = this.getAllDataByYear(year-1);

            let states = this.getUSStates(),
                jobTitles = this.getJobTitles();

            if (jobTitles.length == 1) {
                lastYear = this.getAllDataByJobTitle(jobTitles[0], lastYear);
            }

            if (states.length == 1) {
                lastYear = this.getAllDataByState(states[0], lastYear);
            }

            let percent = ((this.props.data.length-lastYear.length)/this.props.data.length*100);

            if (this.props.data.length/lastYear.length > 2) {
                fragment = ", "+(this.props.data.length/lastYear.length).toFixed()+" times more than the year before";
            }else{
                let percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

                fragment = `, ${Math.abs(percent)}% ${percent > 0 ? "more" : "less"} than the year before`;
            }
        }

        return fragment;
    }

    getJobTitleFragment() {
        let jobTitles = this.getJobTitles(),
            fragment;

        if (jobTitles.length > 1) {
            fragment = "foreign nationals";
        }else{
            if (jobTitles[0] == "other") {
                fragment = "foreign nationals";
            }else{
                fragment = `foreign software ${jobTitles[0]}s`;
            }
        }

        return fragment;
    }

    getStateFragment() {
        let states = this.getUSStates(),
            fragment;

        if (states.length > 1) {
            fragment = "US";
        }else{
            fragment = StatesMap[states[0].toUpperCase()];
        }

        return fragment;
    }

    getCityFragment() {
        let byCity = _.groupBy(this.props.data, "city"),

            ordered = _.sortBy(_.keys(byCity)
                                .map((city) => byCity[city])
                                .filter((d) => d.length/this.props.data.length > 0.01),
                               (d) => d3.mean(_.pluck(d, 'base_salary'))),

            best = ordered[ordered.length-1],
            mean = d3.mean(_.pluck(best, 'base_salary'));

        let city = best[0].city
                          .split(" ")
                          .map((w) => w.capitalize())
                          .join(" ");

        let jobFragment = this.getJobTitleFragment()
                              .replace("foreign nationals", "")
                              .replace("foreign", "");

        return (
            <span>
                The best city {jobFragment.length ? `for ${jobFragment}` : "to be in"} {this.getYearFragment().length ? "was" : "is"} {city} with an average salary of ${this.getFormatter()(mean)}.
            </span>
        );
    }

    render() {
        let formatter = this.getFormatter(),
            mean = d3.mean(this.props.data,
                           (d) => d.base_salary),
            deviation = d3.deviation(this.props.data,
                                     (d) => d.base_salary);

        let yearFragment = this.getYearFragment();

        return (
            <p className="lead">{yearFragment.length ? yearFragment : "Since 2012"} the {this.getStateFragment()} software industry {yearFragment.length ? "gave" : "has given"} jobs to {formatter(this.props.data.length)} {this.getJobTitleFragment()}{this.getPreviousYearFragment()}. Most of them made between ${formatter(mean-deviation)} and ${formatter(mean+deviation)} per year. {this.getCityFragment()}</p>
        );
    }
}

export default Description;
