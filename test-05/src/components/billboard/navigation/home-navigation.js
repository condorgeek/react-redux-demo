/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [home-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 10.03.20, 15:07
 */
import toastr from "toastr";

import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import {
    BiggerIcon, FlatButton,
    FlatIcon,
    Icon,
    LinkButton,
    NavigationGroup,
    NavigationRow
} from "../../navigation-buttons/nav-buttons";
import UserInformation from "../../user-information/user-information";
import {getAuthorizedUsername, isAuthorized, isSuperUser} from "../../../selectors";
import { asyncAddFriend } from "../../../actions";
import {withConfigurationContext} from "../../util/configuration-context";

const renderSpacesButton = (props, location) => {
    const {homedata, authname, username, viewSpaces, viewEvents, Lang} = props;
    const firstname = homedata.space.user.firstname;
    // const count = ((spaces && spaces.length) || 0) + ((events && events.length) || 0);
    const count = viewSpaces.length + viewEvents.length;

    const spacesUrl = location.pathname !== `/${username}/spaces` ?
        `/${username}/spaces` : `/${username}/home`;

    console.log('HOMEDATA', homedata);

    return <LinkButton btn small title={Lang.user.nav.spacesTooltip(firstname)}
                       className='btn-outline-light mobile-headline-button'
                       to={spacesUrl}>
        <Icon className="fas fa-th-large mr-1"/>{count > 0 && count}
        <span className='mobile-headline-text'> {Lang.user.nav.spaces}</span>
    </LinkButton>
};

const renderFriendButtons = (props, location) => {
    const {homedata, authname, username, Lang} = props;
    const {space, isFriend} = homedata;
    const isSelf = username === authname;

    const friendsUrl = location.pathname !== `/${username}/friends` ?
        `/${username}/friends` : `/${username}/home`;

    const pendingUrl = location.pathname !== `/${username}/pending` ?
        `/${username}/pending` : `/${username}/home`;

    return <Fragment>
        <LinkButton btn small
                    title={Lang.user.nav.friendsTooltip(space.user.firstname)}
                    className='btn-outline-light mobile-headline-button'
                    to={friendsUrl}>
            <Icon className="fas fa-user-friends mr-1"/>{homedata.friends}
            <span className='mobile-headline-text'> {Lang.user.nav.friends}</span>
        </LinkButton>

        {isSelf && homedata.pending > 0 && <LinkButton btn small
                    title={Lang.user.nav.pendingTooltip(space.user.firstname)}
                    className='btn-outline-light mobile-headline-button'
                    to={pendingUrl}>
            <Icon className="fas fa-clock mr-1"/>{homedata.pending}
            <span className='mobile-headline-text'> {Lang.user.nav.pending}</span>
        </LinkButton>}

        {!isSelf && !isFriend && <FlatButton btn small
                    title={Lang.user.nav.addFriendTooltip(space.user.firstname)}
                    className='btn-outline-light mobile-headline-button'
                    onClick={(e) => {
                        props.asyncAddFriend(authname, username, friend => {
                            toastr.warning(Lang.user.nav.friendshipRequested(friend.friend.firstname));
                        });
                    }}>
            <Icon className="fas fa-user-plus mr-1"/>
            <span className='mobile-headline-text'>{Lang.user.nav.addFriend}</span>
        </FlatButton>}
    </Fragment>
};


const HomeNavigation = (props) => {
    const {location, isAuthorized, homedata, authname, username, isSuperUser, onUpload, Lang} = props;
    const userdata = homedata && homedata.userdata;
    const isOwner = homedata && homedata.isOwner || false;
    const isFriendsLocation = location.pathname === `/${username}/friends`;
    const isPendingLocation = location.pathname === `/${username}/pending`;

    return <div className='mobile-headline-container'>

        <NavigationRow className={`mobile-headline-navigation 
        ${isFriendsLocation ? 'box-chat': isPendingLocation ? 'box-orange' : 'box-system'} `}>
            <NavigationGroup>
                <span className="mobile-headline-title">
                    {homedata.space.user.fullname}
                    {isFriendsLocation ? Lang.user.nav.friendsSuffix :
                        isPendingLocation ? Lang.user.nav.pendingSuffix : ''}
                </span>
            </NavigationGroup>

            <NavigationGroup>
                {renderSpacesButton(props, location)}

                {isAuthorized && renderFriendButtons(props, location)}

                {isAuthorized && (isOwner || isSuperUser) &&
                <FlatIcon circle btn primary title={Lang.user.nav.uploadCover}
                          className='mobile-headline-icon' onClick={onUpload}>
                    <BiggerIcon className="far fa-image clr-white" aria-hidden="true"/>
                </FlatIcon>}
            </NavigationGroup>
        </NavigationRow>

        {!isFriendsLocation && !isPendingLocation && <UserInformation className='mobile-headline-body'
                                                description=''
                                                firstname={homedata.space.user.firstname}
                                                userdata={userdata}/>}
    </div>
};

const mapStateToProps = (state) => ({
    authname: getAuthorizedUsername(state),
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
    viewSpaces: state.viewSpaces,
    viewEvents: state.viewEvents,
});

export default connect(mapStateToProps, {asyncAddFriend})(
    withConfigurationContext(HomeNavigation))