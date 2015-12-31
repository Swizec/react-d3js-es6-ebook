
//
// Example 1
//
import React from 'react';

import H1BGraph from './components/H1BGraph';

//
// Example 2
//
import React from 'react';

import H1BGraph from './components/H1BGraph';

// leanpub-start-insert
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.decapitalize = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
// leanpub-end-insert

//
// Example 3
//
import React from 'react';

import H1BGraph from './components/H1BGraph';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.decapitalize = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

// leanpub-start-insert
React.render(
    <H1BGraph url="data/h1bs.csv" />,
    document.querySelectorAll('.h1bgraph')[0]
);
// leanpub-end-insert
