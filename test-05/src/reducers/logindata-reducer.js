/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [userdata-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 24.07.18 16:33
 */

import {
    FETCH_LOGINDATA,
    UPDATE_LOGINDATA,
    UPDATE_LOGINDATA_ACCOUNT,
    UPDATE_LOGINDATA_ADDRESS,
    UPDATE_SURROGATEDATA
} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case FETCH_LOGINDATA:
            return {status: 'success', payload: action.userdata};

        case UPDATE_LOGINDATA:
            return {status: 'updated', payload: action.logindata};

        case UPDATE_LOGINDATA_ACCOUNT: {
            const payload = Object.assign({}, state.payload);
            payload.user = action.user;
            return {status: 'updated', payload: payload};
        }

        case UPDATE_LOGINDATA_ADDRESS: {
            const payload = Object.assign({}, state.payload);
            payload.userdata = action.userdata;
            return {status: 'updated', payload: payload};
        }

        default:
            return state;
    }
}
