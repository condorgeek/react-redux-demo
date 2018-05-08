import React, {Component} from 'react';

export default class ActiveContact extends Component {

    renderTextArea(contact) {

        if(this.props.chat) {
            return(
                <div className="collapse" id={`chat${contact.name}`}>
                    <div className='active-chat'>
                        <textarea placeholder="You.."/>
                    </div>
                </div>
            );
        }
    }

    render() {
        const contact = this.props.contact;

        return (
            <div className='active-contact'>
                <a href="#"><img src={contact.thumbnail}/>{`${contact.firstname} ${contact.lastname}`}</a>
                <span>{contact.when}1 min ago</span>

                {this.props.chat ? <a data-toggle="collapse" href={`#chat${contact.name}`}>
                    <i className="fa fa-commenting-o" aria-hidden="true"/>3</a> : ''}

                {this.renderTextArea(contact)}
            </div>
        );
    }
}