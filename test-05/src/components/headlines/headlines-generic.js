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
import moment from 'moment';

import {bindRawTooltip, showTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {ACTION_DELETE_MEMBER, asyncDeleteMember, asyncFetchMembers, asyncFetchMembersPage, asyncJoinSpace, asyncLeaveSpace,
    updateCreateSpace, updateDeleteSpace, updateGenericData} from "../../actions/spaces";
import {showForceVisibleImages, showVisibleImages} from "../../actions/image-handler";
import {
    LOGIN_STATUS_ERROR,
    LOGIN_STATUS_LOGOUT,
    LOGIN_STATUS_REQUEST,
    LOGIN_STATUS_SUCCESS,
    ROOT_STATIC_URL
} from "../../actions";
import HeadlinesEditor from './headlines-space-editor';
import {PLACEHOLDER} from "../../static";
import {Widget} from '../sidebar/widget';


class TooltipMemberIcon extends Component {
    constructor(props) {
        super(props);
        this.tooltips = [];
    }

    componentWillUnmount() {
        this.tooltips.forEach(tooltip => tooltip.destroy);
    }

    render() {
        const {html, action} = this.props;
        return <i title="Member options" className="fas fa-bars" onClick={event => {
            event.preventDefault();

            const isShowing = this.tooltips.some(tooltip => !tooltip.state.isDestroyed);
            this.tooltips.forEach(tooltip => tooltip.destroy);

            if(isShowing) return;

            const tooltip = bindRawTooltip(event.target, html,
                {trigger: 'click', showOnInit: true, callback:action});
            this.tooltips.push(tooltip);
        }}/>
    }
}

export class HeadlinesGeneric extends Component {

    constructor(props) {
        super(props);
        this.handleTooltipAction = this.handleTooltipAction.bind(this);
        this.onScrollStop = this.onScrollStop.bind(this);
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
        this.props.asyncFetchMembersPage(authorization.user.username, spaceId, 0, 50, page => {
            this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
        });
    }

    componentWillUnmount() {
        this.localstate.removeTooltips();
    }

    renderMembersTooltip(isOwner, authorization, fullname, genericdata, member) {
        const data = {authorization: authorization, member: member, genericdata: genericdata, fullname: fullname};
        const isSelf = authorization.user.username === member.user.username;
        const isAuthorized = authorization.status === LOGIN_STATUS_SUCCESS;

        return <div className="friends-tooltip">
            <span className="like-link" data-props={JSON.stringify({...data, action: 'LINK_TO'})}>
                {fullname}{isSelf && ' (Owner)'}
            </span>
            {isOwner && !isSelf && <div className="d-inline">
                <button className="btn btn-tooltip btn-sm"
                        data-props={JSON.stringify({...data, action: 'CANCEL'})}> Cancel</button>
                {isAuthorized && <button className="btn btn-tooltip btn-sm"
                                data-props={JSON.stringify({...data, action: ACTION_DELETE_MEMBER})}>
                <span><i className="fas fa-user-minus"/></span> Remove</button>}
                </div>}
        </div>
    }

    handleTooltipAction(event, data, timestamp, tooltip) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {authorization, genericdata, fullname, member} = props;

        switch (props.action) {
            case ACTION_DELETE_MEMBER:
                this.props.asyncDeleteMember(authorization.user.username, member.space.id, member.id, member => {
                    toastr.info(`You have removed ${fullname}`);
                });
                return;

            case 'LINK_TO':
                event.stopPropagation();
                this.props.history.push(`/${member.user.username}/home`);
                tooltip.destroy();
                return false;

            case 'CANCEL':
                event.stopPropagation();
                tooltip.destroy();
                return false;

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
                            <img className="card-img-top" src={PLACEHOLDER} data-src={avatar}/>

                            <TooltipMemberIcon html={this.renderMembersTooltip(isOwner, authorization, fullname, genericdata, member)}
                                            action={this.handleTooltipAction}/>
                            {member.role === 'OWNER' && <span className="member-triangle"/>}
                        </div>
                    </Link>)
            });
    }

    renderMembersNavigation(authorization, genericdata, spaceId) {

        const isOwner = genericdata && (genericdata.space.user.username === authorization.user.username);
        const isMember = genericdata && genericdata.isMember;
        const isAuthorized = authorization.status === LOGIN_STATUS_SUCCESS;

        if(!isAuthorized) return '';

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

    onScrollStop(event) {
        const {authorization, spaceId} = this.props;
        const {next, last, first, when} = this.localstate.getState();

        const elem = event.target;
        showForceVisibleImages(elem);

        /* fetch next page of members */
        if(!last && (elem.scrollTop + elem.clientHeight + 100 >= elem.scrollHeight)) {
            this.props.asyncFetchMembersPage(authorization.user.username, spaceId, next, 50, page => {
                this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
            });
        }

        // } else if(elem.scrollTop === 0 && (!first || moment().diff(when) > ONE_MINUTE * 5 )) {
        //     this.props.asyncFetchMembersPage(authorization.user.username, spaceId, 0, 50, page => {
        //         this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
        //     });
        // }
    }

    isTransitioning(authorization) {
        return authorization.status === LOGIN_STATUS_REQUEST || authorization.status === LOGIN_STATUS_LOGOUT ||
            authorization.status === LOGIN_STATUS_ERROR;
    }

    renderTopWidgets(widgets) {
        if(!widgets) return '';
        return widgets.filter(widget => widget.pos === 'LTOP').map(widget => {
            return <Widget key={widget.id} widget={widget}/>
        })
    }

    renderBottomWidgets(widgets) {
        if(!widgets) return '';
        return widgets.filter(widget => widget.pos === 'LBOTTOM').map(widget => {
            return <Widget key= {widget.id} widget={widget}/>
        })
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, space, genericdata, spaceId, members, widgets} = this.props;

        if(this.isTransitioning(authorization)) return '';

        const isAuthorized = authorization.status === LOGIN_STATUS_SUCCESS;

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchMembersPage(authorization.user.username, spaceId, 0, 50, page => {
                this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
            });
            return "";
        }

        return (
            <div className='headlines-container'>
                <HeadlinesEditor authname={authorization.user.username} spaceId={spaceId} isAuthorized={isAuthorized}/>

                <div className="widget-container">
                    {this.renderTopWidgets(widgets)}
                </div>

                <div className='headline'>
                    <h5>Members ({members ? members.length : 0})</h5>
                    {genericdata && this.localstate.removeTooltips()}
                    {genericdata && this.renderMembersNavigation(authorization, genericdata, spaceId)}
                </div>

                <div id='members-container-id' className='members-container' onScroll={ event => {
                        showVisibleImages(event.target);
                    }} ref={elem => {
                        if(!elem) return;
                        setTimeout(()=>{
                            OverlayScrollbars(elem, {callbacks: {onScrollStop: this.onScrollStop}});
                            showVisibleImages(elem);
                        }, 1000);

                }}>
                    <div className='card-columns members-container-box'>
                        {members && this.renderMembers(authorization, genericdata, members)}
                    </div>
                </div>

                <div className="widget-container pt-4">
                    {this.renderBottomWidgets(widgets)}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authorization: state.authorization, members: state.members,
        genericdata: state.genericdata ? state.genericdata.payload : null,
        widgets: state.widgets
    };
}

export default withRouter(connect(mapStateToProps, {asyncFetchMembers, asyncFetchMembersPage, asyncJoinSpace, asyncLeaveSpace,
    asyncDeleteMember, updateGenericData, updateCreateSpace, updateDeleteSpace})(HeadlinesGeneric));