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

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncUpdateSpaceCover, asyncFetchSpaceData, asyncValidateAuth,
    asyncAddFollowee, asyncAddFriend, ROOT_SERVER_URL, ROOT_STATIC_URL} from "../../actions/index";
import {authConfig} from "../../actions/bearer-config";
import '../../../node_modules/tippy.js/dist/tippy.css';
import {EVENT_SPACE} from "../../actions/spaces";


class Coverholder extends Component {
    render() {
        const holder = `holder.js/800x330?auto=yes&random=yes&text=${this.props.text}&size=16`;
        return <img src={holder}/>
    }
}

class BillboardGenericCover extends Component {

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


    renderMembersTooltip(spacedata) {
        const {user} = spacedata.space;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const data = {authorization: this.props.authorization, username: user.username};

        return <div className="friends-tooltip">
            <img src={avatar}/>{` Space created by ${user.firstname}`}
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'JOIN_SPACE'})}>
                <span><i className="fas fa-user-plus"/></span>Join Space
            </button>

            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'LEAVE_SPACE'})}>
                <span><i className="fas fa-user-minus"/></span>Leave Space
            </button>
        </div>
    }

    handleTooltipRequest(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        switch (props.action) {
            case 'JOIN_SPACE':
                console.log('JOIN_SPACE', props, timestamp);
                // this.props.asyncAddFriend(props.authorization.user.username, props.username);
                return;

            case 'LEAVE_SPACE':
                console.log('LEAVE_SPACE', props, timestamp);
                // this.props.asyncAddFriend(props.authorization.user.username, props.username);
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

        const {authorization, userdata, spacedata, username, space} = this.props;
        const payload = this.props.userdata.payload;

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceData(username, space);

        }
        const isMember = spacedata && spacedata.isMember;
        const isMembersOnly = spacedata && spacedata.space.access === 'RESTRICTED';

        return (
            <div className='billboard-cover'>
                <span title={this.getTitle(spacedata)}>
                    {this.getCoverImage(spacedata)}
                </span>

                {isMember && <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={event => this.validateAuth(event)}
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
                                const html = ReactDOMServer.renderToStaticMarkup(this.renderMembersTooltip(spacedata));
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
            theme: 'bluelight',
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
    asyncUpdateSpaceCover, asyncFetchSpaceData, asyncAddFollowee, asyncAddFriend})(BillboardGenericCover);
