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

import {FETCH_LOGINDATA, UPDATE_LOGINDATA, UPDATE_SURROGATEDATA} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case FETCH_LOGINDATA:

            console.log('FETCH_LOGINDATA', action);

            return {status: 'success', payload: action.userdata};

        case UPDATE_LOGINDATA:
            return {status: 'updated', payload: action.logindata};

        default:
            return state;
    }
}
