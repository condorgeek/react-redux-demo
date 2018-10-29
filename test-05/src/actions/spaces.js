/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [spaces.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 23.10.18 17:31
 */

import axios from 'axios';
import {authConfig} from "./bearer-config";
import {asyncHandleError, ROOT_USER_URL} from "./index";

/* spaces and members */
export const FETCH_SPACES = 'FETCH_SPACES';
export const CREATE_SPACE = 'CREATE_SPACE';
export const DELETE_SPACE = 'DELETE_SPACE';
export const CREATE_EVENT = 'CREATE_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const CREATE_SHOP = 'CREATE_SHOP';
export const DELETE_SHOP = 'DELETE_SHOP';
export const FETCH_MEMBERS = 'FETCH_MEMBERS';
export const ADD_MEMBER = 'ADD_MEMBER';
export const DELETE_MEMBER = 'DELETE_MEMBER';


export function asyncFetchSpaces(username) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/spaces`, authConfig())
            .then(response => {
                dispatch(fetchSpaces(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchSpaces(username))));
            })
    };

    function fetchSpaces(response) {return {type: FETCH_SPACES, payload: response.data }}
}

export function asyncCreateSpace(username, values) {
    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/space/create`, values, authConfig())
            .then(response => {
                dispatch(createSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateSpace(username, values))));
            })
    };

    function createSpace(response) {return {type: CREATE_SPACE, payload: response.data }}
}
