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
import {authConfig, isPreAuthorized, saveUserSettings} from "./local-storage";
import {asyncHandleError} from "./error-handling";
import {
    anonymousFetchAnySpaces, anonymousFetchGenericData, anonymousFetchHomeData,
    anonymousFetchMembers, anonymousFetchMembersPage, anonymousFetchPage, anonymousFetchSpaceMedia,
    anonymousFetchSpaces, anonymousFetchWidgets, anonymousSearchGlobal
} from "./anonymous";

import {environment as env} from "./environment";

/* spaces and members actions */

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

/** spaces and events from public user */
export const FETCH_GENERIC_PUBLIC = 'FETCH_GENERIC_PUBLIC';
export const FETCH_EVENT_PUBLIC = 'FETCH_EVENT_PUBLIC';

/** spaces and events for a specific view */
export const FETCH_GENERIC_VIEW = 'FETCH_GENERIC_VIEW';
export const FETCH_EVENT_VIEW = 'FETCH_EVENT_VIEW';

export const FETCH_SHOP = 'FETCH_SHOP';
export const CREATE_SHOP = 'CREATE_SHOP';
export const DELETE_SHOP = 'DELETE_SHOP';
export const BLOCK_SHOP = 'BLOCK_SHOP';
export const UNBLOCK_SHOP = 'UNBLOCK_SHOP';

export const FETCH_WIDGETS = 'FETCH_WIDGETS';
export const CREATE_WIDGET = 'CREATE_WIDGET';
export const DELETE_WIDGET = 'DELETE_WIDGET';
export const UPDATE_WIDGET = 'UPDATE_WIDGET';
export const FETCH_PAGE = 'FETCH_PAGE';
export const CREATE_PAGE = 'CREATE_PAGE';

export const SEARCH_GLOBAL = 'SEARCH_GLOBAL';
export const SEARCH_MEMBERS = 'SEARCH_MEMBERS';
export const SEARCH_USERS = 'SEARCH_USERS';
export const SEARCH_FOLLOWERS = 'SEARCH_FOLLOWERS';

export const FETCH_ANY_SPACES = 'FETCH_ANY_SPACES';
export const FETCH_MEMBERS = 'FETCH_MEMBERS';
export const FETCH_MEMBERS_PAGE = 'FETCH_MEMBERS_PAGE';
export const JOIN_SPACE = 'JOIN_SPACE';
export const LEAVE_SPACE = 'LEAVE_SPACE';
export const UPDATE_SPACE = 'UPDATE_SPACE';
export const REORDER_SPACE_RANKING = 'REORDER_SPACE_RANKING';
export const ASSIGN_SPACE_CHILDREN = 'ASSIGN_SPACE_CHILDREN';

export const FETCH_SPACEDATA = 'FETCH_SPACEDATA';
export const UPDATE_SPACEDATA = 'UPDATE_SPACEDATA';
export const FETCH_HOMEDATA = 'FETCH_HOMEDATA';
export const UPDATE_HOMEDATA = 'UPDATE_HOMEDATA';
export const FETCH_GENERICDATA = 'FETCH_GENERICDATA';
export const UPDATE_GENERICDATA = 'UPDATE_GENERICDATA';

export const FETCH_SPACE_MEDIA = 'FETCH_SPACE_MEDIA';

export const ADD_SPACE_MEDIA = 'ADD_SPACE_MEDIA';
export const ADD_GENERIC_MEDIA = 'ADD_GENERIC_MEDIA';

export const CONTEXT_USER_SPACE = 'undefined';
export const CONTEXT_PUBLIC_SPACE = 'PUBLIC';
export const CONTEXT_VIEW_SPACE = 'VIEW';

/* generic constants */

export const ADD_MEMBER = 'ADD_MEMBER'; /*@deprecated*/
export const DELETE_MEMBER = 'DELETE_MEMBER'; /*@deprecated*/

export const GENERIC_SPACE = 'GENERIC';
export const HOME_SPACE = 'HOME';
export const EVENT_SPACE = 'EVENT';
export const SHOP_SPACE = 'SHOP';

export const PUBLIC_ACCESS = 'PUBLIC';
export const RESTRICTED_ACCESS = 'RESTRICTED';

export const STATE_ACTIVE = 'ACTIVE';
export const STATE_BLOCKED = 'BLOCKED';
export const STATE_REQUESTING = 'REQUESTING';
export const STATE_REQUESTED = 'REQUESTED';

export const LOCAL_DELETE_MEDIA = 'LOCAL_DELETE_MEDIA';
export const LOCAL_ADD_MEDIA = 'LOCAL_ADD_MEDIA';
export const LOCAL_UPDATE_MEDIA = 'LOCAL_UPDATE_MEDIA';
export const LOCAL_MEDIA_RESIZE = 'LOCAL_MEDIA_RESIZE';
export const LOCAL_MEDIA_SLIDER = 'LOCAL_MEDIA_SLIDER';

/* tooltip actions */
export const ACTION_ADD_FRIEND = 'ACTION_ADD_FRIEND';
export const ACTION_DELETE_FRIEND = 'ACTION_DELETE_FRIEND';
export const ACTION_CANCEL_FRIEND = 'ACTION_CANCEL_FRIEND';
export const ACTION_IGNORE_FRIEND = 'ACTION_IGNORE_FRIEND';
export const ACTION_ACCEPT_FRIEND = 'ACTION_ACCEPT_FRIEND';
export const ACTION_BLOCK_FRIEND = 'ACTION_BLOCK_FRIEND';
export const ACTION_UNBLOCK_FRIEND = 'ACTION_UNBLOCK_FRIEND';

export const ACTION_ADD_FOLLOWEE = 'ACTION_ADD_FOLLOWEE';
export const ACTION_DELETE_FOLLOWEE = 'ACTION_DELETE_FOLLOWEE';

export const ACTION_DELETE_MEMBER = 'ACTION_DELETE_MEMBER';
export const ACTION_LEAVE_SPACE = 'ACTION_LEAVE_SPACE';
export const ACTION_JOIN_SPACE = 'ACTION_JOIN_SPACE';


export function asyncFetchWidgets(username, position) {
    return isPreAuthorized() ? authFetchWidgets(username, position) :
        anonymousFetchWidgets(username, position);
}

export function authFetchWidgets(username, position) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/widgets`, authConfig())
        .then(response => {
            dispatch(fetchWidgets(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, ()=> dispatch(authFetchWidgets(username, position))))
        })
    };

    function fetchWidgets(widgets) {return {type: FETCH_WIDGETS, widgets}}
}

export function asyncCreateWidget(username, type, values, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/widgets/${type.toLowerCase()}/create`, values, authConfig())
        .then(response => {
            dispatch(createWidget(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, ()=> dispatch(asyncCreateWidget(username, type, values, callback))))
        })
    };

    function createWidget(widget) {callback && callback(widget); return {type: CREATE_WIDGET, widget}}
}

export function asyncDeleteWidget(username, widgetId, callback) {
    return dispatch => {
        axios.delete(`${env.ROOT_USER_URL}/${username}/widgets/${widgetId}/delete`, authConfig())
        .then(response => {
            dispatch(deleteWidget(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, ()=> dispatch(asyncDeleteWidget(username, widgetId, callback))))
        })
    };

    function deleteWidget(widget) {callback && callback(widget); return {type: DELETE_WIDGET, widget}}
}

export function asyncUpdateWidget(username, widgetId, values, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/widgets/${widgetId}/update`, values, authConfig())
        .then(response => {
            dispatch(updateWidget(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateWidget(username, widgetId, values, callback))))
        })
    };

    function updateWidget(widget) {callback && callback(widget); return {type: UPDATE_WIDGET, widget}}
}


export function asyncFetchPage(username, name, callback) {
    return isPreAuthorized() ? authFetchPage(username, name, callback) :
        anonymousFetchPage(username, name, callback);
}

export function authFetchPage(username, name, callback) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/page/${name}`, authConfig())
        .then(response => {
            dispatch(fetchPage(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, ()=> dispatch(authFetchPage(username, name, callback))))
        })
    };

    function fetchPage(page) {callback && callback(page); return {type: FETCH_PAGE, page}}
}

export function asyncFetchGenericData(username, space, callback) {
    return isPreAuthorized() ? authFetchGenericData(username, space, callback) :
        anonymousFetchGenericData(username, space, callback);
}

export function authFetchGenericData(username, space, callback) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/space/${space}`, authConfig())
            .then (response => {
                dispatch(fetchGenericData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncFetchGenericData(username, space, callback))))
            })
    };

    function fetchGenericData(genericdata) {callback && callback(genericdata); return{type: FETCH_GENERICDATA, genericdata}}
}

export function asyncSearchGlobal(username, term, size, callback) {
    return isPreAuthorized() ? authSearchGlobal(username, term, size, callback) :
        anonymousSearchGlobal(username, term, size, callback);
}

export function authSearchGlobal(username, term, size, callback) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/search/${term}/${size}`, authConfig())
        .then(response => {
            dispatch(searchGlobal(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, ()=> dispatch(authSearchGlobal(username, term, size, callback))))
        })
    };

    function searchGlobal(result) {callback && callback(result); return{type: SEARCH_GLOBAL, result}}
}

export function asyncUpdateSpaceCover(username, values, space) {
    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/space/cover/${space}`, values, authConfig())
            .then (response => {
                dispatch(updateGenericData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateSpaceCover(username, values))))
            })
    };

    function updateGenericData(genericdata) {return{type: UPDATE_GENERICDATA, genericdata}}
}

export function asyncFetchHomeData(username, space) {
    return isPreAuthorized() ? authFetchHomeData(username, space) : anonymousFetchHomeData(username, space);
}

export function authFetchHomeData(username, space) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/space/${space}`, authConfig())
            .then (response => {
                dispatch(fetchHomeData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncFetchHomeData(username, space))))
            })
    };

    function fetchHomeData(homedata) {return{type: FETCH_HOMEDATA, homedata}}
}

export function asyncFetchSpaceMedia(username, space) {
    return isPreAuthorized() ? authFetchSpaceMedia(username, space) : anonymousFetchSpaceMedia(username, space);
}

export function authFetchSpaceMedia(username, space) {

    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/posts/media/${space}`, authConfig())
            .then(response => {
                dispatch(fetchMedia(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchSpaceMedia(username, space))));
            });
    };

    function fetchMedia(media) {return {type: FETCH_SPACE_MEDIA, media}}
}

/* space one of home or generic/id, where id is the space id*/
export function asyncUpdateHomeCover(username, values, space) {
    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/space/cover/${space}`, values, authConfig())
            .then (response => {
                dispatch(updateHomeData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateHomeCover(username, values))))
            })
    };

    function updateHomeData(homedata) {return{type: UPDATE_HOMEDATA, homedata}}
}

export function asyncUpdateSpace(username, spaceId, values, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/update`, values, authConfig())
            .then (response => {
                dispatch(updateSpace(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateSpace(username, spaceId, values, callback))))
            })
    };

    function updateSpace(space) {callback && callback(space); return{type: UPDATE_SPACE, space}}
}


/* type one of GENERIC|EVENT|SHOP , context = if defined, one of PUBLIC|VIEW (internal only, no server support) */
/* Ex: FETCH_GENERIC or FETCH_GENERIC_PUBLIC or FETCH_GENERIC_VIEW */
export function asyncFetchSpaces(username, type, context) {
    return isPreAuthorized() ? authFetchSpaces(username, type, context) :
        anonymousFetchSpaces(username, type, context);
}


export function authFetchSpaces(username, type, context) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/spaces/${type}`, authConfig())
        .then(response => {
            dispatch(fetchSpaces(response));
        })
        .catch(error =>{
            dispatch(asyncHandleError(error, () => dispatch(asyncFetchSpaces(username, type, context))));
        })
    };

    function fetchSpaces(response) {
        const contextType = context ? `_${context}` : '';
        return {type: `FETCH_${type.toUpperCase()}${contextType}`,  payload: response.data }}
}

export function asyncFetchAnySpaces(username) {
    return isPreAuthorized() ? authFetchAnySpaces(username) : anonymousFetchAnySpaces(username);
}

export function authFetchAnySpaces(username) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/spaces/*`, authConfig())
            .then(response => {
                dispatch(fetchAnySpaces(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchAnySpaces(username))));
            })
    };

    function fetchAnySpaces(spaces) {return {type: FETCH_ANY_SPACES,  spaces }}
}

/* type one of GENERIC|EVENT|SHOP */
export function asyncCreateSpace(username, type, values, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/space/${type}/create`, values, authConfig())
            .then(response => {
                dispatch(createSpace(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateSpace(username, type, values, callback))));
            })
    };

    function createSpace(space) {callback && callback(space); return {type: `CREATE_${type.toUpperCase()}`, space }}
}

export function asyncDeleteSpace(username, type, spaceId, callback) {
    return dispatch => {
        axios.delete(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/delete`, authConfig())
            .then(response => {
                dispatch(deleteSpace(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteSpace(username, type, spaceId, callback))));
            })
    };

    function deleteSpace(space) {callback && callback(space); return {type: `DELETE_${type.toUpperCase()}`, space }}
}

export function asyncBlockSpace(username, type, spaceId, callback) {
    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/block`, authConfig())
            .then(response => {
                dispatch(blockSpace(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncBlockSpace(username, type, spaceId, callback))));
            })
    };

    function blockSpace(space) {callback && callback(space); return {type: `BLOCK_${type.toUpperCase()}`, space}}
}

export function asyncUnblockSpace(username, type, spaceId, callback) {
    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/block`, authConfig())
            .then(response => {
                dispatch(unblockSpace(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncUnblockSpace(username, type, spaceId, callback))));
            })
    };

    function unblockSpace(space) {callback && callback(space); return {type: `UNBLOCK_${type.toUpperCase()}`, space}}
}

export function asyncFetchMembers(username, spaceId) {
    return isPreAuthorized() ? authFetchMembers(username, spaceId) : anonymousFetchMembers(username, spaceId);
}

export function authFetchMembers(username, spaceId) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/members`, authConfig())
            .then(response => {
                dispatch(fetchMembers(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchMembers(username, spaceId))));
            })
    };

    function fetchMembers(response) {return {type: FETCH_MEMBERS, payload: response.data }}
}

export function asyncFetchMembersPage(username, spaceId, page, size, callback) {
    return isPreAuthorized() ? authFetchMembersPage(username, spaceId, page, size, callback) :
        anonymousFetchMembersPage(username, spaceId, page, size, callback);
}

export function authFetchMembersPage(username, spaceId, page, size, callback) {
    return dispatch => {
        axios.get(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/members/${page}/${size}`, authConfig())
            .then(response => {
                dispatch(fetchMembersPage(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchMembersPage(username, spaceId, page, size, callback))));
            })
    };

    function fetchMembersPage(page) {callback && callback(page); return {type: FETCH_MEMBERS_PAGE, page}}
}

export function asyncJoinSpace(username, spaceId, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/join`, {}, authConfig())
            .then(response => {
                dispatch(joinSpace(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncJoinSpace(username, spaceId, callback))));
            })
    };

    function joinSpace(member) {callback && callback(member); return {type: JOIN_SPACE, member }}
}

export function asyncLeaveSpace(username, spaceId, memberId, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/leave/${memberId}`, {}, authConfig())
            .then(response => {
                dispatch(leaveSpace(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncLeaveSpace(username, spaceId, memberId, callback))));
            })
    };

    function leaveSpace(member) {callback && callback(member); return {type: LEAVE_SPACE, member }}
}

export function asyncLeaveSpaceByUsername(username, spaceId, callback) {
    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/leave`, {}, authConfig())
            .then(response => {
                dispatch(leaveSpace(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncLeaveSpace(username, spaceId, callback))));
            })
    };

    function leaveSpace(member) {callback && callback(member); return {type: LEAVE_SPACE, member }}
}

export function asyncDeleteMember(username, spaceId, memberId, callback) {
    return dispatch => {
        axios.delete(`${env.ROOT_USER_URL}/${username}/space/${spaceId}/delete/${memberId}`, authConfig())
            .then(response => {
                dispatch(deleteMember(response.data));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteMember(username, spaceId, memberId, callback))));
            })
    };

    function deleteMember(member) {callback && callback(member); return {type: DELETE_MEMBER, member }}
}

/* spacepath one of home or generic/{id}, where id is the space id. Action type is resolved on spacepath */
export function asyncAddSpaceMedia(username, spacepath, values, callback) {

    const type = spacepath === 'home' ? ADD_SPACE_MEDIA : ADD_GENERIC_MEDIA;

    return dispatch => {
        axios.post(`${env.ROOT_USER_URL}/${username}/media/add/${spacepath}`, values, authConfig())
        .then(response => {
            dispatch(addSpaceMedia(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, () => dispatch(asyncAddSpaceMedia(username, spacepath, values, callback))));
        })
    };

    function addSpaceMedia(space) {callback && callback(space); return {type: type, space}}
}

/* values array of entries as in {space: <id>, ranking: <ranking>} */
export function asyncReorderSpaceRanking(username, values, callback) {

    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/spaces/ranking`, values, authConfig())
        .then(response => {
            dispatch(reorderRanking(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, () => dispatch(asyncReorderSpaceRanking(username, values, callback))));
        })
    };

    function reorderRanking(spaces) {callback && callback(spaces); return {type: REORDER_SPACE_RANKING, spaces}}
}

export function asyncAssignSpaceChildren(username, spaceId, values, callback) {
    return dispatch => {
        axios.put(`${env.ROOT_USER_URL}/${username}/spaces/${spaceId}/assign`, values, authConfig())
        .then(response => {
            dispatch(assignChildren(response.data));
        })
        .catch(error => {
            dispatch(asyncHandleError(error, () => dispatch(asyncAssignSpaceChildren(username, spaceId, values, callback))));
        })
    };

    function assignChildren(space) {callback && callback(space); return {type: ASSIGN_SPACE_CHILDREN, space}}
}

export function localMediaResize(data) {
    const localconfig = saveUserSettings(data);

    return {type: LOCAL_MEDIA_RESIZE, localconfig}
}

export function localMediaSlider(data) {
    const localconfig = saveUserSettings(data);

    return {type: LOCAL_MEDIA_SLIDER, localconfig}
}

/* local delete */
export function localDeleteMedia(media) {
    /* media is an array of media */
    return {type: LOCAL_DELETE_MEDIA, media}
}

/* local add */
export function localUpdateMedia(media) {
    /* media is an array of media */
    return {type: LOCAL_UPDATE_MEDIA, media}
}

/* local update (no server intervention) */
export function updateGenericData(data) {
    const genericdata = Object.assign({}, data);

    return {type: UPDATE_GENERICDATA, genericdata};
}

/* local update (no server intervention) */
export function updateHomeData(data) {
    const homedata = Object.assign({}, data);

    return {type: UPDATE_HOMEDATA, homedata};
}

/* local update (no server intervention) */
export function updateCreateSpace(data) {
    const space = Object.assign({}, data);

    return {type: `CREATE_${space.type}`, space};
}

/* local update (no server intervention) */
export function updateDeleteSpace(data) {
    const space = Object.assign({}, data);

    return {type: `DELETE_${space.type}`, space};
}

export function resetSearchGlobal() {
    const result = [];

    return {type: SEARCH_GLOBAL, result};
}




