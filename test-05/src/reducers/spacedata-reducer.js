/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [spacedata-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.07.18 13:38
 */

import {FETCH_HOMEDATA, FETCH_SPACEDATA, UPDATE_HOMEDATA, UPDATE_SPACEDATA} from "../actions/spaces";
import {EVENT_FOLLOWER_ADDED, EVENT_FOLLOWER_DELETED} from "../actions";

export function SpaceDataReducer(state = {}, action) {

    switch (action.type) {
        case FETCH_SPACEDATA:
            return {status: 'success', payload: action.spacedata};

        case UPDATE_SPACEDATA:
            return {status: 'updated', payload: action.spacedata};

        default:
            return state;
    }
}

export function HomeDataReducer(state = {}, action) {

    switch (action.type) {
        case FETCH_HOMEDATA:
            return {status: 'success', payload: action.homedata};

        case UPDATE_HOMEDATA:
            return {status: 'updated', payload: action.homedata};

        case EVENT_FOLLOWER_ADDED:
            const homedata = Object.assign({}, state.payload);
            homedata.followers = homedata.followers + 1;
            return Object.assign(state, {payload: homedata});
            // return {...state, payload: homedata};

        case EVENT_FOLLOWER_DELETED:
            const deleted = Object.assign({}, state.payload);
            deleted.followers = deleted.followers - 1;
            return Object.assign(state, {payload: deleted});

        default:
            return state;
    }
}