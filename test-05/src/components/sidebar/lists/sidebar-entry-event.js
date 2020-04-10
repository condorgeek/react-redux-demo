/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [sidebar-entry-date.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 13.02.20, 11:50
 */

import OverlayScrollbars from 'overlayscrollbars';
import toastr from "toastr";
import moment from 'moment';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {EVENT_SPACE, GENERIC_SPACE, RESTRICTED_ACCESS, SHOP_SPACE,
    asyncJoinSpace,
    updateCreateSpace} from "../../../actions/spaces";
import {getStaticImageUrl} from "../../../actions/environment";
import {FlatIcon, FlatLink, Icon, NavigationGroup, NavigationRow} from "../../navigation-buttons/nav-buttons";
import {asyncDeleteSpace, asyncLeaveSpaceByUsername, updateDeleteSpace} from '../../../actions/spaces';
import {ImageBoxBig} from "../boxes/image-box-big";
import {DateBoxFlat} from "../boxes/date-box-flat";
import LeaveSpaceDialog from "../dialogs/leave-space-dialog";

class SidebarEntryEvent extends Component {

    state = {isLeaveOpen: false, isDeleteOpen: false};

    renderAvatar(user, space) {
        return <div className="avatar-tooltip">
            <span title={space.name}><img src={getStaticImageUrl(user.avatar)}/></span>
        </div>
    }

    joinSpace = (event) => {
        event.preventDefault();
        const {authname, space} = this.props;


        console.log('EVENT', authname, space);

        this.props.asyncJoinSpace(authname, space.id, member => {
            this.props.updateCreateSpace(space);
            toastr.info(`You have joined ${space.name}`);
        });
    };

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
        const {authname, isAuthorized, isOwner, isMember = true, space} = this.props;
        const {isLeaveOpen, isDeleteOpen} = this.state;
        const {user, state} = space;

        const activespace = `/${user.username}/space/${space.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderCover(user, space));
        const isBlocked = state === 'BLOCKED';
        const date = space.spacedata.startDate ? space.spacedata.startDate : space.created;
        const dates = moment(date).format('MMM DD').split(" ");
        const hasChildren = space.children && space.children.length > 0;
        const image = space.media && space.media.length > 0 ? space.media[0].url : null;

        return <div className='sidebar-entry-event mt-1 mb-2'>
            <NavigationRow className='sidebar-entry-date box-light-gray'>
            <NavigationGroup>
                    <FlatLink to={activespace}>
                        <ImageBoxBig image={image}/>
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
                {isAuthorized && !isOwner && isMember && <FlatIcon circle>
                    <Icon title={`Leave ${space.name}`}
                          className="fas fa-user-minus sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.setState({isLeaveOpen: true});
                    }}/>
                </FlatIcon>}

                {isAuthorized && !isOwner && !isMember && <FlatIcon circle>
                    <Icon title={`Join ${space.name}`}
                          className="fas fa-user-plus sidebar-entry-icon" onClick={this.joinSpace}/>
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

                <LeaveSpaceDialog isOpen={isLeaveOpen}
                                  onOpen={() => this.setState({isLeaveOpen: false})}
                                  authname={authname}
                                  space={space}/>

            </NavigationRow>
                <FlatLink to={activespace} className='date-box-flat-margin box-light-gray'>
                    <DateBoxFlat blocked={isBlocked} html={html} dates={dates} className='mr-2'/>
                    <span className='sidebar-space-text'>{space.name}</span>
                </FlatLink>
        </div>
    }
}

export default connect(null, {
    asyncDeleteSpace,
    asyncLeaveSpaceByUsername,
    updateDeleteSpace,
    asyncJoinSpace,
    updateCreateSpace})(SidebarEntryEvent);
