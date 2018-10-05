/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [contacts-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 04.04.18 15:15
 */

import {FETCH_CONTACTS} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case FETCH_CONTACTS:
            return Object.assign([], action.payload);

        default:
            return state;

    }
}