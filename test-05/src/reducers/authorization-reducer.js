/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [authorization-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.09.18 12:07
 */

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGIN_CONNECT,
    FETCH_CONFIGURATION,
    LOGIN_ANONYMOUS,
    LOGIN_STATUS_REQUEST,
    LOGIN_STATUS_SUCCESS,
    LOGIN_STATUS_ERROR,
    LOGIN_STATUS_ANONYMOUS, LOGIN_STATUS_LOGOUT, LOGIN_STATUS_CONNECT
} from "../actions";
import {getBearer} from "../actions/bearer-config";

const bearer = getBearer();
const initial = bearer ? {status: LOGIN_STATUS_CONNECT, user: {username: bearer.username}} :
    {status: LOGIN_STATUS_ANONYMOUS, user: {username: 'public'}};

// ((bearer) => {
//     if(bearer) {
//         console.log('RECONNECTING', bearer.username);
//         stompClient.connect(bearer.username);
//     }
// })(bearer);

export default function (state = initial, action) {

    switch (action.type) {
        case LOGIN_REQUEST:
            return {status: LOGIN_STATUS_REQUEST, user: null, isAuthorized: false};

        case LOGIN_SUCCESS:
            // stompClient.connect(action.user.username);
            return {status: LOGIN_STATUS_SUCCESS, user: action.user, isAuthorized: true};

        case LOGIN_FAILURE:
            return {status: LOGIN_STATUS_ERROR, user: null, isAuthorized: false, error: action.error};

        case LOGOUT_REQUEST:
            return {status: LOGIN_STATUS_LOGOUT, user: null, isAuthorized: false};

        case LOGIN_CONNECT:
            return {...state, status: LOGIN_STATUS_SUCCESS, isAuthorized: true};

        case LOGIN_ANONYMOUS:
            return {status: LOGIN_STATUS_ANONYMOUS, user: action.user, isAuthorized: false};

        // case LOGIN_VALIDATE:
        //     nothing

        default:
            return state;
    }
}

export function ConfigurationReducer(state = null, action) {

    switch (action.type) {
        case FETCH_CONFIGURATION:
            return action.configuration;

        default:
            return state;
    }

}