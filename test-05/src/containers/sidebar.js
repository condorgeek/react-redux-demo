import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchFriends, fetchFollowers} from '../actions';
import ActiveContact from '../components/active-contact';

class Sidebar extends Component {

    componentDidMount() {
        const user = 'amaru.london';
        this.props.fetchFriends(user);
        this.props.fetchFollowers(user);
    }

    renderContacts(contacts, chat = false) {
        if (contacts == null || contacts === undefined) {
            return <div>Loading..</div>
        }

        return (_.map(contacts, contact => {
            return <li className='d-sm-block'><ActiveContact contact={contact} chat={chat}/></li>
        }));
    }

    render() {
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
                    <h5>Friends ({this.props.friends.length})</h5>
                    <ul className='list-group'> {this.renderContacts(this.props.friends, true)} </ul>
                </div>
                <div>
                    <h5>Followers ({this.props.followers.length}) </h5>
                    <ul className='list-group'> {this.renderContacts(this.props.followers)} </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {friends: state.friends, followers: state.followers}
}

export default connect(mapStateToProps, {fetchFriends, fetchFollowers})(Sidebar);