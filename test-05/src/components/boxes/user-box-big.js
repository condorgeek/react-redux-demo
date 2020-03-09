/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [image-box-small.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 04.02.20, 16:36
 */

import React, {useState, useEffect} from 'react';
import {bindTooltip} from "../../actions/tippy-config";
import {getStaticImageUrl} from "../../actions/environment";

export const UserBoxBig = (props) => {
    const {blocked, active, badged, html, avatar, animated, grayscale, bigger} = props;
    const [tooltip, setTooltip] = useState(null);

    /* willComponentUnmount */
    useEffect(() => {
        return () => { tooltip && tooltip.destroy(); }
    }, []);

    return <div className='user-box-big' ref={(elem) => {
        if (elem === null) return;
        html && setTooltip(bindTooltip(elem, html,
            {placement: 'top', multiple: false, animation: 'shift-away'}));
    }}>
        <div className='user-box-big-image'>
            <img className={`${bigger ? 'bigger' : ''} 
            ${animated ? 'animated' : ''} 
            ${grayscale ? 'grayscale' : ''}`}
                 src={getStaticImageUrl(avatar)}/>

            {blocked && <span className='blocked'>
                <svg viewBox="0 0 24 24">
                    <path d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                </svg>
            </span>}

            {badged && <div className='badged'>
                <span className='badge box-tomato'>{badged}</span>
            </div>}
            {active && <div className='top-right-corner'>
                <span className='fas fa-circle'/>
            </div>}

            {/*{active && <div className='top-left-corner'/>}*/}

        </div>

    </div>
};