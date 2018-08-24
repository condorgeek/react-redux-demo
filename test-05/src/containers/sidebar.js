import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchFriends, fetchFollowers, fetchFollowees} from '../actions';
import ActiveContact from '../components/active-contact';

class Sidebar extends Component {

    componentDidMount() {
        const {authorization} = this.props;

        this.props.fetchFriends(authorization.user.username);
        this.props.fetchFollowers(authorization.user.username);
        this.props.fetchFollowees(authorization.user.username);
    }

    renderContacts(contacts, chat = false) {
        if (contacts === null || contacts === undefined) {
            return <div>Loading..</div>
        }

        return (contacts.map(contact => {
            return <li key={contact.id} className='d-sm-block'><ActiveContact contact={contact} chat={chat}/></li>
        }));
    }

    render() {
        const {authorization, friends, followers, followees} = this.props;

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
                    <h5>Your Followers ({followers.length}) </h5>
                    <ul className='list-group'> {this.renderContacts(followers)} </ul>
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
    return {authorization: state.authorization, friends: state.friends, followers: state.followers, followees: state.followees}
}

export default connect(mapStateToProps, {fetchFriends, fetchFollowers, fetchFollowees})(Sidebar);