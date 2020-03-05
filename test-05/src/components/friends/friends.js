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
import React from 'react';
import {connect} from 'react-redux';
import {getAuthorizedUsername, isAuthorized, isSuperUser} from "../../selectors";
import {FlatIcon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {UserLink} from "../navigation-headlines/nav-headlines";
import {localFriendChat} from "../../actions";

const renderFriends = (props) => {
    const {friends, authname} = props;

  return friends.map(entry => {
      const {friend, chat} = entry;


      console.log('FRIEND XXX', entry, entry.chat);

      const homespace = `/${friend.username}/home`;
      const fullname = `${friend.firstname} ${friend.lastname}`;
      const isSelf = authname === friend.username;

      return <NavigationRow key={friend.id} className='members-generic-entry'>
          <NavigationGroup>
              <UserLink grayscale to={homespace} avatar={friend.avatar} text={fullname}/>
          </NavigationGroup>
          <NavigationGroup>
              {/*{isRemoveAllowed && !isSelf &&*/}
              {/*<RemoveMemberDialog authname={authname}*/}
              {/*                    member={member}*/}
              {/*                    space={genericdata.space}/>*/}
              {/*}*/}

              <FlatIcon circle title={`BLock ${friend.firstname}`}
                        className='fas fa-user-slash' onClick={(event) => {
                  event.preventDefault();
                  console.log('BLOCK USER');
              }}/>

              <FlatIcon circle title={`Delete friendship w. ${friend.firstname}`}
                        className='fas fa-user-minus' onClick={(event) => {
                  event.preventDefault();
                  console.log('DELETE FRIENDSHIP');
              }}/>
              <FlatIcon circle bigger title={`Chat with ${friend.firstname}`}
                        className='far fa-comment-dots' onClick={(event) => {
                            event.preventDefault();
                  props.localFriendChat(entry);
              }}/>
          </NavigationGroup>
      </NavigationRow>

  })
};


const Friends = (props) => {
    const {className, friends, homedata} = props;

    console.log('FRIENDS', friends, homedata);

    return <div className={`friends-container ${className ? className :''}`}>
        {friends && renderFriends(props)}
    </div>
};

const mapStateToProps = (state) => ({
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
    authname: getAuthorizedUsername(state),
    friends: state.friends,
    homedata: state.homedata ? state.homedata.payload : state.homedata,
});

export default connect(mapStateToProps, {localFriendChat})(Friends);