/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [member-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 28.02.20, 19:25
 */

import {FETCH_USERDATA, LOCAL_MEMBER_PROFILE} from "../actions";

export const MemberReducer = (state=null, action) => {
    switch(action.type) {
        case LOCAL_MEMBER_PROFILE:
            return action.member;
        default:
            return state;
    }
};

export const UserdataReducer = (state={}, action) => {
    switch(action.type) {
        case FETCH_USERDATA:
            return action.userdata;
        default:
            return state;
    }
};
