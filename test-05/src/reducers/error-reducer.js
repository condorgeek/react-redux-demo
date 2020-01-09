/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [error-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 09.01.20, 14:10
 */

import {FLAG_ERROR, RESET_ERROR} from "../actions";

const ErrorReducer = (state = {}, action) => {

  switch(action.type) {
      case FLAG_ERROR:
          return {dirty: true, data: action.data};

      case RESET_ERROR:
          return {...state, dirty: action.value};

      default:
          return state;
  }
};

export default ErrorReducer;