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
import FriendsReducer, {FriendsPending} from './friends-reducer';
import FollowersReducer from './followers-reducer';
import FolloweesReducer from './followees-reducer';
import LikesReducer, {CommentLikesReducer} from './likes-reducer';
import AuthorizationReducer, {ConfigurationReducer} from './authorization-reducer';
import CreateUserReducer from './create-user-reducer';
import LoginDataReducer from './logindata-reducer';
import SpacesReducer, {EventsReducer, ShopsReducer, MembersReducer,
    MediaReducer, SearchReducer} from './spaces-reducer';
import {HomeDataReducer, GenericDataReducer} from './genericdata-reducer';
import ChatEntriesReducer, {ChatCountReducer} from './chat-reducer';
import WidgetReducer from './widget-reducer';

const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    commentlikes: CommentLikesReducer,
    friends: FriendsReducer,
    pending: FriendsPending,
    chatEntries: ChatEntriesReducer,
    chatCount: ChatCountReducer,
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
    members: MembersReducer,
    media: MediaReducer,
    configuration: ConfigurationReducer,
    search: SearchReducer,
    widgets: WidgetReducer
});

export default rootReducer;