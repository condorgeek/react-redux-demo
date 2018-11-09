/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [active-date.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 24.10.18 18:14
 */

import tippy from 'tippy.js'
import moment from 'moment';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';

import {ROOT_STATIC_URL} from "../../actions/index";

export default class ActiveDate extends Component {

    constructor(props) {
        super(props);
    }

    renderAvatar(avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    render() {
        const {authname, user, space, state} = this.props;

        const activespace = `/${user.username}/space/${space.id}`;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const templateId = `#space-tooltip-${space.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, space.name));
        const isBlocked = state === 'BLOCKED';
        const dates = moment(space.created).format('MMM DD').split(" ");


        return (
            <div className='active-friend d-inline'>
                <Link to={activespace}>
                    <div className="state-thumb"
                         ref={(elem) => {
                             if (elem === null) return;
                             const initialText = document.querySelector(templateId).textContent;
                             const tooltip = tippy(elem, {
                                 html: templateId, interactive: false, theme: 'avatar',
                                 placement: 'left', delay: [400, 0],
                                 animation: 'shift-away', arrow: true,
                                 onShow() {
                                     const content = this.querySelector('.tippy-content');
                                     if (tooltip.loading || content.innerHTML !== initialText) return;
                                     tooltip.loading = true;
                                     content.innerHTML = html;
                                     tooltip.loading = false;
                                 },
                                 onHidden() {
                                     const content = this.querySelector('.tippy-content');
                                     content.innerHTML = initialText;
                                 }
                             });
                         }}
                    ><div className="rectangular-date">
                        {/*<img className={isBlocked ? "blocked-img" : "thumb"} src={avatar}/>*/}
                        <i className="far fa-calendar"/>
                        <span className="date-month">{dates[0]}</span>
                        <span className="date-day">{dates[1]}</span>
                    </div>


                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}
                    </div>
                    {space.name}
                </Link>

                <div id={`space-tooltip-${space.id}`} className="d-none">Loading...</div>

            </div>
        );
    }
}
