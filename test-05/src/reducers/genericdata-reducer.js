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

import {
    ADD_SPACE_MEDIA,
    DELETE_MEMBER, FETCH_GENERICDATA, FETCH_HOMEDATA, JOIN_SPACE,
    LEAVE_SPACE, UPDATE_GENERICDATA, UPDATE_HOMEDATA, UPDATE_SPACE
} from "../actions/spaces";
import {
    ACCEPT_FRIEND, ADD_FOLLOWEE, ADD_FRIEND, BLOCK_FRIEND, CANCEL_FRIEND,
    DELETE_FOLLOWEE, DELETE_FRIEND, EVENT_FOLLOWER_ADDED, EVENT_FOLLOWER_DELETED,
    IGNORE_FRIEND, UNBLOCK_FRIEND, UPDATE_USERDATA
} from "../actions";

export function GenericDataReducer(state = {}, action) {

    switch (action.type) {
        case FETCH_GENERICDATA:
            return {status: 'success', payload: action.genericdata};

        case UPDATE_GENERICDATA:
            return {status: 'updated', payload: action.genericdata};

        case JOIN_SPACE: {
            const genericdata = Object.assign({}, state.payload);

            if(genericdata.space.id === action.member.space.id) {
                genericdata.isMember = true;
                genericdata.members = genericdata.members + 1;
                genericdata.member = action.member;

                return Object.assign(state, {payload: genericdata});
            }
            return state;
        }

        case LEAVE_SPACE: {
            const genericdata = Object.assign({}, state.payload);

            if(genericdata.space.id === action.member.space.id) {
                genericdata.isMember = false;
                genericdata.members = genericdata.members - 1;
                genericdata.member = null;

                return Object.assign(state, {payload: genericdata});
            }
            return state;
        }

        case DELETE_MEMBER: {
            const genericdata = Object.assign({}, state.payload);
            genericdata.members = genericdata.members - 1;
            return Object.assign(state, {payload: genericdata});
        }

        case UPDATE_SPACE: {
            const genericdata = Object.assign({}, state.payload);
            genericdata.space = action.space;

            return Object.assign(...state, {payload: genericdata});
        }

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

        case UPDATE_USERDATA: {
            const homedata = Object.assign({}, state.payload);
            homedata.userdata = action.userdata;

            return {status: 'updated', payload: homedata};
        }

        case ADD_SPACE_MEDIA: {
            const homedata = Object.assign({}, state.payload);
            homedata.space = action.space;

            return {status: 'updated', payload: homedata};
        }

        case ADD_FRIEND : {
            const homedata = Object.assign({}, state.payload);
            homedata.friend = action.friend;
            homedata.isFriend = true;

            return Object.assign(state, {payload: homedata});
        }

        case DELETE_FRIEND: {
            const homedata = Object.assign({}, state.payload);
            homedata.friends = homedata.friends - 1;
            homedata.friend = null;
            homedata.isFriend = false;

            return Object.assign(state, {payload: homedata});
        }

        case CANCEL_FRIEND: {
            const homedata = Object.assign({}, state.payload);
            homedata.friend = null;
            homedata.isFriend = false;

            return Object.assign(state, {payload: homedata});
        }

        case IGNORE_FRIEND: {
            const homedata = Object.assign({}, state.payload);
            homedata.friend = null;
            homedata.isFriend = false;

            return Object.assign(state, {payload: homedata});
        }

        case ACCEPT_FRIEND: {
            const homedata = Object.assign({}, state.payload);
            homedata.friends = homedata.friends + 1;
            homedata.friend = action.friend;
            homedata.isFriend = true;

            return Object.assign(state, {payload: homedata});
        }

        case BLOCK_FRIEND:
        case UNBLOCK_FRIEND: {
            const homedata = Object.assign({}, state.payload);
            homedata.friend = action.friend;
            homedata.isFriend = true;

            return Object.assign(state, {payload: homedata});
        }

        case ADD_FOLLOWEE: {
            const homedata = Object.assign({}, state.payload);
            homedata.isFollowee = true;
            return Object.assign(state, {payload: homedata});
        }

        case DELETE_FOLLOWEE: {
            const homedata = Object.assign({}, state.payload);
            homedata.isFollowee = false;
            return Object.assign(state, {payload: homedata});
        }

        /* remote friend has added current logged id user as friend */
        case EVENT_FOLLOWER_ADDED: {
            const homedata = Object.assign({}, state.payload);
            homedata.followers = homedata.followers + 1;
            return Object.assign(state, {payload: homedata});
        }

        /* remote friend has deleted current logged id user as friend */
        case EVENT_FOLLOWER_DELETED: {
            const homedata = Object.assign({}, state.payload);
            homedata.followers = homedata.followers - 1;
            return Object.assign(state, {payload: homedata});
        }
        default:
            return state;
    }
}