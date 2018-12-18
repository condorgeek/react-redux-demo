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

import {
    ACTION_DELETE_MEMBER, asyncDeleteMember, asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace,
    updateCreateSpace, updateDeleteSpace, updateGenericData} from "../../actions/spaces";
import {ROOT_STATIC_URL} from "../../actions";
import HeadlinesEditor from './headlines-space-editor';


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
            setState(newstate) {
                state = {...state, ...newstate}; return state;
                },
            getState() {return state;},
            pushTooltip(tooltip) {tooltips.push(tooltip)},
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

    renderMembersTooltip(authorization, fullname, genericdata, member) {
        const data = {authorization: authorization, member: member, genericdata: genericdata, fullname: fullname};
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
        const {authorization, genericdata, fullname, member} = props;

        switch (props.action) {
            case ACTION_DELETE_MEMBER:
                this.props.asyncDeleteMember(authorization.user.username, member.space.id, member.id, member => {
                    toastr.info(`You have removed ${fullname}`);
                });
                return;

            default:
                return;
        }
    }

    renderMembers(authorization, genericdata, members) {
        const isOwner = genericdata && (genericdata.space.user.username === authorization.user.username);

        if (!genericdata) return (<div className="fa-2x">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        return members
            .filter(member => {
                return genericdata.space.id === member.space.id;
            })

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
                                                 const html = ReactDOMServer.renderToStaticMarkup(this.renderMembersTooltip(authorization, fullname, genericdata, member));
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

    renderMembersNavigation(authorization, genericdata, spaceId) {

        const isOwner = genericdata && (genericdata.space.user.username === authorization.user.username);
        const isMember = genericdata && genericdata.isMember;

        return <div className="headline-navigation">
            {!isOwner && !isMember &&
            <button title="Join space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncJoinSpace(authorization.user.username, spaceId, member => {
                            this.props.updateCreateSpace(genericdata.space);
                            toastr.info(`You have joined ${genericdata.space.name}`);
                        });
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-user-plus"/>
            </button>}

            {!isOwner && isMember &&
            <button title="Leave space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncLeaveSpace(authorization.user.username, spaceId, genericdata.member.id, member => {
                            this.props.updateDeleteSpace(genericdata.space);
                            toastr.info(`You have left ${genericdata.space.name}`);
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
        const {authorization, space, genericdata, spaceId, members} = this.props;

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchMembers(authorization.user.username, spaceId);
            return "";
        }

        return (
            <div className='headlines-container'>
                <HeadlinesEditor authname={authorization.user.username} spaceId={spaceId}/>

                <div className='headline'>
                    <h5>Members ({members ? members.length : 0})</h5>
                    {genericdata && this.localstate.removeTooltips()}
                    {genericdata && this.renderMembersNavigation(authorization, genericdata, spaceId)}
                </div>

                <div id='pictures-container-id' className='members-container'>
                    <div className='card-columns'>
                        {members && this.renderMembers(authorization, genericdata, members)}
                    </div>
                </div>

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        authorization: state.authorization, members: state.members,
        genericdata: state.genericdata ? state.genericdata.payload : null
    };
}

export default connect(mapStateToProps, {asyncFetchMembers, asyncJoinSpace, asyncLeaveSpace,
    asyncDeleteMember, updateGenericData, updateCreateSpace, updateDeleteSpace})(HeadlinesGeneric);