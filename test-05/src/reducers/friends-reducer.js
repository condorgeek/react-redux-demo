/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [friends-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.09.18 15:27
 */

import {
    ACCEPT_FRIEND, ADD_FRIEND, BLOCK_FRIEND, CANCEL_FRIEND, DELETE_FRIEND, FETCH_FRIENDS,
    FETCH_FRIENDS_PENDING, IGNORE_FRIEND, EVENT_FRIEND_ACCEPTED, EVENT_FRIEND_IGNORED, EVENT_FRIEND_REQUESTED,
    EVENT_FRIEND_BLOCKED, EVENT_FRIEND_UNBLOCKED, EVENT_FRIEND_DELETED, EVENT_FRIEND_CANCELLED,
    UNBLOCK_FRIEND} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FRIENDS:
            return Object.assign([], action.friends);

        case DELETE_FRIEND:
            return Object.assign([], state.filter(friend => friend.id !== action.friend.id));

        case BLOCK_FRIEND:
            return Object.assign([], action.payload.data);

        case UNBLOCK_FRIEND:
            return Object.assign([], action.payload.data);

        case ACCEPT_FRIEND:
            return [...state, Object.assign([], action.friend)];

        case EVENT_FRIEND_ACCEPTED:
            return [...state, Object.assign([], action.user)];

        case EVENT_FRIEND_BLOCKED:
        case EVENT_FRIEND_UNBLOCKED:
            return state.map(friend => {
                return friend.id === action.user.id ? {...friend, ...action.user} : friend;
            });

        case EVENT_FRIEND_DELETED:
            const active = state.filter( friend => { return friend.id !==  action.user.id });
            return Object.assign([], active);

        default:
            return state;
    }
}

export function FriendsPending (state = [], action) {

    switch (action.type) {

        case ADD_FRIEND:
            return [...state, Object.assign([], action.friend)];

        case FETCH_FRIENDS_PENDING:
            return Object.assign([], action.payload.data);

        case IGNORE_FRIEND:
            return Object.assign([], state.filter(friend => friend.id !== action.friend.id));

        case CANCEL_FRIEND:
            return Object.assign([], state.filter(friend => friend.id !== action.friend.id));

        case ACCEPT_FRIEND:
            const pending = state.filter((friend) => { return friend.id !== action.friend.id });
            return Object.assign([], pending);

        case EVENT_FRIEND_REQUESTED:
            return [...state, Object.assign([], action.user)];

        case EVENT_FRIEND_IGNORED:
        case EVENT_FRIEND_ACCEPTED:
        case EVENT_FRIEND_CANCELLED:
            const pending_msg = state.filter( friend => { return friend.id !==  action.user.id });
            return Object.assign([], pending_msg);

        default:
            return state;
    }
}