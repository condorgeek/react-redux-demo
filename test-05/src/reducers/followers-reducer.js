/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [followers-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.09.18 18:42
 */

import {
    BLOCK_FOLLOWER,
    UNBLOCK_FOLLOWER,
    FETCH_FOLLOWERS,
    EVENT_FOLLOWER_ADDED,
    EVENT_FOLLOWER_DELETED
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWERS:
            return Object.assign([], action.payload.data);

        case BLOCK_FOLLOWER:
            return Object.assign([], action.payload.data);

        case UNBLOCK_FOLLOWER:
            return Object.assign([], action.payload.data);

        case EVENT_FOLLOWER_ADDED:
            return [...state, Object.assign([], action.follower)];

        case EVENT_FOLLOWER_DELETED:
            const active = state.filter( follower => { return follower.id !==  action.follower.id });
            return Object.assign([], active);

        default:
            return state;
    }
}