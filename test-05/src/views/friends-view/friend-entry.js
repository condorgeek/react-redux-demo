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
import React, {useEffect, useState, Fragment} from 'react';
import {connect} from 'react-redux';

import {FlatIcon, NavigationGroup, NavigationRow} from "../../components/navigation-buttons/nav-buttons";
import {UserLink} from "../../components/navigation-headlines/nav-headlines";
import {STATE_ACTIVE, STATE_BLOCKED} from "../../actions/spaces";
import DeleteFriendDialog from "./dialogs/delete-friend-dialog";


const FriendEntry = (props) => {
    const {chatEntry, active, delivered, enableChat, onBlock, onUnblock, onDelete, onChat} = props;
    const {chat, friend, state, action} = chatEntry;
    const [count, setCount] = useState(chat.delivered); // incoming messages and not read yet

    useEffect(()=> {
        const isIncoming = delivered && (delivered.chat.id === chat.id);
        isIncoming && !active && setCount(count + 1);
    }, [delivered]);

    const homespace = `/${friend.username}/home`;
    const fullname = `${friend.firstname} ${friend.lastname}`;
    const isBlocked = state === STATE_BLOCKED;

    console.log('STATE', friend);

    return <NavigationRow key={friend.id} className='friends-generic-entry'>
        <NavigationGroup>
            <UserLink grayscale
                      badged={enableChat && !isBlocked && count > 0 ? count : null}
                      active={enableChat && active}
                      blocked={isBlocked ? true : null}
                      to={homespace}
                      avatar={friend.avatar}
                      text={fullname}/>
        </NavigationGroup>

        <NavigationGroup>
            {enableChat && <Fragment>
                {isBlocked && action === 'BLOCKING' && <Fragment>
                    <FlatIcon circle title={`UnbLock ${friend.firstname}`}
                              className='fas fa-user-slash' onClick={onUnblock}/>
                </Fragment>}

                {state === STATE_ACTIVE && <Fragment>
                    <FlatIcon circle title={`BLock ${friend.firstname}`}
                              className='fas fa-user-slash' onClick={onBlock}/>

                    <DeleteFriendDialog friend={friend} onDelete={onDelete}/>

                    <FlatIcon circle bigger title={`Chat with ${friend.firstname}`}
                              className='far fa-comment-dots' onClick={(event) => {
                        setCount(0);
                        onChat(event);
                    }}/></Fragment>}
            </Fragment>}

        </NavigationGroup>
    </NavigationRow>
};

const mapStateToProps = (state, ownProps) => {
    const isFriendChatOpen = state.friend ? state.friend.chat.id === ownProps.chat.id : false;

    return isFriendChatOpen ?
        {chat: state.friend.chat, active: isFriendChatOpen, delivered: state.chatDelivered} :
        {active: isFriendChatOpen, delivered: state.chatDelivered}
};

export default connect(mapStateToProps, {})(FriendEntry)