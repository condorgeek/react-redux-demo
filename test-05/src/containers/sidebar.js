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
                            }}>
                        <svg style={{width:'22px', height: '22px'}}  viewBox="0 -5 28 28">
                            <path className="svg-icon" d="M9,5A3.5,3.5 0 0,1 12.5,8.5A3.5,3.5 0 0,1 9,12A3.5,3.5 0 0,1 5.5,8.5A3.5,3.5 0 0,1 9,5M9,13.75C12.87,13.75 16,15.32 16,17.25V19H2V17.25C2,15.32 5.13,13.75 9,13.75M17,12.66L14.25,9.66L15.41,8.5L17,10.09L20.59,6.5L21.75,7.91L17,12.66Z" />
                        </svg>
                    </button>
                    <button title={`Block ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncBlockFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}>
                        <svg className="svg-icon" style={{width:'22px', height: '22px'}} viewBox="0 -5 30 30">
                                <path transform="translate(7, 1)" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            <path className="svg-red" stroke-width="2" transform="translate(1, 5) scale(0.4, 0.4)" d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z" />

                        </svg>
                    </button>
                    <button title={`Remove ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}>
                        <svg className="svg-icon" viewBox="0 -5 28 28">
                            <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M1,10V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                        </svg>
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
                        }}>
                            <svg style={{width:'26px', height: '26px'}} className="svg-icon" viewBox="0 -5 28 28">
                                <path d="M9,5A3.5,3.5 0 0,1 12.5,8.5A3.5,3.5 0 0,1 9,12A3.5,3.5 0 0,1 5.5,8.5A3.5,3.5 0 0,1 9,5M9,13.75C12.87,13.75 16,15.32 16,17.25V19H2V17.25C2,15.32 5.13,13.75 9,13.75M17,12.66L14.25,9.66L15.41,8.5L17,10.09L20.59,6.5L21.75,7.91L17,12.66Z" />
                            </svg>
                        </button>
                    <button title={`Ignore ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncIgnoreFriend(username, user.username);
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}>
                            <svg className="svg-icon" viewBox="0 -5 28 28">
                                <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M1,10V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                            </svg>
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
                            }}>
                        <svg style={{width:'24px', height: '24px'}} viewBox="0 -5 28 28">
                            <path className="svg-icon" d="M22.59,7.92L23.75,9.33L19,14.08L16.25,11.08L17.41,9.92L19,11.5L22.59,7.92M6,5A3,3 0 0,1 9,8A3,3 0 0,1 6,11A3,3 0 0,1 3,8A3,3 0 0,1 6,5M11,5A3,3 0 0,1 14,8A3,3 0 0,1 11,11C10.68,11 10.37,10.95 10.08,10.85C10.65,10.04 11,9.06 11,8C11,6.94 10.65,5.95 10.08,5.14C10.37,5.05 10.68,5 11,5M6,13C8,13 12,14 12,16V18H0V16C0,14 4,13 6,13M12.62,13.16C14.63,13.5 17,14.46 17,16V18H14V16C14,14.82 13.45,13.88 12.62,13.16Z" />
                        </svg>
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
                        <svg className="svg-icon" style={{width:'24px', height: '24px'}} viewBox="0 -5 30 30">
                            <path transform="translate(7, 1)" d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
                            <path className="svg-red" stroke-width="2" transform="translate(1, 5) scale(0.4, 0.4)" d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z" />

                        </svg>

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
                            }}>
                        <svg style={{width:'24px', height: '24px'}} className="svg-icon" viewBox="0 -5 28 28">
                            <path d="M13,13C11,13 7,14 7,16V18H19V16C19,14 15,13 13,13M19.62,13.16C20.45,13.88 21,14.82 21,16V18H24V16C24,14.46 21.63,13.5 19.62,13.16M13,11A3,3 0 0,0 16,8A3,3 0 0,0 13,5A3,3 0 0,0 10,8A3,3 0 0,0 13,11M18,11A3,3 0 0,0 21,8A3,3 0 0,0 18,5C17.68,5 17.37,5.05 17.08,5.14C17.65,5.95 18,6.94 18,8C18,9.06 17.65,10.04 17.08,10.85C17.37,10.95 17.68,11 18,11M8,10H0V12H8V10Z" />
                        </svg>
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