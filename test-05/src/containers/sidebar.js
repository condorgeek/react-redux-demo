import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchContacts} from '../actions';
import ActiveContact from '../components/active-contact';

class Sidebar extends Component {

    componentDidMount() {
        const someId = 1;
        this.props.fetchContacts(someId);
    }

    renderContacts(contacts) {
        if (contacts == null || contacts === undefined) {
            return <div>Loading..</div>
        }

        if(contacts.length > 0) {
            return contacts.map(contact => {
                return <li className='d-sm-block'><ActiveContact contact={contact}/></li>
            });
        }
    }

    render() {
        return(
            <div className='sidebar'>
                <h5 className='mt-1'>Friends</h5>
                <ul className='list-group'> {this.renderContacts(this.props.contacts)} </ul>

                <h5 className='mt-1'>Followers</h5>
                <ul className='list-group'> {this.renderContacts(this.props.contacts)} </ul>
                <ul className='list-group'> {this.renderContacts(this.props.contacts)} </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {contacts: state.contacts}
}

export default connect(mapStateToProps, {fetchContacts}) (Sidebar);