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
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncValidateAuth, asyncAddFollowee, asyncAddFriend,
    asyncIgnoreFriend, asyncDeleteFollowee, asyncCancelFriend, asyncAcceptFriend, asyncDeleteFriend,
    ROOT_SERVER_URL, ROOT_STATIC_URL} from "../../actions/index";
import {
    asyncUpdateHomeCover,
    asyncFetchHomeData,
    updateHomeData,
    ACTION_ADD_FOLLOWEE,
    ACTION_ADD_FRIEND,
    ACTION_DELETE_FRIEND,
    ACTION_DELETE_FOLLOWEE,
    ACTION_CANCEL_FRIEND,
    ACTION_ACCEPT_FRIEND, ACTION_IGNORE_FRIEND
} from "../../actions/spaces";
import {authConfig} from "../../actions/bearer-config";
import {bindTooltip} from "../../actions/tippy-config";


class Coverholder extends Component {
    render() {
        const holder = `holder.js/800x300?auto=yes&random=yes&text=${this.props.text}&size=16`;
        return <img src={holder}/>
    }
}

class Avatarholder extends Component {
    render() {
        const {firstname, lastname} = this.props;
        // const holder = `holder.js/160x160?auto=yes&theme=social&text=${firstname.charAt(0)}${lastname.charAt(0)}&size=28`;
        const holder = `holder.js/160x160?auto=yes&random=yes&text=${firstname.charAt(0)}${lastname.charAt(0)}&size=28`;
        return <img src={holder}/>
    }
}

class BillboardCover extends Component {

    constructor(props) {
        super(props);

        this.state={location: props.location};
        this.props.asyncFetchHomeData(props.username, props.space);

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

    componentDidMount() { // empty
        this.localstate.removeTooltips();
    }

    componentWillUnmount() {
        console.log('UNMOUNT COVER');
        this.localstate.removeTooltips();
    }

    validateAuth(event) {
        this.props.asyncValidateAuth(this.props.username);
    }

    uploadSpaceCover(event, username, space) {
        event.preventDefault();
        const filelist = event.target.files;
        if (filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/cover/upload/${space}`, formData, authConfig())
            .then(response => {
                this.props.asyncUpdateHomeCover(username, {path: response.data}, space);
            })
            .catch(error => console.log(error));
    }

    uploadUserAvatar(event, username) {
        event.preventDefault();
        const filelist = event.target.files;

        if (filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/avatar/upload`, formData, authConfig())
            .then(response => {
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

    getCoverImage(homedata) {

        if(!homedata) return (<div className="fa-2x billboard-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        const {cover, name, user} = homedata.space;
        return cover !== null ? <img src={`${ROOT_STATIC_URL}/${cover}`}/> :
                <Coverholder text={user.firstname} ref={() => holderjs.run() }/>;
    }

    getAvatarImage(isOwner, logindata, homedata) {
        if(!logindata || !homedata) return "";

        const avatar = isOwner ? logindata.user.avatar :
            homedata !== undefined ? homedata.space.user.avatar : null;

        const {firstname, lastname} = homedata.space.user;

        return avatar !== null ? <img src={`${ROOT_STATIC_URL}/${avatar}`}/> :
            <Avatarholder firstname={firstname} lastname={lastname} ref={() => holderjs.run() }/>;
    }


    renderFriendsTooltip(homedata) {
        const {user} = homedata.space;
        const {friend, isFriend} = homedata;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, homedata: homedata, username: user.username};

        const text = isFriend ? friend.state === 'ACTIVE' ? "You're friend's with" : friend.state === 'PENDING' ?
            "Pending friendship with" : "" : "";

        return <div className="generic-cover-tooltip">
            <img src={avatar}/><span className="d-block">{text}</span> {user.firstname} {user.lastname}

            {!isFriend &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_ADD_FRIEND})}>
                <span><i className="fas fa-user-plus"/></span>Add friend
            </button>}

            {isFriend && friend.state === 'ACTIVE' &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_DELETE_FRIEND})}>
                <span><i className="fas fa-user-minus"/></span>Delete friend
            </button>}

            {isFriend && friend.state === 'PENDING' && friend.action === 'REQUESTING' &&
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_CANCEL_FRIEND})}>
                <span><i className="fas fa-user-minus"/></span>Cancel request
            </button>}

            {isFriend && friend.state === 'PENDING' && friend.action === 'REQUESTED' &&
            <span>
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_ACCEPT_FRIEND})}>
                <span><i className="fas fa-user-check"/></span>Confirm {user.firstname}
            </button>

            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_IGNORE_FRIEND})}>
                <span><i className="fas fa-user-minus"/></span>Ignore {user.firstname}
                </button>
            </span>}

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

        switch (props.action) {

            case ACTION_ADD_FRIEND:
                this.props.asyncAddFriend(authorization.user.username, username, friendData =>{
                    this.localstate.removeTooltips();

                    homedata.friend = friendData;
                    homedata.isFriend = true;
                    this.props.updateHomeData(homedata);

                    toastr.warning(`You have requested a friendship to ${friendData.friend.firstname}.`);
                });
                return;

            case ACTION_CANCEL_FRIEND:
                this.props.asyncCancelFriend(authorization.user.username, username, friend => {
                    this.localstate.removeTooltips();

                    homedata.friend = null;
                    homedata.isFriend = false;
                    this.props.updateHomeData(homedata);

                    toastr.warning(`You have cancelled your friendship's request to ${friend.friend.firstname}.`);
                });

                return;

            case ACTION_DELETE_FRIEND:
                this.props.asyncDeleteFriend(authorization.user.username, username, friend => {
                    this.localstate.removeTooltips();

                    homedata.friends = homedata.friends - 1;
                    homedata.friend = null;
                    homedata.isFriend = false;
                    this.props.updateHomeData(homedata);

                    toastr.warning(`You have deleted your friendship to ${friend.friend.firstname}.`);
                });

                return;

            case ACTION_ACCEPT_FRIEND:
                this.props.asyncAcceptFriend(authorization.user.username, username, friend => {
                    this.localstate.removeTooltips();

                    homedata.friends = homedata.friends + 1;
                    homedata.friend = friend;
                    homedata.isFriend = true;
                    this.props.updateHomeData(homedata);

                    toastr.info(`You have confirmed ${friend.friend.firstname} friendship.`);
                });

                return;

            case ACTION_IGNORE_FRIEND:
                this.props.asyncIgnoreFriend(authorization.user.username, username, friend => {
                    this.localstate.removeTooltips();

                    homedata.friend = null;
                    homedata.isFriend = false;
                    this.props.updateHomeData(homedata);

                    toastr.warning(`You have ignored ${friend.friend.firstname} friendship's request.`);
                });

                return;

            case ACTION_ADD_FOLLOWEE:
                this.props.asyncAddFollowee(authorization.user.username, username, followee => {

                    this.localstate.removeTooltips();

                    homedata.isFollowee = true;
                    this.props.updateHomeData(homedata);

                    toastr.warning(`You are following ${followee.followee.firstname}.`);
                });
                return;

            case ACTION_DELETE_FOLLOWEE:
                this.props.asyncDeleteFollowee(authorization.user.username, username, followee => {
                    this.localstate.removeTooltips();

                    homedata.isFollowee = false;
                    this.props.updateHomeData(homedata);

                    toastr.warning(`You have stopped following ${followee.followee.firstname}.`);
                });

                return;

            default:
                return;
        }
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, logindata, username, space, homedata} = this.props;

        console.log('LOGINDATA', username, logindata, homedata);

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchHomeData(username, space);
            return "";
        }

        const isOwner = homedata && homedata.isOwner || false;
        const fullname = this.getFullName(isOwner, logindata, homedata);
        const residence = this.getResidence(isOwner, logindata, homedata);

        return (
            <div className='billboard-cover'>
                <span title={`${fullname}, ${residence}`}>
                    {this.getCoverImage(homedata)}
                </span>

                {isOwner && <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={event => this.validateAuth(event)}
                           onChange={event => this.uploadSpaceCover(event, username, space)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                }

                <div className="friends-navigation">
                    {homedata && <button type="button" className="btn btn-lightblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || homedata.isOwner) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderFriendsTooltip(homedata));
                                const tooltip = bindTooltip(elem, html, {callback: this.handleTooltipAction});
                                this.localstate.pushTooltip(tooltip);
                            }}
                    >
                    Friends <div className="badge badge-light d-inline">{homedata.friends}</div>
                    </button>}

                    {homedata && <button type="button" className="btn btn-lightblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || homedata.isOwner) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderFollowersTooltip(homedata));
                                const tooltip = bindTooltip(elem, html, {callback: this.handleTooltipAction});
                                this.localstate.pushTooltip(tooltip);
                            }}
                    >
                    Followers <div className="badge badge-light d-inline">{homedata.followers}</div>
                    </button>}
                </div>

                <div className='billboard-avatar'>
                    {this.getAvatarImage(isOwner, logindata, homedata)}

                    {isOwner && <label for="avatarUploadId">
                        <input type="file" id="avatarUploadId"
                               onClick={event => this.validateAuth(event)}
                               onChange={event => this.uploadUserAvatar(event, username)}/>
                        <i className="fa fa-picture-o" aria-hidden="true"/>
                    </label>
                    }
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
    asyncAcceptFriend, asyncDeleteFriend, asyncDeleteFollowee, updateHomeData})(BillboardCover);
