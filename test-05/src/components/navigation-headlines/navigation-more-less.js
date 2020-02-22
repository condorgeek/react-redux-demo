/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [navigation-more-less.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 22.02.20, 14:19
 */

import React, {useContext} from 'react';

import {FlatLink, Icon} from "../navigation-buttons/nav-buttons";
import {ConfigurationContext} from "../configuration/configuration";


const NavigationMoreLess = (props) => {
    const {className, callback, open, ...otherProps} = props;
    const {Lang} = useContext(ConfigurationContext);

    const title = open ? Lang.tooltip.lessContent : Lang.tooltip.moreContent;
    const icon = open ? 'fas fa-minus-square' : 'fas fa-plus-square';
    const text = open ? Lang.button.readLess : Lang.button.readMore;

    return <FlatLink onClick={callback}>
        <div className={`navigation-more-less ${className ? className : ''}`} {...otherProps}>
            <Icon title={title} className={icon}></Icon>
            <span className='navigation-more-less-text'>{text}</span>
        </div></FlatLink>
};

export default NavigationMoreLess;