/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [space-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 23.10.18 17:43
 */

import {FETCH_SPACES} from "../actions/spaces";

export default function (state = [], action) {
    switch (action.type) {

        case FETCH_SPACES:
            return action.payload;

        default:
            return state;
    }
}
