/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [space-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 23.10.18 17:43
 */

import {
    FETCH_GENERIC, CREATE_GENERIC,
    FETCH_EVENT, CREATE_EVENT,
    FETCH_SHOP, CREATE_SHOP,
    DELETE_GENERIC, DELETE_EVENT, DELETE_SHOP
} from "../actions/spaces";

export default function (state = [], action) {
    switch (action.type) {

        case FETCH_GENERIC:
            return action.payload;

        case CREATE_GENERIC:
            return [...state, Object.assign([], action.payload)];

        case DELETE_GENERIC:
            return state.filter(space => space.id !== action.payload.id);

        default:
            return state;
    }
}

export function EventsReducer(state = [], action) {
    switch (action.type) {

        case FETCH_EVENT:
            return action.payload;

        case CREATE_EVENT:
            return [...state, Object.assign([], action.payload)];

        case DELETE_EVENT:
            return state.filter(space => space.id !== action.payload.id);

        default:
            return state;
    }
}

export function ShopsReducer(state = [], action) {
    switch (action.type) {

        case FETCH_SHOP:
            return action.payload;

        case CREATE_SHOP:
            return [...state, Object.assign([], action.payload)];

        case DELETE_SHOP:
            return state.filter(space => space.id !== action.payload.id);

        default:
            return state;
    }
}
