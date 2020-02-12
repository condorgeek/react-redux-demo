/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [buttons.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 22.01.20, 16:19
 */
import React, {Component, useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import Waves from '../../../node_modules/node-waves';
import {showTooltip} from "../../actions/tippy-config";

const apply = (test, value) => {
    return test ? value : '';
};

export const WavesButtonLink = (props) => {
    const {className, large, block, ...otherProps} = props;

    return <Link className={`btn btn-primary 
    ${className ? className:''} 
    ${large ? 'btn-lg':''} 
    ${block ? 'btn-block':''}`} {...otherProps} ref={
        (ref) => { if(ref) Waves.attach(ref, ['waves-light'])}}>
        {props.children}
    </Link>
};

export const FlatLink = (props) => {
    const {className, to, ...otherProps} = props;

    return <Link to={to} className={`box-aligned 
    ${className ? className : ''}`} {...otherProps}>
        {props.children}
    </Link>
};

export const ButtonLink = (props) => {
    const {className, large, block, ...otherProps} = props;

    return <Link className={`btn btn-primary 
    ${className ? className:''} 
    ${large ? 'btn-lg':''} 
    ${block ? 'btn-block':''}`} {...otherProps}>
        {props.children}
    </Link>
};

export const Button = (props) => {
    const {className, large, block, ...otherProps} = props;

    return <button className={`btn btn-primary 
    ${className ? className: ''} 
    ${large ? 'btn-lg':''} 
    ${block ? 'btn-block':''}`} {...otherProps}>
        {props.children}
    </button>
};

export const NavigationRow = (props) => {
    const {className, dark, right, left, ...otherProps} = props;

    return <div className={`navigation-row 
    ${dark ? 'navigation-row-dark':''} 
    ${left ? 'navigation-row-left':''} 
    ${right ? 'navigation-row-right':''} 
    ${className ? className:''}`}
                {...otherProps}>
        {props.children}
    </div>
};

export const NavigationGroup = (props) => {
    const {className, dark, column, ...otherProps} = props;

    return <div className={`navigation-group 
    ${dark ? 'navigation-group-dark':''} 
    ${className ? className:''} 
    ${column ? 'navigation-group-column':''}`} {...otherProps}>
      {props.children}
  </div>
};

// ----------------------------------------------------
// attempt cleanup of tooltip on component unmount
// ----------------------------------------------------
export const Icon = (props) => {
    const {className, title, ...otherProps} = props;
    const mounted = useRef({});

    /* componentDidMount */
    useEffect(() => {
    }, []);

    /* componentWillUnmount */
    useEffect(() => {
        return () => {
            const {tooltip} = mounted.current;
            tooltip && tooltip.destroy();
        }
    }, []);

    return <i className={`navigation-icon 
    ${className ? className:''}`} {...otherProps}
              ref={(ref) => {if(ref && title) {
                  mounted.current = {tooltip: showTooltip(ref)};
              }}}
    > {props.children}
    </i>
};


export const BiggerIcon = (props) => {
    const {className, ...otherProps} = props;
    const mounted = useRef({});

    /* componentWillUnmount */
    useEffect(() => {
        return () => {
            const {tooltip} = mounted.current;
            tooltip && tooltip.destroy();
        }
    }, []);

    return <i className={`navigation-icon-bigger 
    ${className ? className:''}`} {...otherProps}
              ref={(ref) => {if(ref) {
                  mounted.current = {tooltip: showTooltip(ref)};
              }}}> {props.children}
    </i>
};

// compound icon
export const FollowerIcon = (props) => {
    const {className, ...otherProps} = props;

    return <span className={`headline-icon-stacked ${className && className}`} {...otherProps}>
        <i className="fas fa-user"/>
        <i className="fas fa-chevron-right headline-icon-top-right"/>
    </span>
};

// bounded (custom tooltip) and unbounded (default tooltip) support
export const FlatIcon = (props) => {
    const {className, button, circle, float, btn, primary, small, bigger, onBound, ...otherProps} = props;
    const mounted = useRef({});

    const effects = ['waves-effect'];
    button && effects.push('waves-button');
    circle && effects.push('waves-circle');
    float && effects.push('waves-float');

    /* componentWillUnmount */
    useEffect(() => {
        return () => {
            const {tooltip} = mounted.current;
            tooltip && tooltip.destroy();
        }
    }, []);

    return <span className={`navigation-flat-icon 
    ${btn ? 'btn btn-overrides':''} 
    ${primary ? 'btn-primary':''} 
    ${small ? 'navigation-icon-small':''} 
    ${bigger ? 'navigation-icon-bigger':''} 
    ${className ? className : ''}`}
                 ref={(ref) => {if(ref) {
                         Waves.attach(ref, effects);
                         // onBound ? onBound(ref) : (mounted.current = {tooltip: showTooltip(ref)});
                     }}}
                 {...otherProps}>
        {props.children}
    </span>
};


export const FlatButton = (props) => {
    const {className, button, circle, float, btn, primary, small, ...otherProps} = props;
    const mounted = useRef({});

    const effects = ['waves-effect'];
    button && effects.push('waves-button');
    circle && effects.push('waves-circle');
    float && effects.push('waves-float');

    /* componentWillUnmount */
    useEffect(() => {
        return () => {
            const {tooltip} = mounted.current;
            tooltip && tooltip.destroy();
        }
    }, []);

    return <button className={`navigation-flat-button 
    ${btn ? 'btn btn-overrides':''} 
    ${primary ? 'btn-primary':''} 
    ${small ? 'btn-sm':''} 
    ${className ? className:''} `}
                   ref={(ref) => {if(ref) {
                     Waves.attach(ref, effects);
                       mounted.current = {tooltip: showTooltip(ref)};
                 }}}
                 {...otherProps}>
        {props.children}
    </button>
};

export const FlatButtonBounded = (props) => {
    const {className, onBound, button, circle, float, btn, primary, small, ...otherProps} = props;
    const effects = ['waves-effect'];
    button && effects.push('waves-button');
    circle && effects.push('waves-circle');
    float && effects.push('waves-float');

    return <button className={`navigation-flat-button 
    ${btn ? 'btn btn-overrides':''} 
    ${primary ? 'btn-primary':''} 
    ${small ? 'btn-sm':''} 
    ${className ? className:''}`} ref={(elem) => {if(elem) {
                       Waves.attach(elem, effects);
                       onBound(elem);
                   }}}
                   {...otherProps}>
        {props.children}
    </button>
};
