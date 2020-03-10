/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [home-secondary-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 10.03.20, 08:11
 */
import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import {
    BiggerIcon, FlatButton,
    FlatIcon,
    Icon,
    LinkButton,
    NavigationGroup,
    NavigationRow
} from "../navigation-buttons/nav-buttons";
import UserInformation from "../user-information/user-information";
import {getAuthorizedUsername, isAuthorized, isSuperUser} from "../../selectors";


const renderFriendButtons = (props, location) => {
    const {homedata, authname, username} = props;
    const isSelf = username === authname;

    const targetUrl = location.pathname === `/${authname}/home` ?
        `/${authname}/friends` : `/${authname}/home`;

    return <Fragment>
        <LinkButton btn small title='Chat'
                    className='btn-outline-light mobile-headline-button'
                    to={targetUrl}>
            <Icon className="fas fa-user-friends mr-1"/>
            <span className='mobile-headline-text'>{homedata.friends} Friends</span>
        </LinkButton>
        {!isSelf && <FlatButton btn small title='Add friend'
                                className='btn-outline-light mobile-headline-button'
                                onClick={(e) => {
                                    console.log('ADD FRIEND');
                                    // this.props.asyncAddFriend(authname, username, friend =>{
                                    //     toastr.warning(`You have requested a friendship to ${friend.friend.firstname}.`);
                                    // });
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

    const isFriendsLocation = location.pathname === `/${authname}/friends`;

    return <div className='mobile-headline-container'>

        <NavigationRow className={`mobile-headline-navigation ${isFriendsLocation ? 'box-chat':'box-system'} `}>
            <NavigationGroup>
                <span className="mobile-headline-title">{homedata.space.user.fullname}</span>
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

        {!isFriendsLocation && <UserInformation className='mobile-headline-body'
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

export default connect(mapStateToProps, {})(HomeNavigation)