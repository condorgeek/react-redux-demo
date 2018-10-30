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
import {connect} from 'react-redux';
import React, {Component} from 'react';


import {asyncFetchFollowees, asyncFetchFollowers, asyncFetchFriends, asyncFetchFriendsPending,
    asyncDeleteFollowee,  asyncDeleteFriend, asyncAcceptFriend, asyncIgnoreFriend, asyncCancelFriend,
    asyncBlockFollower, asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend} from '../../actions/index';

import {asyncFetchSpaces, asyncCreateSpace} from "../../actions/spaces";

import ActiveFriend from './active-friend';
import ActiveSpace from './active-space';
import tippy from "../util/tippy.all.patched";

window.jQuery = $;

class ActiveSpaceToggler extends Component {

    constructor(props) {
        super(props);
        this.state= {access: 'PUBLIC'}; /* form data */

    }

    handleChange(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formdata = {...this.state};
        this.props.callback(formdata);
    }

    render() {
        const {authname, type, icon} = this.props;
        const {access} = this.state;

        const id = `${type}-${authname}`;

        return (<div className="active-space-frame">
            <div className="title-navigation">
                <button title={`Create new ${type}`} type="button" className="btn btn-darkblue btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            const toggle = document.getElementById(id);
                            if (toggle) {
                                toggle.classList.toggle('active-show');
                            }
                        }}
                        ref={(elem)=> {
                            if (elem === null) return;
                            tippy(elem, {arrow: true, theme: "darkblue"});
                        }}><i className={icon}/>
                </button>
            </div>

            <div className="active-space-toggle" id={id}>
                <form onSubmit={event => this.handleSubmit(event)}>
                    <div className='active-space'>
                        <input type="text" id={`space-name-${authname}`} name="name"
                               placeholder={`Enter ${type} name..`}
                               onChange={event => this.handleChange(event)}/>
                        <textarea name="description" placeholder={`Enter ${type} description..`}
                                  onChange={event => this.handleChange(event)}/>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="access"
                                   checked={access==='PUBLIC'}
                                   onChange={(event) => this.handleChange(event)}
                                   id="publicId" value="PUBLIC" required/>
                            <label className="form-check-label"
                                   htmlFor="publicId">Public</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="access"
                                   checked={access==='RESTRICTED'}
                                   onChange={(event) => this.handleChange(event)}
                                   id="restrictedId" value="RESTRICTED"/>
                            <label className="form-check-label"
                                   htmlFor="restrictedId">Restricted Access</label>
                        </div>

                        <button type="submit" className="btn btn-lightblue btn-sm btn-active">
                            <i className={`${icon} mr-1`}/>Create {type}
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

        this.props.asyncFetchFriends(authorization.user.username);
        this.props.asyncFetchFriendsPending(authorization.user.username);
        this.props.asyncFetchFollowers(authorization.user.username);
        this.props.asyncFetchFollowees(authorization.user.username);
        this.props.asyncFetchSpaces(authorization.user.username);
    }

    componentDidMount() {
        toastr.options.closeButton = true;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.closeHtml='<button><i class="fas fa-times"/></button>';
    }

    renderSpaces(authname, spaces) {
        return spaces.map(space => {
            const user = space.user;
            return <li key={space.id} className='d-sm-block sidebar-entry'>
                <ActiveSpace authname={authname} user={user} space={space} state={space.state}/>
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
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
                            tippy(elem, {arrow: true, theme: "darkblue"});
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
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
                                 tippy(elem, {arrow: true, theme: "darkblue"});
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
                                tippy(elem, {arrow: true, theme: "darkblue"});
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>
            </li>
        }));
    }

    handleCreateSpace(formdata) {
        const authname = this.props.authorization.user.username;

        if(!formdata.description || !formdata.access) {
            toastr.warning("Cannot create space. Mandatory fields missing.");
            return;
        }

        this.props.asyncCreateSpace(authname,
            {name: formdata.name, description: formdata.description, access: formdata.access});
    }

    handleCreateShop(formdata) {
        console.log('CREATE_SHOP', formdata);
    }

    handleCreateEvent(formdata) {
        console.log('CREATE_EVENT', formdata);
    }


    render() {
        const {authorization, friends, pending, followers, followees, spaces, username} = this.props;
        const authname = authorization.user.username;

        return (
            <div className='sidebar-container'>
                <div className='sidebar-title'>
                    <h5>Spaces ({spaces.length})</h5>
                    <ActiveSpaceToggler authname={authname} type="space" icon="fas fa-users"
                                        callback={this.handleCreateSpace.bind(this)} />
                    {spaces && <ul className='list-group'> {this.renderSpaces(authname, spaces)} </ul>}

                </div>

                <div className='sidebar-title'>
                    <h5>Shops</h5>
                    <ActiveSpaceToggler authname={authname} type="shop" icon="fas fa-cart-plus"
                                        callback={this.handleCreateShop.bind(this)} />
                </div>

                <div className='sidebar-title'>
                    <h5>Events</h5>
                    <ActiveSpaceToggler authname={authname} type="event" icon="fas fa-calendar-plus"
                                        callback={this.handleCreateEvent.bind(this)} />
                </div>

                <div>
                    <h5>Friends ({friends.length})</h5>
                    <ul className='list-group'> {this.renderFriends(authname, friends, true)} </ul>
                </div>
                <div>
                    <h5>Pending ({pending.length})</h5>
                    <ul className='list-group'> {this.renderPending(authname, pending)} </ul>
                </div>
                <div>
                    <h5>Your Followers ({followers.length}) </h5>
                    <ul className='list-group d-inline'> {this.renderFollowers(authname, followers)} </ul>
                </div>
                <div>
                    <h5>You follow ({followees.length}) </h5>
                    <ul className='list-group'> {this.renderFollowees(authname, followees)} </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, friends: state.friends, followers: state.followers,
        followees: state.followees, pending: state.pending, spaces: state.spaces}
}

export default connect(mapStateToProps, {asyncFetchFriends, asyncFetchFollowers, asyncFetchFollowees,
    asyncFetchFriendsPending, asyncDeleteFollowee, asyncAcceptFriend, asyncIgnoreFriend, asyncBlockFollower,
    asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend, asyncDeleteFriend, asyncCancelFriend,
    asyncFetchSpaces, asyncCreateSpace})(Sidebar);