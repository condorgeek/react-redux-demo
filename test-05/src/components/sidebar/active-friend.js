/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [active-friend.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 27.09.18 12:09
 */

import {bindTooltip} from "../../actions/tippy-config";


import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';

import ActiveChat from "./active-chat";
import {getStaticImageUrl} from "../../actions/environment";

export default class ActiveFriend extends Component {

    constructor(props) {
        super(props);
        this.tooltip = null;
    }

    componentWillUnmount() {
        this.tooltip && this.tooltip.destroy();
    }

    renderAvatar(avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    render() {
        const {authname, user, state, chat} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar = getStaticImageUrl(user.avatar);
        const fullname = `${user.firstname} ${user.lastname}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));
        const isBlocked = state === 'BLOCKED';

        this.tooltip && this.tooltip.destroy();

        return (
            <div className='active-friend d-inline'>
                <Link to={homespace}>
                    <div className="state-thumb"
                         ref={(elem) => {
                             if (elem === null) return;
                             bindTooltip(elem, html, {placement: 'left', animation: 'shift-away', theme: 'avatar'});
                         }}
                    ><div className="rounded-thumb"><img className={isBlocked ? "blocked-img" : "thumb"} src={avatar}/></div>
                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}
                    </div><span className="text">{fullname}</span>
                </Link>

                {chat && !isBlocked && <ActiveChat authname={authname} user={user} chat={chat} />}

            </div>
        );
    }
}
