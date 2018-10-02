import $ from 'jquery';
import toastr from "../../../node_modules/toastr/toastr";
import {connect} from 'react-redux';
import React, {Component} from 'react';


import {asyncFetchFollowees, asyncFetchFollowers, asyncFetchFriends, asyncFetchFriendsPending,
    asyncDeleteFollowee,  asyncDeleteFriend, asyncAcceptFriend, asyncIgnoreFriend, asyncCancelFriend,
    asyncBlockFollower, asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend} from '../../actions/index';
import ActiveFriend from './active-friend';
import tippy from "../util/tippy.all.patched";

window.jQuery = $;

class Sidebar extends Component {

    constructor(props) {
        super(props);
        const {authorization} = this.props;

        this.props.asyncFetchFriends(authorization.user.username);
        this.props.asyncFetchFriendsPending(authorization.user.username);
        this.props.asyncFetchFollowers(authorization.user.username);
        this.props.asyncFetchFollowees(authorization.user.username);
    }

    componentDidMount() {
        toastr.options.closeButton = true;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.closeHtml='<button><i class="fas fa-times"/></button>';
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
                    {friend.state === 'BLOCKED' && friend.action === 'BLOCKING' && <button title={`Unblock ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncUnblockFriend(authname, user.username, (params) => {
                                    toastr.info(`You have unblocked ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-check"/>
                    </button>}

                    {friend.state === 'ACTIVE' && <button title={`Block ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncBlockFriend(authname, user.username, (params) => {
                                    toastr.info(`You have blocked ${user.firstname}.`);

                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-slash"/>
                    </button>}

                    {friend.state === 'ACTIVE' && <button title={`Delete friendship to ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFriend(authname, user.username, (params) => {
                                    toastr.warning(`You have deleted your friendship to ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
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
                    <button title={`Confirm ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                              event.preventDefault();
                              this.props.asyncAcceptFriend(authname, user.username, (params) => {
                                    toastr.info(`You have confirmed ${user.firstname} friendship.`);
                                });
                            }}
                            ref={(elem)=> {
                            if (elem === null) return;
                            tippy(elem, {arrow: true, theme: "sidebar"});
                        }}><i className="fas fa-user-check"/>
                    </button>

                    <button title={`Ignore ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncIgnoreFriend(authname, user.username, (params) => {
                                    toastr.warning(`You have ignored ${user.firstname} friendship's request.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-minus"/>
                    </button>
                </div>}

                {friend.action === 'REQUESTING' && <div className="sidebar-navigation">

                    <button title={`Cancel request to ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncCancelFriend(authname, user.username, (params) => {
                                    toastr.warning(`You have cancelled your friendship's request to ${user.firstname}.`);
                                });
                            }}
                            ref={(elem)=> {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
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
                    <button title={`Unblock ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncUnblockFollower(authname, user.username, (params) => {
                                    toastr.info(`You have unblocked ${user.firstname}.`);
                                });

                            }}
                            ref={(elem) => {
                                if (elem === null) return;
                                tippy(elem, {arrow: true, theme: "sidebar"});
                            }}><i className="fas fa-user-check"/>
                    </button>}
                    {follower.state === 'ACTIVE' && <button title={`Block ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                             onClick={(event) => {
                                 event.preventDefault();
                                 this.props.asyncBlockFollower(authname, user.username, (params) => {
                                     toastr.info(`You have blocked ${user.firstname}.`);
                                 });
                             }}
                             ref={(elem) => {
                                 if (elem === null) return;
                                 tippy(elem, {arrow: true, theme: "sidebar"});
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
                    <button title={`Stop following ${user.firstname}`} type="button" className="btn btn-billboard btn-sm"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.asyncDeleteFollowee(authname, user.username, (params) => {
                                    toastr.warning(`You have stopped following ${user.firstname}.`);
                                });
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
        const {authorization, friends, pending, followers, followees, username} = this.props;

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

export default connect(mapStateToProps, {asyncFetchFriends, asyncFetchFollowers, asyncFetchFollowees,
    asyncFetchFriendsPending, asyncDeleteFollowee, asyncAcceptFriend, asyncIgnoreFriend, asyncBlockFollower,
    asyncUnblockFollower, asyncUnblockFriend, asyncBlockFriend, asyncDeleteFriend, asyncCancelFriend})(Sidebar);