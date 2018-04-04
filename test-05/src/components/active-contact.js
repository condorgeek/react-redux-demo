import React, {Component} from 'react';

export default class ActiveContact  extends Component {

    render() {
        const contact = this.props.contact;
        console.log('active-contact', contact);

        return (
            <div className='active-contact'><img src={contact.thumb}/> :: {contact.user} {contact.when}</div>
        );
    }
}