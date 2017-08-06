
//
// Example 1
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Title extends Meta {
    render() {
        let title = (<h2>This is a title</h2>);


        return title;
    }
}

export default Title;


//
// Example 2
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Title extends Meta {
    // leanpub-start-insert
    getYearsFragment() {
        let years = this.getYears(),
            title;

        if (years.length > 1) {
            title = "";
        }else{
            title = `in ${years[0]}`;
        }

        return title;
    }

    getUSStateFragment() {
        var states = this.getUSStates(),
            title;


        if (states.length > 1) {
            title = "";
        }else{
            title = `in ${StatesMap[states[0].toUpperCase()]}`;
        }

        return title;
    }
    // leanpub-end-insert

    render() {
        let title = (<h2>This is a title</h2>);

        return title;
    }
}

export default Title;


//
// Example 3
//
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Title extends Meta {
    // leanpub-start-insert
    getYearsFragment() {
        let years = this.getYears(),
            title;

        if (years.length > 1) {
            title = "";
        }else{
            title = `in ${years[0]}`;
        }

        return title;
    }

    getUSStateFragment() {
        var states = this.getUSStates(),
            title;


        if (states.length > 1) {
            title = "";
        }else{
            title = `In ${StatesMap[states[0].toUpperCase()]}`;
        }

        return title;
    }
    // leanpub-end-insert

    render() {
        // leanpub-start-delete
        let title = (<h2>This is a title</h2>);
        // leanpub-end-delete
        // leanpub-start-insert
        let mean = d3.mean(this.props.data, (d) => d.base_salary),
            format = this.getFormatter();

        let
            yearsFragment = this.getYearsFragment(),
            USstateFragment = this.getUSStateFragment(),
            title;

        if (yearsFragment && USstateFragment) {
            title = (
                <h2>{USstateFragment}, H1B workers in the software industry made ${format(mean)}/year {yearsFragment}</h2>
            );
        }else{
            title = (
                <h2>H1B workers in the software industry {yearsFragment.length ? "made" : "make"} ${format(mean)}/year {USstateFragment} {yearsFragment}</h2>
            );
        }
        // leanpub-end-insert

        return title;
    }
}

export default Title;


// ---
import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Title extends Meta {
    getYearsFragment() {
        var years = this.getYears(),
            title;

        if (years.length > 1) {
            title = "";
        }else{
            title = `in ${years[0]}`;
        }

        return title;
    }

    getStateFragment() {
        var states = this.getUSStates(),
            title;


        if (states.length > 1) {
            title = "";
        }else{
            title = `in ${StatesMap[states[0].toUpperCase()]}`;
        }

        return title;
    }

    getJobTitleFragment() {
        var jobTitles = this.getJobTitles(),
            title;

        if (jobTitles.length > 1) {
            title = "H1B workers in the software industry";
        }else{
            if (jobTitles[0] == "other") {
                title = "Other H1B workers in the software industry";
            }else{
                title = `Software ${jobTitles[0]}s on an H1B`;
            }
        }

        return title;
    }

    render() {
        var mean = d3.mean(this.props.data, (d) => d.base_salary),
            format = this.getFormatter();

        var
            yearsFragment = this.getYearsFragment(),
            jobTitleFragment = this.getJobTitleFragment(),
            stateFragment = this.getStateFragment(),
            title;

        if (yearsFragment && stateFragment) {
            title = (
                <h2>{stateFragment.capitalize()}, {jobTitleFragment.match(/^H1B/) ? jobTitleFragment : jobTitleFragment.decapitalize()} {yearsFragment.length ? "made" : "make"} ${format(mean)}/year {yearsFragment}</h2>
            );
        }else{
            title = (
                <h2>{jobTitleFragment} {yearsFragment.length ? "made" : "make"} ${format(mean)}/year {stateFragment} {yearsFragment}</h2>
            );
        }

        return title;
    }
}

export default Title;
