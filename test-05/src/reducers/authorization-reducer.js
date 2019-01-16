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
    FETCH_CONFIGURATION
} from "../actions";
// import stompClient from '../actions/stomp-client';
// import {asyncValidateAuth} from "../actions";


const bearer = JSON.parse(localStorage.getItem('bearer'));
// const initial = bearer ? {status: 'success', user: {username: bearer.username} } : {};
// const initial = bearer ? {status: 'connect', user: {username: bearer.username} } : {};
const initial = bearer ? {status: 'connect', user: {username: bearer.username} } : null;

// ((bearer) => {
//     if(bearer) {
//         console.log('RECONNECTING', bearer.username);
//         stompClient.connect(bearer.username);
//     }
// })(bearer);

export default function (state = initial, action) {

    switch (action.type) {
        case LOGIN_REQUEST:
            return {status: 'request', user: null};

        case LOGIN_SUCCESS:
            // stompClient.connect(action.user.username);
            return {status: 'success', user: action.user};

        case LOGIN_FAILURE:
            return {status: 'error', user: null, error: action.error};

        case LOGOUT_REQUEST:
            return {status: 'logout', user: null};

        case LOGIN_CONNECT:
            return {...state, status: 'success'};

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