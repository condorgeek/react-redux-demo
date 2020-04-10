/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [sidebar-entry-space.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 13.02.20, 11:32
 */

import toastr from "toastr";
import OverlayScrollbars from 'overlayscrollbars';

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
    GENERIC_SPACE,
    asyncLeaveSpaceByUsername,
    updateDeleteSpace,
    asyncDeleteSpace,
    asyncJoinSpace,
    updateCreateSpace,
} from "../../../actions/spaces";
import {getStaticImageUrl} from "../../../actions/environment";
import {FlatIcon, FlatLink, Icon, NavigationGroup, NavigationRow} from "../../navigation-buttons/nav-buttons";
import {ImageBoxSmall} from "../boxes/image-box-small";
import SpaceDialogBox from "../../dialog-box/space-dialog-box";
import {NavigationToggler} from "../../navigation-headlines/nav-headlines";
import LeaveSpaceDialog from "../dialogs/leave-space-dialog";

class SidebarEntrySpace extends Component {

    constructor(props) {
        super(props);
        this.state = {isLeaveOpen: false, isDeleteOpen: false}
    }

    joinSpace = (event) => {
        event.preventDefault();
        const {authname, space} = this.props;

        this.props.asyncJoinSpace(authname, space.id, member => {
            this.props.updateCreateSpace(space);
            toastr.info(`You have joined ${space.name}`);
        });
    };

    renderAvatarTooltip(avatar, space) {
        return <div className="avatar-tooltip"><span title={space.name}><img src={avatar}/></span></div>
    }

    renderChildren(user, space) {
        const children = space.children.map(child => {
            const target = `/${user.username}/space/${child.id}`;
            return <li key={child.id} className="nav-item"> <Link to={target} className="nav-link" >{child.name}</Link></li>
        });

        return <div className="sidebar-submenu"><ul className="nav flex-column">{children}</ul></div>;
    }

    render() {
        const {authname, space, isAuthorized, isOwner, isMember = true} = this.props;
        const {isLeaveOpen, isDeleteOpen} = this.state;
        const {user, state} = space;

        const activespace = `/${user.username}/space/${space.id}`;
        const avatar = getStaticImageUrl(user.avatar);
        const image = space.media && space.media.length > 0 ? space.media[0].url : null;
        const hasChildren = space.children && space.children.length > 0;

        return <Fragment> <NavigationRow className='sidebar-entry-space box-light-gray'>
            <NavigationGroup className='mt-1 mb-1'>
                <FlatLink to={activespace}>
                    <ImageBoxSmall blocked={state === 'BLOCKED'} image={image} avatar={user.avatar}/>
                    <span className="sidebar-space-text">{space.name}</span>
                </FlatLink>
            </NavigationGroup>

            <NavigationGroup column>
                {isAuthorized && !isOwner && isMember && <FlatIcon circle small>
                    <Icon title={`Leave ${space.name}`}
                          className="fas fa-user-minus sidebar-entry-icon" onClick={(event) => {
                        event.preventDefault();
                        this.setState({isLeaveOpen: true})
                    }}/>
                </FlatIcon>}

                {isAuthorized && !isOwner && !isMember && <FlatIcon circle small>
                    <Icon title={`Join ${space.name}`}
                          className="fas fa-user-plus sidebar-entry-icon"
                          onClick={this.joinSpace}/>
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

            <LeaveSpaceDialog isOpen={isLeaveOpen}
                              onOpen={() => this.setState({isLeaveOpen: false})}
                              authname={authname}
                              space={space}/>

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

export default connect(null, {
    asyncLeaveSpaceByUsername,
    updateDeleteSpace,
    asyncDeleteSpace,
    asyncJoinSpace,
    updateCreateSpace})(SidebarEntrySpace)
