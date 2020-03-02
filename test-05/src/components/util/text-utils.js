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
import ReactDOMServer from 'react-dom/server';


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

/* must return static html to be passed to headlineuserentry component */
export const asStaticUrl = (web) => {
    if(!web) return '';
    const regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm;

    const list =  web.split(/,|\r|\n/).map(entry => {
        const matches = regex.exec(entry.trim());
        const domain = matches && matches.length > 0 ? matches[0] : entry.trim();

        return `<li><a href=${entry.trim()} target='_blank'> ${domain}</a> <i class="fas fa-external-link-alt "></i></li>`;
    });

    return ReactDOMServer.renderToStaticMarkup(<ul className="headline-user-list btn-plattform">{list}</ul>);
};
