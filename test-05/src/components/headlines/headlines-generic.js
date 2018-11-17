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
import {bindTooltip, showTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace, updateSpaceData,
    updateCreateSpace, updateDeleteSpace, asyncDeleteMember, ACTION_DELETE_MEMBER} from "../../actions/spaces";
import {ROOT_STATIC_URL} from "../../actions";

export class HeadlinesGeneric extends Component {

    constructor(props) {
        super(props);
        this.handleTooltipAction = this.handleTooltipAction.bind(this);
        this.localstate = this.localstate.bind(this)({location: props.location});
    }

    localstate(data) {
        let state = data;
        let tooltips = [];
        return {
            setState(newstate) { state = {...state, ...newstate}; return state;},
            getState() { return state; },
            pushTooltip(tooltip) { tooltips.push(tooltip)},
            removeTooltips() {
                tooltips.forEach(tooltip => {tooltip.destroy();}); tooltips = [];
            }
        }
    }

    componentDidMount() {
        const {authorization, spaceId} = this.props;
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
        this.props.asyncFetchMembers(authorization.user.username, spaceId);
    }

    componentWillUnmount() {
        this.localstate.removeTooltips();
    }

    renderMembersTooltip(authorization, fullname, spacedata, member) {
        const data = {authorization: authorization, member: member, spacedata: spacedata, fullname: fullname};
        const isSelf = authorization.user.username === member.user.username;

        return <div className="friends-tooltip">
            {fullname} {isSelf && '(Owner)'}
            {!isSelf && <button className="btn btn-tooltip btn-sm"
                                data-props={JSON.stringify({...data, action: ACTION_DELETE_MEMBER})}>
                <span><i className="fas fa-user-minus"/></span> Remove member
            </button>}
        </div>
    }

    handleTooltipAction(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {authorization, spacedata, fullname, member} = props;

        switch (props.action) {
            case ACTION_DELETE_MEMBER:
                this.props.asyncDeleteMember(authorization.user.username, member.space.id, member.id, member => {
                    spacedata.members = spacedata.members - 1;
                    this.props.updateSpaceData(spacedata);

                    toastr.info(`You have removed ${fullname}`);
                });

                return;
            default:
                return;
        }
    }

    renderMembers(authorization, spacedata, members) {
        const isOwner = spacedata && (spacedata.space.user.username === authorization.user.username);

        if(!spacedata) return (<div className="fa-2x">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        return members
            .filter(member => {
                return spacedata.space.id === member.space.id;})

            .map((member, idx) => {
            const homespace = `/${member.user.username}/home`;
            const avatar = `${ROOT_STATIC_URL}/${member.user.avatar}`;
            const fullname = `${member.user.firstname} ${member.user.lastname}`;

            return (
                <Link key={idx} to={homespace}>
                    <div key={idx} className="card headline-member">
                        {isOwner && <img className="card-img-top" src={avatar}
                             ref={(elem) => {
                                 if (elem === null) return;
                                 const html = ReactDOMServer.renderToStaticMarkup(this.renderMembersTooltip(authorization, fullname, spacedata, member));
                                 const tooltip = bindTooltip(elem, html, {callback: this.handleTooltipAction});
                                 this.localstate.pushTooltip(tooltip);
                             }}/>}
                        {!isOwner && <img title={fullname} className="card-img-top" src={avatar}
                                         ref={(elem) => {
                                             if (elem === null) return;
                                             const tooltip = showTooltip(elem);
                                             this.localstate.pushTooltip(tooltip);
                                         }}/>}
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
                        showTooltip(elem);
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
                        showTooltip(elem);
                    }}><i className="fas fa-user-minus"/>
            </button>}
        </div>
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, space, spacedata, spaceId, members} = this.props;

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchMembers(authorization.user.username, spaceId);
            return "";
        }

        // if(!spacedata) return (<div className="fa-2x">
        //     <i className="fas fa-spinner fa-spin"/>
        // </div>);

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
                        {members && this.renderMembers(authorization, spacedata, members)}
                    </div>
                </div>

            </div>
        );
    }
}



function mapStateToProps(state) {
    return {
        authorization: state.authorization, members: state.members,
        spacedata: state.spacedata ? state.spacedata.payload : null
    };
}

export default connect(mapStateToProps, {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace,
    asyncDeleteMember, updateSpaceData, updateCreateSpace, updateDeleteSpace})(HeadlinesGeneric);