
//
// Example 1
//
// ./src/components/H1BGraph/Meta/BaseComponent.jsx
import React, { Component } from 'react';
import d3 from 'd3';
import _ from 'lodash';

export default class Meta extends Component {
    getYears(data) {

    }

    getUSStates(data) {

    }

    getFormatter(data) {

    }
}

//
// Example 2
//
import React, { Component } from 'react';
import d3 from 'd3';
import _ from 'lodash';

// ./src/components/H1BGraph/Meta/BaseComponent.jsx
export default class Meta extends Component {
    getYears(data) {
        // leanpub-start-insert
        data || (data = this.props.data);

        return _.keys(_.groupBy(this.props.data,
                                (d) => d.submit_date.getFullYear())
        );
        // leanpub-end-insert
    }

    getUSStates(data) {
        // leanpub-start-insert
        data || (data = this.props.data);

        return _.keys(_.groupBy(this.props.data,
                                (d) => d.state)
        );
        // leanpub-end-insert
    }

    getFormatter(data) {
        // leanpub-start-insert
        data || (data = this.props.data);

        return d3.scale.linear()
                 .domain(d3.extent(this.props.data,
                                   (d) => d.base_salary))
                 .tickFormat();
        // leanpub-end-insert
    }
}


// ---

import React, { Component } from 'react';
import d3 from 'd3';
import _ from 'lodash';

export default class Meta extends Component {
    getYears(data) {
        data || (data = this.props.data);

        return _.keys(_.groupBy(this.props.data,
                                (d) => d.submit_date.getFullYear())
        );
    }

    getUSStates(data) {
        data || (data = this.props.data);

        return _.keys(_.groupBy(this.props.data,
                                (d) => d.state)
        );
    }

    getFormatter(data) {
        data || (data = this.props.data);

        return d3.scale.linear()
                 .domain(d3.extent(this.props.data,
                                   (d) => d.base_salary))
                 .tickFormat();
    }
}
