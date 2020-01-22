/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [text-utils.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 24.11.19, 13:06
 */

import he from '../../../node_modules/he/he';
import React from 'react';
import {getStaticImageUrl} from "../../actions/environment";

export const TextAsHTML = (props) => {
    return <p {...props} ref={ref => {if(ref) ref.innerHTML = he.decode(props.children);}}>
        {props.children}
    </p>
};

export const animateElement = (elem) => {
    elem.classList.remove("animate-headshake");
    void elem.offsetWidth;
    elem.classList.add("animate-headshake");
};

export const BackgroundImage = (props) => {
    const {background, className, ...otherProps} = props;

    if(!background) return null;

    return <div className={`background-image ${className}`} {...otherProps}>
        <img style={{objectPosition: background.position}} src={getStaticImageUrl(background.src)}/>
    </div>
};
