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

import {bindRawTooltip} from "../../actions/tippy-config";
import moment from 'moment';

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {PLACEHOLDER} from "../../static";
import {getStaticImageUrl} from "../../actions/environment";

export default class UserLink extends Component {

    constructor(props) {
        super(props);
        this.tooltips = [];
    }

    componentWillUnmount() {
        this.tooltips.forEach(tooltip => {tooltip.destroy();}); this.tooltips = [];
    }

    renderAvatar (avatar, fullname) {
        return <div className="avatar-tooltip" id="avatar-tooltip-id"><span title={fullname}><img src={PLACEHOLDER} data-src={avatar}/></span></div>
    }

    render() {
        const {user, created, state, from} = this.props.post;
        const shared = state === 'SHARED' ? 'shared' : 'posted';
        const isFrom = state === 'SHARED' && from && from.username !== user.username;

        const homespace = `/${user.username}/home`;
        const avatar =  getStaticImageUrl(user.avatar);

        const fromspace = isFrom ? `/${from.username}/home` : '';
        const fromAvatar = isFrom ? getStaticImageUrl(from.avatar) : '';

        return (
            <div className='user-link'>
                <Link to={homespace}>
                    <div className="d-inline"
                         ref={(elem) => {
                             if (elem === null) return;
                             const tooltip = bindRawTooltip(elem, this.renderAvatar(avatar, user.fullname), {theme: 'avatar'});
                             this.tooltips.push(tooltip);
                         }}
                    ><img className="thumb" src={PLACEHOLDER} data-src={avatar}/>
                    {user.fullname.length > 36 ? user.firstname : user.fullname}</div>
                </Link>
                {this.props.allowComments && <span className="comment-created">{shared} {moment(created).fromNow()} {isFrom ? 'from':''}</span>}

                {isFrom && <Link to={fromspace}>
                    <div className="d-inline" ref={(elem) => {
                        if (elem === null) return;
                        const tooltip = bindRawTooltip(elem, this.renderAvatar(fromAvatar, from.fullname),
                            {theme: 'avatar', placeholderId: 'avatar-tooltip-id'});
                        this.tooltips.push(tooltip);
                    }}
                    >{from.fullname}</div>
                </Link>}

            </div>
        );
    }
}