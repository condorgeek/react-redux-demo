/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [billboard-generic-cover.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 05.10.18 14:04
 */

import holderjs from 'holderjs';
import moment from 'moment';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

import {asyncJoinSpace, asyncLeaveSpace,
    updateCreateSpace, updateDeleteSpace,
    asyncFetchGenericData} from "../../actions/spaces";

import {EVENT_SPACE} from "../../actions/spaces";
import CoverUploadModal from "./dialogs/cover-upload-modal";
import CoverSlider from "../slider/cover-slider";
import {getStaticImageUrl} from "../../actions/environment";
import {
    BiggerIcon, FlatButton,
    FlatIcon,
    Icon, LinkButton,
    NavigationGroup,
    NavigationRow
} from "../navigation-buttons/nav-buttons";
import {ConfigurationContext} from "../configuration/configuration";
import {getAuthorizedUsername, isAuthorized, isSuperUser} from "../../selectors";
import {SpinnerBig} from "../util/spinner";
import SpaceInformation from "../user-information/space-information";

class Coverholder extends Component {
    render() {
        const holder = `holder.js/800x330?auto=yes&theme=social&text=${this.props.text}&size=8&outline=yes`;
        return <img src={holder} data-ignore={true}/>
    }
}

class BillboardGenericCover extends Component {

    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
        this.props.asyncFetchGenericData(props.authorization.user.username, props.spacepath);

        this.localstate = this.localstate.bind(this)({location: props.location});
    }

    localstate(data) {
        let state = data;
        return {
            setState(newstate) { state = {...state, ...newstate}; return state; },
            getState() { return state; },
        }
    }


    getStartDate(genericdata) {
        if (!genericdata) return "";
        const {space} = genericdata;
        return space.spacedata.startDate ? space.spacedata.startDate : space.created;
    }

    getTitle(genericdata, date) {
        if (!genericdata) return "";
        const {space} = genericdata;

        return space.type === EVENT_SPACE ? `${space.name}, ${moment(date).format('DD MMM YYYY')}`
            : `${space.name}`;
    }

    renderCoverBanner(genericdata) {
        if(!genericdata) return <SpinnerBig/>;

        const {space} = genericdata;

        if(!space.media) return <Coverholder text={space.name} ref={() => holderjs.run()}/>;

        switch (space.media.length) {
            case 0:
                return <Coverholder text={space.name} ref={() => holderjs.run()}/>;
            case 1:
                return <img src={getStaticImageUrl(space.media[0].url)}/>;
            default: // multiple slides
                return <CoverSlider space={space}/>
        }
    }

    renderSubMenu(space) {
        if(!space || !space.children.length) return '';

        const entries = space.children.map(child => {
            const target = `/${child.user.username}/space/${child.id}`;

            return <li className="nav-item">
                <Link className="nav-link" to={target} href="#">{child.name}</Link>
            </li>
        });

        return <div className="navigation-submenu">
            <ul className="nav">{entries}</ul>
        </div>
    }


    resolveUserName(authorization, genericdata) {
        const {authname, isSuperUser} = this.props;
        if(!genericdata) return authname;

        const isOwner = genericdata.isMember && genericdata.member.role === 'OWNER';
        return isSuperUser && !isOwner ? genericdata.space.user.username : authname;
    }

    joinSpace = (event) => {
        event.preventDefault();
        const {authname, spaceId, genericdata} = this.props;

        this.props.asyncJoinSpace(authname, spaceId, member => {
            this.props.updateCreateSpace(genericdata.space);
            toastr.info(`You have joined ${genericdata.space.name}`);
        });
    };

    leaveSpace = (event) => {
        event.preventDefault();
        const {authname, spaceId, genericdata} = this.props;
        const isMember = genericdata && genericdata.isMember;
        const memberId = isMember ? genericdata.member.id : null;

        memberId && this.props.asyncLeaveSpace(authname, spaceId, memberId, member => {
            this.props.updateDeleteSpace(genericdata.space);
            toastr.info(`You have left ${genericdata.space.name}`);
        });
    };

    renderJoinButtons = (inContext) => {
        const {authname, genericdata} = this.props;
        const isMember = genericdata && genericdata.isMember;
        const isOwner = genericdata && (genericdata.space.user.username === authname);

        if(!inContext) return null;

        return <Fragment>
            <LinkButton btn small title='Space members'
                        className='btn-outline-light mobile-headline-button'
                        to={`/${authname}/members/${genericdata.space.id}`}>
                <Icon className="fas fa-user-friends mr-1"/>
                <span className='mobile-headline-text'>
                                        {genericdata.members} Members
                                    </span>
            </LinkButton>

            {!isOwner && !isMember && <FlatButton btn small title='Join space'
                        className='btn-outline-light mobile-headline-button'
                        onClick={this.joinSpace}>
                <Icon className='fas fa-user-plus mr-1'/>
                <span className='mobile-headline-text'>Join</span>
            </FlatButton>}

            {!isOwner && isMember && <FlatButton btn small title='Leave space'
                        className='btn-outline-light mobile-headline-button'
                        onClick={this.leaveSpace}>
                <Icon className='fas fa-user-minus mr-1'/>
                <span className='mobile-headline-text'>Leave</span>
            </FlatButton>}
        </Fragment>
    };


    render() {
        const {location} = this.localstate.getState();
        const {authorization, genericdata, isAuthorized, isSuperUser, ownername, spacepath, spaceId, Lang} = this.props;

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchGenericData(authorization.user.username, spacepath);
            return null;
        }

        const inContext = genericdata && (genericdata.space.id.toString() === spaceId);
        const isMember = genericdata && genericdata.isMember;
        const isMembersOnly = genericdata && genericdata.space.access === 'RESTRICTED';
        const isEvent = genericdata && genericdata.space.type === 'EVENT';
        const spacedata = genericdata && genericdata.spacedata;
        const startDate = this.getStartDate(genericdata);

        return <div className='billboard-cover'>
                <span title={this.getTitle(genericdata, startDate)}>
                    {this.renderCoverBanner(genericdata)}
                </span>

                {genericdata && <div className="mobile-headline-container">

                    <NavigationRow className='mobile-headline-navigation box-system'>
                        <NavigationGroup>
                            <span className="mobile-headline-title">{genericdata.space.name}</span>
                        </NavigationGroup>

                        <NavigationGroup>
                            {isAuthorized && isMembersOnly &&
                            <FlatButton btn small title='Members Only'
                                        className='btn-outline-light mobile-headline-button'>
                                <Icon className="fas fa-mask mr-1"/>
                            </FlatButton>}

                            {this.renderJoinButtons(inContext)}

                            {isAuthorized && (isMember || isSuperUser) &&
                            <FlatIcon circle btn primary title='Upload cover image'
                                      className='mobile-headline-icon' onClick={(e) => {
                                e.preventDefault();
                                this.uploadModalRef.onOpen();
                            }}>
                                <BiggerIcon className="far fa-image clr-white" aria-hidden="true"/>
                            </FlatIcon>}

                        </NavigationGroup>
                    </NavigationRow>

                    <SpaceInformation description={genericdata.space.description}
                                      spacedata={spacedata}/>

                </div>}

                {isAuthorized && (isMember || isSuperUser) &&
                    <CoverUploadModal onRef={ref => this.uploadModalRef = ref}
                                      authorization={authorization} spacepath={spacepath}
                                      username={this.resolveUserName(authorization, genericdata)}
                                      container={this.uploadRef}/>}

                {isEvent && <div className='billboard-date-container'>
                    <div className="billboard-date text-center">
                        <div className="month">{moment(startDate).format('MMM')}</div>
                        <div className="day">{moment(startDate).format('DD')}</div>
                        <div className="dayofweek">{moment(startDate).format('dddd')}</div>
                    </div>
                </div>}

                {genericdata && this.renderSubMenu(genericdata.space)}

            </div>
    }
}


function mapStateToProps(state) {
    return {authorization: state.authorization,
        authname: getAuthorizedUsername(state),
        isAuthorized: isAuthorized(state),
        isSuperUser: isSuperUser(state),
        genericdata: state.genericdata ? state.genericdata.payload : state.genericdata};
}

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<BillboardGenericCover {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default connect(mapStateToProps, {
    asyncFetchGenericData,
    asyncJoinSpace,
    asyncLeaveSpace,
    updateCreateSpace,
    updateDeleteSpace
})(withConfigurationContext);
