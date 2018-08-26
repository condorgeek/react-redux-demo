import tippy from 'tippy.js'

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';

import {ROOT_STATIC_URL} from "../actions";

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

    renderAvatar (avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    render() {

        const {user} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar =  `${ROOT_STATIC_URL}/${user.avatar}`;
        const fullname = `${user.firstname} ${user.lastname}`;
        const templateId = `#user-tooltip-${user.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));

        return (
            <div className='active-contact d-inline'>
                <Link to={homespace}>
                    <div className="d-inline"
                         ref={(elem) => {
                             if (elem === null) return;
                             const initialText = document.querySelector(templateId).textContent;
                             const tooltip = tippy(elem, {
                                 html: templateId, interactive: false, theme: 'avatar',
                                 placement: 'left',
                                 animation: 'shift-toward', arrow: true,
                                 onShow() {
                                     const content = this.querySelector('.tippy-content');
                                     if (tooltip.loading || content.innerHTML !== initialText) return;
                                     tooltip.loading = true;
                                     content.innerHTML = html;
                                     tooltip.loading = false;
                                 },
                                 onHidden() {
                                     const content = this.querySelector('.tippy-content');
                                     content.innerHTML = initialText;
                                 }
                             });
                         }}
                    ><img className="thumb" src={avatar}/>{fullname}</div>
                </Link>

                {this.props.chat ? <a data-toggle="collapse" href={`#chat${user.name}`}>
                    <i className="fa fa-commenting-o" aria-hidden="true"/>3</a> : ''}

                {this.renderTextArea(user)}

                <div id={`user-tooltip-${user.id}`} className="d-none">Loading...</div>

            </div>
        );

    }
}