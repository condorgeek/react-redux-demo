/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [sidebar.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 20:49
 */

import $ from 'jquery';
import toastr from "../../../node_modules/toastr/toastr";
import moment from 'moment';
import Sortable from '../../../node_modules/sortablejs/Sortable';

import {connect} from 'react-redux';
import React, {Component} from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import {
    asyncFetchFollowees, asyncFetchFollowers, asyncFetchFriends, asyncFetchFriendsPending,
    asyncDeleteFollowee, asyncDeleteFriend, asyncAcceptFriend, asyncIgnoreFriend,
    asyncCancelFriend, asyncBlockFollower, asyncUnblockFollower, asyncUnblockFriend,
    asyncBlockFriend, LOGIN_STATUS_SUCCESS,
    LOGIN_STATUS_REQUEST, LOGIN_STATUS_LOGOUT, ROOT_STATIC_URL, LOGIN_STATUS_ERROR
} from '../../actions/index';

import {
    asyncFetchSpaces, asyncCreateSpace, asyncDeleteSpace, asyncLeaveSpaceByUsername, updateDeleteSpace,
    asyncFetchWidgets, asyncReorderSpaceRanking, asyncCreateWidget,
    GENERIC_SPACE, PUBLIC_ACCESS, RESTRICTED_ACCESS, EVENT_SPACE, SHOP_SPACE
} from "../../actions/spaces";

import ActiveFriend from './active-friend';
import ActiveSpace from './active-space';
import ActiveDate from './active-date';
import {showTooltip} from "../../actions/tippy-config";
import Widget from '../widgets/widget';
import WidgetCreateNav from "../widgets/widget-create-nav";

window.jQuery = $;

class SpaceCreateForm extends Component {

    constructor(props) {
        super(props);
        this.state= {access: PUBLIC_ACCESS, start: new Date(), isFormInvalid: ''}; /* form data */
    }

    handleChange(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleSubmit(focusId, type, event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(focusId).focus();

        if (!event.target.checkValidity()) {
            this.setState({ isFormInvalid: 'form-invalid'});
            return;
        }
        this.setState({ isFormInvalid: '' });
        event.target.reset();

        const formdata = {...this.state};
        this.props.callback(type, formdata);

    }

    handleOnChangeDate(date) {

        console.log('PICKER', date.toISOString());

        this.setState({start: date});
    }

    render() {
        const {authname, type, icon} = this.props;
        const display = this.props.display || type.toLowerCase();
        const {access, isFormInvalid} = this.state;

        const toggleId = `${type}-${authname}`;
        const nameId = `${type}-name-${authname}`;

        return (<div className="active-space-frame">
            <div className="title-navigation">
                <button title={`Create new ${display}`} type="button" className="btn btn-darkblue btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            const toggle = document.getElementById(toggleId);
                            if (toggle) {
                                toggle.classList.toggle('active-show');
                            }
                            setTimeout(() => {
                                document.getElementById(nameId).focus();
                            }, 500);
                        }}
                        ref={(elem)=> {
                            if (elem === null) return;
                            showTooltip(elem);
                        }}><i className={icon}/>
                </button>
            </div>

            <div className="active-space-toggle" id={toggleId}>
                <form noValidate className={isFormInvalid}
                      onSubmit={event => this.handleSubmit(nameId, type, event)}>
                    <div className='active-space'>
                        <input type="text" id={nameId} name="name" placeholder={`Enter ${display} name..`}
                               onChange={event => this.handleChange(event)} required/>
                        <textarea name="description" placeholder={`Enter ${display} description..`}
                                  onChange={event => this.handleChange(event)} required/>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="access"
                                   checked={access===PUBLIC_ACCESS}
                                   onChange={(event) => this.handleChange(event)}
                                   id="publicId" value={PUBLIC_ACCESS} required/>
                            <label className="form-check-label"
                                   htmlFor="publicId">Public</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="access"
                                   checked={access===RESTRICTED_ACCESS}
                                   onChange={(event) => this.handleChange(event)}
                                   id="restrictedId" value={RESTRICTED_ACCESS}/>
                            <label className="form-check-label"
                                   htmlFor="restrictedId">Restricted Access</label>
                        </div>

                        {type === EVENT_SPACE && <DatePicker selected={this.state.start}
                            onChange={this.handleOnChangeDate.bind(this)}
                                    placeholderText="Enter date and time" dateFormat="MMMM d, yyyy"
                                    timeCaption="Time" minDate={new Date()}
                                    popperPlacement="left"/>}

                        <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                            <i className={`${icon} mr-1`}/>Create {display}
                        </button>
                    </div>
                </form>
            </div>

        </div>)
    }
}


class Sidebar extends Component {

    constructor(props) {
        super(props);
        const {authorization} = this.props;
        this.handleCreateSpace = this.handleCreateSpace.bind(this);

        this.props.asyncFetchFriends(authorization.user.username);
        this.props.asyncFetchFriendsPending(authorization.user.username);
        this.props.asyncFetchFollowers(authorization.user.username);
        this.props.asyncFetchFollowees(authorization.user.username);
        this.props.asyncFetchSpaces(authorization.user.username, GENERIC_SPACE);
        this.props.asyncFetchSpaces(authorization.user.username, EVENT_SPACE);
        this.props.asyncFetchWidgets(authorization.user.username, null);
    }

    componentDidMount() {
        toastr.options.closeButton = true;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.closeHtml='<button><i class="fas fa-times"/></button>';
    }

    renderOwnerButtons(type, authname, space) {
        return <div className="sidebar-navigation">
            <button title={`Block ${space.name}`} type="button" className="btn btn-lightblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        console.log('BLOCK_SPACE', space.name);

                    }}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-ban"/>
            </button>

            <button title={`Delete ${space.name}`} type="button" className="btn btn-lightblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncDeleteSpace(authname, type, space.id, (space) => {
                            toastr.info(`You have deleted ${space.name}`);
                        });

                    }}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-trash"/>
            </button>
        </div>
    }

    renderMemberButtons(type, authname, space) {
        return <div className="sidebar-navigation">
            <button title={`Leave ${space.name}`} type="button" className="btn btn-lightblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.props.asyncLeaveSpaceByUsername(authname, space.id, member => {
                            this.props.updateDeleteSpace(space);
                            toastr.info(`You have left ${space.name}`);
                            });
                    }}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-user-minus"/>
            </button>
        </div>
    }

    renderSpaces(type, authname, spaces, isAuthorized) {

        return spaces.map(space => {
            const user = space.user;
            const isOwner = authname === space.user.username;

            return <li key={space.id} data-position={space.ranking} data-space={space.id} className='d-sm-block sidebar-entry'>
                {type === GENERIC_SPACE && <ActiveSpace authname={authname} user={user} space={space} state={space.state}/>}
                {type === SHOP_SPACE && <ActiveSpace authname={authname} user={user} space={space} state={space.state}/>}
                {type === EVENT_SPACE && <ActiveDate authname={authname} user={user} space={space} state={space.state}/>}

                {isAuthorized && isOwner ? this.renderOwnerButtons(type, authname, space) :
                    isAuthorized ? this.renderMemberButtons(type, authname, space) : ''}
            </li>
        })
    }

    renderFriends(authname, friends, chat = false) {
        if (friends === null || friends === undefined) {
            return <div>Loading..</div>
        }

        return (friends.map(friend => {
            const user = friend.friend;

            return <li key={friend.id} className='d-sm-block sidebar-entry'>
                <ActiveFriend authname={authname} user={user} state={friend.state} chat={friend.chat}/>

                <div className="sidebar-navigation">
                    {friend.state === 'BLOCKED' && friend.action === 'BLOCKING' && <button title={`Unblock ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncUnblockFriend(authname, user.username, (params) => {
                                    toastr.info(`You have unblocked ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-check"/>
                    </button>}

                    {friend.state === 'ACTIVE' && <button title={`Block ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncBlockFriend(authname, user.username, (params) => {
                                    toastr.info(`You have blocked ${user.firstname}.`);

                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-slash"/>
                    </button>}

                    {friend.state === 'ACTIVE' && <button title={`Delete friendship to ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFriend(authname, user.username, (params) => {
                                    toastr.warning(`You have deleted your friendship to ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-minus"/>
                    </button>}
                </div>
            </li>
        }));
    }

    renderPending(authname, friends) {
        if (friends === null || friends === undefined) {
            return <div>Loading..</div>
        }

        return (friends.map(friend => {
            const user = friend.friend;

            return <li key={friend.id} className='d-sm-block sidebar-entry'>
                <ActiveFriend authname={authname} user={user}/>

                {friend.action === 'REQUESTING' && <span className="sidebar-waiting"><i className="fas fa-clock"/></span>}

                {friend.action === 'REQUESTED' && <div className="sidebar-navigation">
                    <button title={`Confirm ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                              event.preventDefault();
                              this.props.asyncAcceptFriend(authname, user.username, (params) => {
                                    toastr.info(`You have confirmed ${user.firstname} friendship.`);
                                });
                            }}
                            ref={(elem)=> {
                            if (elem === null) return;
                                showTooltip(elem);
                        }}><i className="fas fa-user-check"/>
                    </button>

                    <button title={`Ignore ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncIgnoreFriend(authname, user.username, (params) => {
                                    toastr.warning(`You have ignored ${user.firstname} friendship's request.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>}

                {friend.action === 'REQUESTING' && <div className="sidebar-navigation">

                    <button title={`Cancel request to ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncCancelFriend(authname, user.username, (params) => {
                                    toastr.warning(`You have cancelled your friendship's request to ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>}


            </li>
        }));
    }

    renderFollowers(authname, followers) {
        if (followers === null || followers === undefined) {
            return <div>Loading..</div>
        }
        return (followers.map(follower => {
            const user = follower.follower;

            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveFriend authname={authname} user={user} state={follower.state}/>

                <div className="sidebar-navigation">
                    {follower.state === 'BLOCKED' &&
                    <button title={`Unblock ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncUnblockFollower(authname, user.username, (params) => {
                                    toastr.info(`You have unblocked ${user.firstname}.`);
                                });

                            }}
                            ref={(elem) => {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-check"/>
                    </button>}
                    {follower.state === 'ACTIVE' && <button title={`Block ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                             onClick={(event) => {
                                 event.preventDefault();
                                 this.props.asyncBlockFollower(authname, user.username, (params) => {
                                     toastr.info(`You have blocked ${user.firstname}.`);
                                 });
                             }}
                             ref={(elem) => {
                                 if (elem === null) return;
                                 showTooltip(elem);
                             }}><i className="fas fa-user-slash"/>
                    </button>}
                </div>
            </li>
        }));
    }

    renderFollowees(authname, followees) {
        if (followees === null || followees === undefined) {
            return <div>Loading..</div>
        }
        return (followees.map(followee => {
            const user = followee.followee;

            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveFriend authname={authname} user={user} state={followee.state}/>

                <div className="sidebar-navigation">
                    <button title={`Stop following ${user.firstname}`} type="button" className="btn btn-lightblue btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFollowee(authname, user.username, (params) => {
                                    toastr.warning(`You have stopped following ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                showTooltip(elem);
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>
            </li>
        }));
    }

    handleCreateSpace(type, formdata) {
        const authname = this.props.authorization.user.username;

        if(!formdata.description || !formdata.access) {
            toastr.warning("Cannot create space. Mandatory fields missing.");
            return;
        }
        if(type === 'EVENT' && !formdata.start) {
            toastr.warning("Cannot create space. Start date missing.");
            return;
        }
        const startdate = type === 'EVENT' ? moment(formdata.start).format('YYYY-MM-DD') : null;

        this.props.asyncCreateSpace(authname, type,
            {name: formdata.name, description: formdata.description, access: formdata.access,
                start: startdate, end: startdate});
    }

    isTransitioning(authorization) {
        return authorization.status === LOGIN_STATUS_REQUEST || authorization.status === LOGIN_STATUS_LOGOUT ||
            authorization.status === LOGIN_STATUS_ERROR;
    }


    renderTopWidgets(widgets, authname, authorization) {
        if(!widgets) return '';
        return widgets.filter(widget => widget.pos === 'RTOP').map(widget => {
            return <Widget key={widget.id} widget={widget} authname={authname}
                           authorization={authorization} mode='RIGHT'/>
        })
    }

    renderBottomWidgets(widgets, authname, authorization) {
        if(!widgets) return '';
        return widgets.filter(widget => widget.pos === 'RBOTTOM').map(widget => {
            return <Widget key={widget.id} widget={widget} authname={authname}
                           authorization={authorization} mode='RIGHT'/>
        })
    }

    reorderRanking = (evt) => {
        const {authorization} = this.props;

        const ranks = []; const maxRanking = evt.to.children.length;
        [...evt.to.children].forEach((child, idx) => {
            child.dataset.space && ranks.push({spaceId: child.dataset.space, ranking: maxRanking - idx});
        });

        this.props.asyncReorderSpaceRanking(authorization.user.username, {ranks: ranks}, spaces => {
            toastr.info(`${spaces.length} spaces ranking set successfully`);
        })
    };

    render() {
        const {authorization, friends, pending, followers, followees, spaces, events,
            shops, username, location, widgets} = this.props;

        if(this.isTransitioning(authorization)) return '';

        const authname = authorization.user.username;
        const isAuthorized = authorization && authorization.status === LOGIN_STATUS_SUCCESS;
        const isSuperUser = authorization && authorization.user.isSuperUser;

        return (
            <div className='sidebar-container'>

                <div className="widget-container">
                    {this.renderTopWidgets(widgets, authorization.user.username, authorization)}
                </div>

                <div className='sidebar-title'>
                    <h4>Veranstaltungen</h4>
                    {isAuthorized && <SpaceCreateForm authname={authname} type={EVENT_SPACE} icon="fas fa-calendar-plus"
                                                         callback={this.handleCreateSpace} />}
                    {events && <ul className='list-group' ref={elem => {
                        if(!elem || !isAuthorized) return;
                        Sortable.create(elem, {animation: 150, onEnd: this.reorderRanking});
                    }}>
                        {this.renderSpaces(EVENT_SPACE, authname, events, isAuthorized)}
                    </ul>}
                </div>

                <div className='sidebar-title'>
                    <h4>Themen</h4>

                    {isAuthorized && <SpaceCreateForm authname={authname} type={GENERIC_SPACE} display="space" icon="fas fa-users"
                                        callback={this.handleCreateSpace} />}

                    {isAuthorized && isSuperUser && <WidgetCreateNav authname={authname}/>}

                    {spaces && <ul className='list-group' ref={elem => {
                        if(!elem || !isAuthorized) return;
                        Sortable.create(elem, {animation: 150, onEnd: this.reorderRanking});
                    }}>
                        {this.renderSpaces(GENERIC_SPACE, authname, spaces, isAuthorized)}
                    </ul>}

                </div>

                {/*<div className='sidebar-title'>*/}
                    {/*<h5>Shops</h5>*/}
                    {/*{isAuthorized && <SpaceCreateForm authname={authname} type={SHOP_SPACE} icon="fas fa-cart-plus"*/}
                                        {/*callback={this.handleCreateSpace} />}*/}
                    {/*{shops && <ul className='list-group'> {this.renderSpaces(SHOP_SPACE, authname, shops, isAuthorized)} </ul>}*/}

                {/*</div>*/}



                {isAuthorized && (friends.length > 0) && <div>
                    <h4>Friends ({friends.length})</h4>
                    <ul className='list-group'> {this.renderFriends(authname, friends, true)} </ul>
                </div>}

                {isAuthorized && (pending.length > 0) && <div>
                    <h4>Pending ({pending.length})</h4>
                    <ul className='list-group'> {this.renderPending(authname, pending)} </ul>
                </div>}

                {isAuthorized && (followers.length > 0) && <div>
                    <h4>Your Followers ({followers.length}) </h4>
                    <ul className='list-group d-inline'> {this.renderFollowers(authname, followers)} </ul>
                </div>}

                {isAuthorized && (followees.length > 0) && <div>
                    <h4>You follow ({followees.length}) </h4>
                    <ul className='list-group'> {this.renderFollowees(authname, followees)} </ul>
                </div>}

                <div className="widget-container pt-4">
                    {this.renderBottomWidgets(widgets, authorization.user.username, authorization)}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, friends: state.friends, followers: state.followers,
        followees: state.followees, pending: state.pending, spaces: state.spaces,
        events: state.events, shops: state.shops, widgets: state.widgets}
}

export default connect(mapStateToProps, {asyncFetchFriends, asyncFetchFollowers, asyncFetchFollowees,
    asyncFetchFriendsPending, asyncDeleteFollowee, asyncAcceptFriend, asyncIgnoreFriend, asyncBlockFollower,
    asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend, asyncDeleteFriend, asyncCancelFriend,
    asyncFetchSpaces, asyncCreateSpace, asyncDeleteSpace, asyncLeaveSpaceByUsername, updateDeleteSpace,
    asyncFetchWidgets, asyncReorderSpaceRanking})(Sidebar);