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
import {getAuthorizedUsername, isAuthorized, isOwner, isSuperUser} from "../../../selectors";
import {withConfigurationContext} from "../../util/configuration-context";


const renderJoinButtons = (username, props) => {
    const {authname, isAuthorized, genericdata, spaceId, location, onJoinSpace, onLeaveSpace, Lang} = props;
    const {isMember} = genericdata;
    const inContext = genericdata && (genericdata.space.id.toString() === spaceId);
    const isOwner = genericdata && (genericdata.space.user.username === authname);

    if(!inContext) return null;

    const targetUrl = location.pathname !== `/${username}/space/${spaceId}` ?
        `/${username}/space/${spaceId}` : `/${username}/members/${spaceId}`;

    return <Fragment>
        <LinkButton btn small title={Lang.generic.nav.members}
                    className='btn-outline-light mobile-headline-button'
                    to={targetUrl}>
            <Icon className="fas fa-user-friends mr-1"/>{genericdata.members}
            <span className='mobile-headline-text'> {Lang.generic.nav.members}</span>
        </LinkButton>

        {isAuthorized && !isOwner && !isMember && <FlatButton btn small title={Lang.generic.nav.join}
                                              className='btn-outline-light mobile-headline-button'
                                              onClick={onJoinSpace}>
            <Icon className='fas fa-user-plus mr-1'/>
            <span className='mobile-headline-text'>{Lang.generic.nav.join}</span>
        </FlatButton>}

        {isAuthorized && !isOwner && isMember && <FlatButton btn small title={Lang.generic.nav.leave}
                                             className='btn-outline-light mobile-headline-button'
                                             onClick={onLeaveSpace}>
            <Icon className='fas fa-user-minus mr-1'/>
            <span className='mobile-headline-text'>{Lang.generic.nav.leave}</span>
        </FlatButton>}
    </Fragment>
};

const GenericNavigation = (props) => {
    const {genericdata, spaceId, isAuthorized, isSuperUser, authname, isOwner, location, onUpload, Lang} = props;
    const {isMember, spacedata} = genericdata;
    const isMembersOnly = genericdata && genericdata.space.access === 'RESTRICTED';
    const username = genericdata && genericdata.space.user.username;
    const isMembersLocation = location.pathname === `/${username}/members/${spaceId}`;

    return <div className="mobile-headline-container">

        <NavigationRow className={`mobile-headline-navigation 
        ${isMembersLocation ? 'box-members' : 'box-system'}`}>
            <NavigationGroup>
                <span className="mobile-headline-title">
                    {genericdata.space.name} {isMembersLocation && Lang.generic.nav.membersSuffix}
                </span>
            </NavigationGroup>

            <NavigationGroup>
                {isAuthorized && isMembersOnly &&
                <FlatButton btn small title='Members Only'
                            className='btn-outline-light mobile-headline-button'>
                    <Icon className="fas fa-mask mr-1"/>
                </FlatButton>}

                {renderJoinButtons(username, props)}

                {isAuthorized && (isOwner || isSuperUser) &&
                <FlatIcon circle btn primary title={Lang.generic.nav.uploadCover}
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
    isOwner: isOwner(state),
});

export default connect(mapStateToProps, {})(
    withConfigurationContext(GenericNavigation));