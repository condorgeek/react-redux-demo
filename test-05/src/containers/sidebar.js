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
                        {/*<svg style={{width:'22px', height: '22px'}}  viewBox="0 -5 28 28">*/}
                            {/*<path className="svg-icon" d="M9,5A3.5,3.5 0 0,1 12.5,8.5A3.5,3.5 0 0,1 9,12A3.5,3.5 0 0,1 5.5,8.5A3.5,3.5 0 0,1 9,5M9,13.75C12.87,13.75 16,15.32 16,17.25V19H2V17.25C2,15.32 5.13,13.75 9,13.75M17,12.66L14.25,9.66L15.41,8.5L17,10.09L20.59,6.5L21.75,7.91L17,12.66Z" />*/}
                        {/*</svg>*/}
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
                            }}>
                            <span className="sidebar-stack">
                                <i className="fas fa-user stack-bottom"/>
                                <i className="fas fa-ban stack-top"/>
                            </span>
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
                    <span><a href=''><i className="fa fa-object-group" aria-hidden="true"/>Create a Space</a></span>
                </div>
                <div className='sidebar-title'>
                    <h5>Shops</h5>
                    <span><a href=''><i className="fa fa-money" aria-hidden="true"/>Create a Shop</a></span>
                </div>

                <div className='sidebar-title'>
                    <h5>Events</h5>
                    <span><a href=''><i className="fa fa-calendar" aria-hidden="true"/>Create an Event</a></span>
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