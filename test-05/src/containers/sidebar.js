import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchContacts} from '../actions';
import ActiveContact from '../components/active-contact';

class Sidebar extends Component {

    componentDidMount() {
        const someId = 1;
        this.props.fetchContacts(someId);
    }

    renderContacts(contacts, chat = false) {
        if (contacts == null || contacts === undefined) {
            return <div>Loading..</div>
        }

        if (contacts.length > 0) {
            return contacts.map(contact => {
                return <li className='d-sm-block'><ActiveContact contact={contact} chat={chat}/></li>
            });
        }
    }

    render() {
        const cnt = this.props.contacts.length;

        return (
            <div className='sidebar'>
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
                    <h5>Friends ({cnt})</h5>
                    <ul className='list-group'> {this.renderContacts(this.props.contacts, true)} </ul>
                </div>
                <div>
                    <h5>Followers ({cnt * 2}) </h5>
                    <ul className='list-group'> {this.renderContacts(this.props.contacts)} </ul>
                    <ul className='list-group'> {this.renderContacts(this.props.contacts)} </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {contacts: state.contacts}
}

export default connect(mapStateToProps, {fetchContacts})(Sidebar);