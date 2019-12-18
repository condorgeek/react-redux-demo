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
import {bindTooltip, showTooltip} from "../../actions/tippy-config";
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link, withRouter} from "react-router-dom";

import {
    asyncUpdateUserAvatar, asyncValidateAuth, asyncAddFollowee, asyncAddFriend, loginStatus
} from "../../actions/index";
import {asyncJoinSpace, asyncLeaveSpace, updateGenericData, updateCreateSpace, updateDeleteSpace,
    asyncUpdateSpaceCover, asyncFetchGenericData} from "../../actions/spaces";

import {EVENT_SPACE, ACTION_LEAVE_SPACE, ACTION_JOIN_SPACE} from "../../actions/spaces";
import CoverUploadModal from "./cover-upload-modal";
import CoverSlider from "./cover-slider";
import HeadlineUserEntry from "../headlines/headline-user-entry";
import {getStaticImageUrl} from "../../actions/environment";

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
        this.handleTooltipAction = this.handleTooltipAction.bind(this);
    }

    localstate(data) {
        let state = data;
        let tooltips = [];
        return {
            setState(newstate) { state = {...state, ...newstate}; return state; },
            getState() { return state; },
            pushTooltip(tooltip) { tooltips.push(tooltip)},
            removeTooltips() {
                tooltips.forEach(tooltip => {tooltip.destroy();}); tooltips = [];
            }
        }
    }

    componentWillUnmount() {
        this.localstate.removeTooltips();
    }

    renderMembersTooltip(authorization, genericdata) {
        const {user} = genericdata.space;
        const avatar = getStaticImageUrl(user.avatar);

        const isOwner = genericdata && (genericdata.space.user.username === authorization.user.username);
        const isMember = genericdata && genericdata.isMember;

        const data = {authorization: authorization, genericdata: genericdata, username: user.username,
            spaceId: genericdata ? genericdata.space.id : null, memberId: isMember ? genericdata.member.id : null};

        return <div className="generic-cover-tooltip">
            <img src={avatar}/>{` Space created by ${user.firstname}`}

            {!isOwner && !isMember &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_JOIN_SPACE})}>
                <span><i className="fas fa-user-plus"/></span>Join Space
            </button>}

            {!isOwner && isMember &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_LEAVE_SPACE})}>
                <span><i className="fas fa-user-minus"/></span>Leave Space
            </button>}
        </div>
    }

    handleTooltipAction(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {authorization, genericdata, username, spaceId, memberId} = props;

        switch (props.action) {
            case ACTION_JOIN_SPACE:
                this.props.asyncJoinSpace(authorization.user.username, spaceId, member => {
                    this.props.updateCreateSpace(genericdata.space);
                    toastr.info(`You have joined ${genericdata.space.name}`);
                });

                return;

            case ACTION_LEAVE_SPACE:
                memberId && this.props.asyncLeaveSpace(authorization.user.username, spaceId, memberId, member => {
                        this.props.updateDeleteSpace(genericdata.space);
                        toastr.info(`You have left ${genericdata.space.name}`);
                    });
                return;

            default:
                return;
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
        if(!genericdata) return (<div className="fa-2x billboard-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);
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
                {/*<a className="nav-link" href="#">{child.name}</a>*/}
                <Link className="nav-link" to={target} href="#">{child.name}</Link>
            </li>
        });

        return <div className="navigation-submenu">
            <ul className="nav">{entries}</ul>
        </div>
    }


    resolveUserName(authorization, genericdata) {
        if(!genericdata) return authorization.user.username;

        const isOwner = genericdata.isMember && genericdata.member.role === 'OWNER';
        const isSuperUser = authorization && authorization.user.isSuperUser;

        return isSuperUser && !isOwner ? genericdata.space.user.username : authorization.user.username;
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, genericdata, ownername, spacepath, spaceId} = this.props;

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchGenericData(authorization.user.username, spacepath);
            return "";
        }

        const inContext = genericdata && (genericdata.space.id.toString() === spaceId);
        const isMember = genericdata && genericdata.isMember;
        const isMembersOnly = genericdata && genericdata.space.access === 'RESTRICTED';
        const isEvent = genericdata && genericdata.space.type === 'EVENT';
        const isAuthorized = authorization.status === loginStatus.SUCCESS;
        const isSuperUser = authorization && authorization.user.isSuperUser;

        const spacedata = genericdata && genericdata.spacedata;

        const startDate = this.getStartDate(genericdata);

        return (
            <div className='billboard-cover'>
                <span title={this.getTitle(genericdata, startDate)}>
                    {this.renderCoverBanner(genericdata)}
                </span>

                {genericdata && <div className="billboard-cover-headline">
                    <div className="headline-display-box">
                        <div className="headline-display-text">
                            <span className="headline-text">{genericdata.space.name}</span>
                        </div></div>
                    <div className="headline-entry-box">
                        <HeadlineUserEntry text={genericdata.space.description}/>
                        <HeadlineUserEntry title='General Information' text={spacedata.generalInformation} icon='fas fa-info-circle'/>
                        <HeadlineUserEntry title='Tickets' text={spacedata.tickets} icon='fas fa-ticket-alt'/>
                        <HeadlineUserEntry title='Dates' text={spacedata.dates} icon='fas fa-calendar-alt'/>
                        <HeadlineUserEntry title='Location' text={spacedata.theVenue} icon='fas fa-hotel'/>
                    </div>
                </div>}

                {isAuthorized && (isMember || isSuperUser) &&
                    <CoverUploadModal authorization={authorization} spacepath={spacepath}
                                      username={this.resolveUserName(authorization, genericdata)}
                                      container={this.uploadRef}/>}

                {isAuthorized && <div className="friends-navigation">

                    {isMembersOnly && <div title="Members Only" className="members-only" ref={(elem)=> {
                        if (elem === null) return;
                        const tooltip = showTooltip(elem);
                        this.localstate.pushTooltip(tooltip);
                    }}><i className="fas fa-mask"/></div>}

                    {inContext && this.localstate.removeTooltips()}

                    {inContext && <button type="button" className="btn btn-fullblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || genericdata === undefined) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderMembersTooltip(authorization, genericdata));
                                const tooltip = bindTooltip(elem, html, {callback: this.handleTooltipAction});
                                this.localstate.pushTooltip(tooltip);
                            }}>
                    Members <span className="badge badge-info d-inline">{genericdata ? genericdata.members : 0}</span>
                    </button>}

                </div>}

                {isEvent && <div className='billboard-date-container'>
                    <div className="billboard-date text-center">
                        <div className="month">{moment(startDate).format('MMM')}</div>
                        <div className="day">{moment(startDate).format('DD')}</div>
                        <div className="dayofweek">{moment(startDate).format('dddd')}</div>
                    </div>
                </div>}

                {genericdata && this.renderSubMenu(genericdata.space)}

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {authorization: state.authorization,
        genericdata: state.genericdata ? state.genericdata.payload : state.genericdata};
}

export default connect(mapStateToProps, {asyncValidateAuth, asyncUpdateUserAvatar,
    asyncUpdateSpaceCover, asyncFetchGenericData, asyncAddFollowee, asyncAddFriend,
    asyncJoinSpace, asyncLeaveSpace, updateGenericData, updateCreateSpace, updateDeleteSpace})(BillboardGenericCover);
