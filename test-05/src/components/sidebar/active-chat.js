import tippy from 'tippy.js'
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import stompClient, {CHAT_CONSUME_QUEUE, CHAT_DELIVER_QUEUE} from "../../actions/stomp-client";
import {EVENT_CHAT_DELIVERED} from "../../actions";

export default class ActiveChat extends Component {

    constructor(props) {
        super(props);
        this.state = {id: props.chat.id};
        this.localstate = this.localstate.bind(this)({isOpen: false, count: props.chat.deliver});
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
        const {callback} = this.props;

        console.log('ENTRIES0', chat, entries);

        return entries
            .filter(entry => {
                return entry.data !== undefined && entry.data.chat.id === this.state.id
            })
            .map(entry => {
                const isIncoming = entry.event === EVENT_CHAT_DELIVERED;
                const isConsumed = entry.data.state === 'CONSUMED';

                const incoming = isIncoming ? 'incoming' : 'outgoing';
                const consumed = isConsumed ? 'consumed' : 'delivered';

                console.log('ENTRY', chat, entry);

                if (isIncoming && !isConsumed) {
                    if(this.localstate.get().isOpen) {
                        stompClient.send(CHAT_CONSUME_QUEUE, {
                            to: entry.data.from, id: this.state.id,
                            entryId: entry.data.id
                        });
                    } else {
                        // callback( this.localstate.set({count: ++this.localstate.get().count}));
                        toastr.info(`You have received a new message from ${entry.data.from}`);
                    }
                }

                return <div key={entry.data.id} className={`active-entry ${incoming}`}>
                    {entry.data.text}
                    {!isIncoming && <i className={`fas fa-check-double ${consumed}`}/>}
                </div>;
            });
    }


    render() {
        const {chat, user, chatEntries, callback} = this.props;

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
        </div>
    }
}

// function mapStateToProps(state) {
//     return {chatEntries: state.chatEntries}
// }
//
// export default connect(mapStateToProps, {asyncFetchChatEntries})(ActiveChat);