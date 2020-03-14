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


const renderFriendButtons = (props, location) => {
    const {homedata, authname, username} = props;
    const {space, isFriend} = homedata;
    const isSelf = username === authname;

    const friendsUrl = location.pathname !== `/${username}/friends` ?
        `/${username}/friends` : `/${username}/home`;

    const pendingUrl = location.pathname !== `/${username}/pending` ?
        `/${username}/pending` : `/${username}/home`;

    return <Fragment>
        <LinkButton btn small title={`${space.user.firstname}'s friends`}
                    className='btn-outline-light mobile-headline-button'
                    to={friendsUrl}>
            <Icon className="fas fa-user-friends mr-1"/>{homedata.friends}
            <span className='mobile-headline-text'> Friends</span>
        </LinkButton>

        {isSelf && homedata.pending > 0 && <LinkButton btn small title={`Pending requests for ${space.user.firstname}`}
                    className='btn-outline-light mobile-headline-button'
                    to={pendingUrl}>
            <Icon className="fas fa-clock mr-1"/>{homedata.pending}
            <span className='mobile-headline-text'> Pending</span>
        </LinkButton>}

        {!isSelf && !isFriend && <FlatButton btn small title={`Add ${space.user.firstname} as friend`}
                                className='btn-outline-light mobile-headline-button'
                                onClick={(e) => {
                                    props.asyncAddFriend(authname, username, friend => {
                                        toastr.warning(`You have requested a friendship to ${friend.friend.firstname}.`);
                                    });
                                }}>
            <Icon className="fas fa-user-plus mr-1"/>
            <span className='mobile-headline-text'>Add Friend</span>
        </FlatButton>}
    </Fragment>
};


const HomeNavigation = (props) => {
    const {location, isAuthorized, homedata, authname, username, isSuperUser, onUpload} = props;
    const userdata = homedata && homedata.userdata;
    const isOwner = homedata && homedata.isOwner || false;
    const isFriendsLocation = location.pathname === `/${username}/friends`;
    const isPendingLocation = location.pathname === `/${username}/pending`;

    return <div className='mobile-headline-container'>

        <NavigationRow className={`mobile-headline-navigation 
        ${isFriendsLocation ? 'box-chat': isPendingLocation ? 'box-orange' : 'box-system'} `}>
            <NavigationGroup>
                <span className="mobile-headline-title">
                    {homedata.space.user.fullname} {isFriendsLocation && '- friends'}
                </span>
            </NavigationGroup>

            {isAuthorized && <NavigationGroup>

                {renderFriendButtons(props, location)}

                {isAuthorized && (isOwner || isSuperUser) &&
                <FlatIcon circle btn primary title='Upload cover image'
                          className='mobile-headline-icon' onClick={onUpload}>
                    <BiggerIcon className="far fa-image clr-white" aria-hidden="true"/>
                </FlatIcon>}
            </NavigationGroup>}
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
});

export default connect(mapStateToProps, {asyncAddFriend})(HomeNavigation)