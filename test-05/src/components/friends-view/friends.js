/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [friends.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.03.20, 16:15
 */
import React, {useRef, useEffect} from 'react';
import toastr from "toastr";

import {connect} from 'react-redux';
import {getAuthorizedUsername, isAuthorized, isSuperUser} from "../../selectors";
import {localOpenFriendChat, asyncFetchFriends, asyncFetchFriendsPending,
    asyncBlockFriend, asyncUnblockFriend, asyncDeleteFriend} from "../../actions";
import NavigationChatEntry from "./navigation-chat-entry";

const renderNavigationChatEntries = (props, enableChat, toggler) => {
    const {friends, authname} = props;

    return friends.map(entry => {
      const {friend, chat} = entry;
      const isSelf = authname === friend.username;


      console.log('FRIENDS', entry);

      // delivered = incoming messages and not read yet
      return <NavigationChatEntry
          key={friend.id} friend={friend} chat={chat}
          chatEntry={entry}
          enableChat={enableChat}
          onBlock={event => {
              event.preventDefault();
              props.asyncBlockFriend(authname, friend.username, (params) => {
                  toastr.info(`You have blocked ${friend.firstname}.`);
              });

          }} onUnblock={event => {
              event.preventDefault();
              props.asyncUnblockFriend(authname, friend.username, (params) => {
                  toastr.info(`You have unblocked ${friend.firstname}.`);
              });

          }} onDelete={event => {
              event.preventDefault();
              props.asyncDeleteFriend(authname, friend.username, (params) => {
                  toastr.warning(`You have deleted your friendship to ${friend.firstname}.`);
              });

          }} onChat={(event) => {
              props.localOpenFriendChat(toggler(entry));
          }}/>
  })
};

const Friends = (props) => {
    const {className, isAuthorized, friends, delivered, username, authname, homedata} = props;
    const currentFriend = useRef(null);
    const enableChat = username === authname;

    useEffect(() => {
        props.asyncFetchFriends(username);
    }, []);

    useEffect(() => {
        enableChat && props.asyncFetchFriendsPending(authname);
    }, []);

    if(!isAuthorized) return null;

    delivered && enableChat && toastr.info(`XXXX You have received a new message from ${delivered.from}`);

    return <div className={`friends-container ${className ? className :''}`}>
        {friends && renderNavigationChatEntries(props, enableChat,(entry) => {
            if(currentFriend.current && currentFriend.current.id === entry.friend.id) {
                currentFriend.current = null;
                return null;
            }
            currentFriend.current = entry.friend;
            return entry;
        })}
    </div>
};

const mapStateToProps = (state) => ({
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
    authname: getAuthorizedUsername(state),
    friends: state.friends,
    homedata: state.homedata ? state.homedata.payload : state.homedata,
    delivered: state.chatDelivered,
});

export default connect(mapStateToProps, {
    localOpenFriendChat,
    asyncFetchFriends,
    asyncFetchFriendsPending,
    asyncBlockFriend,
    asyncUnblockFriend,
    asyncDeleteFriend})(Friends);