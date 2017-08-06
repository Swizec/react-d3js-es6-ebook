
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

//
// Example 6
//
var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    // leanpub-start-insert
    drawers = require('./drawers.jsx');
    // leanpub-end-insert

var H1BGraph = React.createClass({
    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: []};
    },

    loadRawData: function () {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
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
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        // leanpub-start-insert
        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        },
            fullWidth = 700;
        // leanpub-end-insert

        return (
            <div className="row">
                <div className="col-md-12">
                    // leanpub-start-insert
                    <svg width={fullWidth} height={params.height}>
                        <drawers.Histogram {...params} data={this.state.rawData} />
                    </svg>
                    // leanpub-end-insert
                </div>
            </div>
        );
    }
});

//
// Example 7
//

var H1BGraph = React.createClass({
    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: []};
    },

    loadRawData: function () {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
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
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        // leanpub-start-insert
        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        },
            fullWidth = 700;
        // leanpub-end-insert

        return (
            // leanpub-start-insert
            <div>
            // leanpub-end-insert
                <div className="row">
                    <div className="col-md-12">
                        <svg width={fullWidth} height={params.height}>
                            <drawers.Histogram {...params} data={this.state.rawData} />
                        </svg>
                    </div>
                </div>
            // leanpub-start-insert
                <Controls data={this.state.rawData} updateDataFilter={this.updateDataFilter} />
            </div>
            // leanpub-end-insert
        );
    }
});


//
// Example 8
//
var H1BGraph = React.createClass({
    loadRawData: function () {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
    },

    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: [],
                // leanpub-start-insert
                dataFilter: function () { return true; }};
        // leanpub-end-insert
    },

    // leanpub-start-insert
    updateDataFilter: function (filter) {
        this.setState({dataFilter: filter});
    },
    // leanpub-end-insert

    render: function () {
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        },
            fullWidth = 700;

        return (
            <div className="row">
                <div className="col-md-12">
                    <svg width={fullWidth} height={params.height}>
                        <drawers.Histogram {...params} data={this.state.rawData} />
                    </svg>
                </div>
            </div>
        );
    }

});

//
// Example 9
//
var H1BGraph = React.createClass({
    loadRawData: function () {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
    },

    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: [],
                dataFilter: function () { return true; }};
    },

    updateDataFilter: function (filter) {
        this.setState({dataFilter: filter});
    },

    render: function () {
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        },
            fullWidth = 700;


        // leanpub-start-insert
        var filteredData = this.state.rawData.filter(this.state.dataFilter);
        // leanpub-end-insert

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <svg width={fullWidth} height={params.height}>
                            // leanpub-start-delete
                            <drawers.Histogram {...params} data={this.state.rawData} />
                            // leanpub-end-delete
                            // leanpub-start-insert
                            <drawers.Histogram {...params} data={filteredData} />
                            // leanpub-end-insert
                        </svg>
                    </div>
                </div>
                <Controls data={this.state.rawData} updateDataFilter={this.updateDataFilter} />
            </div>
        );
    }

});


//
// Example 10
//
var H1BGraph = React.createClass({
    loadRawData: function () {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
    },

    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: [],
                dataFilter: function () { return true; }};
    },

    updateDataFilter: function (filter) {
        this.setState({dataFilter: filter});
    },

    render: function () {
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        },
            fullWidth = 700;


        var filteredData = this.state.rawData.filter(this.state.dataFilter);

        return (
            <div>
                // leanpub-start-insert
                <meta.Title data={filteredData} />
                // leanpub-end-insert
                <div className="row">
                    <div className="col-md-12">
                        <svg width={fullWidth} height={params.height}>
                            <drawers.Histogram {...params} data={filteredData} />
                        </svg>
                    </div>
                </div>
                <Controls data={this.state.rawData} updateDataFilter={this.updateDataFilter} />
            </div>
        );
    }

});

//
// Example 11
//
var H1BGraph = React.createClass({
    loadRawData: function () {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
          .row(function (d) {
              if (!d['base salary']) {
                  return null;
              }

              return {employer: d.employer,
                      submit_date: dateFormat.parse(d['submit date']),
                      start_date: dateFormat.parse(d['start date']),
                      case_status: d['case status'],
                      job_title: d['job title'],
                      base_salary: Number(d['base salary']),
                      salary_to: d['salary to'] ? Number(d['salary to']) : null,
                      city: d.city,
                      state: d.state};
          }.bind(this))
          .get(function (error, rows) {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          }.bind(this));
    },

    componentWillMount: function () {
        this.loadRawData();
    },

    getInitialState: function () {
        return {rawData: [],
                dataFilter: function () { return true; }};
    },

    updateDataFilter: function (filter) {
        this.setState({dataFilter: filter});
    },

    render: function () {
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        },
            fullWidth = 700;


        var filteredData = this.state.rawData.filter(this.state.dataFilter);

        return (
            <div>
                <meta.Title data={filteredData} />
                // leanpub-start-insert
                <meta.Description data={filteredData} allData={this.state.rawData} />
                // leanpub-end-insert
                <div className="row">
                    <div className="col-md-12">
                        <svg width={fullWidth} height={params.height}>
                            <drawers.Histogram {...params} data={filteredData} />
                        </svg>
                    </div>
                </div>
                <Controls data={this.state.rawData} updateDataFilter={this.updateDataFilter} />
            </div>
        );
    }

});
