/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [create-user-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.07.18 19:34
 */

import {CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case CREATE_USER_REQUEST:
            return {status: 'request', user: null};

        case CREATE_USER_SUCCESS:
            return {status: 'success', user: action.user};

        case CREATE_USER_FAILURE:
            return {status: 'error', user: null, error: action.error};

        default:
            return state;
    }
}