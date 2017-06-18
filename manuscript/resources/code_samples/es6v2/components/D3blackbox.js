
//
// Example 1
//
// src/components/D3blackbox.js
import React, { Component } from 'react';

export default function D3blackbox(D3render) {
  return class Blackbox exComponent {
    componentDidMount() { D3render.call(this); }
    componentDidUpdate() { D3render.call(this) }

    render() {
      const { x, y } = this.props;
      return <g transform={`translate(${x}, ${y})`} ref="anchor" />;
    }
  }
}
