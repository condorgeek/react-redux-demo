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
import {asyncHandleError, LOGIN_VALIDATE, ROOT_USER_URL, UPDATE_SPACEDATA} from "./index";

/* spaces and members */
export const FETCH_GENERIC = 'FETCH_GENERIC';
export const CREATE_GENERIC = 'CREATE_GENERIC';
export const DELETE_GENERIC = 'DELETE_GENERIC';
export const BLOCK_GENERIC = 'BLOCK_GENERIC';
export const UNBLOCK_GENERIC = 'UNBLOCK_GENERIC';

export const FETCH_EVENT = 'FETCH_EVENT';
export const CREATE_EVENT = 'CREATE_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const BLOCK_EVENT = 'BLOCK_EVENT';
export const UNBLOCK_EVENT = 'UNBLOCK_EVENT';

export const FETCH_SHOP = 'FETCH_SHOP';
export const CREATE_SHOP = 'CREATE_SHOP';
export const DELETE_SHOP = 'DELETE_SHOP';
export const BLOCK_SHOP = 'BLOCK_SHOP';
export const UNBLOCK_SHOP = 'UNBLOCK_SHOP';

export const FETCH_MEMBERS = 'FETCH_MEMBERS';
export const JOIN_SPACE = 'JOIN_SPACE';
export const LEAVE_SPACE = 'LEAVE_SPACE';

export const ADD_MEMBER = 'ADD_MEMBER'; /*@deprecated*/
export const DELETE_MEMBER = 'DELETE_MEMBER'; /*@deprecated*/

export const GENERIC_SPACE = 'GENERIC';
export const GENERIC_SPACE_ALT = 'SPACE';
export const EVENT_SPACE = 'EVENT';
export const SHOP_SPACE = 'SHOP';

export const PUBLIC_ACCESS = 'PUBLIC';
export const RESTRICTED_ACCESS = 'RESTRICTED';

export const STATE_ACTIVE = 'ACTIVE';
export const STATE_BLOCKED = 'BLOCKED';
export const STATE_REQUESTING = 'REQUESTING';
export const STATE_REQUESTED = 'REQUESTED';

export const ACTION_DELETE_MEMBER = 'ACTION_DELETE_MEMBER';
export const ACTION_LEAVE_SPACE = 'ACTION_LEAVE_SPACE';
export const ACTION_JOIN_SPACE = 'ACTION_JOIN_SPACE';

/* type one of GENERIC|EVENT|SHOP */
export function asyncFetchSpaces(username, type) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/spaces/${type}`, authConfig())
            .then(response => {
                dispatch(fetchSpaces(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchSpaces(username, type))));
            })
    };

    function fetchSpaces(response) {
        return {type: `FETCH_${type.toUpperCase()}`,  payload: response.data }}
}

/* type one of GENERIC|EVENT|SHOP */
export function asyncCreateSpace(username, type, values) {
    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/space/${type}/create`, values, authConfig())
            .then(response => {
                dispatch(createSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateSpace(username, type, values))));
            })
    };

    function createSpace(response) {return {type: `CREATE_${type.toUpperCase()}`, payload: response.data }}
}

export function asyncDeleteSpace(username, type, spaceId, callback) {
    return dispatch => {
        axios.delete(`${ROOT_USER_URL}/${username}/space/${spaceId}/delete`, authConfig())
            .then(response => {
                dispatch(deleteSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteSpace(username, type, spaceId, callback))));
            })
    };

    function deleteSpace(response) {
        callback && callback(response.data); return {type: `DELETE_${type.toUpperCase()}`, payload: response.data }}
}

export function asyncBlockSpace(username, type, spaceId) {
    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/space/${spaceId}/block`, authConfig())
            .then(response => {
                dispatch(blockSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncBlockSpace(username, type, spaceId))));
            })
    };

    function blockSpace(response) {return {type: `BLOCK_${type.toUpperCase()}`, payload: response.data }}
}

export function asyncUnblockSpace(username, type, spaceId) {
    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/space/${spaceId}/block`, authConfig())
            .then(response => {
                dispatch(unblockSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncUnblockSpace(username, type, spaceId))));
            })
    };

    function unblockSpace(response) {return {type: `UNBLOCK_${type.toUpperCase()}`, payload: response.data }}
}

export function asyncFetchMembers(username, spaceId) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/space/${spaceId}/members`, authConfig())
            .then(response => {
                dispatch(fetchMembers(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchMembers(username, spaceId))));
            })
    };

    function fetchMembers(response) {return {type: FETCH_MEMBERS, payload: response.data }}
}

export function asyncJoinSpace(username, spaceId, callback) {
    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/space/${spaceId}/join`, {}, authConfig())
            .then(response => {
                dispatch(joinSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncJoinSpace(username, spaceId, callback))));
            })
    };

    function joinSpace(response) {callback && callback(response.data); return {type: JOIN_SPACE, payload: response.data }}
}

export function asyncLeaveSpace(username, spaceId, memberId, callback) {
    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/space/${spaceId}/leave/${memberId}`, {}, authConfig())
            .then(response => {
                dispatch(leaveSpace(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncLeaveSpace(username, spaceId, memberId, callback))));
            })
    };

    function leaveSpace(response) {callback && callback(response.data); return {type: LEAVE_SPACE, payload: response.data }}
}

export function asyncDeleteMember(username, spaceId, memberId, callback) {
    return dispatch => {
        axios.delete(`${ROOT_USER_URL}/${username}/space/${spaceId}/delete/${memberId}`, authConfig())
            .then(response => {
                dispatch(deleteMember(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteMember(username, spaceId, memberId, callback))));
            })
    };

    function deleteMember(response) {callback && callback(response.data); return {type: DELETE_MEMBER, payload: response.data }}
}

/* local update (no server intervention) */
export function updateSpaceData(data) {
    const spacedata = Object.assign({}, data);

    return {type: UPDATE_SPACEDATA, spacedata};
}

/* local update (no server intervention) */
export function updateCreateSpace(space) {
    const data = Object.assign({}, space);

    return {type: `CREATE_${space.type}`, payload: data};
}

/* local update (no server intervention) */
export function updateDeleteSpace(space) {
    const data = Object.assign({}, space);

    return {type: `DELETE_${space.type}`, payload: data};
}



