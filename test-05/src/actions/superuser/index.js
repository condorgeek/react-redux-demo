/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [index.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 14.01.20, 17:23
 */
import axios from 'axios';

import {environment as env} from "../environment";
import {authConfig} from "../local-storage";
import {asyncHandleError} from "../error-handling";

export const BLOCK_USER = 'BLOCK_USER';
export const ACTIVATE_USER = 'ACTIVATE_USER';
export const DELETE_USER = 'DELETE_USER';


/* ROLE_SUPERUSER */
export function asyncBlockUser(username, callback) {

    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/user/block`, {}, authConfig())
        .then(response => {
            dispatch(blockUser(response.data))
        })
        .catch(error => {
            dispatch(asyncHandleError(error, () => dispatch(asyncBlockUser(username, callback))));
        });
    };

    function blockUser(user) {callback && callback(user); return {type: BLOCK_USER, user}}
}

/* ROLE_SUPERUSER */
export function asyncActivateUser(username, callback) {

    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/user/activate`, {}, authConfig())
        .then(response => {
            dispatch(activateUser(response.data))
        })
        .catch(error => {
            dispatch(asyncHandleError(error, () => dispatch(asyncActivateUser(username, callback))));
        });
    };

    function activateUser(user) {callback && callback(user); return {type: ACTIVATE_USER, user}}
}

/* ROLE_SUPERUSER */
export function asyncDeleteUser(username, callback) {

    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/user/delete`, {}, authConfig())
        .then(response => {
            dispatch(deleteUser(response.data))
        })
        .catch(error => {
            dispatch(asyncHandleError(error, () => dispatch(asyncDeleteUser(username, callback))));
        });
    };

    function deleteUser(user) {callback && callback(user); return {type: DELETE_USER, user}}
}