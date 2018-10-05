/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [comments-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 09.05.18 14:37
 */

import {FETCH_COMMENTS, CREATE_COMMENT} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case FETCH_COMMENTS:
            return  {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        case CREATE_COMMENT:
            state[action.meta.id].unshift(action.payload.data);
            return {...state, [action.meta.id]: Object.assign([], state[action.meta.id])};

        default:
            return state;
    }

}

