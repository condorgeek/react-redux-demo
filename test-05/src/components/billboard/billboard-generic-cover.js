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
import tippy from '../util/tippy.all.patched';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncUpdateSpaceCover, asyncFetchSpaceData, asyncValidateAuth,
    asyncAddFollowee, asyncAddFriend, ROOT_SERVER_URL, ROOT_STATIC_URL} from "../../actions/index";
import {asyncJoinSpace, asyncLeaveSpace, updateSpaceData, updateCreateSpace, updateDeleteSpace} from "../../actions/spaces";

import {authConfig} from "../../actions/bearer-config";
import '../../../node_modules/tippy.js/dist/tippy.css';
import {EVENT_SPACE, ACTION_LEAVE_SPACE, ACTION_JOIN_SPACE} from "../../actions/spaces";


class Coverholder extends Component {
    render() {
        const holder = `holder.js/800x330?auto=yes&random=yes&text=${this.props.text}&size=16`;
        return <img src={holder}/>
    }
}

class BillboardGenericCover extends Component {

    constructor(props) {
        super(props);

        const {authorization, ownername} = props;

        this.state={location: props.location};
        this.props.asyncFetchSpaceData(authorization.user.username, props.space);

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

    validateAuth(authname) {
        this.props.asyncValidateAuth(authname);
    }

    uploadSpaceCover(event, username, space) {
        event.preventDefault();
        const filelist = event.target.files;

        if (filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/cover/upload/${space}`, formData, authConfig())
            .then(response => {
                this.props.asyncUpdateSpaceCover(username, {path: response.data}, space);
            })
            .catch(error => console.log(error));
    }

    getCoverImage(spacedata) {
        if(spacedata !== undefined) {
            const {cover, name, user} = spacedata.space;
            return cover !== null ? <img src={`${ROOT_STATIC_URL}/${cover}`}/> :
                <Coverholder text={name} ref={() => holderjs.run() }/>;
        }
        return 'Loading..';
    }

    renderMembersTooltip(authorization, spacedata) {
        const {user} = spacedata.space;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;

        const isOwner = spacedata && (spacedata.space.user.username === authorization.user.username);
        const isMember = spacedata && spacedata.isMember;

        const data = {authorization: authorization, spacedata: spacedata, username: user.username,
            spaceId: spacedata ? spacedata.space.id : null, memberId: isMember ? spacedata.member.id : null};

        return <div className="friends-tooltip">
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

    handleTooltipRequest(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {authorization, spacedata, username, spaceId, memberId} = props;

        switch (props.action) {
            case ACTION_JOIN_SPACE:
                this.props.asyncJoinSpace(authorization.user.username, spaceId, member => {
                    spacedata.isMember = true;
                    spacedata.members = spacedata.members + 1;
                    spacedata.member = member;
                    this.props.updateSpaceData(spacedata);
                    this.props.updateCreateSpace(spacedata.space);
                    toastr.info(`You have joined ${spacedata.space.name}`);
                });

                return;

            case ACTION_LEAVE_SPACE:
                memberId && this.props.asyncLeaveSpace(authorization.user.username, spaceId, memberId, member => {
                        spacedata.isMember = false;
                        spacedata.members = spacedata.members - 1;
                        spacedata.member = null;
                        this.props.updateSpaceData(spacedata);
                        this.props.updateDeleteSpace(spacedata.space);
                        toastr.info(`You have left ${spacedata.space.name}`);
                    });
                return;

            default:
                return;
        }
    }

    getTitle(spacedata) {
        if (!spacedata) return "";
        const {space} = spacedata;

        return space.type === EVENT_SPACE ? `${space.name}, on ${moment(space.created).format('DD MMM YYYY [at] HH:mm')}`
            : `${space.name}, created ${moment(space.created).format('DD MMM YYYY')}`;
    }

    render() {
        const {location} = this.localstate.getState();

        const {authorization, userdata, spacedata, ownername, space} = this.props;
        const payload = this.props.userdata.payload;

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceData(authorization.user.username, space);
        }
        const isMember = spacedata && spacedata.isMember;
        const isMembersOnly = spacedata && spacedata.space.access === 'RESTRICTED';

        // TODO where to save space resources - owner or member context ?
        // console.log('UPLOAD_COVER', ownername, payload ? payload.user.username : payload);

        return (
            <div className='billboard-cover'>
                <span title={this.getTitle(spacedata)}>
                    {this.getCoverImage(spacedata)}
                </span>

                {isMember && <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={() => this.validateAuth(authorization.user.username)}
                           onChange={event => this.uploadSpaceCover(event, payload.user.username, space)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                }

                <div className="friends-navigation">

                    {isMembersOnly && <div title="Members Only" className="members-only" ref={(elem)=> {
                        if (elem === null) return;
                        tippy(elem, {arrow: true, theme: "standard"});
                    }}><i className="fas fa-mask"/></div>}

                    <button type="button" className="btn btn-lightblue btn-sm"
                            ref={(elem)=> {
                                if (elem === null || spacedata === undefined) return;
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderMembersTooltip(authorization, spacedata));
                                this.bindTooltipToRef(elem, "#friends-tooltip", html);
                            }}
                    >
                    Members <div className="badge badge-light-cover d-inline">{spacedata ? spacedata.members : 0}</div>
                    </button>

                </div>

                <div id="friends-tooltip" className="d-none">Loading...</div>

            </div>
        );
    }

    bindTooltipToRef(elem, templateId, html) {
        const initialText = document.querySelector(templateId).textContent;

        const tooltip = tippy(elem, {
            html: templateId, interactive: true, reactive: true,
            placement: 'bottom',
            theme: 'standard',
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
}


function mapStateToProps(state) {
    return {authorization: state.authorization, userdata: state.userdata,
        spacedata: state.spacedata ? state.spacedata.payload : null};
}

export default connect(mapStateToProps, {asyncValidateAuth, asyncUpdateUserAvatar,
    asyncUpdateSpaceCover, asyncFetchSpaceData, asyncAddFollowee, asyncAddFriend,
    asyncJoinSpace, asyncLeaveSpace, updateSpaceData, updateCreateSpace, updateDeleteSpace})(BillboardGenericCover);
