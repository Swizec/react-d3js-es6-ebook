
//
// Example 1
//
var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3');


var H1BGraph = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
                    <svg width="700" height="500">

                    </svg>
                </div>
            </div>
        );
    }
});


React.render(
    <H1BGraph url="data/h1bs.csv" />,
    document.querySelectorAll('.h1bgraph')[0]
);


//
// Example 2
//
var H1BGraph = React.createClass({
    // leanpub-start-insert
    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: []};
    },

    loadRawData: function () {

    },
    // leanpub-end-insert

    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
                    <svg width="700" height="500">

                    </svg>
                </div>
            </div>
        );
    }
});

//
// Example 3
//
var H1BGraph = React.createClass({
    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: []};
    },

    loadRawData: function () {
        // leanpub-start-insert
        d3.csv(this.props.url)
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
        // leanpub-end-insert
    },

    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
                    <svg width="700" height="500">

                    </svg>
                </div>
            </div>
        );
    }
});

//
// Example 4
//
var H1BGraph = React.createClass({
    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: []};
    },

    loadRawData: function () {
        // leanpub-start-insert
        var dateFormat = d3.time.format("%m/%d/%Y");
        // leanpub-end-insert
        d3.csv(this.props.url)
          // leanpub-start-insert
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      clean_job_title: this.cleanJobs(d['job title']),
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
          // leanpub-end-insert
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
    },

    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
                    <svg width="700" height="500">

                    </svg>
                </div>
            </div>
        );
    }
});


//
// Example 5
//
var H1BGraph = React.createClass({
    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: []};
    },

    loadRawData: function () {
        // leanpub-start-insert
        var dateFormat = d3.time.format("%m/%d/%Y");
        // leanpub-end-insert
        d3.csv(this.props.url)
          // leanpub-start-insert
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      clean_job_title: this.cleanJobs(d['job title']),
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
          // leanpub-end-insert
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
    },

    render: function () {
        // leanpub-start-insert
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }
        // leanpub-end-insert

        return (
            <div className="row">
                <div className="col-md-12">
                    <svg width="700" height="500">

                    </svg>
                </div>
            </div>
        );
    }
});
