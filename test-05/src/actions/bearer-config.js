/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [bearer-config.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.06.18 15:16
 */

export function authConfig() {
    return  {
        headers: {...authHeader(), 'X-Requested-With': 'XMLHttpRequest'}
    };
}

export function refreshConfig() {
    return  {
        headers: {...refreshHeader(), 'X-Requested-With': 'XMLHttpRequest'}
    };
}

export function authHeader() {
    const bearer = JSON.parse(localStorage.getItem('bearer'));


    if (bearer && bearer.token) {
        return { 'Authorization': 'Bearer ' + bearer.token };
    } else {
        return {};
    }
}

export function refreshHeader() {
    const bearer = JSON.parse(localStorage.getItem('bearer'));

    if (bearer && bearer.refreshToken) {
        return {'Authorization': 'Bearer ' + bearer.refreshToken};
    } else {
        return {};
    }
}