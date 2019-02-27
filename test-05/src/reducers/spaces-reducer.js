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
    FETCH_GENERIC,
    CREATE_GENERIC,
    FETCH_EVENT,
    CREATE_EVENT,
    FETCH_SHOP,
    CREATE_SHOP,
    DELETE_GENERIC,
    DELETE_EVENT,
    DELETE_SHOP,
    FETCH_MEMBERS,
    JOIN_SPACE,
    LEAVE_SPACE,
    DELETE_MEMBER,
    FETCH_SPACE_MEDIA,
    LOCAL_DELETE_MEDIA,
    LOCAL_ADD_MEDIA,
    LOCAL_UPDATE_MEDIA, FETCH_MEMBERS_PAGE, SEARCH_GLOBAL, REORDER_SPACE_RANKING
} from "../actions/spaces";

export default function (state = [], action) {
    switch (action.type) {

        case FETCH_GENERIC:
            return action.payload;

        case CREATE_GENERIC:
            return [...state, Object.assign([], action.space)];

        case DELETE_GENERIC:
            return state.filter(space => space.id !== action.space.id);

        case REORDER_SPACE_RANKING:
            /* do nothing at the moment - actions.spaces = new reordered spaces */
            return state;

        default:
            return state;
    }
}

export function EventsReducer(state = [], action) {
    switch (action.type) {

        case FETCH_EVENT:
            return action.payload;

        case CREATE_EVENT:
            return [...state, Object.assign([], action.space)];

        case DELETE_EVENT:
            return state.filter(space => space.id !== action.space.id);

        default:
            return state;
    }
}

export function ShopsReducer(state = [], action) {
    switch (action.type) {

        case FETCH_SHOP:
            return action.payload;

        case CREATE_SHOP:
            return [...state, Object.assign([], action.space)];

        case DELETE_SHOP:
            return state.filter(space => space.id !== action.space.id);

        default:
            return state;
    }
}

export function MembersReducer(state = [], action) {
    switch (action.type) {

        case FETCH_MEMBERS:
            return action.payload;

        case FETCH_MEMBERS_PAGE:
            if(action.page.first) {
                return action.page.content;
            }
            return [...state, ...action.page.content];

        case JOIN_SPACE:
            return [...state, Object.assign([], action.member)];

        case LEAVE_SPACE:
            return state.filter(member => member.id !== action.member.id);

        case DELETE_MEMBER:
            return state.filter(member => member.id !== action.member.id);

        default:
            return state;
    }
}

export function MediaReducer(state = [], action) {
    switch (action.type) {

        case FETCH_SPACE_MEDIA:
            return action.media;

        case LOCAL_DELETE_MEDIA:
            /* media is an array of media */
            return state.filter(media => {
                return action.media.every(m => m.id !== media.id);
            });

        case LOCAL_UPDATE_MEDIA:
            /* media is an array of media */
            return [...action.media, ...state];

        default:
            return state;
    }
}

export function SearchReducer(state = [], action) {

    switch (action.type) {
        case SEARCH_GLOBAL:
            return action.result;

        default:
            return state;
    }
}
