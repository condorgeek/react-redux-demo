import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchFollowees, fetchFollowers, fetchFriends, fetchFriendsPending} from '../actions';
import ActiveContact from '../components/active-contact';

class Sidebar extends Component {

    componentDidMount() {
        const {authorization} = this.props;

        this.props.fetchFriends(authorization.user.username);
        this.props.fetchFriendsPending(authorization.user.username);
        this.props.fetchFollowers(authorization.user.username);
        this.props.fetchFollowees(authorization.user.username);
    }

    renderContacts(users, chat = false) {
        if (users === null || users === undefined) {
            return <div>Loading..</div>
        }

        return (users.map(user => {
            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveContact user={user} chat={chat}/>

                <div className="sidebar-navigation">
                    <button type="button" className="btn btn-billboard btn-sm"
                            // ref={(elem)=> {
                            //     if (elem === null || spacedata === undefined || isEditable) return;
                            //     const html = ReactDOMServer.renderToStaticMarkup(this.renderFriendsTooltip(spacedata));
                            //     this.bindTooltipToRef(elem, "#friends-tooltip", html);
                            // }}
                    >
                        Friends <div className="badge badge-light d-inline">{123}</div>
                    </button>
                </div>
            </li>
        }));
    }

    renderPending(users) {
        if (users === null || users === undefined) {
            return <div>Loading..</div>
        }
        return (users.map(user => {
            return <li key={user.id} className='d-sm-block sidebar-entry'>
                <ActiveContact user={user} chat="false"/>

                <div className="sidebar-navigation">
                    <button type="button" className="btn btn-billboard btn-sm"
                        // ref={(elem)=> {
                        //     if (elem === null || spacedata === undefined || isEditable) return;
                        //     const html = ReactDOMServer.renderToStaticMarkup(this.renderFriendsTooltip(spacedata));
                        //     this.bindTooltipToRef(elem, "#friends-tooltip", html);
                        // }}
                    >Confirm</button>
                    <button type="button" className="btn btn-billboard btn-sm"
                        // ref={(elem)=> {
                        //     if (elem === null || spacedata === undefined || isEditable) return;
                        //     const html = ReactDOMServer.renderToStaticMarkup(this.renderFriendsTooltip(spacedata));
                        //     this.bindTooltipToRef(elem, "#friends-tooltip", html);
                        // }}
                    >Ignore</button>
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
                    <ul className='list-group'> {this.renderContacts(friends, true)} </ul>
                </div>
                <div>
                    <h5>Pending ({pending.length})</h5>
                    <ul className='list-group'> {this.renderPending(pending)} </ul>
                </div>
                <div>
                    <h5>Your Followers ({followers.length}) </h5>
                    <ul className='list-group d-inline'> {this.renderContacts(followers)} </ul>
                </div>
                <div>
                    <h5>You follow ({followees.length}) </h5>
                    <ul className='list-group'> {this.renderContacts(followees)} </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, friends: state.friends, followers: state.followers,
        followees: state.followees, pending: state.pending}
}

export default connect(mapStateToProps, {fetchFriends, fetchFollowers, fetchFollowees, fetchFriendsPending})(Sidebar);