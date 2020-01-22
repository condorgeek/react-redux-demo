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
