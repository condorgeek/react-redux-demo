/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [generic-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 10.03.20, 19:41
 */

import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {
    BiggerIcon,
    FlatButton,
    FlatIcon,
    Icon, LinkButton,
    NavigationGroup,
    NavigationRow
} from "../../navigation-buttons/nav-buttons";
import SpaceInformation from "../../user-information/space-information";
import {getAuthorizedUsername, isAuthorized, isSuperUser} from "../../../selectors";


const renderJoinButtons = (props) => {
    const {authname, genericdata, spaceId, location, onJoinSpace, onLeaveSpace} = props;
    const {isMember} = genericdata;
    const inContext = genericdata && (genericdata.space.id.toString() === spaceId);
    const isOwner = genericdata && (genericdata.space.user.username === authname);

    if(!inContext) return null;

    const targetUrl = location.pathname === `/${authname}/space/${spaceId}` ?
        `/${authname}/members/${spaceId}` : `/${authname}/space/${spaceId}`;

    return <Fragment>
        <LinkButton btn small title='Space members'
                    className='btn-outline-light mobile-headline-button'
                    // to={`/${authname}/members/${genericdata.space.id}`}>
                    to={targetUrl}>
            <Icon className="fas fa-user-friends mr-1"/>
            <span className='mobile-headline-text'>
                                        {genericdata.members} Members
                                    </span>
        </LinkButton>

        {!isOwner && !isMember && <FlatButton btn small title='Join space'
                                              className='btn-outline-light mobile-headline-button'
                                              onClick={onJoinSpace}>
            <Icon className='fas fa-user-plus mr-1'/>
            <span className='mobile-headline-text'>Join</span>
        </FlatButton>}

        {!isOwner && isMember && <FlatButton btn small title='Leave space'
                                             className='btn-outline-light mobile-headline-button'
                                             onClick={onLeaveSpace}>
            <Icon className='fas fa-user-minus mr-1'/>
            <span className='mobile-headline-text'>Leave</span>
        </FlatButton>}
    </Fragment>
};

const GenericNavigation = (props) => {
    const {genericdata, spaceId, isAuthorized, isSuperUser, authname, location, onUpload} = props;
    const {isMember, spacedata} = genericdata;
    const isMembersOnly = genericdata && genericdata.space.access === 'RESTRICTED';

    console.log('LOCATION', location);
    const isMembersLocation = location.pathname === `/${authname}/members/${spaceId}`;

    return <div className="mobile-headline-container">

        <NavigationRow className={`mobile-headline-navigation ${isMembersLocation ? 'box-members' : 'box-system'}`}>
            <NavigationGroup>
                <span className="mobile-headline-title">{genericdata.space.name}</span>
            </NavigationGroup>

            <NavigationGroup>
                {isAuthorized && isMembersOnly &&
                <FlatButton btn small title='Members Only'
                            className='btn-outline-light mobile-headline-button'>
                    <Icon className="fas fa-mask mr-1"/>
                </FlatButton>}

                {renderJoinButtons(props)}

                {isAuthorized && (isMember || isSuperUser) &&
                <FlatIcon circle btn primary title='Upload cover image'
                          className='mobile-headline-icon' onClick={onUpload}>
                    <BiggerIcon className="far fa-image clr-white" aria-hidden="true"/>
                </FlatIcon>}

            </NavigationGroup>
        </NavigationRow>

        <SpaceInformation description={genericdata.space.description}
                          spacedata={spacedata}/>

    </div>
};

const mapStateToProps = (state) => ({
    authname: getAuthorizedUsername(state),
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
});

export default connect(mapStateToProps, {})(GenericNavigation);