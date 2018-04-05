import React, {Component} from 'react';

export default class ActiveContact extends Component {

    renderTextArea(contact) {

        if(this.props.chat) {
            return(
                <div className="collapse" id={`chat${contact.user}`}>
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
                <a href="#"><img src={contact.thumb}/>{contact.user}</a>
                {this.props.chat ? <a data-toggle="collapse" href={`#chat${contact.user}`}><i className="fa fa-commenting-o" aria-hidden="true"/>3</a> : ''}
                <span>{contact.when}</span>

                {this.renderTextArea(contact)}

            </div>
        );
    }
}