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

        if(error && error.response && error.response.data) {
            const {data} = error.response;

            if(data.errorCode === TOKEN_EXPIRED) {
                dispatch(asyncRefreshToken(retry));

            } else {
                // toastr.error(`Status(${data.status}) ${data.error}. ${data.message}. `);

                if(data.status >= 300) {
                    dispatch(flagError(data));
                }
                if(data.status === 401) {
                     // authorization will be handled somewhere else..

                } else if(data.status === 404) {
                    gotoErrorPage('/page-not-found', data);

                } else {
                    gotoErrorPage('/error-page', data);
                }
            }

        } else {
            gotoFatalErrorPage(error);
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

export const gotoErrorPage = (page, data) => {
    console.log('ERROR', data);
    window.location = `${page}/?status=${data.status}&error=${data.error}&message=${data.message}`;
};

export const gotoFatalErrorPage = (error) => {
    console.log('FATAL ERROR', error);
    return gotoErrorPage('/error-page', {status: 400, error: 'System error', message: 'A fatal system error occurred'});
};
