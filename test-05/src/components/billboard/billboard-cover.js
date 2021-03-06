/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [billboard-cover.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 21:01
 */

import holderjs from 'holderjs';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import {
    asyncAcceptFriend, asyncAddFollowee, asyncAddFriend, asyncBlockFriend, asyncCancelFriend,
    asyncDeleteFollowee, asyncDeleteFriend, asyncIgnoreFriend, asyncUnblockFriend,
    asyncUpdateUserAvatar, asyncUpdateSurrogateAvatar, asyncValidateAuth,
    LOGIN_STATUS_ERROR, LOGIN_STATUS_LOGOUT, LOGIN_STATUS_REQUEST, LOGIN_STATUS_SUCCESS,
    ROOT_SERVER_URL, ROOT_STATIC_URL
} from "../../actions/index";

import {ACTION_ACCEPT_FRIEND, ACTION_ADD_FOLLOWEE, ACTION_ADD_FRIEND, ACTION_BLOCK_FRIEND, ACTION_CANCEL_FRIEND,
    ACTION_DELETE_FOLLOWEE, ACTION_DELETE_FRIEND, ACTION_IGNORE_FRIEND, ACTION_UNBLOCK_FRIEND,
    asyncFetchHomeData, asyncUpdateHomeCover, updateHomeData} from "../../actions/spaces";

import {authConfig} from "../../actions/bearer-config";
import {bindRawTooltip, showTooltip} from "../../actions/tippy-config";
import CoverUploadModal from "./cover-upload-modal";
import CoverSlider from "./cover-slider";
import HeadlineUserEntry from '../headlines/headline-user-entry';


class Coverholder extends Component {
    render() {
        const holder = `holder.js/800x300?auto=yes&theme=sky&text=${this.props.text}&size=12&outline=yes`;
        return <img src={holder} data-ignore={true}/>
    }
}

class Avatarholder extends Component {
    render() {
        const {firstname, lastname} = this.props;
        const holder = `holder.js/160x160?auto=yes&random=yes&text=${firstname.charAt(0)}${lastname.charAt(0)}&size=28`;
        return <img src={holder}/>
    }
}

class BillboardCover extends Component {

    constructor(props) {
        super(props);

        this.state={location: props.location};
        this.props.asyncFetchHomeData(props.username, props.spacepath);
        this.uploadRef = React.createRef();

        this.localstate = this.localstate.bind(this)({location: props.location});
        this.handleTooltipAction = this.handleTooltipAction.bind(this);
    }

    localstate(data) {
        let state = data;
        let tooltips = [];
        return {
            setState(newstate) {state = {...state, ...newstate}; return state; },
            getState() { return state; },
            pushTooltip(tooltip) { tooltips.push(tooltip)},
            removeTooltips() {
                tooltips.forEach(tooltip => {tooltip.destroy();}); tooltips = [];
            }
        }
    }

    componentDidMount() {
        this.localstate.removeTooltips();
    }

    componentWillUnmount() {
        console.log('UNMOUNT COVER');
        this.localstate.removeTooltips();
    }

    validateAuth(event) {
        this.props.asyncValidateAuth(this.props.username);
    }

    uploadUserAvatar(event, username, isSurrogate) {
        event.preventDefault();
        const filelist = event.target.files;

        if (filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));

        axios.post(`${ROOT_SERVER_URL}/user/${username}/avatar/upload`, formData, authConfig())
            .then(response => {
                isSurrogate ? this.props.asyncUpdateSurrogateAvatar(username, {path: response.data}) :
                    this.props.asyncUpdateUserAvatar(username, {path: response.data});
            })
            .catch(error => console.log(error));
    }

    getFullName(isOwner, logindata, homedata) {
        return isOwner && logindata ? `${logindata.user.firstname} ${logindata.user.lastname}` :
            homedata ? `${homedata.space.user.firstname} ${homedata.space.user.lastname}` : "";
    }

    getResidence(isOwner, logindata, homedata) {
        return isOwner && logindata ? `${logindata.userdata.address.city} ${logindata.userdata.address.country}` :
           homedata ? `${homedata.userdata.address.city} ${homedata.userdata.address.country}` : "";
    }

    renderAvatarImage(isOwner, logindata, homedata) {
        if(!homedata) return "";

        const avatar = isOwner && logindata ? logindata.user.avatar :
            homedata !== undefined ? homedata.space.user.avatar : null;

        const {firstname, lastname} = homedata.space.user;

        return avatar !== null ? <img src={`${ROOT_STATIC_URL}/${avatar}`}/> :
            <Avatarholder firstname={firstname} lastname={lastname} ref={() => holderjs.run() }/>;
    }


    renderFriendsTooltip(homedata) {
        const {user} = homedata.space;
        const {friend, isFriend} = homedata;
        const isBlocked = isFriend && friend.state === 'BLOCKED';
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, homedata: homedata, username: user.username};

        const text = isFriend ? friend.state === 'ACTIVE' ? "You're friend's with" : friend.state === 'PENDING' ?
            "Pending friendship with" : friend.state === 'BLOCKED' ? "Friendship is blocked" : "" : "";

        return <div className="generic-cover-tooltip">
            <img className={isBlocked ? 'blocked-img': ''} src={avatar}/><span className="d-block">{text}</span> {user.firstname} {user.lastname}
            {isBlocked && <svg viewBox="-0.2 -0.2 24.8 24.8">
                <path d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
            </svg>}

            {!isFriend && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_ADD_FRIEND})}>
                <span><i className="fas fa-user-plus"/></span>Add friend
            </button>}

            {isFriend && friend.state === 'ACTIVE' && <span>
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_DELETE_FRIEND})}>
                <span><i className="fas fa-user-minus"/></span>Delete friend
            </button>
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_BLOCK_FRIEND})}>
                <span><i className="fas fa-user-slash"/></span>Block friend
                </button>
            </span>
            }

            {isFriend && friend.state === 'PENDING' && friend.action === 'REQUESTING' &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_CANCEL_FRIEND})}>
                <span><i className="fas fa-user-minus"/></span>Cancel request
            </button>}

            {isFriend && friend.state === 'PENDING' && friend.action === 'REQUESTED' && <span>
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_ACCEPT_FRIEND})}>
                <span><i className="fas fa-user-check"/></span>Confirm {user.firstname}
            </button>

            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_IGNORE_FRIEND})}>
                <span><i className="fas fa-user-minus"/></span>Ignore {user.firstname}
                </button>
            </span>}

            {isFriend && friend.state === 'BLOCKED' && friend.action === 'BLOCKING' &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_UNBLOCK_FRIEND})}>
                <span><i className="fas fa-user-check"/></span>Unblock friend
            </button>}

        </div>
    }

    renderFollowersTooltip(homedata) {
        const {user} = homedata.space;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, homedata: homedata, username: user.username};

        return <div className="generic-cover-tooltip">
            <img src={avatar}/> {homedata.isFollowee ? <span className="d-block">You follow</span> : ''} {user.firstname} {user.lastname}

            {!homedata.isFollowee && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_ADD_FOLLOWEE})}>
                <span className="fa-layers fa-fw">
                    <i className="fas fa-user"/>
                    <i className="fas fa-angle-right" data-fa-transform="shrink-12"/>
                </span>Follow
            </button>}

            {homedata.isFollowee && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_DELETE_FOLLOWEE})}>
                <span><i className="fas fa-user-minus"/></span>Stop following
            </button>}

        </div>
    }

    handleTooltipAction(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {authorization, username, homedata} = props;
        const authname = authorization.user.username;

        switch (props.action) {

            case ACTION_ADD_FRIEND:
                this.props.asyncAddFriend(authname, username, friend =>{
                    toastr.warning(`You have requested a friendship to ${friend.friend.firstname}.`);
                });
                return;

            case ACTION_CANCEL_FRIEND:
                this.props.asyncCancelFriend(authname, username, friend => {
                    toastr.warning(`You have cancelled your friendship's request to ${friend.friend.firstname}.`);
                });

                return;

            case ACTION_DELETE_FRIEND:
                this.props.asyncDeleteFriend(authname, username, friend => {
                    toastr.warning(`You have deleted your friendship to ${friend.friend.firstname}.`);
                });

                return;

            case ACTION_ACCEPT_FRIEND:
                this.props.asyncAcceptFriend(authname, username, friend => {
                    toastr.info(`You have confirmed ${friend.friend.firstname} friendship.`);
                });

                return;

            case ACTION_IGNORE_FRIEND:
                this.props.asyncIgnoreFriend(authname, username, friend => {
                    toastr.warning(`You have ignored ${friend.friend.firstname} friendship's request.`);
                });

                return;

            case ACTION_BLOCK_FRIEND:
                this.props.asyncBlockFriend(authname, username, friend => {
                    toastr.info(`You have blocked ${friend.friend.firstname}.`);
                });
                return;

            case ACTION_UNBLOCK_FRIEND:
                this.props.asyncUnblockFriend(authname, username, friend => {
                    toastr.info(`You have unblocked ${friend.friend.firstname}.`);
                });
                return;

            case ACTION_ADD_FOLLOWEE:
                this.props.asyncAddFollowee(authname, username, followee => {
                    toastr.warning(`You are following ${followee.followee.firstname}.`);
                });
                return;

            case ACTION_DELETE_FOLLOWEE:
                this.props.asyncDeleteFollowee(authname, username, followee => {
                    toastr.warning(`You have stopped following ${followee.followee.firstname}.`);
                });
                return;

            default:
                return;
        }
    }

    isTransitioning(authorization) {
        return authorization.status === LOGIN_STATUS_REQUEST || authorization.status === LOGIN_STATUS_LOGOUT ||
            authorization.status === LOGIN_STATUS_ERROR;
    }


    renderCoverBanner(homedata) {
        if(!homedata) return (<div className="fa-2x billboard-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);
        const {space} = homedata;

        if(!space.media) return <Coverholder text={space.user.firstname} ref={() => holderjs.run()}/>;

        switch (space.media.length) {
            case 0:
                return <Coverholder text={space.user.firstname} ref={() => holderjs.run()}/>;
            case 1:
                return <img src={`${ROOT_STATIC_URL}/${space.media[0].url}`}/>;
            default: // multiple slides
                return <CoverSlider space={space}/>
        }
    }

    resolveUserName(authorization, homedata) {
        if(!homedata) return authorization.user.username;

        const isOwner = homedata.isOwner;
        const isSuperUser = authorization && authorization.user.isSuperUser;

        return isSuperUser && !isOwner ? homedata.space.user.username : authorization.user.username;
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, logindata, username, spacepath, homedata} = this.props;

        if(this.isTransitioning(authorization)) return '';

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchHomeData(username, spacepath);
            return "";
        }

        const isOwner = homedata && homedata.isOwner || false;
        const fullname = this.getFullName(isOwner, logindata, homedata);
        const residence = this.getResidence(isOwner, logindata, homedata);
        const isAuthorized = authorization && authorization.status === LOGIN_STATUS_SUCCESS;
        const isSuperUser = authorization && authorization.user.isSuperUser;
        const isSurrogate = isSuperUser && !isOwner;
        const isPublicHome = !authorization.isAuthorized && this.props.location.pathname === "/public/home";
        const userdata = homedata && homedata.userdata;

        return (
            <div className='billboard-cover'>
                <span title={`${fullname}, ${residence}`}>
                    {this.renderCoverBanner(homedata)}
                </span>

                {homedata && <div className="billboard-cover-headline">
                    <div className="headline-display-box">
                        <div className="headline-display-text">
                            <span className="headline-text">{homedata.space.user.fullname}</span>
                        </div></div>
                    <div className="headline-entry-box">
                        <HeadlineUserEntry title='About' text={userdata.aboutYou} icon='fas fa-user-circle'/>
                        <HeadlineUserEntry title='Work' text={userdata.work} icon='fas fa-user-tie'/>
                    </div>
                </div>}


                {isAuthorized && (isOwner || isSuperUser) &&
                    <CoverUploadModal authorization={authorization} spacepath={spacepath}
                                      username={this.resolveUserName(authorization, homedata)}
                                      container={this.uploadRef}/>}

                {isAuthorized && <div className="friends-navigation">
                    {homedata &&  this.localstate.removeTooltips()}
                    {homedata && <button type="button" className="btn btn-fullblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || homedata.isOwner) return;
                                const tooltip = bindRawTooltip(elem, this.renderFriendsTooltip(homedata),
                                    {callback: this.handleTooltipAction});
                                this.localstate.pushTooltip(tooltip);
                            }}
                    >
                    Friends <span className="badge badge-info">{homedata.friends}</span>
                    </button>}

                    {homedata && <button type="button" className="btn btn-fullblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || homedata.isOwner) return;
                                const tooltip = bindRawTooltip(elem, this.renderFollowersTooltip(homedata),
                                    {callback: this.handleTooltipAction});
                                this.localstate.pushTooltip(tooltip);
                            }}
                    >
                    Followers <span className="badge badge-info">{homedata.followers}</span>
                    </button>}
                </div>}

                <div className='billboard-avatar'>
                    {!isPublicHome && this.renderAvatarImage(isOwner, logindata, homedata)}

                    {isAuthorized && (isOwner || isSuperUser) && <label for="avatarUploadId">
                        <input type="file" id="avatarUploadId"
                               onClick={event => this.validateAuth(event)}
                               onChange={event => this.uploadUserAvatar(event,
                                   this.resolveUserName(authorization, homedata),
                                   isSurrogate)}/>
                        <i className="fa fa-picture-o" aria-hidden="true"/>
                    </label>}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization,
        logindata: state.logindata ? state.logindata.payload : state.logindata,
        homedata: state.homedata ? state.homedata.payload : state.homedata};
}

export default connect(mapStateToProps, {asyncValidateAuth, asyncUpdateUserAvatar, asyncUpdateHomeCover,
    asyncFetchHomeData, asyncAddFollowee, asyncAddFriend, asyncCancelFriend, asyncIgnoreFriend,
    asyncUnblockFriend, asyncBlockFriend, asyncUpdateSurrogateAvatar,
    asyncAcceptFriend, asyncDeleteFriend, asyncDeleteFollowee, updateHomeData})(BillboardCover);
