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
import {PublicEventsReducer, PublicSpacesReducer, ViewEventsReducer, ViewSpacesReducer} from "./fetch-public-spaces";

const rootReducer = combineReducers({
    configuration: ConfigurationReducer,
    localconfig: LocalConfigReducer,
    authorization: AuthorizationReducer,
    logindata: LoginDataReducer,

    /** POSTS (comments, likes) **/
    posts: PostsReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    commentLikes: CommentLikesReducer,

    /** FRIENDS/ CHAT */
    friends: FriendsReducer,                // list of all friends for logged in user
    pending: FriendsPending,                // list of pending requests for friendship
    friend: FriendChatReducer,              // current open friend on chat
    chatEntries: ChatEntriesReducer,        // list of chat entries for current open chat
    chatCount: ChatCountReducer,            // count of delivered chat entries
    chatDelivered: ChatDeliveredReducer,    // last delivered chat entry (may be null)

    /** SPACE MEMBERS */
    members: MembersReducer,                // list of members for current space
    member: MemberReducer,                  // current open member on panel

    /** FOLLOWERS (@deprecated) **/
    followers: FollowersReducer,
    followees: FolloweesReducer,

    /** SPACE DATA **/
    homedata: HomeDataReducer,
    genericdata: GenericDataReducer,
    userdata: UserdataReducer,

    /** OWNER SPACES **/
    spaces: SpacesReducer,                  // authorized user specific spaces (own or joined)
    events: EventsReducer,                  // authorized specific events (own or joined)
    shops: ShopsReducer,                    // authorized user specific shops (own or joined)

    /** 3D PARTY USER SPACES **/
    viewSpaces: ViewSpacesReducer,          // spaces specific to a user (not authorized user)
    viewEvents: ViewEventsReducer,          // events specific to a user (not authorized user)

    /** PUBLIC SPACES **/
    publicSpaces: PublicSpacesReducer,      // spaces from public user
    publicEvents: PublicEventsReducer,      // events from public user

    media: MediaReducer,
    request: CreateUserReducer,
    search: SearchReducer,
    widgets: WidgetReducer,
    page: PageReducer,
    error: ErrorReducer,
});

export default rootReducer;