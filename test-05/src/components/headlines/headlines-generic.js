/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headlines-generic.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.10.18 15:48
 */

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import toastr from "../../../node_modules/toastr/toastr";
import tippy from "../util/tippy.all.patched";

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace, updateSpaceData,
    updateCreateSpace, updateDeleteSpace, ACTION_DELETE_MEMBER} from "../../actions/spaces";
import {ROOT_STATIC_URL} from "../../actions";

export class HeadlinesGeneric extends Component {

    constructor(props) {
        super(props);
        this.state = {location: props.location};
    }

    componentDidMount() {
        const {authorization, spaceId} = this.props;
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
        this.props.asyncFetchMembers(authorization.user.username, spaceId);
    }

    renderMembersTooltip(authorization, fullname, member) {
        const data = {authorization: authorization, member: member};

        return <div className="friends-tooltip">
            {fullname}
            <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: ACTION_DELETE_MEMBER})}>
                <span><i className="fas fa-user-minus"/></span> Remove member
            </button>
        </div>
    }

    handleTooltipRequest(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        const {authorization, member} = props;

        switch (props.action) {
            case ACTION_DELETE_MEMBER:
                console.log(ACTION_DELETE_MEMBER, member);
                return;
            default:
                return;
        }
    }

    renderMembers(authorization, members) {
        return members.map((member, idx) => {
            const homespace = `/${member.user.username}/home`;
            const avatar = `${ROOT_STATIC_URL}/${member.user.avatar}`;
            const fullname = `${member.user.firstname} ${member.user.lastname}`;

            return (
                <Link to={homespace}>
                    <div key={idx} className="card headline-member">
                        <img title={fullname} className="card-img-top" src={avatar}
                             ref={(elem) => {
                                 if (elem === null) return;
                                 const html = ReactDOMServer.renderToStaticMarkup(this.renderMembersTooltip(authorization, fullname, member));
                                 this.bindTooltipToRef(elem, "#members-tooltip", html);
                             }}/>
                        {member.role === 'OWNER' && <span className="member-triangle"/>}
                    </div>
                </Link>)
        });
    }

    renderMembersNavigation(authorization, spacedata, spaceId) {

        const isOwner = spacedata && (spacedata.space.user.username === authorization.user.username);
        const isMember = spacedata && spacedata.isMember;

        return <div className="headline-navigation">
            {!isOwner && !isMember && <button title="Join space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncJoinSpace(authorization.user.username, spaceId, (member) => {
                            spacedata.isMember = true;
                            spacedata.members = spacedata.members + 1;
                            spacedata.member = member;
                            this.props.updateSpaceData(spacedata);
                            this.props.updateCreateSpace(spacedata.space);
                            toastr.info(`You have joined ${spacedata.space.name}`);
                        });
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        tippy(elem, {arrow: true, theme: "standard"});
                    }}><i className="fas fa-user-plus"/>
            </button>}

            {!isOwner && isMember && <button title="Leave space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncLeaveSpace(authorization.user.username, spaceId, spacedata.member.id,
                            (member) => {
                                spacedata.isMember = false;
                                spacedata.members = spacedata.members - 1;
                                spacedata.member = null;
                                this.props.updateSpaceData(spacedata);
                                this.props.updateDeleteSpace(spacedata.space);
                                toastr.info(`You have left ${spacedata.space.name}`);
                            });
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        tippy(elem, {arrow: true, theme: "standard"});
                    }}><i className="fas fa-user-minus"/>
            </button>}
        </div>
    }

    render() {
        const {authorization, space, spacedata, spaceId, members} = this.props;

        if (this.state.location.pathname !== this.props.location.pathname) {
            this.setState({location: this.props.location});
            this.props.asyncFetchMembers(authorization.user.username, spaceId);
        }

        return (
            <div className='headlines-container'>

                <div className='headline'>
                    <h5>About this Space</h5>
                    {/*<ul>*/}
                    {/*{members && this.renderMembers(members)}*/}
                    {/*</ul>*/}
                </div>

                <div className='headline'>
                    <h5>Members ({members ? members.length : 0})</h5>
                    {spacedata && this.renderMembersNavigation(authorization, spacedata, spaceId)}
                </div>

                <div id='pictures-container-id' className='members-container'>
                    <div className='card-columns'>
                        {members && this.renderMembers(authorization, members)}
                    </div>
                </div>

                <div id="members-tooltip" className="d-none">Loading...</div>

            </div>
        );
    }

    bindTooltipToRef(elem, templateId, html) {
        const initialText = document.querySelector(templateId).textContent;

        const tooltip = tippy(elem, {
            html: templateId, interactive: true, reactive: true,
            placement: 'bottom', delay: [400, 0],
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
    return {
        authorization: state.authorization, members: state.members,
        spacedata: state.spacedata ? state.spacedata.payload : null
    };
}

export default connect(mapStateToProps, {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace,
    updateSpaceData, updateCreateSpace, updateDeleteSpace})(HeadlinesGeneric);