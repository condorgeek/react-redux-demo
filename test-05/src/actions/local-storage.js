/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [local-storage.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.06.18 15:16
 */
import nJwt from 'njwt';
import {parseJwt} from "./jwt-parser";

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

const SIGNING_KEY= Buffer.from("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "base64");
export function verifyBearer(bearer) {
    try {
        // this is bad since im exposing the signing key in the client..
        const verifiedJwt = nJwt.verify(bearer.token, SIGNING_KEY, 'HS512');
        console.log(verifiedJwt);

    } catch (e) {
        console.log(e);
    }
}

export function saveBearer(bearer) {
    return localStorage.setItem('bearer', JSON.stringify(bearer));
}

export function getBearer() {
    const bearer = JSON.parse(localStorage.getItem('bearer'));
    return bearer ? parseBearer(bearer) : null;
}

export function parseBearer(bearer) {
    const parsed = parseJwt(bearer.token);
    const scopes = parsed.body.scopes ? parsed.body.scopes : [];
    const isSuperUser = scopes.some(scope => scope === 'ROLE_SUPERUSER');

    return {...bearer, scopes: scopes, isSuperUser: isSuperUser};
}

export function isSuperUser(bearer) {
    const parsed = parseJwt(bearer.token);
    return parsed.body.scopes && parsed.body.scopes.some(scope => scope === 'ROLE_SUPERUSER');
}

export function removeBearer() {
    localStorage.removeItem('bearer');
}

/* query temporary site configuration data */
export function getLocalConfiguration() {
    // return JSON.parse(sessionStorage.getItem('configuration'));
    return JSON.parse(localStorage.getItem('configuration'));
}

/* save temporary site configuration data - destroyed when browser tab closed */
export function saveLocalConfiguration(configuration) {
    // sessionStorage.setItem('configuration', JSON.stringify(configuration));
    localStorage.setItem('configuration', JSON.stringify(configuration));
}

export function saveUserSettings(config) {
    let userSettings = JSON.parse(localStorage.getItem('user-settings'));
    userSettings = {...userSettings, ...config};

    localStorage.setItem('user-settings', JSON.stringify(userSettings));
    return userSettings;
}

export function getUserSettings() {
    return JSON.parse(localStorage.getItem('user-settings'));
}
