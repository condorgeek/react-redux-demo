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

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncValidateAuth, asyncAddFollowee, asyncAddFriend, asyncDeleteFriend, asyncDeleteFollowee,
    ROOT_SERVER_URL, ROOT_STATIC_URL} from "../../actions/index";
import {asyncUpdateHomeCover, asyncFetchHomeData,
    ACTION_FOLLOW_USER, ACTION_ADD_FRIENDSHIP, ACTION_DELETE_FRIENDSHIP, ACTION_UNFOLLOW_USER
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
        return isOwner ? `${logindata.user.firstname} ${logindata.user.lastname}` :
            homedata ? `${homedata.space.user.firstname} ${homedata.space.user.lastname}` : "";
    }

    getResidence(isOwner, logindata, homedata) {
        return isOwner ? `${logindata.userdata.address.city} ${logindata.userdata.address.country}` :
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
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, username: user.username};

        return <div className="generic-cover-tooltip">
            <img src={avatar}/> {homedata.isFriend ? <span className="d-block">You're friend's with</span> : ''} {user.firstname} {user.lastname}
            {!homedata.isFriend && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_ADD_FRIENDSHIP})}>
                <span><i className="fas fa-user-plus"/></span>Add friend
            </button>}

            {homedata.isFriend && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_DELETE_FRIENDSHIP})}>
                <span><i className="fas fa-user-minus"/></span>Delete friend
            </button>}

        </div>
    }

    renderFollowersTooltip(homedata) {
        const {user} = homedata.space;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, username: user.username};

        return <div className="generic-cover-tooltip">
            <img src={avatar}/> {homedata.isFollowee ? <span className="d-block">You follow</span> : ''} {user.firstname} {user.lastname}

            {!homedata.isFollowee && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_FOLLOW_USER})}>
                <span className="fa-layers fa-fw">
                    <i className="fas fa-user"/>
                    <i className="fas fa-angle-right" data-fa-transform="shrink-12"/>
                </span>Follow
            </button>}

            {homedata.isFollowee && <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_UNFOLLOW_USER})}>
                <span><i className="fas fa-user-minus"/></span>Stop following
            </button>}

        </div>
    }

    handleTooltipAction(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        switch (props.action) {
            case ACTION_ADD_FRIENDSHIP:
                this.props.asyncAddFriend(props.authorization.user.username, props.username);
                return;

            case ACTION_FOLLOW_USER:
                this.props.asyncAddFollowee(props.authorization.user.username, props.username);
                return;

            case ACTION_DELETE_FRIENDSHIP:
                console.log(ACTION_DELETE_FRIENDSHIP);

                // this.props.asyncDeleteFriend(authname, user.username, (params) => {
                //     toastr.warning(`You have deleted your friendship to ${user.firstname}.`);
                // });

                return;

            case ACTION_UNFOLLOW_USER:
                console.log(ACTION_UNFOLLOW_USER);
                // this.props.asyncDeleteFollowee(authname, user.username, (params) => {
                //     toastr.warning(`You have stopped following ${user.firstname}.`);
                // });

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
                           onChange={event => this.uploadSpaceCover(event, logindata.user.username, space)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                }

                <div className="friends-navigation">
                    {homedata && <button type="button" className="btn btn-lightblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || homedata === undefined || homedata.isOwner) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderFriendsTooltip(homedata));
                                const tooltip = bindTooltip(elem, html, {callback: this.handleTooltipAction});
                                this.localstate.pushTooltip(tooltip);
                            }}
                    >
                    Friends <div className="badge badge-light d-inline">{homedata.friends}</div>
                    </button>}

                    {homedata && <button type="button" className="btn btn-lightblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || homedata === undefined || homedata.isOwner) return;
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
                               onChange={event => this.uploadUserAvatar(event, logindata.user.username)}/>
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
    asyncFetchHomeData, asyncAddFollowee, asyncAddFriend,
    asyncDeleteFriend, asyncDeleteFollowee})(BillboardCover);
