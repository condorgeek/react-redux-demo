/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [anonymous.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 15.01.19 19:30
 */

import axios from 'axios';
import toastr from "../../node_modules/toastr/toastr";


import {FETCH_CHAT_COUNT, FETCH_CHAT_ENTRIES, FETCH_COMMENTS, FETCH_CONFIGURATION,
    FETCH_FOLLOWEES, FETCH_FOLLOWERS, FETCH_FRIENDS, FETCH_FRIENDS_PENDING,
    FETCH_LOGINDATA, FETCH_POSTS, FETCH_POSTS_PAGE, ROOT_PUBLIC_URL} from "./index";

import {FETCH_ANY_SPACES, FETCH_GENERICDATA, FETCH_HOMEDATA,
    FETCH_MEMBERS, FETCH_MEMBERS_PAGE, FETCH_SPACE_MEDIA} from "./spaces";

export function anonymousFetchPosts(username, space) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/posts/${space}`).then(response => {
            dispatch(fetchPosts(response.data))
        })
        .catch(error => {
            logError(error);
        });
    };

    function fetchPosts(posts) {return {type: FETCH_POSTS, posts}}
}

export function anonymousFetchPostsPage(username, space, page, size=10, callback) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/posts/${space}/page/${page}/${size}`)
        .then(response => {
            dispatch(fetchPostsPage(response.data))
        })
        .catch(error => {
            logError(error);
        });
    };

    function fetchPostsPage(page) {callback && callback(page); return {type: FETCH_POSTS_PAGE, page}}
}

export function anonymousFetchLoginData(username) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/userdata`).then (response => {
            dispatch(fetchLoginData(response.data))
        })
        .catch( error => {
            logError(error);
        })
    };

    function fetchLoginData(userdata) {return{type: FETCH_LOGINDATA, userdata}}
}

export function anonymousFetchComments(username, id) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/comments/${id}`).then(response => {
            dispatch(fetchComments(response.data, id));
        })
        .catch(error => {
            logError(error);
        });

    };

    function fetchComments(comments, id) {return {type: FETCH_COMMENTS, comments, meta: {id: id}}}
}

// export function anonymousFetchComments(username, id) {
//     const request = axios.get(`${ROOT_PUBLIC_URL}/${username}/comments/${id}`);
//
//     return {type: FETCH_COMMENTS, payload: request, meta: {id: id}}
// }

/* noop */
export function anonymousFetchFriends(username) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/friends`).then(response => {
            dispatch(fetchFriends(response.data));
        })
        .catch(error => {
            logError(error);
        });
    };

    function fetchFriends(friends) {return {type: FETCH_FRIENDS, friends}}
}

/* noop */
export function anonymousFetchFriendsPending(username) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/friends/pending`).then(response => {
            dispatch(fetchFriendsPending(response.data));
        })
        .catch(error => {
            logError(error);
        });
    };

    function fetchFriendsPending(friends) {return {type: FETCH_FRIENDS_PENDING, friends}}
}

/* noop */
export function anonymousFetchFollowers(username) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/followers`).then(response => {
            dispatch(fetchFollowers(response));
        })
        .catch(error =>{
           logError(error);
        })
    };

    function fetchFollowers(response) {return {type: FETCH_FOLLOWERS, payload: response }}
}

/* noop */
export function anonymousFetchFollowees(username) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/followees`).then(response => {
            dispatch(fetchFollowees(response.data));
        })
        .catch(error => {
            logError(error);
        })
    };

    function fetchFollowees(followees) { return {type: FETCH_FOLLOWEES, followees}}
}

/* noop */
export function anonymousFetchChatEntries(username, chatId, callback) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/chat/${chatId}/entries`).then(response => {
            dispatch(fetchChatEntries(response.data));
        })
        .catch(error => {
            logError(error);
        })
    };
    function fetchChatEntries(data) {if(callback !== undefined){callback()} return {type: FETCH_CHAT_ENTRIES, payload: data}}
}

/* noop */
export function anonymousFetchChatCount(username, chatId, callback) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/chat/${chatId}/count`).then(response => {
            dispatch(fetchChatCount(response.data));
        })
        .catch(error => {
            logError(error);
        })
    };
    function fetchChatCount(data) {if(callback !== undefined){callback()} return {type: FETCH_CHAT_COUNT, payload: data}}
}

export function anonymousFetchGenericData(username, space) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/space/${space}`).then (response => {
            dispatch(fetchGenericData(response.data))
        })
        .catch( error => {
            logError(error);
        })
    };

    function fetchGenericData(genericdata) {return{type: FETCH_GENERICDATA, genericdata}}
}

export function anonymousFetchHomeData(username, space) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/space/${space}`).then (response => {
            dispatch(fetchHomeData(response.data))
        })
        .catch( error => {
            logError(error);
        })
    };

    function fetchHomeData(homedata) {return{type: FETCH_HOMEDATA, homedata}}
}

export function anonymousFetchSpaceMedia(username, space) {

    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/posts/media/${space}`).then(response => {
            dispatch(fetchMedia(response.data))
        })
        .catch(error => {
            logError(error);
        });
    };

    function fetchMedia(media) {return {type: FETCH_SPACE_MEDIA, media}}
}

/* type one of GENERIC|EVENT|SHOP */
export function anonymousFetchSpaces(username, type) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/spaces/${type}`).then(response => {
            dispatch(fetchSpaces(response));
        })
        .catch(error =>{
            logError(error);
        })
    };

    function fetchSpaces(response) {
        return {type: `FETCH_${type.toUpperCase()}`,  payload: response.data }}
}

export function anonymousFetchAnySpaces(username) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/spaces/*`).then(response => {
            dispatch(fetchAnySpaces(response.data));
        })
        .catch(error =>{
            logError(error);
        })
    };

    function fetchAnySpaces(spaces) {return {type: FETCH_ANY_SPACES,  spaces }}
}

export function anonymousFetchMembers(username, spaceId) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/space/${spaceId}/members`).then(response => {
            dispatch(fetchMembers(response));
        })
        .catch(error =>{
            logError(error);
        })
    };

    function fetchMembers(response) {return {type: FETCH_MEMBERS, payload: response.data }}
}

export function anonymousFetchMembersPage(username, spaceId, page, size, callback) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/${username}/space/${spaceId}/members/${page}/${size}`)
        .then(response => {
            dispatch(fetchMembersPage(response.data));
        })
        .catch(error =>{
            logError(error);
        })
    };

    function fetchMembersPage(page) {callback && callback(page); return {type: FETCH_MEMBERS_PAGE, page}}
}

function logError(error) {
    const {data} = error.response;
    console.log('ANONYMOUS ERROR', data);
    toastr.error(`${data.error}. ${data.message}. Status(${data.status})`);
}