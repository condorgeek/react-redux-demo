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
        const {user, state} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar =  `${ROOT_STATIC_URL}/${user.avatar}`;
        const fullname = `${user.firstname} ${user.lastname}`;
        const templateId = `#user-tooltip-${user.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));
        const isBlocked = state === 'BLOCKED';

        return (
            <div className='active-contact d-inline'>
                <Link to={homespace}>
                    <div className="state-thumb"
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
                    ><img className={isBlocked ? "blocked-img" : "thumb"} src={avatar}/>{fullname}
                        {/*{state === 'BLOCKED' && <span className="blocked-thumb"><i className="fas fa-ban"/></span>}*/}
                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width:'32px', height:'32px'}} viewBox="0 0 24 24">
                                <path d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z" />
                            </svg>
                        </span>}
                    </div>
                </Link>

                {this.props.chat ? <a data-toggle="collapse" href={`#chat${user.name}`}>
                    <i className="fa fa-commenting-o" aria-hidden="true"/>3</a> : ''}

                {this.renderTextArea(user)}

                <div id={`user-tooltip-${user.id}`} className="d-none">Loading...</div>

            </div>
        );

    }
}