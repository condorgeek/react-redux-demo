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

export function isPreAuthorized() {
    return JSON.parse(localStorage.getItem('bearer'));
}

/* query temporary site configuration data */
export function getSiteConfiguration() {
    return JSON.parse(sessionStorage.getItem('configuration'));
}

/* save temporary site configuration data - destroyed when browser tab closed */
export function saveSiteConfiguration(configuration) {
    sessionStorage.setItem('configuration', JSON.stringify(configuration));
}