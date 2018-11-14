/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [user-link.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 29.08.18 18:26
 */

import {bindTooltip} from "../../actions/tippy-config";
import moment from 'moment';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';
import {ROOT_STATIC_URL} from "../../actions";

export default class UserLink extends Component {

    constructor(props) {
        super(props);
    }

    renderAvatar (avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    render() {
        const {user, id, created} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar =  `${ROOT_STATIC_URL}/${user.avatar}`;
        const fullname = `${user.firstname} ${user.lastname}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));

        return (
            <div className='user-link'>
                <Link to={homespace}>
                    <div className="d-inline"
                         ref={(elem) => {
                             if (elem === null) return;
                             bindTooltip(elem, html, {theme: 'avatar'});
                         }}
                    ><img className="thumb" src={avatar}/>{fullname}</div>
                </Link>
                <span className="comment-created">{moment(created).fromNow()}</span>
            </div>
        );
    }
}