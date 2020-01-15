/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [user-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 14.01.20, 17:33
 */

import {ACTIVATE_USER, BLOCK_USER, DELETE_USER} from "../actions/superuser";

const UserReducer = (state=null, action) => {
    switch(action.type) {
        case BLOCK_USER:
        case ACTIVATE_USER:
        case DELETE_USER:
            return state; // currently not doing anything with this info
        default:
            return state;
    }
};