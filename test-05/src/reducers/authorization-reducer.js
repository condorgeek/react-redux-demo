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
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGIN_CONNECT,
    FETCH_CONFIGURATION, LOGIN_ANONYMOUS, loginStatus,
} from "../actions";
import {getBearer, getLocalConfiguration, getUserSettings} from "../actions/local-storage";
import {LOCAL_MEDIA_RESIZE, LOCAL_MEDIA_SLIDER} from "../actions/spaces";
import {getPublicUser} from "../actions/environment";

const bearer = getBearer();
const initial = bearer ?
    {status: loginStatus.CONNECT, user: {username: bearer.username, isSuperUser: bearer.isSuperUser}, isAuthorized: true} :
    // {status: LOGIN_STATUS_ANONYMOUS, user: {username: 'public', isSuperUser: false}, isAuthorized: false};
    {status: loginStatus.ANONYMOUS, user: {username: getPublicUser(), isSuperUser: false}, isAuthorized: false};

// ((bearer) => {
//     if(bearer) {
//         verifyBearer(bearer);
//     }
// })(bearer);

export default function (state = initial, action) {

    switch (action.type) {
        case LOGIN_REQUEST:
            return {status: loginStatus.REQUEST, user: null, isAuthorized: false};

        case LOGIN_SUCCESS:
            // stompClient.connect(action.user.username);
            return {status: loginStatus.SUCCESS, user: action.user, isAuthorized: true};

        case LOGIN_FAILURE:
            return {status: loginStatus.ERROR, user: null, isAuthorized: false, error: action.error};

        case LOGOUT_REQUEST:
            return {status: loginStatus.LOGOUT, user: null, isAuthorized: false};

        case LOGIN_CONNECT:
            return {...state, status: loginStatus.SUCCESS, isAuthorized: true};

        case LOGIN_ANONYMOUS:
            return {status: loginStatus.ANONYMOUS, user: action.user, isAuthorized: false};

        // case LOGIN_VALIDATE:
        //     nothing

        default:
            return state;
    }
}

/* configuration coming from server */
export function ConfigurationReducer(state = null, action) {

    switch (action.type) {
        case FETCH_CONFIGURATION:
            return action.configuration ? action.configuration : getLocalConfiguration();

        default:
            return state;
    }

}

/* user settings coming from local storage */
export function LocalConfigReducer(state = {status: 'refresh', config: getUserSettings()}, action) {
    switch (action.type) {

        case LOCAL_MEDIA_RESIZE:
            return {status: 'update', config: action.localconfig};

        case LOCAL_MEDIA_SLIDER:
            return {status: 'slider', config: action.localconfig};

        default:
            return state;
    }
}