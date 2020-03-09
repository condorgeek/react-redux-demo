/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [chat.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.03.20, 16:18
 */
import toastr from "toastr";
import moment from 'moment';

import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {UserLink} from "../navigation-headlines/nav-headlines";
import {getAuthorizedUsername} from "../../selectors";
import {
    asyncFetchChatEntries,
    CHAT_ENTRY_CONSUMED, CHAT_ENTRY_RECEIVED,
    EVENT_CHAT_CONSUMED_ACK,
    EVENT_CHAT_DELIVERED,
    EVENT_CHAT_RECEIVED
} from "../../actions";
import stompClient, {CHAT_CONSUME_QUEUE, CHAT_DELIVER_QUEUE} from "../../actions/stomp-client";
import {DefaultButton, FlatButton} from "../navigation-buttons/nav-buttons";


// handleActiveChat(isOpen) {
//     const {authname, chat} = this.props;
//     const localstate = this.localstate.set({isOpen: isOpen});
//
//     console.log('ON_OPEN', localstate);
//
//     if (localstate.isOpen && !localstate.isLoaded) {
//         this.props.asyncFetchChatEntries(authname, chat.id, () => {
//             this.localstate.set({isLoaded: true, count: 0})
//         });
//     } else if (localstate.isOpen && localstate.count > 0) {
//         this.localstate.set({count: 0});
//         this.forceUpdate();
//     }
// }

const renderChatEntries = (entries, chatId) => {
    const bubbles = entries.map(entry => {

        if(entry.data.chat.id !== chatId) return null;

        const isIncoming = [EVENT_CHAT_DELIVERED, EVENT_CHAT_RECEIVED, EVENT_CHAT_CONSUMED_ACK]
        .includes(entry.event);
        const isConsumed = entry.data.state === CHAT_ENTRY_CONSUMED;
        const isReceived = entry.data.state === CHAT_ENTRY_RECEIVED;

        const incoming = isIncoming ? 'chat-entry-incoming' : 'chat-entry-outgoing';
        const consumed = isConsumed ? 'chat-entry-consumed' : 'chat-entry-delivered';

        // isIncoming && console.log('INCOMING');
        // isConsumed && console.log('CONSUMED');
        // isReceived && console.log('RECEIVED');

        // acknowledge receipt and consuming of message
        if (isIncoming && !isConsumed) {
            stompClient.send(CHAT_CONSUME_QUEUE, {
                to: entry.data.from, id: chatId, entryId: entry.data.id
            });
            // TODO !isReceived case - see active-chat.js
        }

        return <div key={entry.data.id} className={`chat-entry ${incoming}`}>
            <div className={`chat-entry-bubble 
            ${isIncoming ? 'incoming': 'outgoing' }`}>
                {entry.data.text}
                {!isIncoming && <i className={`fas fa-check-double ${consumed}`}/>}
                <span className="chat-entry-time">{moment(entry.data.created).fromNow()}</span>
            </div>
        </div>
    });

    return <div className='bubble-container'>{bubbles}</div>
};

const sendMessage = (event, friend, chatId) => {
    event.preventDefault();
    const data = new FormData(event.target);
    event.target.reset();

    if (data.get('message').length > 0) {
        stompClient.send(
            CHAT_DELIVER_QUEUE, {to: friend.username, id: chatId, message: data.get("message")}
            );
    }
};

const Chat = (props) => {
    const {className, authname, friendChat, chatEntries} = props;
    const chatRef = useRef({id: 0});


    /* didComponentMount */
    useEffect(() => {
        if(friendChat) {
            const {friend, chat} = friendChat;
            chatRef.current = chat;

            friend && props.asyncFetchChatEntries(authname, chat.id, (data) => {
                console.log('CHAT ENTRIES LOADED', data);
            })
        }
    }, [friendChat]);


    /* componentWillUnmount */
    useEffect(() => {
        return () => {
            console.log('CHAT UNMOUNT');
            // TODO reset global chatEntries in the global store
            // props.localResetChatEntries();
        }
    },[]);

    if(!friendChat || friendChat.chat.id !== chatRef.current.id) return null;

    const {friend, chat} = friendChat;
    const homespace = `/${friend.username}/home`;

    return <div className={`chat-container box-white ${className ? className : ''}`}>
        <UserLink bigger className='box-light-gray'
                  to={homespace} avatar={friend.avatar} text={friend.fullname}/>

        {renderChatEntries(chatEntries, chat.id)}

        <form onSubmit={(event) => sendMessage(event, friend, chat.id)}>
            <div className='chat-input-box'>
                <textarea name='message' placeholder='You..'/>
                <DefaultButton className='chat-input-box-button' block type='submit'>Send</DefaultButton>
            </div>
        </form>


    </div>
};

const mapStateToProps = (state) => ({
    authname: getAuthorizedUsername(state),
    friendChat: state.friend,
    chatEntries: state.chatEntries,
});

export default connect(mapStateToProps, {asyncFetchChatEntries})(Chat);