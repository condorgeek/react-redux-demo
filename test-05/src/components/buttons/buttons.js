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
import React from 'react';
import {Link} from 'react-router-dom';
import Waves from '../../../node_modules/node-waves';
import {showTooltip} from "../../actions/tippy-config";

export const WavesButtonLink = (props) => {
    const {className, large, block, ...otherProps} = props;

    return <Link className={`btn btn-primary ${className} ${large && 'btn-lg'} ${block && 'btn-block'}`} {...otherProps} ref={
        (ref) => { if(ref) Waves.attach(ref, ['waves-light'])}}>
        {props.children}
    </Link>
};

export const ButtonLink = (props) => {
    const {className, large, block, ...otherProps} = props;

    return <Link className={`btn btn-primary ${className} ${large && 'btn-lg'} ${block && 'btn-block'}`} {...otherProps}>
        {props.children}
    </Link>
};

export const Button = (props) => {
    const {className, large, block, ...otherProps} = props;

    return <button className={`btn btn-primary ${className} ${large && 'btn-lg'} ${block && 'btn-block'}`} {...otherProps}>
        {props.children}
    </button>
};

export const IconRow = (props) => {
    const {dark, ...otherProps} = props;

    return <div className={`navigation-icon-row ${dark && 'navigation-icon-row-dark'}`} {...otherProps}>
        {props.children}
    </div>
};

export const IconGroup = (props) => {
    const {dark, ...otherProps} = props;

    return <div className={`navigation-icon-group ${dark && 'navigation-icon-group-dark'}`} {...otherProps}>
      {props.children}
  </div>
};

export const FlatIcon = (props) => {
    const {className, button, circle, float, btn, primary, ...otherProps} = props;
    const effects = ['waves-effect'];
    button && effects.push('waves-button');
    circle && effects.push('waves-circle');
    float && effects.push('waves-float');

    return <span className={`${btn && 'btn'} ${primary && 'btn-primary'} ${className && className} navigation-flat-icon`}
                 ref={(ref) => {if(ref) {
                         Waves.attach(ref, effects);
                         showTooltip(ref);
                     }}}
                 {...otherProps}>
        {props.children}
    </span>
};

export const FlatButton = (props) => {
    const {className, button, circle, float, btn, primary, ...otherProps} = props;
    const effects = ['waves-effect'];
    button && effects.push('waves-button');
    circle && effects.push('waves-circle');
    float && effects.push('waves-float');

    return <button className={`${btn && 'btn'} ${primary && 'btn-primary'} ${className && className} navigation-flat-button`}
                 ref={(ref) => {if(ref) {
                     Waves.attach(ref, effects);
                     showTooltip(ref);
                 }}}
                 {...otherProps}>
        {props.children}
    </button>
};
