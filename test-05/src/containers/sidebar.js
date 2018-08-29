import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchFollowees, fetchFollowers, fetchFriends, fetchFriendsPending, asyncDeleteFollowee,
    asyncAcceptFriend, asyncIgnoreFriend, asyncBlockFollower, asyncUnblockFollower,
    asyncUnblockFriend, asyncBlockFriend, asyncDeleteFriend} from '../actions';
import ActiveContact from '../components/active-contact';
import tippy from "../components/util/tippy.all.patched";

class Sidebar extends Component {

    componentDidMount() {
        const {authorization} = this.props;

        this.props.fetchFriends(authorization.user.username);
        this.props.fetchFriendsPending(authorization.user.username);
        this.props.fetchFollowers(authorization.user.username);
        this.props.fetchFollowees(authorization.user.username);
    }

    renderFriends(username, users, chat = false) {
        if (users === null || users === undefined) {
            return <div>Loading..</div>
        }

        return (users.map(user => {
            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveContact user={user} chat={chat}/>

                <div className="sidebar-navigation">
                    <button title={`Unblock ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncUnblockFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-check"/>
                    </button>
                    <button title={`Block ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncBlockFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-slash"/>
                    </button>
                    <button title={`Remove ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>
            </li>
        }));
    }

    renderPending(username, users) {
        if (users === null || users === undefined) {
            return <div>Loading..</div>
        }
        return (users.map(user => {
            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveContact user={user} chat="false"/>

                <div className="sidebar-navigation">
                    <button title={`Confirm ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                              event.preventDefault();
                              this.props.asyncConfirmFriend(username, user.username);
                            }}

                            ref={(elem)=> {
                            if (elem === null) return;
                            tippy(elem, {arrow: true, theme: "sidebar"});
                        }}><i className="fas fa-user-check"/>
                    </button>

                    <button title={`Ignore ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncIgnoreFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>
            </li>
        }));
    }

    renderFollowers(username, users) {
        if (users === null || users === undefined) {
            return <div>Loading..</div>
        }
        return (users.map(user => {
            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveContact user={user} chat="false"/>

                <div className="sidebar-navigation">
                    <button title={`Unblock ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncUnblockFollower(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-check"/>
                    </button>
                    <button title={`Block ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncBlockFollower(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-slash"/>
                    </button>
                </div>
            </li>
        }));
    }

    renderFollowees(username, users) {
        if (users === null || users === undefined) {
            return <div>Loading..</div>
        }
        return (users.map(user => {
            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveContact user={user} chat="false"/>

                <div className="sidebar-navigation">
                    <button title={`Remove ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFollowee(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>
            </li>
        }));
    }


    render() {
        const {authorization, friends, pending, followers, followees} = this.props;

        console.log(authorization, followees);

        return (
            <div className='sidebar-container'>
                <div className='sidebar-title'>
                    <h5>Spaces</h5>
                    <div className="title-navigation">
                        <button title="Create a place" type="button" className="btn btn-sidebar btn-sm"
                                onClick={(event) => {
                                    event.preventDefault();
                                    console.log('Create place');
                                }}
                                ref={(elem)=> {
                                    if (elem === null) return;
                                    tippy(elem, {arrow: true, theme: "sidebar"});
                                }}><i className="fas fa-plus-circle"/>
                        </button>
                    </div>
                </div>
                <div className='sidebar-title'>
                    <h5>Shops</h5>
                    <div className="title-navigation">
                        <button title="Create a shop" type="button" className="btn btn-sidebar btn-sm"
                                onClick={(event) => {
                                    event.preventDefault();
                                    console.log('Create shop');
                                }}
                                ref={(elem)=> {
                                    if (elem === null) return;
                                    tippy(elem, {arrow: true, theme: "sidebar"});
                                }}><i className="fas fa-cart-plus"/>
                        </button>
                    </div>
                </div>

                <div className='sidebar-title'>
                    <h5>Events</h5>
                    <div className="title-navigation">
                        <button title="Create an event" type="button" className="btn btn-sidebar btn-sm"
                                onClick={(event) => {
                                    event.preventDefault();
                                    console.log('Create event');
                                }}
                                ref={(elem)=> {
                                    if (elem === null) return;
                                    tippy(elem, {arrow: true, theme: "sidebar"});
                                }}><i className="fas fa-calendar-plus"/>
                        </button>
                    </div>
                </div>

                <div>
                    <h5>Friends ({friends.length})</h5>
                    <ul className='list-group'> {this.renderFriends(authorization.user.username, friends, true)} </ul>
                </div>
                <div>
                    <h5>Pending ({pending.length})</h5>
                    <ul className='list-group'> {this.renderPending(authorization.user.username, pending)} </ul>
                </div>
                <div>
                    <h5>Your Followers ({followers.length}) </h5>
                    <ul className='list-group d-inline'> {this.renderFollowers(authorization.user.username, followers)} </ul>
                </div>
                <div>
                    <h5>You follow ({followees.length}) </h5>
                    <ul className='list-group'> {this.renderFollowees(authorization.user.username, followees)} </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, friends: state.friends, followers: state.followers,
        followees: state.followees, pending: state.pending}
}

export default connect(mapStateToProps, {fetchFriends, fetchFollowers, fetchFollowees,
    fetchFriendsPending, asyncDeleteFollowee, asyncAcceptFriend, asyncIgnoreFriend, asyncBlockFollower,
    asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend, asyncDeleteFriend})(Sidebar);