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

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';
import {
    GENERIC_SPACE, RESTRICTED_ACCESS, SHOP_SPACE,
    asyncLeaveSpaceByUsername, updateDeleteSpace, asyncDeleteSpace, EVENT_SPACE
} from "../../actions/spaces";
import {getStaticImageUrl} from "../../actions/environment";
import {FlatIcon, FlatLink, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {ImageBoxSmall} from "./boxes/image-box-small";
import SpaceDialogBox from "../dialog-box/space-dialog-box";
import {NavigationToggler} from "../navigation-headlines/nav-headlines";

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

        return <Fragment> <NavigationRow className='sidebar-entry-space box-light-gray'>
            <NavigationGroup className='mt-1 mb-1'>
                <FlatLink to={activespace}>
                    <ImageBoxSmall blocked={state === 'BLOCKED'} html={html} image={image} avatar={user.avatar}/>
                    <span className="sidebar-space-text">{space.name}</span>
                </FlatLink>
            </NavigationGroup>

            <NavigationGroup column>
                {isAuthorized && <FlatIcon circle small>
                    <Icon title={`Leave ${space.name}`} className="fas fa-user-minus sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.setState({isLeaveOpen: true})
                    }}/>
                </FlatIcon>}

                {isAuthorized && isOwner && <FlatIcon circle small>
                    <Icon title={`Delete ${space.name}`} className="fas fa-trash sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.setState({isDeleteOpen: true});
                    }}/>
                </FlatIcon>}

                {hasChildren && <FlatIcon circle>
                    <Icon className="fas fa-chevron-down headline-icon-rotate" onClick={(event) => {
                        event.preventDefault();
                        this.subMenuRef.toggle();
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

            {hasChildren && <NavigationToggler onRef={(ref) => this.subMenuRef = ref}>
                <div className="sidebar-entry-submenu" ref={elem => {
                    elem && OverlayScrollbars(elem, {
                        scrollbars: {visibility: "hidden"}
                    });
                }}>
                    {this.renderChildren(user, space)}
                </div>
            </NavigationToggler>}

        </Fragment>
    }
}

export default connect(null, {asyncLeaveSpaceByUsername, updateDeleteSpace, asyncDeleteSpace})(SidebarEntrySpace)
