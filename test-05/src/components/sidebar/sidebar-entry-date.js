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

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import toastr from "../../../node_modules/toastr/toastr";
import moment from 'moment';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {EVENT_SPACE, GENERIC_SPACE, RESTRICTED_ACCESS, SHOP_SPACE} from "../../actions/spaces";
import {getStaticImageUrl} from "../../actions/environment";
import {DateBoxSmall} from "./boxes/date-box-small";
import {FlatIcon, FlatLink, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {asyncDeleteSpace, asyncLeaveSpaceByUsername, updateDeleteSpace} from '../../actions/spaces';

class SidebarEntryDate extends Component {

    renderAvatar(user, space) {
        return <div className="avatar-tooltip">
            <span title={space.name}><img src={getStaticImageUrl(user.avatar)}/></span>
        </div>
    }

    renderCover(user, space) {
        const {name, cover} = space;
        const access = space.access === RESTRICTED_ACCESS ? <i className="fas fa-mask"/> : '';
        const type = space.type === GENERIC_SPACE ? <i className="fas fa-users"/> : space === SHOP_SPACE ?
            <i className="fas fa-shopping-cart"/> :
            <i className="fas fa-calendar-alt"/>;

        return cover === null ? this.renderAvatar(user, space) :
            <div className="cover-tooltip">
                <img src={getStaticImageUrl(cover)}/>
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
            return <li key={child.id} className="nav-item"><Link to={target} className="nav-link">{child.name}</Link>
            </li>
        });

        return <div className="sidebar-submenu">
            <ul className="nav flex-column">{children}</ul>
        </div>;
    }

    render() {
        const {authname, isAuthorized, isOwner, space} = this.props;
        const {user, state} = space;

        const activespace = `/${user.username}/space/${space.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderCover(user, space));
        const isBlocked = state === 'BLOCKED';
        const date = space.spacedata.startDate ? space.spacedata.startDate : space.created;
        const dates = moment(date).format('MMM DD').split(" ");
        const hasChildren = space.children && space.children.length > 0;

        return <NavigationRow className='sidebar-entry-date box-light-gray'>
            <NavigationGroup>
                <FlatLink to={activespace}>
                    <DateBoxSmall blocked={isBlocked} html={html} dates={dates} className='mr-2'/>
                    <span>{space.name}</span>
                </FlatLink>

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
                            scrollbars: {visibility: "hidden"}
                        });
                    }}>
                        {hasChildren && this.renderChildren(user, space)}
                    </div>
                </div>

            </NavigationGroup>
            <NavigationGroup>

                {isAuthorized && <FlatIcon circle>
                    <Icon title={`Leave ${space.name}`} className="fas fa-user-minus sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncLeaveSpaceByUsername(authname, space.id, member => {
                            this.props.updateDeleteSpace(space);
                            toastr.info(`You have left ${space.name}`);
                        });
                    }}/>
                </FlatIcon>}

                {isAuthorized && isOwner && <FlatIcon circle>
                    <Icon title={`Delete ${space.name}`} className="fas fa-trash sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncDeleteSpace(authname, EVENT_SPACE, space.id, (space) => {
                            toastr.info(`You have deleted ${space.name}`);
                        });
                    }}/>
                </FlatIcon>}

            </NavigationGroup>
            </NavigationRow>

    }
}

export default connect(null, {asyncDeleteSpace, asyncLeaveSpaceByUsername, updateDeleteSpace})(SidebarEntryDate);
