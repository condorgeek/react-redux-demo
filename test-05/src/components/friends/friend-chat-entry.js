/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [friend-entry.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 07.03.20, 14:44
 */
import React, {useRef, useEffect, useState} from 'react';
import {connect} from 'react-redux';

import {FlatIcon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {UserLink} from "../navigation-headlines/nav-headlines";


const FriendChatEntry = (props) => {
    const {friend, chat, active, delivered, onBlock, onDelete, onChat} = props;
    const [count, setCount] = useState(chat.delivered); // incoming messages and not read yet

    useEffect(()=> {
        const isIncoming = delivered && (delivered.chat.id === chat.id);
        isIncoming && !active && setCount(count + 1);
    }, [delivered]);

    console.log('CHAT RENDER', chat);

    const homespace = `/${friend.username}/home`;
    const fullname = `${friend.firstname} ${friend.lastname}`;

    return <NavigationRow key={friend.id} className='friends-generic-entry'>
        <NavigationGroup>
            <UserLink grayscale
                      badged={count > 0 ? count : null}
                      active={active}
                      to={homespace}
                      avatar={friend.avatar}
                      text={fullname}/>

        </NavigationGroup>
        <NavigationGroup>
            <FlatIcon circle title={`BLock ${friend.firstname}`}
                      className='fas fa-user-slash' onClick={onBlock}/>

            <FlatIcon circle title={`Delete friendship w. ${friend.firstname}`}
                      className='fas fa-user-minus' onClick={onDelete}/>

            <FlatIcon circle bigger title={`Chat with ${friend.firstname}`}
                      className='far fa-comment-dots' onClick={(event) => {
                          setCount(0);
                          onChat(event);
                      }}
            />
        </NavigationGroup>
    </NavigationRow>
};

const mapStateToProps = (state, ownProps) => {
    const isFriendChatOpen = state.friend ? state.friend.chat.id === ownProps.chat.id : false;

    return isFriendChatOpen ?
        {chat: state.friend.chat, active: isFriendChatOpen, delivered: state.chatDelivered} :
        {active: isFriendChatOpen, delivered: state.chatDelivered}
};

export default connect(mapStateToProps, {})(FriendChatEntry)