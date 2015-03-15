
//
// Example 1
//
var React = require('react'),
    d3 = require('d3'),
    _ = require('lodash'),
    States = require('./states.js');

var MetaMixin = {
};

var Title = React.createClass({
    mixins: [MetaMixin],

    render: function () {
        return null;
    }
});

var Description = React.createClass({
    mixins: [MetaMixin],

    render: function () {
        return null;
    }
});

module.exports = {
    Title: Title,
    Description: Description
}

//
// Example 2
//
var MetaMixin = {
    getYears: function (data) {
        data || (data = this.props.data);

        return _.keys(
            _.groupBy(this.props.data,
                      function (d) { return d.submit_date.getFullYear(); })
        );
    },

    getFormatter: function (data) {
        data || (data = this.props.data);

        return d3.scale.linear()
                 .domain(d3.extent(this.props.data,
                                   function (d) { return d.base_salary; }))
                 .tickFormat();
    }

    getAllDataByYear: function (year, data) {
        data || (data = this.props.allData);

        return data.filter(function (d) {
            return d.submit_date.getFullYear() == year;
        });
    }
};

//
// Example 3
//
var Title = React.createClass({
    mixins: [MetaMixin],

    // leanpub-start-insert
    getYearsFragment: function () {
        var years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "in "+years[0];
        }

        return fragment;
    },
    // leanpub-end-insert

    render: function () {
        return null;
    }
});

//
// Example 4
//
var Title = React.createClass({
    mixins: [MetaMixin],

    getYearsFragment: function () {
        var years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "in "+years[0];
        }

        return fragment;
    },

    render: function () {
        // leanpub-start-delete
        return null
        // leanpub-end-delete

        // leanpub-start-insert
        var mean = d3.mean(this.props.data,
                           function (d) { return d.base_salary; }),
            format = this.getFormatter();

        var
            yearsFragment = this.getYearsFragment(),
            title;

        return (
            <h2>H1B workers in the software industry {yearsFragment.length ? "made" : "make"} ${format(mean)}/year {yearsFragment}</h2>
        );
        // leanpub-end-insert
    }
});

//
// Example 5
//
var Description = React.createClass({
    mixins: [MetaMixin],

    // leanpub-start-insert
    getYearFragment: function () {
        var years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    },
    // leanpub-end-insert

    render: function () {
        return null;
    }
});

//
// Example 6
//
var Description = React.createClass({
    mixins: [MetaMixin],

    getYearFragment: function () {
        var years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    },

    getPreviousYearFragment: function () {
        var years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            var year = years[0],
                lastYear = this.getAllDataByYear(year-1),
                percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

            fragment = ", "+Math.abs(percent)+"% "+(percent > 0 ? "more" : "less")+" than the year before";
        }

        return fragment;
    },

    render: function () {
        return null
    }
});

//
// Example 7
//
var Description = React.createClass({
    mixins: [MetaMixin],

    getYearFragment: function () {
        var years = this.getYears(),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else{
            fragment = "In "+years[0];
        }

        return fragment;
    },

    getPreviousYearFragment: function () {
        var years = this.getYears().map(Number),
            fragment;

        if (years.length > 1) {
            fragment = "";
        }else if (years[0] == 2012) {
            fragment = "";
        }else{
            var year = years[0],
                lastYear = this.getAllDataByYear(year-1),
                percent = ((1-lastYear.length/this.props.data.length)*100).toFixed();

            fragment = ", "+Math.abs(percent)+"% "+(percent > 0 ? "more" : "less")+" than the year before";
        }

        return fragment;
    },

    render: function () {
        // leanpub-start-delete
        return null;
        // leanpub-end-delete
        // leanpub-start-insert
        var formatter = this.getFormatter(),
            mean = d3.mean(this.props.data,
                           function (d) { return d.base_salary; }),
            deviation = d3.deviation(this.props.data,
                                     function (d) { return d.base_salary; });

        var yearFragment = this.getYearFragment(),


        return (
            <p className="lead">{yearFragment.length ? yearFragment : "Since 2012"} the US software industry {yearFragment.length ? "gave" : "has given"} jobs to {formatter(this.props.data.length)} foreign nationals{this.getPreviousYearFragment()}. Most of them made between ${formatter(mean-deviation)} and ${formatter(mean+deviation)} per year.</p>
        );
        // leanpub-end-insert
    }
});
