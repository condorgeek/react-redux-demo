/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [jwt-parser.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 13.03.19 15:34
 */

function base64urlEncode(data) {
    const str = typeof data === 'number' ? data.toString() : data;
    return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64urlUnescape(str) {
    str += new Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
}

function safeJsonParse(input) {
    var result;
    try{
        result = JSON.parse(Buffer.from(base64urlUnescape(input),'base64'));
    }catch(e){
        return e;
    }
    return result;
}

export function parseJwt(jwtString){
    var segments = jwtString.split('.');

    if(segments.length<2 || segments.length>3){
        return {header: null, body: null};
    }

    var header = safeJsonParse(segments[0]);
    var body = safeJsonParse(segments[1]);

    if(header instanceof Error){
        return {header: null, body: null};
    }
    if(body instanceof Error){
        return {header: null, body: null};
    }

    return {header: header, body: body};
}
