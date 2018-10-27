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
import tippy from '../util/tippy.all.patched';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncUpdateSpaceCover, asyncFetchSpaceData, asyncValidateAuth,
    asyncAddFollowee, asyncAddFriend, ROOT_SERVER_URL, ROOT_STATIC_URL} from "../../actions/index";
import {authConfig} from "../../actions/bearer-config";
import '../../../node_modules/tippy.js/dist/tippy.css';


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
        this.props.asyncFetchSpaceData(props.username, props.space);

        this.localstate = this.localstate.bind(this)({location: props.location});
        this.handleTooltipRequest = this.handleTooltipRequest.bind(this);
    }

    localstate(data) {
        let state = data;
        return {
            setState(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            getState() {
                return state;
            }
        }
    }

    componentDidMount() {
        holderjs.run();
    }

    validateAuth(event) {
        this.props.asyncValidateAuth(this.props.username);
    }

    uploadSpaceCover(event, username, space) {
        event.preventDefault();
        const filelist = event.target.files;

        if (filelist.length !== 1) return;

        console.log('UPLOAD_COVER', username, space);

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/cover/upload/${space}`, formData, authConfig())
            .then(response => {
                this.props.asyncUpdateSpaceCover(username, {path: response.data}, space);
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

    getFullName(isEditable, payload, spacedata) {
        return isEditable ? `${payload.user.firstname} ${payload.user.lastname}` :
            spacedata !== undefined ? `${spacedata.space.user.firstname} ${spacedata.space.user.lastname}` : 'Loading..';
    }

    getResidence(isEditable, payload, spacedata) {
        return isEditable ? `${payload.userdata.address.city} ${payload.userdata.address.country}` :
           spacedata !== undefined ? `${spacedata.userdata.address.city} ${spacedata.userdata.address.country}` : 'Loading..';
    }

    getCoverImage(spacedata) {
        if(spacedata !== undefined) {
            const {cover, name, user} = spacedata.space;
            return cover !== null ? <img src={`${ROOT_STATIC_URL}/${cover}`}/> :
                <Coverholder text={user.firstname} ref={() => holderjs.run() }/>;
        }
        return 'Loading..';
    }

    getAvatarImage(isEditable, payload, spacedata) {
        if(payload === undefined || spacedata === undefined) return 'Loading';

        const avatar = isEditable ? payload.user.avatar :
            spacedata !== undefined ? spacedata.space.user.avatar : null;

        const {firstname, lastname} = spacedata.space.user;

        return avatar !== null ? <img src={`${ROOT_STATIC_URL}/${avatar}`}/> :
            <Avatarholder firstname={firstname} lastname={lastname} ref={() => holderjs.run() }/>;
    }


    renderFriendsTooltip(spacedata) {
        const {user} = spacedata.space;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, username: user.username};

        return <div className="friends-tooltip">
            <img src={avatar}/> You know {user.firstname} ?
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'ADD_FRIENDSHIP'})}>
                <span><i className="fas fa-user-plus"/></span>Add friend
            </button>
        </div>
    }

    renderFollowersTooltip(spacedata) {
        const {user} = spacedata.space;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, username: user.username};

        return <div className="friends-tooltip">
            <img src={avatar}/> Stay in touch with {user.firstname} ?

            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'FOLLOW_USER'})}>
                <span className="fa-layers fa-fw">
                    <i className="fas fa-user"/>
                    <i className="fas fa-angle-right" data-fa-transform="shrink-12"/>
                </span>Follow
            </button>
        </div>
    }

    handleTooltipRequest(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        switch (props.action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, timestamp);
                this.props.asyncAddFriend(props.authorization.user.username, props.username);
                return;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', props);
                this.props.asyncAddFollowee(props.authorization.user.username, props.username);
                return;

            default:
                return;
        }
    }

    bindTooltipToRef(elem, templateId, html) {
        const initialText = document.querySelector(templateId).textContent;

        const tooltip = tippy(elem, {
            html: templateId, interactive: true, reactive: true,
            placement: 'bottom',
            theme: 'billboard',
            animation: 'shift-toward', arrow: true,
            // trigger: 'click',
            onShow() {
                const content = this.querySelector('.tippy-content');
                if (tooltip.loading || content.innerHTML !== initialText) return;
                tooltip.loading = true;
                content.innerHTML = html;
                tooltip.loading = false;
            },
            onHidden() {
                const content = this.querySelector('.tippy-content');
                content.innerHTML = initialText;
            },
            onClick: this.handleTooltipRequest
        });
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, userdata, username, space} = this.props;
        const payload = this.props.userdata.payload;
        const spacedata = this.props.spacedata.payload;

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceData(username, space);
        }

        const isEditable = spacedata !== undefined  && payload !== undefined && spacedata.space.user.username === payload.user.username;
        const fullname = this.getFullName(isEditable, payload, spacedata);
        const residence = this.getResidence(isEditable, payload, spacedata);
        const friends = spacedata != null ? spacedata.friends : 0;
        const followers = spacedata != null ? spacedata.followers : 0;

        return (
            <div className='billboard-cover'>
                <span title={`${fullname}, ${residence}`}>
                    {this.getCoverImage(spacedata)}
                </span>

                {isEditable && <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={event => this.validateAuth(event)}
                           onChange={event => this.uploadSpaceCover(event, payload.user.username, space)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                }

                <div className="friends-navigation">
                    <button type="button" className="btn btn-billboard btn-sm"
                            ref={(elem)=> {
                                if (elem === null || spacedata === undefined || isEditable) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderFriendsTooltip(spacedata));
                                this.bindTooltipToRef(elem, "#friends-tooltip", html);
                            }}
                    >
                    Friends <div className="badge badge-light d-inline">{friends || 123}</div>
                    </button>
                    <button type="button" className="btn btn-billboard btn-sm"
                            ref={(elem)=> {
                                if (elem === null || spacedata === undefined || isEditable) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderFollowersTooltip(spacedata));
                                this.bindTooltipToRef(elem, "#followers-tooltip", html);
                            }}
                    >
                    Followers <div className="badge badge-light d-inline">{followers || 45}</div>
                    </button>
                </div>

                <div className='billboard-avatar'>
                    {this.getAvatarImage(isEditable, payload, spacedata)}

                    {isEditable && <label for="avatarUploadId">
                        <input type="file" id="avatarUploadId"
                               onClick={event => this.validateAuth(event)}
                               onChange={event => this.uploadUserAvatar(event, payload.user.username)}/>
                        <i className="fa fa-picture-o" aria-hidden="true"/>
                    </label>
                    }
                </div>

                <div id="friends-tooltip" className="d-none">Loading...</div>
                <div id="followers-tooltip" className="d-none">Loading...</div>

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {authorization: state.authorization, userdata: state.userdata, spacedata: state.spacedata};
}

export default connect(mapStateToProps, {asyncValidateAuth, asyncUpdateUserAvatar,
    asyncUpdateSpaceCover, asyncFetchSpaceData, asyncAddFollowee, asyncAddFriend})(BillboardCover);
