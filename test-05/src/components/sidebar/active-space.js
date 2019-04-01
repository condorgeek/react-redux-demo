/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [active-space.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 05.10.18 14:05
 */

import {bindTooltip} from "../../actions/tippy-config";
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';
import {ROOT_STATIC_URL} from "../../actions/index";
import {GENERIC_SPACE, RESTRICTED_ACCESS, SHOP_SPACE} from "../../actions/spaces";

export default class ActiveSpace extends Component {

    constructor(props) {
        super(props);
        this.tooltip = null;
    }

    componentWillUnmount() {
        this.tooltip && this.tooltip.destroy();
    }

    renderAvatarTooltip(avatar, space) {
        return <div className="avatar-tooltip"><span title={space.name}><img src={avatar}/></span></div>
    }

    renderCoverTooltip(avatar, space) {
        const {name, cover} = space;
        const access = space.access === RESTRICTED_ACCESS ? <i className="fas fa-mask"/> : '';
        const type = space.type === GENERIC_SPACE ? <i className="fas fa-users"/> : space === SHOP_SPACE ? <i className="fas fa-shopping-cart"/> :
            <i className="fas fa-calendar-alt"/>;

        return cover === null ? this.renderAvatarTooltip(avatar, space) :
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
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const mediaurl = space.media && space.media.length > 0 ? space.media[0].url : null;
        const cover = `${ROOT_STATIC_URL}/${mediaurl}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderCoverTooltip(avatar, space));
        const hasChildren = space.children && space.children.length > 0;
        const isBlocked = state === 'BLOCKED';

        this.tooltip && this.tooltip.destroy();

        return (<div>
            <div className='sidebar-space' >
                <Link to={activespace}>
                    <div className="sidebar-space-thumb" ref={(elem) => {
                        if (elem === null) return;
                        this.tooltip = bindTooltip(elem, html,
                            {placement: 'top', multiple: false, animation: 'shift-away'});
                    }}>
                        {space.icon && <i className={`${space.icon}`}/>}
                        {!space.icon && <div className="rectangular-cover">
                            <img className={isBlocked ? "blocked-img" : "thumb"} src={mediaurl ? cover : avatar}/>
                        </div>}
                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}
                    </div><span className="sidebar-space-text">{space.name}</span>
                </Link>

                {hasChildren && <div className="sidebar-space-toggle" onClick={event => {
                    event.preventDefault();
                    this.toggle();
                }}>
                    <i className="fas fa-caret-down"/>
                </div>}

            </div>

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
        );
    }
}
