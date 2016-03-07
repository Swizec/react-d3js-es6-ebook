
//
// Example 1
//
import React, { Component } from 'react';

class Toggle extends Component {
    render() {
        return null;
    }
}

export default Toggle;


//
// Example 2
//
import React, { Component } from 'react';

class Toggle extends Component {
    render() {
        // leanpub-start-delete
        return null;
        // leanpub-end-delete
        // leanpub-start-insert
        let className = "btn btn-default";

        if (this.state.value) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={::this.handleClick}>
                {this.props.label}
            </button>
        );
        // leanpub-end-insert
    }
}

export default Toggle;


//
// Example 3
//
import React, { Component } from 'react';

class Toggle extends Component {
    // leanpub-start-insert
    constructor() {
        super();

        this.state = {value: false};
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    }

    handleClick(event) {
       let newValue = !this.state.value;
       this.setState({value: newValue});
    }
    // leanpub-end-insert

    render() {
        let className = "btn btn-default";

        if (this.state.value) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={::this.handleClick}>
                {this.props.label}
            </button>
        );
    }
}

export default Toggle;


//
// Example 3
//
import React, { Component } from 'react';

class Toggle extends Component {
    constructor() {
        super();

        this.state = {value: false};
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    }

    handleClick(event) {
        let newValue = !this.state.value;
        this.setState({value: newValue});
        // leanpub-start-insert
        this.props.onClick(this.props.name, newValue);
        // leanpub-end-insert
    }

    render() {
        let className = "btn btn-default";

        if (this.state.value) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={::this.handleClick}>
                {this.props.label}
            </button>
        );
    }
}

export default Toggle;


/// ---

import React, { Component } from 'react';

class Toggle extends Component {
    constructor() {
        super();

        this.state = {value: false};
    }

    handleClick(event) {
       let newValue = !this.state.value;
       this.setState({value: newValue});
       this.props.onClick(this.props.name, newValue);
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    }

    render() {
        let className = "btn btn-default";

        if (this.state.value) {
            className += " btn-primary";
        }

        return (
            <button className={className} onClick={::this.handleClick}>
                {this.props.label}
            </button>
        );
    }
}

export default Toggle;
