/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [fetch-public-spaces.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 15.03.20, 17:21
 */


import {FETCH_EVENT_PUBLIC, FETCH_EVENT_VIEW, FETCH_GENERIC_PUBLIC, FETCH_GENERIC_VIEW} from "../actions/spaces";

export const PublicSpacesReducer = (state=[], action) => {
    switch(action.type) {
        case FETCH_GENERIC_PUBLIC:
        return action.payload;

        default:
            return state;
    }
};

export const PublicEventsReducer = (state=[], action) => {
    switch(action.type) {
        case FETCH_EVENT_PUBLIC:
            return action.payload;

        default:
            return state;
    }
};

/** spaces specific to a view */
export const ViewSpacesReducer = (state=[], action) => {
    switch(action.type) {
        case FETCH_GENERIC_VIEW:
            return action.payload;

        default:
            return state;
    }
};

/** events specific to a view */
export const ViewEventsReducer = (state=[], action) => {
    switch(action.type) {
        case FETCH_EVENT_VIEW:
            return action.payload;

        default:
            return state;
    }
};
