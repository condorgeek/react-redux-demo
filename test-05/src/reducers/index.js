/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [index.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 25.09.18 19:35
 */

import { combineReducers } from 'redux';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';
import FriendsReducer, {FriendChatReducer, FriendsPending} from './friends-reducer';
import FollowersReducer from './followers-reducer';
import FolloweesReducer from './followees-reducer';
import LikesReducer, {CommentLikesReducer} from './likes-reducer';
import AuthorizationReducer, {ConfigurationReducer, LocalConfigReducer} from './authorization-reducer';
import CreateUserReducer from './create-user-reducer';
import LoginDataReducer from './logindata-reducer';
import SpacesReducer, {EventsReducer, ShopsReducer, MembersReducer,
    MediaReducer} from './spaces-reducer';
import {HomeDataReducer, GenericDataReducer} from './genericdata-reducer';
import ChatEntriesReducer, {ChatCountReducer, ChatDeliveredReducer} from './chat-reducer';
import WidgetReducer, {PageReducer} from './widget-reducer';
import ErrorReducer from "./error-reducer";
import {SearchReducer} from "./search-reducer";
import {MemberReducer, UserdataReducer} from "./member-reducer";

const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    commentLikes: CommentLikesReducer,
    pending: FriendsPending,

    /** CHAT */
    friends: FriendsReducer,                // list of all friends for logged in user
    friend: FriendChatReducer,              // current open friend on chat
    chatEntries: ChatEntriesReducer,        // list of chat entries for current open chat
    chatCount: ChatCountReducer,            // count of delivered chat entries
    chatDelivered: ChatDeliveredReducer,    // last delivered chat entry (may be null)

    /** SPACE MEMBERS */
    members: MembersReducer,                // list of members for current space
    member: MemberReducer,                  // current open member on panel

    followers: FollowersReducer,
    followees: FolloweesReducer,
    authorization: AuthorizationReducer,
    request: CreateUserReducer,
    logindata: LoginDataReducer,
    homedata: HomeDataReducer,
    genericdata: GenericDataReducer,
    spaces: SpacesReducer,
    events: EventsReducer,
    shops: ShopsReducer,
    media: MediaReducer,
    configuration: ConfigurationReducer,
    search: SearchReducer,
    widgets: WidgetReducer,
    page: PageReducer,
    localconfig: LocalConfigReducer,
    error: ErrorReducer,
    userdata: UserdataReducer,
});

export default rootReducer;