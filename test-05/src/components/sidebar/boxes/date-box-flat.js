/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [date-box-small.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.02.20, 16:32
 */
import React, {useState, useEffect} from 'react';
import {bindTooltip} from "../../../actions/tippy-config";

export const DateBoxFlat = (props) => {
    const {blocked, className, html, dates} = props;
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        return () => {tooltip && tooltip.destroy()}
    }, []);

    return <div className={`date-box-flat ${className && className}`}
                ref={(elem) => {
                    if (elem === null) return;
                    if (!tooltip) {
                        setTooltip(bindTooltip(
                            elem, html, {placement: 'top', animation: 'shift-away', multiple: false}));
                    }
                }}>
        <div className="date-box-flat-month">{dates[0]}</div>
        <div className="date-box-flat-day">{dates[1]}</div>

        {blocked && <span className="date-box-small-blocked">
            {/*<svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">*/}
            <svg viewBox="0 0 24 24">
                <path
                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
            </svg>
        </span>}

    </div>
};