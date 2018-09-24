import tippy from 'tippy.js'

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import stompClient, {CHAT_DELIVER_QUEUE} from '../actions/stomp-client';

import {asyncFetchChatEntries, EVENT_CHAT_DELIVERED_ACK, ROOT_STATIC_URL} from "../actions";


class ActiveChat extends Component {

    constructor(props) {
        super(props);
        this.state = {id: props.chatId};
        this.localstate = this.localstate.bind(this)({isOpen: false, count: 0});
    }

    localstate(data) {
        let state = data;
        return {
            set(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            get() {
                return state;
            }
        }
    }

    handleSubmit(event, user, chatId) {
        event.preventDefault();
        const data = new FormData(event.target);
        event.target.reset();

        stompClient.send(CHAT_DELIVER_QUEUE, {to: user.username, id: chatId, message: data.get("message")});
    }

    renderChat(entries) {
        if (entries === undefined) return;
        let count = 0;

        return entries
            .filter(entry => {
                return entry.data !== undefined && entry.data.chat.id === this.state.id
            })
            .map(entry => {
                this.localstate.set({count: ++count});
                const className = entry.event === EVENT_CHAT_DELIVERED_ACK ? 'outgoing' : 'incoming';
                return <div key={entry.data.id} className={`chat ${className}`}>{entry.data.text}</div>;
            });
    }

    render() {
        const {chatId, user, chat, callback} = this.props;

        return <div className="active-frame">
            <button title={`Chat with ${user.firstname}`} className="btn btn-billboard btn-sm"
                    onClick={(event) => {
                        if (event === null) return;
                        event.preventDefault();
                        const toggleId = event.target.getAttribute('data-target');
                        const toggle = document.getElementById(toggleId);

                        if (toggle) {
                            toggle.classList.toggle('active-show');
                            callback && callback(
                                this.localstate.set({isOpen: toggle.classList.contains('active-show')})
                            );
                            setTimeout(() => {
                                document.getElementById(`textarea-${user.username}`).focus();
                            }, 500);

                        }
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
                        <textarea id={`textarea-${user.username}`} name="message" placeholder="You.."/>
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

    constructor(props) {
        super(props);
        this.handleActiveChat = this.handleActiveChat.bind(this);
        this.localstate = this.localstate.bind(this)({isOpen: false, isLoaded: false, count: 0});
    }

    localstate(data) {
        let state = data;
        return {
            set(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            get() {
                return state;
            }
        }
    }

    renderAvatar(avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    handleActiveChat(state) {
        const {user, chatId} = this.props;
        const localstate = this.localstate.set(state);

        console.log('ACTIVE', this.localstate.get());

        if (localstate.isOpen && !localstate.isLoaded) {
            this.props.asyncFetchChatEntries(user.username, chatId, () => {
                this.localstate.set({isLoaded: true})
            });
        } else {
            this.forceUpdate();
        }
    }

    render() {
        const {user, state, chat, chatId} = this.props;

        const homespace = `/${user.username}/home`;
        const avatar = `${ROOT_STATIC_URL}/${user.avatar}`;
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
                    ><img className={isBlocked ? "blocked-img" : "thumb"} src={avatar}/>
                        {isBlocked && <span className="blocked-thumb">
                            <svg style={{width: '32px', height: '32px'}} viewBox="0 0 24 24">
                                <path
                                    d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z"/>
                            </svg>
                        </span>}
                        {!this.localstate.get().isOpen && chatId && <span className="counter-thumb">
                            <div className="badge badge-light d-inline">{this.localstate.get().count}</div>
                        </span>}

                    </div>
                    {fullname}
                </Link>

                {chatId && !isBlocked &&
                <ActiveChat chat={chat} user={user} chatId={chatId} callback={this.handleActiveChat}/>}

                <div id={`user-tooltip-${user.id}`} className="d-none">Loading...</div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {chat: state.chat}
}

export default connect(mapStateToProps, {asyncFetchChatEntries})(ActiveFriend);