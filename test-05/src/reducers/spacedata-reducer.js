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
    DELETE_MEMBER,
    FETCH_HOMEDATA,
    FETCH_SPACEDATA,
    JOIN_SPACE,
    LEAVE_SPACE,
    UPDATE_HOMEDATA,
    UPDATE_SPACEDATA
} from "../actions/spaces";
import {
    ACCEPT_FRIEND, ADD_FOLLOWEE,
    ADD_FRIEND,
    BLOCK_FRIEND, CANCEL_FRIEND, DELETE_FOLLOWEE,
    DELETE_FRIEND,
    EVENT_FOLLOWER_ADDED,
    EVENT_FOLLOWER_DELETED, IGNORE_FRIEND,
    UNBLOCK_FRIEND
} from "../actions";

export function SpaceDataReducer(state = {}, action) {

    switch (action.type) {
        case FETCH_SPACEDATA:
            return {status: 'success', payload: action.spacedata};

        case UPDATE_SPACEDATA:
            return {status: 'updated', payload: action.spacedata};

        case JOIN_SPACE: {
            const spacedata = Object.assign({}, state.payload);

            if(spacedata.space.id === action.member.space.id) {
                spacedata.isMember = true;
                spacedata.members = spacedata.members + 1;
                spacedata.member = action.member;

                return Object.assign(state, {payload: spacedata});
            }
            return state;
        }

        case LEAVE_SPACE: {
            const spacedata = Object.assign({}, state.payload);

            if(spacedata.space.id === action.member.space.id) {
                spacedata.isMember = false;
                spacedata.members = spacedata.members - 1;
                spacedata.member = null;

                return Object.assign(state, {payload: spacedata});
            }
            return state;
        }

        case DELETE_MEMBER: {
            const spacedata = Object.assign({}, state.payload);
            spacedata.members = spacedata.members - 1;
            return Object.assign(state, {payload: spacedata});
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