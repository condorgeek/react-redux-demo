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
            return contacts.map(entry => {
                console.log(entry);
                {/*<li><ActiveContact contact={entry}/></li>*/}
                <li>{entry.user}</li>
            });
        }
    }

    render() {
        return(
            <div className='sidebar'>
                <h3>Sidebar</h3>
                <ul> {this.renderContacts(this.props.contacts)} </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {contacts: state.contacts}
}

export default connect(mapStateToProps, {fetchContacts}) (Sidebar);