/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [search-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 15.01.20, 16:06
 */

import {SEARCH_GLOBAL} from "../actions/spaces";
import {ACTIVATE_USER, BLOCK_USER, DELETE_USER} from "../actions/superuser";

export function SearchReducer(state = [], action) {

    switch (action.type) {
        case SEARCH_GLOBAL:
            return action.result;

        case BLOCK_USER:
            return state.map(user => user.username === action.user.username ?
                composeSearchUser(action.user) : user
            );

            case ACTIVATE_USER:
            return state.map(user => user.username === action.user.username ?
                composeSearchUser(action.user) : user);

        case DELETE_USER:
            return state.filter(user => user.user !== action.user.username);

        default:
            return state;
    }

}

const composeSearchUser = (user) => {
  return {
      name: `${user.firstname} ${user.lastname}`,
      avatar: user.avatar,
      state: user.state,
      type: 'USER',
      url: `/${user.username}/home`,
      username: user.username
  }
};