import holderjs from 'holderjs';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const HOLDER_ATTR_NAMES = [
    'theme',
    'random',
    'bg',
    'fg',
    'text',
    'size',
    'font',
    'align',
    'outline',
    'lineWrap',
];

function createPlaceholder (node, updateOnResize = true) {
    holderjs.run({
        domain: 'holder.js',
        images: node,
        object: null,
        bgnodes: null,
        stylenodes: null,
    });
    if (updateOnResize === false) {
        holderjs.setResizeUpdate(node, false)
    }
}

function updatePlaceholder (node, updateOnResize = true) {
    holderjs.setResizeUpdate(node, Boolean(updateOnResize))
}

class Holder extends Component {

    render () {
        const { width, height } = this.props;
        const holderConfig = _.pick(this.props, HOLDER_ATTR_NAMES);
        const htmlAttrs = _.omit(this.props, HOLDER_ATTR_NAMES);

        const src = `holder.js/${width}x${height}?${JSON.stringify(holderConfig)}`;
        return (
            <img
                ref='placeholder'
                data-src={src}
                {...htmlAttrs}
            />
        )
    }

    componentDidMount () {
        const placeholderNode = ReactDOM.findDOMNode(this.refs.placeholder);
        createPlaceholder(placeholderNode, this.props.updateOnResize);
    }

    componentDidUpdate () {
        const placeholderNode = ReactDOM.findDOMNode(this.refs.placeholder);
        updatePlaceholder(placeholderNode, this.props.updateOnResize);
    }

}

Holder.defaultProps = {
    width: '100',
    height: '100',
};

export default Holder;


