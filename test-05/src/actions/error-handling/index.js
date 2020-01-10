/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [error-handling.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 10.01.20, 11:27
 */

import axios from 'axios';
import toastr from "../../../node_modules/toastr/toastr";

import {environment as env} from "../environment";
import {getBearer, refreshConfig, saveBearer} from "../local-storage";
import {logoutRequest} from "../index";

export const FLAG_ERROR = 'FLAG_ERROR';
export const RESET_ERROR = 'ACK_ERROR';
export const TOKEN_EXPIRED = 11;

export function asyncHandleError(error, retry) {
    return dispatch => {

        const {data} = error ? error.response : {};
        if(data && data.errorCode === TOKEN_EXPIRED) {
            dispatch(asyncRefreshToken(retry));

        } else if (data) {
            console.log('ERROR', data);
            toastr.error(`Status(${data.status}) ${data.error}. ${data.message}. `);

            if(data.status >= 300) {
                dispatch(flagError(data));
            }

            if(data.status === 404) {
                window.location = `/page-not-found/?status=${data.status}&error=${data.error}&message=${data.message}`;

            } else {
                window.location = `/error-page?status=${data.status}&error=${data.error}&message=${data.message}`;
            }

        } else {
            toastr.error(`Fatal System error. ${error}`);
        }
    }
}

/* only in auth mode */
function asyncRefreshToken(retry) {
    return dispatch => {
        axios.get(`${env.ROOT_SERVER_URL}/public/token`, refreshConfig())
        .then(response => {
            console.log('REFRESH OK', response);
            // const bearer = JSON.parse(localStorage.getItem('bearer'));
            // const refresh = {...bearer, 'token': response.data.token};
            // localStorage.setItem('bearer', JSON.stringify(refresh));

            saveBearer({...getBearer(), 'token': response.data.token});
            retry && retry();
        })
        .catch(error => {

            console.log('SECURITY ERROR, error');
            dispatch(logoutRequest());
        });
    };
}

/* flag last error to interested components (will overwrite older errors) */
export const flagError = (data) => ({type: FLAG_ERROR, data});
export const resetError = (value = false) => ({type: RESET_ERROR, value});
