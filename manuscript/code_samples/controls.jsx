
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
