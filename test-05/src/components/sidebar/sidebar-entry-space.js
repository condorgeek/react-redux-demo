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

import toastr from "../../../node_modules/toastr/toastr";
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';
import {GENERIC_SPACE, RESTRICTED_ACCESS, SHOP_SPACE,
    asyncLeaveSpaceByUsername, updateDeleteSpace, asyncDeleteSpace} from "../../actions/spaces";
import {getStaticImageUrl} from "../../actions/environment";
import {FlatIcon, FlatLink, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {ImageBoxSmall} from "./image-box-small";
import MessageBox from "../dialog-box/message-box";
import SpaceDialogBox from "../dialog-box/space-dialog-box";

class SidebarEntrySpace extends Component {

    constructor(props) {
        super(props);
        this.state = {isLeaveOpen: false, isDeleteOpen: false}
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
            return <li key={child.id} className="nav-item"> <Link to={target} className="nav-link" >{child.name}</Link></li>
        });

        return <div className="sidebar-submenu"><ul className="nav flex-column">{children}</ul></div>;
    }

    render() {
        const {authname, space, isAuthorized, isOwner} = this.props;
        const {isLeaveOpen, isDeleteOpen} = this.state;
        const {user, state} = space;

        const activespace = `/${user.username}/space/${space.id}`;
        const avatar = getStaticImageUrl(user.avatar);
        const image = space.media && space.media.length > 0 ? space.media[0].url : null;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderCoverTooltip(avatar, space));
        const hasChildren = space.children && space.children.length > 0;

        return <NavigationRow className='sidebar-entry-space'>
            <NavigationGroup>
                <FlatLink to={activespace}>
                    <ImageBoxSmall blocked={state === 'BLOCKED'} html={html} image={image} avatar={user.avatar}/>
                    <span className="sidebar-space-text">{space.name}</span>
                </FlatLink>

                {hasChildren && <div className="sidebar-space-toggle" onClick={event => {
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
            </NavigationGroup>
            <NavigationGroup>
                {isAuthorized && <FlatIcon circle>
                    <Icon title={`Leave ${space.name}`} className="fas fa-user-minus sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.setState({isLeaveOpen: true})
                    }}/>
                </FlatIcon>}

                {isAuthorized && isOwner && <FlatIcon circle>
                    <Icon title={`Delete ${space.name}`} className="fas fa-trash sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.setState({isDeleteOpen: true});
                    }}/>
                </FlatIcon>}
            </NavigationGroup>

            <SpaceDialogBox isOpen={isLeaveOpen} setIsOpen={() => this.setState({isLeaveOpen: false})}
                            image={image || user.avatar}
                            title='Leave Space' action='Leave'
                            callback={event => {
                                event.preventDefault();
                                this.props.asyncLeaveSpaceByUsername(authname, space.id, member => {
                                    this.props.updateDeleteSpace(space);
                                    toastr.info(`You have left ${space.name}`);
                                });
                            }}>
                <div>
                    <p>You have selected to leave the space <span className='space-name'>{space.name}</span>.</p>
                    <p>Are you sure of this operation ?</p>
                    <small>You can join again at a later time if you wish.</small>
                </div>
            </SpaceDialogBox>

            <SpaceDialogBox isOpen={isDeleteOpen} setIsOpen={() => this.setState({isDeleteOpen: false})}
                            image={image || user.avatar}
                            title='Delete Space' action='Delete'
                            callback={event => {
                                event.preventDefault();
                                this.props.asyncDeleteSpace(authname, GENERIC_SPACE, space.id, (space) => {
                                    toastr.info(`You have deleted ${space.name}`);
                                });
                            }}>
                <div>
                    <p>You have selected to delete the space <span className='space-name'>{space.name}</span>.</p>
                    <p>Are you sure of this operation ?</p>
                    <small>This operation cannot be undone. All resources associated with the space will be deleted as well.</small>
                </div>
            </SpaceDialogBox>

        </NavigationRow>
    }
}

export default connect(null, {asyncLeaveSpaceByUsername, updateDeleteSpace, asyncDeleteSpace})(SidebarEntrySpace)
