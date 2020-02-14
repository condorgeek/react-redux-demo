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

import toastr from "../../../node_modules/toastr/toastr";
import moment from 'moment';
import Sortable from '../../../node_modules/sortablejs/Sortable';

import {connect} from 'react-redux';
import React, {Component} from 'react';

import {
    asyncFetchFollowees, asyncFetchFollowers, asyncFetchFriends, asyncFetchFriendsPending,
    asyncDeleteFollowee, asyncDeleteFriend, asyncAcceptFriend, asyncIgnoreFriend,
    asyncCancelFriend, asyncBlockFollower, asyncUnblockFollower, asyncUnblockFriend,
    asyncBlockFriend,
} from '../../actions/index';

import {
    asyncCreateSpace,
    asyncFetchWidgets, asyncReorderSpaceRanking,
    GENERIC_SPACE,  EVENT_SPACE,
} from "../../actions/spaces";

import ActiveFriend from './forms/active-friend';
import SidebarEntryDate from './lists/sidebar-entry-date';
import {showTooltip} from "../../actions/tippy-config";
import Widget from '../widgets/widget';
import {isAuthorized, isSuperUser, isTransitioning} from "../../selectors";
import {FlatIcon, Icon} from "../navigation-buttons/nav-buttons";
import {SidebarHeadline, NavigationToggler} from "../navigation-headlines/nav-headlines";
import WidgetCreateForm from "../widgets/widget-create-form";
import CreateSpaceForm from "./forms/create-space-form";
import SidebarEntrySpace from "./lists/sidebar-entry-space";
import {ConfigurationContext} from "../configuration/configuration";
import SidebarEntryEvent from "./lists/sidebar-entry-event";


class Sidebar extends Component {

    constructor(props) {
        super(props);
        const {authorization} = this.props;
        this.handleCreateSpace = this.handleCreateSpace.bind(this);

        this.props.asyncFetchFriends(authorization.user.username);
        this.props.asyncFetchFriendsPending(authorization.user.username);
        this.props.asyncFetchFollowers(authorization.user.username);
        this.props.asyncFetchFollowees(authorization.user.username);
        this.props.asyncFetchWidgets(authorization.user.username, null);
    }

    componentDidMount() {
        toastr.options.closeButton = true;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.closeHtml='<button><i class="fas fa-times"/></button>';
    }

    renderGenericSpaces(authname, spaces, isAuthorized) {
        return spaces.filter(space => space.type === GENERIC_SPACE).map(space => {
            const user = space.user;
            const isOwner = authname === space.user.username;

            return <li key={space.id} data-position={space.ranking} data-space={space.id} className='list-unstyled'>
                <SidebarEntrySpace authname={authname}
                                   space={space}
                                   isAuthorized={isAuthorized}
                                   isOwner={isOwner}/>
            </li>
        })
    }

    renderEvents(authname, spaces, isAuthorized) {
        return spaces.filter(space => space.type === EVENT_SPACE).map(space => {
            const isOwner = authname === space.user.username;

            return <li key={space.id} data-position={space.ranking} data-space={space.id} className='list-unstyled'>
                {/*<SidebarEntryDate authname={authname}*/}
                {/*                  space={space}*/}
                {/*                  isAuthorized={isAuthorized}*/}
                {/*                  isOwner={isOwner} />*/}

                <SidebarEntryEvent authname={authname}
                                  space={space}
                                  isAuthorized={isAuthorized}
                                  isOwner={isOwner} />

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
        const {authorization, friends, pending, followers, followees, spaces, events, Lang,
            shops, username, location, widgets, isTransitioning, isAuthorized, isSuperUser} = this.props;

        if (isTransitioning) return null;
        const authname = authorization.user.username;

        // const nameId = `${type}-name-${authname}`;

        return <div className='sidebar-container'>

            <div className="widget-container">
                {this.renderTopWidgets(widgets, authorization.user.username, authorization)}
            </div>

            <SidebarHeadline title={Lang.nav.sidebar.events}>
                {isAuthorized && <FlatIcon circle onClick={(e) => {
                    e.preventDefault();
                    this.eventFormRef.toggle();
                }}>
                    <Icon title='Create event' className='fas fa-calendar-plus'/>
                </FlatIcon>}
            </SidebarHeadline>

            {isAuthorized && <NavigationToggler onRef={(ref) => this.eventFormRef = ref}>
                <CreateSpaceForm authname={authname}
                                 type={EVENT_SPACE}
                                 callback={this.handleCreateSpace}/>
            </NavigationToggler>
            }

            {events && <ul className='list-group' ref={elem => {
                if (!elem || !isAuthorized) return;
                Sortable.create(elem, {animation: 150, onEnd: this.reorderRanking});
            }}>
                {this.renderEvents(authname, events, isAuthorized)}
            </ul>}


            <SidebarHeadline title={Lang.nav.sidebar.spaces}>
                {isAuthorized && <FlatIcon circle onClick={(e) => {
                    e.preventDefault();
                    this.spaceRef.toggle();
                }}>
                    <Icon title='Create space' className='fas fa-users'/>
                </FlatIcon>}

                {isAuthorized && isSuperUser && <FlatIcon circle onClick={(e) => {
                    e.preventDefault();
                    this.widgetRef.toggle()}}>
                    <Icon title='Create widget' className='fas fa-cog'/>
                </FlatIcon>}
            </SidebarHeadline>

            {isAuthorized && <NavigationToggler onRef={(ref) => this.spaceRef = ref}>
                <CreateSpaceForm authname={authname} type={GENERIC_SPACE} display="space"
                                 callback={this.handleCreateSpace}/>
            </NavigationToggler>}

            {isAuthorized && isSuperUser && <WidgetCreateForm authname={authname}
                              onRef={ref => this.widgetRef = ref} mode='RIGHT'/>}

            {spaces && <ul className='list-group' ref={elem => {
                if (!elem || !isAuthorized) return;
                Sortable.create(elem, {animation: 150, onEnd: this.reorderRanking});
            }}>
                {this.renderGenericSpaces(authname, spaces, isAuthorized)}
            </ul>}


            {isAuthorized && (friends.length > 0) && <div>
                <SidebarHeadline title={`${friends.length} ${Lang.nav.sidebar.friends}`}/>
                <ul className='list-group'> {this.renderFriends(authname, friends, true)} </ul>
            </div>}

            {isAuthorized && (pending.length > 0) && <div>
                <SidebarHeadline title={`${pending.length} ${Lang.nav.sidebar.pending}`}/>
                <ul className='list-group'> {this.renderPending(authname, pending)} </ul>
            </div>}

            {isAuthorized && (followers.length > 0) && <div>
                <SidebarHeadline title={`${followers.length} ${Lang.nav.sidebar.followers}`}/>
                <ul className='list-group d-inline'> {this.renderFollowers(authname, followers)} </ul>
            </div>}

            {isAuthorized && (followees.length > 0) && <div>
                <SidebarHeadline title={`${followees.length} ${Lang.nav.sidebar.followees}`}/>
                <ul className='list-group'> {this.renderFollowees(authname, followees)} </ul>
            </div>}

            <div className="widget-container pt-4">
                {this.renderBottomWidgets(widgets, authorization.user.username, authorization)}
            </div>

        </div>
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization,
        friends: state.friends,
        followers: state.followers,
        followees: state.followees,
        pending: state.pending,
        spaces: state.spaces,
        events: state.events,
        shops: state.shops,
        widgets: state.widgets,
        isTransitioning: isTransitioning(state),
        isAuthorized: isAuthorized(state),
        isSuperUser: isSuperUser(state)
    }
}

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<Sidebar {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default connect(mapStateToProps, {asyncFetchFriends, asyncFetchFollowers, asyncFetchFollowees,
    asyncFetchFriendsPending, asyncDeleteFollowee, asyncAcceptFriend, asyncIgnoreFriend, asyncBlockFollower,
    asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend, asyncDeleteFriend, asyncCancelFriend,
    asyncCreateSpace,
    asyncFetchWidgets, asyncReorderSpaceRanking})(withConfigurationContext);