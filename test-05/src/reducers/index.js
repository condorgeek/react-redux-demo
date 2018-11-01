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
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';
import FriendsReducer, {FriendsPending} from './friends-reducer';
import FollowersReducer from './followers-reducer';
import FolloweesReducer from './followees-reducer';
import LikesReducer, {CommentLikesReducer} from './likes-reducer';
import AuthorizationReducer from './authorization-reducer';
import CreateUserReducer from './create-user-reducer';
import UserDataReducer from './userdata-reducer';
import SpacesReducer, {EventsReducer, ShopsReducer} from './spaces-reducer';
import SpaceDataReducer from './spacedata-reducer';
import ChatEntriesReducer, {ChatCountReducer} from './chat-reducer';

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
    userdata: UserDataReducer,
    spaces: SpacesReducer,
    events: EventsReducer,
    shops: ShopsReducer,
    spacedata: SpaceDataReducer,
    form: formReducer
});

export default rootReducer;