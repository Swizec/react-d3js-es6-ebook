
//
// Example 1
//
var React = require('react'),
    _ = require('lodash');

var Controls = React.createClass({
    render: function () {

        return (
            <div>

            </div>
        )
    }
});

module.exports = Controls;

//
// Example 2
//
var Controls = React.createClass({
    render: function () {
        // leanpub-start-insert
        var getYears = function (data) {
            return _.keys(_.groupBy(data,
                                    function (d) {
                                        return d.submit_date.getFullYear()
                                    }))
                    .map(Number);
        };
        // leanpub-end-insert

        return (
            <div>
                // leanpub-start-insert
                <ControlRow data={this.props.data}
                            getToggleValues={getYears}
                            updateDataFilter={this.updateYearFilter} />
                // leanpub-end-insert
            </div>
        )
    }
});

//
// Example 3
//
var ControlRow = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
            {this.props.getToggleValues(this.props.data).map(function (value) {
                var key = "toggle-"+value,
                    label = value;

                return (
                    <Toggle label={label}
                            value={value}
                            key={key}
                            on={this.state.togglesOn[value]}
                            onClick={this.makePick} />
                );
             }.bind(this))}
                </div>
            </div>
        );
    }
});

//
// Example 4
//
var ControlRow = React.createClass({
    // leanpub-start-insert
    makePick: function (picked, newState) {
        var togglesOn = this.state.togglesOn;

        togglesOn = _.mapValues(togglesOn,
                              function (value, key) {
                                  return newState && key == picked;
                              });

        this.setState({togglesOn: togglesOn});
    },

    getInitialState: function () {
        var toggles = this.props.getToggleValues(this.props.data),
            togglesOn = _.zipObject(toggles,
                                    toggles.map(function () { return false; }));

        return {togglesOn: togglesOn};
    },
    // leanpub-end-insert

    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
            {this.props.getToggleValues(this.props.data).map(function (value) {
                var key = "toggle-"+value,
                    label = value;

                return (
                    <Toggle label={label}
                            value={value}
                            key={key}
                            on={this.state.togglesOn[value]}
                            onClick={this.makePick} />
                );
             }.bind(this))}
                </div>
            </div>
        );
    }
});

//
// Example 5
//
var Toggle = React.createClass({
    getInitialState: function () {
        return {on: false};
    },

    componentWillReceiveProps: function (newProps) {
        this.setState({on: newProps.on});
    },

    render: function () {
        var className = "btn btn-default";

        if (this.state.on) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={this.handleClick}>
                {this.props.label}
            </button>
        );
    }
});

//
// Example 6
//
var Toggle = React.createClass({
    getInitialState: function () {
        return {on: false};
    },
    // leanpub-start-insert
    handleClick: function (event) {
       var newState = !this.state.on;
       this.setState({on: newState});
       this.props.onClick(this.props.value, newState);
    },
    // leanpub-end-insert

    componentWillReceiveProps: function (newProps) {
        this.setState({on: newProps.on});
    },

    render: function () {
        var className = "btn btn-default";

        if (this.state.on) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={this.handleClick}>
                {this.props.label}
            </button>
        );
    }
});

//
// Example 7
//
var ControlRow = React.createClass({
    makePick: function (picked, newState) {
        var togglesOn = this.state.togglesOn;

        togglesOn = _.mapValues(togglesOn,
                              function (value, key) {
                                  return newState && key == picked;
                              });

        // leanpub-start-insert
        // if newState is false, we want to reset
        this.props.updateDataFilter(picked, !newState);
        // leanpub-end-insert

        this.setState({togglesOn: togglesOn});
    },

    getInitialState: function () {
        var toggles = this.props.getToggleValues(this.props.data),
            togglesOn = _.zipObject(toggles,
                                    toggles.map(function () { return false; }));

        return {togglesOn: togglesOn};
    },

    componentWillMount: function () {
        var hash = window.location.hash.replace('#', '').split("-");

        if (hash.length) {
            var fromUrl = hash[this.props.hashPart];

            if (fromUrl != '*' && fromUrl != '') {
                this.makePick(fromUrl, true);
            }else{
                // reset
                this.props.updateDataFilter('', true);
            }
        }
    },

    render: function () {

        return (
            <div className="row">
                <div className="col-md-12">
            {this.props.getToggleValues(this.props.data).map(function (value) {
                var key = "toggle-"+value,
                    label = value;

                if (this.props.capitalize) {
                    label = label.toUpperCase();
                }

                return (
                    <Toggle label={label}
                            value={value}
                            key={key}
                            on={this.state.togglesOn[value]}
                            onClick={this.makePick} />
                );
             }.bind(this))}
                </div>
            </div>
        );
    }
});

//
// Example 8
//
var Controls = React.createClass({
    // leanpub-start-insert
    updateYearFilter: function (year, reset) {
        var filter = function (d) {
            return d.submit_date.getFullYear() == year;
        };

        if (reset || !year) {
            filter = function () { return true; };
        }

        this.setState({yearFilter: filter});
    },

    getInitialState: function () {
        return {yearFilter: function () { return true; }};
    },
    // leanpub-end-insert

    render: function () {
        var getYears = function (data) {
            return _.keys(_.groupBy(data,
                                    function (d) {
                                        return d.submit_date.getFullYear()
                                    }))
                    .map(Number);
        };

        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleValues={getYears}
                            updateDataFilter={this.updateYearFilter} />
            </div>
        )
    }
});

//
// Example 9
//
var Controls = React.createClass({
    updateYearFilter: function (year, reset) {
        var filter = function (d) {
            return d.submit_date.getFullYear() == year;
        };

        if (reset || !year) {
            filter = function () { return true; };
        }

        this.setState({yearFilter: filter});
    },

    getInitialState: function () {
        return {yearFilter: function () { return true; }};
    },

    render: function () {
        var getYears = function (data) {
            return _.keys(_.groupBy(data,
                                    function (d) {
                                        return d.submit_date.getFullYear()
                                    }))
                    .map(Number);
        };

        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleValues={getYears}
                            updateDataFilter={this.updateYearFilter} />
            </div>
        )
    }
});

//
// Example 10
//
var Controls = React.createClass({
    updateYearFilter: function (year, reset) {
        var filter = function (d) {
            return d.submit_date.getFullYear() == year;
        };

        if (reset || !year) {
            filter = function () { return true; };
        }

        this.setState({yearFilter: filter});
    },

    getInitialState: function () {
        return {yearFilter: function () { return true; }};
    },

    // leanpub-start-insert
    componentDidUpdate: function () {
        this.props.updateDataFilter(
            (function (filters) {
                return function (d) {
                    return filters.yearFilter(d)
                };
            })(this.state)
        );
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    },
    // leanpub-end-insert

    render: function () {
        var getYears = function (data) {
            return _.keys(_.groupBy(data,
                                    function (d) {
                                        return d.submit_date.getFullYear()
                                    }))
                    .map(Number);
        };

        return (
            <div>
                <ControlRow data={this.props.data}
                            getToggleValues={getYears}
                            updateDataFilter={this.updateYearFilter} />
            </div>
        )
    }
});
