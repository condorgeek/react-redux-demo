/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [likes-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 14.05.18 14:18
 */

import {CREATE_LIKE, CREATE_COMMENT_LIKE, REMOVE_LIKE, REMOVE_COMMENT_LIKE} from "../actions";

export default function LikesReducer(state = {}, action) {

    switch (action.type) {

        case CREATE_LIKE:
            if( state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};


        case REMOVE_LIKE:
            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        default:
            return state;
    }

}

export function CommentLikesReducer(state = {}, action) {
    switch (action.type) {

        case CREATE_COMMENT_LIKE:
            if( state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        case REMOVE_COMMENT_LIKE:
            console.log('REMOVE_COMMENT_LIKE', action);

            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        default:
            return state;
    }
}

