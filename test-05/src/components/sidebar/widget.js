/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [widget.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 07.02.19 10:44
 */
import he from '../../../node_modules/he/he';
import React, {Component} from 'react';

import {Link} from 'react-router-dom';

// const Widget = ({space}) => {
//     const cover = `${ROOT_STATIC_URL}/${space.cover}`;
//     const activespace = `/${space.user.username}/space/${space.id}`;
//
//     return <div className="widget">
//         <div className="widget-image"><img src={cover}/></div>
//         <h6>{space.name}</h6>
//         <Link to={activespace}><span className="widget-text">{space.description.slice(0,60)}</span></Link>
//     </div>
// };


import {ROOT_STATIC_URL} from "../../actions";

export const Widget = ({widget}) => {
    const cover = widget.cover ? `${ROOT_STATIC_URL}/${widget.cover}` : null;
    // const activespace = `/${space.user.username}/space/${space.id}`;

    return <div className="card">
        {cover && <img className="card-img-top" src={cover}/>}
        <div className="card-body">
            <h5 className="card-title">{widget.title}</h5>
            <div className="card-text">
                <div className="mr-1" ref={elem =>{
                    if(!elem) return;
                    // this.refElem = elem;
                    elem.innerHTML = he.decode(elem.innerHTML);
                }}>{widget.text.slice(0,240)}
                </div>
                {widget.url && <Link to={`/${widget.url}`}>More..</Link>}
            </div>
        </div>
    </div>
};

export const SpaceWidget = ({space}) => {
    const cover = `${ROOT_STATIC_URL}/${space.cover}`;
    const activespace = `/${space.user.username}/space/${space.id}`;

    return <div className="card">
        <img className="card-img-top" src={cover}/>
        <div className="card-body">
            <h5 className="card-title">{space.name}</h5>
            <div className="card-text">
                {space.description.slice(0,120)}
                {/*<Link to={activespace}><span className="widget-text">{space.description.slice(0,60)}</span></Link>*/}
            </div>
        </div>
    </div>
};