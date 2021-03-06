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

import {bindTooltip} from "../../actions/tippy-config";
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import moment from 'moment';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';

import {ROOT_STATIC_URL} from "../../actions/index";
import {GENERIC_SPACE, RESTRICTED_ACCESS, SHOP_SPACE} from "../../actions/spaces";

export default class ActiveDate extends Component {

    constructor(props) {
        super(props);
        this.tooltip = null;
    }

    componentWillUnmount() {
        this.tooltip && this.tooltip.destroy();
    }

    renderAvatar(user, space) {
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        return <div className="avatar-tooltip"><span title={space.name}><img src={avatar}/></span></div>
    }

    renderCover(user, space) {
        const {name, cover} = space;
        const access = space.access === RESTRICTED_ACCESS ? <i className="fas fa-mask"/> : '';
        const type = space.type === GENERIC_SPACE ? <i className="fas fa-users"/> : space === SHOP_SPACE ?
            <i className="fas fa-shopping-cart"/> :
            <i className="fas fa-calendar-alt"/>;

        return cover === null ? this.renderAvatar(user, space) :
            <div className="cover-tooltip">
                <img src={`${ROOT_STATIC_URL}/${cover}`}/>
                <span>{name} {type} {access}</span>
            </div>;
    }

    toggle = () => {
        this.childrenRef && this.childrenRef.classList.toggle('active-show');
        setTimeout(() => {
            if (document.activeElement !== document.body) document.activeElement.blur();
        }, 500);
    };

    renderChildren(user, space) {
        const children = space.children.map(child => {
            const target = `/${user.username}/space/${child.id}`;
            return <li key={child.id} className="nav-item"> <Link to={target} className="nav-link" >{child.name}</Link></li>
        });

        return <div className="sidebar-submenu"><ul className="nav flex-column">{children}</ul></div>;
    }


    render() {
        const {authname, user, space, state} = this.props;

        const activespace = `/${user.username}/space/${space.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderCover(user, space));
        const isBlocked = state === 'BLOCKED';
        const date = space.spacedata.startDate ? space.spacedata.startDate : space.created;
        const dates = moment(date).format('MMM DD').split(" ");
        const hasChildren = space.children && space.children.length > 0;

        this.tooltip && this.tooltip.destroy();

        return (
            <div className='active-friend d-inline'>
                <Link to={activespace}>
                    <div className="state-thumb">
                        <div className="rectangular-date"
                             ref={(elem) => {
                                 if (elem === null) return;
                                 this.tooltip = bindTooltip(elem, html,
                                     {placement: 'top', animation: 'shift-away', multiple: false});
                             }}>
                            {/*<i className="far fa-calendar"/>*/}
                            <div className="rectangular-date-box">
                                <div className="date-month">{dates[0]}</div>
                                <div className="date-day">{dates[1]}</div>
                            </div>
                        </div>

                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}

                    </div>
                    <span className="ml-0">{space.name}</span>
                </Link>

                {hasChildren && <div className="btn-children-toggle" onClick={event => {
                    event.preventDefault();
                    this.toggle();
                }}>
                    <i className="fas fa-caret-down"/>
                </div>}

                <div className="active-space-frame">
                    <div className="active-space-toggle" ref={elem => {
                        this.childrenRef = elem;
                        elem && OverlayScrollbars(elem, {
                            scrollbars : {visibility: "hidden"}
                        });
                    }}>
                        {hasChildren && this.renderChildren(user, space)}
                    </div>
                </div>

            </div>
        )


    }
}
