
//
// Example 1
//
import React, { Component } from 'react';
import d3 from 'd3';

//
// Example 2
//
import React, { Component } from 'react';
import d3 from 'd3';

// leanpub-start-insert
class H1BGraph extends Component {
    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}
// leanpub-end-insert

//
// Example 3
//
import React, { Component } from 'react';
import d3 from 'd3';

class H1BGraph extends Component {
    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

// leanpub-start-insert
export default H1BGraph;
// leanpub-end-insert

//
// Example 4
//
import React, { Component } from 'react';
import d3 from 'd3';

class H1BGraph extends Component {
    // leanpub-start-insert
    constructor() {
        super();

        this.state = {
            rawData: []
        };
    }

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
    }
    // leanpub-end-insert

    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

export default H1BGraph;

//
// Example 5
//
import React, { Component } from 'react';
import d3 from 'd3';

class H1BGraph extends Component {
    constructor() {
        super();

        this.state = {
            rawData: []
        };
    }

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
        // leanpub-start-insert
        d3.csv(this.props.url)
          .get((error, rows) => {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          });
        // leanpub-end-insert
    }

    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

export default H1BGraph;

//
// Example 6
//
import React, { Component } from 'react';
import d3 from 'd3';

class H1BGraph extends Component {
    constructor() {
        super();

        this.state = {
            rawData: []
        };
    }

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
        // leanpub-start-insert
        let dateFormat = d3.time.format("%m/%d/%Y");
        // leanpub-end-insert

        d3.csv(this.props.url)
            // leanpub-start-insert
          .row((d) => {
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
          })
            // leanpub-end-insert
          .get((error, rows) => {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          });
    }

    render() {
        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

export default H1BGraph;


//
// Example 6
//
import React, { Component } from 'react';
import d3 from 'd3';

class H1BGraph extends Component {
    constructor() {
        super();

        this.state = {
            rawData: []
        };
    }

    componentWillMount() {
        this.loadRawData();
    }

    loadRawData() {
        let dateFormat = d3.time.format("%m/%d/%Y");

        d3.csv(this.props.url)
          .row((d) => {
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
          })
          .get((error, rows) => {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          });
    }

    render() {
        // leanpub-start-insert
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }
        // leanpub-end-insert

        return (
            <div>
                <svg>
                </svg>
            </div>
        );
    }
}

export default H1BGraph;



import React, { Component } from 'react';
import d3 from 'd3';

import { Title, Description } from './Meta';
import Histogram from '../Histogram';
import Mean from './Mean';
import Controls from './Controls';


require('./style.less');

class H1BGraph extends Component {
    constructor() {
        super();

        this.state = {
            rawData: [],
            dataFilter: () => true
        };
    }

    cleanJobs(title) {
        title = title.replace(/[^a-z ]/gi, '');

        if (title.match(/consultant|specialist|expert|prof|advis|consult/)) {
            title = "consultant";
        }else if (title.match(/analyst|strateg|scien/)) {
            title = "analyst";
        }else if (title.match(/manager|associate|train|manag|direct|supervis|mgr|chief/)) {
            title = "manager";
        }else if (title.match(/architect/)) {
            title = "architect";
        }else if (title.match(/lead|coord/)) {
            title = "lead";
        }else if (title.match(/eng|enig|ening|eign/)) {
            title = "engineer";
        }else if (title.match(/program/)) {
            title = "programmer";
        }else if (title.match(/design/)) {
            title = "designer";
        }else if (title.match(/develop|dvelop|develp|devlp|devel|deelop|devlop|devleo|deveo/)) {
            title = "developer";
        }else if (title.match(/tester|qa|quality|assurance|test/)) {
            title = "tester";
        }else if (title.match(/admin|support|packag|integrat/)) {
            title = "administrator";
        }else{
            title = "other";
        }

        return title;
    }

    loadRawData() {
        let dateFormat = d3.time.format("%m/%d/%Y");

        d3.csv(this.props.url)
          .row((d) => {
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
          })
          .get((error, rows) => {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
              }
          });
    }

    updateDataFilter(filter) {
        this.setState({dataFilter: filter});
    }

    componentWillMount() {
        this.loadRawData();
    }

    render() {
        if (!this.state.rawData.length) {
            return (
                <h2>Loading data about 81,000 H1B visas in the software industry</h2>
            );
        }

        let params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: (d) => d.base_salary
        },
            fullWidth = 700;

        let onlyGoodVisas = this.state
                                .rawData
                                .filter((d) => d.case_status == "certified"),
            filteredData = onlyGoodVisas.filter(this.state.dataFilter);

        return (
            <div>
                <Title data={filteredData} />
                <Description data={filteredData} allData={onlyGoodVisas} />
                <svg width={fullWidth} height={params.height}>
                    <Histogram {...params} data={filteredData} />
                    <Mean {...params} data={filteredData} width={fullWidth} />
                </svg>
                <Controls data={onlyGoodVisas} updateDataFilter={::this.updateDataFilter} />
            </div>
        );
    }
}

export default H1BGraph;
