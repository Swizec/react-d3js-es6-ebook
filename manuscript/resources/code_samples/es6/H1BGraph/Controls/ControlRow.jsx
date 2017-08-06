
//
// Example 1
//
import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">

                </div>
            </div>
        );
    }
}

export default ControlRow;


//
// Example 2
//
import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
    // leanpub-start-insert
    _addToggle(name) {
        let key = `toggle-${name}`,
            label = name;

        if (this.props.capitalize) {
            label = label.toUpperCase();
        }

        return (
            <Toggle label={label}
                    name={name}
                    key={key}
                    value={this.state.toggleValues[name]}
                    onClick={::this.makePick} />
        );
    }
    // leanpub-end-insert

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    // leanpub-start-insert
                    {this.props
                         .getToggleNames(this.props.data)
                         .map((name) => this._addToggle(name))}
                    // leanpub-end-insert
                </div>
            </div>
        );
    }
}

export default ControlRow;


//
// Example 3
//
import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
    // leanpub-start-insert
    makePick(picked, newState) {

    }

    componentWillMount() {
        let toggles = this.props.getToggleNames(this.props.data),
            toggleValues = _.zipObject(toggles,
                                       toggles.map(() => false));

        this.state = {toggleValues: toggleValues};
    }
    // leanpub-end-insert

    _addToggle(nme) {
        let key = `toggle-${name}`,
            label = name;

        if (this.props.capitalize) {
            label = label.toUpperCase();
        }

        return (
            <Toggle label={label}
                    name={name}
                    key={key}
                    value={this.state.toggleValues[name]}
                    onClick={::this.makePick} />
        );
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.props
                         .getToggleNames(this.props.data)
                         .map((name) => this._addToggle(name))}
                </div>
            </div>
        );
    }
}

export default ControlRow;


//
// Example 4
//
import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
    makePick(picked, newState) {
        // leanpub-start-insert
        let toggleValues = this.state.toggleValues;

        toggleValues = _.mapValues(toggleValues,
                                   (value, key) => newState && key == picked);

        // if newState is false, we want to reset
        this.props.updateDataFilter(picked, !newState);

        this.setState({toggleValues: toggleValues});
        // leanpub-end-insert
    }

    componentWillMount() {
        let toggles = this.props.getToggleNames(this.props.data),
            toggleValues = _.zipObject(toggles,
                                       toggles.map(() => false));

        this.state = {toggleValues: toggleValues};
    }
    _addToggle(name) {
        let key = `toggle-${name}`,
            label = name;

        if (this.props.capitalize) {
            label = label.toUpperCase();
        }

        return (
            <Toggle label={label}
                    name={name}
                    key={key}
                    value={this.state.toggleValues[name]}
                    onClick={::this.makePick} />
        );
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.props
                         .getToggleNames(this.props.data)
                         .map((name) => this._addToggle(name))}
                </div>
            </div>
        );
    }
}

export default ControlRow;


/// -----


import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
    constructor() {
        super();
    }

    makePick(picked, newState) {
        var toggleValues = this.state.toggleValues;

        toggleValues = _.mapValues(toggleValues,
                                   (value, key) => newState && key == picked);

        // if newState is false, we want to reset
        this.props.updateDataFilter(picked, !newState);

        this.setState({toggleValues: toggleValues});
    }

    componentWillMount() {
        let hash = window.location.hash.replace('#', '').split("-");

        let toggles = this.props.getToggleNames(this.props.data),
            toggleValues = _.zipObject(toggles,
                                       toggles.map(() => false));

        this.state = {toggleValues: toggleValues};

        if (hash.length) {
            let fromUrl = hash[this.props.hashPart];

            if (fromUrl != '*' && fromUrl != '') {
                this.makePick(fromUrl, true);
            }else{
                // reset
                this.props.updateDataFilter('', true);
            }
        }
    }

    _addToggle(name) {
        let key = `toggle-${name}`,
            label = name;

        if (this.props.capitalize) {
            label = label.toUpperCase();
        }

        return (
            <Toggle label={label}
                    name={name}
                    key={key}
                    value={this.state.toggleValues[name]}
                    onClick={::this.makePick} />
        );
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.props
                         .getToggleNames(this.props.data)
                         .map((name) => this._addToggle(name))}
                </div>
            </div>
        );
    }
}

export default ControlRow;
