import tippy from 'tippy.js'
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {connect} from 'react-redux';

import stompClient, {CHAT_CONSUME_QUEUE, CHAT_DELIVER_QUEUE} from "../../actions/stomp-client";
import {
    asyncFetchChatEntries, chatEventHandler, CHAT_ENTRY_CONSUMED, CHAT_ENTRY_RECEIVED,
    EVENT_CHAT_DELIVERED, EVENT_CHAT_RECEIVED, EVENT_CHAT_CONSUMED_ACK
} from "../../actions";

class ActiveChat extends Component {

    constructor(props) {
        super(props);
        this.state = {id: props.chat.id};
        this.localstate = this.localstate.bind(this)({isOpen: false, isLoaded: false, count: props.chat.delivered});
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

        if (data.get("message").length > 0) {
            stompClient.send(CHAT_DELIVER_QUEUE, {to: user.username, id: chatId, message: data.get("message")});
        }
    }

    renderChatEntries(chat, entries) {
        if (entries === undefined) return;

        return entries
            .filter(entry => {
                return entry.data !== undefined && entry.data.chat.id === this.state.id
            })
            .map(entry => {
                const isIncoming = [EVENT_CHAT_DELIVERED, EVENT_CHAT_RECEIVED, EVENT_CHAT_CONSUMED_ACK]
                    .includes(entry.event);
                const isConsumed = entry.data.state === CHAT_ENTRY_CONSUMED;
                const isReceived = entry.data.state === CHAT_ENTRY_RECEIVED;

                const incoming = isIncoming ? 'incoming' : 'outgoing';
                const consumed = isConsumed ? 'consumed' : 'delivered';

                console.log(isIncoming ? '<< IN' : '>> OUT', entry.data.state, entry.data.id, entry.data.text);

                if (isIncoming && !isConsumed) {
                    if(this.localstate.get().isOpen) {

                        console.log('>> CHAT_CONSUME_QUEUE', entry.data.text);

                        stompClient.send(CHAT_CONSUME_QUEUE, {
                            to: entry.data.from, id: this.state.id, entryId: entry.data.id
                        });
                    } else if (!isReceived) {

                        console.log('>> EVENT_CHAT_RECEIVED', entry.data.text);

                        this.localstate.set({count: this.localstate.get().count + 1});
                        entry.data.state = CHAT_ENTRY_RECEIVED;
                        this.props.chatEventHandler(EVENT_CHAT_RECEIVED, entry);
                        toastr.info(`You have received a new message from ${entry.data.from}`);
                    }
                }

                return <div key={entry.data.id} className={`active-entry ${incoming}`}>
                    {entry.data.text}
                    {!isIncoming && <i className={`fas fa-check-double ${consumed}`}/>}
                </div>;
            });
    }

    handleActiveChat(isOpen) {
        const {authname, chat} = this.props;
        const localstate = this.localstate.set({isOpen: isOpen});

        console.log('ON_OPEN', localstate);

        if (localstate.isOpen && !localstate.isLoaded) {
            this.props.asyncFetchChatEntries(authname, chat.id, () => {
                this.localstate.set({isLoaded: true, count: 0})
            });
        } else if (localstate.isOpen && localstate.count > 0) {
            this.localstate.set({count: 0});
            this.forceUpdate();
        }
    }


    render() {
        const {chat, user, chatEntries, authname} = this.props;

        console.log('ACTIVE', chat, chatEntries);

        return <div className="active-frame">
            <button title={`Chat with ${user.firstname}`} className="btn btn-billboard btn-sm"
                    onClick={(event) => {
                        if (event === null) return;
                        event.preventDefault();
                        const toggleId = event.target.getAttribute('data-target');
                        const toggle = document.getElementById(toggleId);

                        if (toggle) {
                            toggle.classList.toggle('active-show');
                            this.handleActiveChat(toggle.classList.contains('active-show'));

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
                {this.renderChatEntries(chat, chatEntries)}

                <form onSubmit={(event) => this.handleSubmit(event, user, chat.id)}>
                    <div className='active-chat'>
                        <textarea id={`textarea-${user.username}`} name="message" placeholder="You.."/>
                        <button type="submit" className="btn btn-billboard btn-sm btn-active">
                            <i className="fas fa-comment-dots mr-1"/>Send
                        </button>
                    </div>
                </form>
            </div>

            {!this.localstate.get().isOpen && this.localstate.get().count > 0 && <span className="counter-thumb">
                            <div className="badge badge-light d-inline">{this.localstate.get().count}</div>
                        </span>}
        </div>
    }
}

function mapStateToProps(state) {
    return {chatEntries: state.chatEntries}
}

export default connect(mapStateToProps, {asyncFetchChatEntries, chatEventHandler})(ActiveChat);