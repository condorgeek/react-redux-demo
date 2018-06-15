import axios from 'axios';
import {authConfig} from "../components/util/bearer-config";

export const FETCH_POSTS = 'fetch_posts';
export const FETCH_POST = 'fetch_post';
export const CREATE_POST = 'create_post';
export const DELETE_POST = 'delete_post';
export const FETCH_COMMENTS = 'fetch_comments';
export const CREATE_COMMENT = 'create_comment';
export const CREATE_COMMENT_LIKE = 'create_comment_like';
export const CREATE_LIKE = 'create_like';
export const FETCH_CONTACTS = 'fetch_contacts';
export const FETCH_FRIENDS = 'fetch_friends';
export const FETCH_FOLLOWERS = 'fetch_followers';

export const LOGIN_REQUEST = 'login_request';
export const LOGIN_SUCCESS = 'login_success';
export const LOGIN_FAILURE = 'login_failure';
export const LOGOUT_REQUEST = 'logout_request';

export const ROOT_STATIC_URL = 'http://localhost:9000';
export const ROOT_SERVER_URL = 'http://localhost:8080';

const ROOT_USER_URL = `${ROOT_SERVER_URL}/user`;

// @Deprecated
// const ROOT_URL = 'http://reduxblog.herokuapp.com/api';
const API_KEY = '?key=amaru01';

export function fetchPosts(username, space) {
    const request = axios.get(`${ROOT_USER_URL}/${username}/posts/${space}`, authConfig());

    // axios.get(`${ROOT_USER_URL}/${username}/posts/${space}`, authConfig())
    //     .then((response) => {
    //         return {
    //             type: FETCH_POSTS,
    //             payload: response
    //         }
    //     })
    //     .catch((error) => {
    //         console.log('ERROR', error);
    //         localStorage.removeItem('bearer');
    //         window.location= "/";
    //         return { type: LOGOUT_REQUEST}
    //     });

    return {
        type: FETCH_POSTS,
        payload: request
    }
}

export function createPost(username, values, space = 'home') {
    const request = axios.post(`${ROOT_USER_URL}/${username}/posts/${space}`, values, authConfig());

    return {
        type: CREATE_POST,
        payload: request
    }
}

export function createComment(username, postId, values, callback) {
    const request = axios.post(`${ROOT_USER_URL}/${username}/comments/${postId}`, values, authConfig());

    return {
        type: CREATE_COMMENT,
        payload: request,
        meta: {id: postId}
    }
}

export function createLike(username, postId, values) {
    const request = axios.post(`${ROOT_USER_URL}/${username}/likes/${postId}`, values, authConfig());

    return {
        type: CREATE_LIKE,
        payload: request,
        meta: {id: postId}
    }
}

export function createCommentLike(username, commentId, values) {
    const request = axios.post(`${ROOT_USER_URL}/${username}/commentlikes/${commentId}`, values, authConfig());

    return {
        type: CREATE_COMMENT_LIKE,
        payload: request,
        meta: {id: commentId}
    }
}

// @Deprecated
export function fetchPost(id, callback) {
    const request = axios.get(`${ROOT_USER_URL}/posts/${id}${API_KEY}`);

    console.log('@request', request);

    return {
        type: FETCH_POST,
        payload: request
    }
}

// @Deprecated
export function deletePost(id, callback) {
    const request = axios.delete(`${ROOT_USER_URL}/posts/${id}${API_KEY}`)
        .then(() => {
            callback()
        });

    console.log('@request', request);

    return {
        type: DELETE_POST,
        payload: id
    }
}

export function fetchComments(username, id) {
    const request = axios.get(`${ROOT_USER_URL}/${username}/comments/${id}`, authConfig());

    return {
        type: FETCH_COMMENTS,
        payload: request,
        meta: {id: id}
    }
}

export function fetchFriends(username) {
    const request = axios.get(`${ROOT_USER_URL}/${username}/friends`, authConfig());

    return {
        type: FETCH_FRIENDS,
        payload: request
    }
}

export function fetchFollowers(username) {
    const request = axios.get(`${ROOT_USER_URL}/${username}/followers`, authConfig());

    return {
        type: FETCH_FOLLOWERS,
        payload: request
    }
}

export function authRequest(user) { return { type: LOGIN_REQUEST, user } }
export function authSuccess(user) { return { type: LOGIN_SUCCESS, user } }
export function authFailure(error) { return { type: LOGIN_FAILURE, error } }

export function logoutRequest() {
    localStorage.removeItem('bearer');
    window.location= "/";
    return { type: LOGOUT_REQUEST}
}
