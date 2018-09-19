import tippy from 'tippy.js'

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import stompClient, {SEND_CHAT_QUEUE} from '../actions/stomp-client';

import {EVENT_CHAT_ACK, ROOT_STATIC_URL} from "../actions";

class ActiveChat extends Component {

    constructor(props) {
        super(props);
        this.state = {id: props.chatId};
    }

    handleSubmit(event, user, chatId) {
        event.preventDefault();
        const data = new FormData(event.target);
        event.target.reset();

        stompClient.send(SEND_CHAT_QUEUE, {to: user.username, id: chatId, message: data.get("message")});
    }

    renderChat(chats) {
        if (chats === undefined) return;

        return chats
            .filter(chat => {
                return chat.chat !== undefined && chat.chat.id === this.state.id
            })
            .map(chat => {
                const className = chat.event === EVENT_CHAT_ACK ? 'outgoing' : 'incoming';
                return <div className={`chat ${className}`}>{chat.text}</div>;
            });
    }

    render() {
        const {chatId, user, chat} = this.props;

        return <div className="d-inline">
            <button title={`Chat with ${user.firstname}`} className="btn btn-billboard btn-sm"
                    onClick={(event) => {
                        if (event === null) return;
                        event.preventDefault();
                        const toggleId = event.target.getAttribute('data-target');
                        const toggle = document.getElementById(toggleId);
                        toggle && toggle.classList.toggle('show');
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        tippy(elem, {arrow: true, theme: "sidebar"});
                    }}>
                <i className="fas fa-comment-dots" aria-hidden="true" data-target={`chat-${user.username}`}/>
            </button>

            <div className="active-toggle" id={`chat-${user.username}`}>

                {this.renderChat(chat)}

                <form onSubmit={(event) => this.handleSubmit(event, user, chatId)}>
                    <div className='active-chat'>
                        <textarea name="message" placeholder="You.."/>
                        <button type="submit" className="btn btn-billboard btn-sm btn-active">
                            <i className="fas fa-comment-dots mr-1"/>Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }
}

class ActiveFriend extends Component {

    renderAvatar(avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    render() {
        const {user, state, chat, chatId} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
        const fullname = `${user.firstname} ${user.lastname}`;
        const templateId = `#user-tooltip-${user.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));
        const isBlocked = state === 'BLOCKED';

        console.log('CHAT', chat);

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
                    ><img className={isBlocked ? "blocked-img" : "thumb"} src={avatar}/>
                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}
                    </div>
                    {fullname}
                </Link>

                {chatId && !isBlocked && <ActiveChat chat={chat} user={user} chatId={chatId}/>}

                <div id={`user-tooltip-${user.id}`} className="d-none">Loading...</div>

            </div>
        );

    }
}

function mapStateToProps(state) {
    return {chat: state.chat}
}

export default connect(mapStateToProps, {})(ActiveFriend);