/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [followees-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.09.18 19:00
 */

import {
    ADD_FOLLOWEE,
    DELETE_FOLLOWEE,
    EVENT_FOLLOWER_BLOCKED,
    EVENT_FOLLOWER_UNBLOCKED,
    FETCH_FOLLOWEES
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWEES:
            return Object.assign([], action.followees);

        case ADD_FOLLOWEE:

            console.log(ADD_FOLLOWEE, action.followee);

            return [...state, Object.assign([], action.followee)];

        case DELETE_FOLLOWEE:

            console.log(DELETE_FOLLOWEE, action.followee);

            return Object.assign([], state.filter(followee => followee.id !== action.followee.id));

        // actually followee..
        case EVENT_FOLLOWER_BLOCKED:
        case EVENT_FOLLOWER_UNBLOCKED:
            return state.map(follower => {
                return follower.id === action.follower.id ? {...follower, ...action.follower} : follower;
            });

        default:
            return state;
    }
}