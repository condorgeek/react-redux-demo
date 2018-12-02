/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [posts-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.05.18 13:29
 */

import {FETCH_POSTS, HIDE_POST, DELETE_POST, CREATE_POST, SHARE_POST} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_POSTS:
            return action.posts;

        case CREATE_POST:
            return [Object.assign([], action.post), ...state];

        case DELETE_POST:
        case HIDE_POST:
            return state.filter(post => {return post.id !== action.post.id});

        case SHARE_POST:
            console.log(SHARE_POST, action.post);

            return state;

        default:
            return state;
    }
}