/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [background-image.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 23.01.20, 12:54
 */
import React from 'react';
import {getStaticImageUrl} from "../../actions/environment";

export const BackgroundImage = (props) => {
    const {background, className, toggle, ...otherProps} = props;

    if(!background) return null;

    return <div className={`background-image ${toggle && 'background-image-toggle'} ${className}`} {...otherProps}>
        <img style={{objectPosition: background.position}} src={getStaticImageUrl(background.src)}/>
    </div>
};