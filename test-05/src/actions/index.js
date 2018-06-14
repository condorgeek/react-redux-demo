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

export const ROOT_STATIC_URL = 'http://localhost:9000';
export const ROOT_SERVER_URL = 'http://localhost:8080';


// @Deprecated
// const ROOT_URL = 'http://reduxblog.herokuapp.com/api';
const API_KEY = '?key=amaru01';

const ROOT_URL = 'http://localhost:8080/user';
const ROOT_USER = 'amaru.london';

export function fetchPosts(space) {
    const request = axios.get(`${ROOT_URL}/${ROOT_USER}/posts/${space}`, authConfig());

    return {
        type: FETCH_POSTS,
        payload: request
    }
}

export function createPost(values, space = 'home') {
    const request = axios.post(`${ROOT_URL}/${ROOT_USER}/posts/${space}`, values, authConfig());

    return {
        type: CREATE_POST,
        payload: request
    }
}

export function createComment(postId, values, callback) {
    const request = axios.post(`${ROOT_URL}/${ROOT_USER}/comments/${postId}`, values, authConfig());

    return {
        type: CREATE_COMMENT,
        payload: request,
        meta: {id: postId}
    }
}

export function createLike(postId, values) {
    const request = axios.post(`${ROOT_URL}/${ROOT_USER}/likes/${postId}`, values, authConfig());

    return {
        type: CREATE_LIKE,
        payload: request,
        meta: {id: postId}
    }
}

export function createCommentLike(commentId, values) {
    const request = axios.post(`${ROOT_URL}/${ROOT_USER}/commentlikes/${commentId}`, values, authConfig());

    return {
        type: CREATE_COMMENT_LIKE,
        payload: request,
        meta: {id: commentId}
    }
}

// @Deprecated
export function fetchPost(id, callback) {
    const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`);

    console.log('@request', request);

    return {
        type: FETCH_POST,
        payload: request
    }
}

// @Deprecated
export function deletePost(id, callback) {
    const request = axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
        .then(() => {
            callback()
        });

    console.log('@request', request);

    return {
        type: DELETE_POST,
        payload: id
    }
}

export function fetchComments(id) {
    const request = axios.get(`${ROOT_URL}/${ROOT_USER}/comments/${id}`, authConfig());

    return {
        type: FETCH_COMMENTS,
        payload: request,
        meta: {id: id}
    }
}

export function fetchFriends(username) {
    const request = axios.get(`${ROOT_URL}/${username}/friends`, authConfig());

    return {
        type: FETCH_FRIENDS,
        payload: request
    }
}

export function fetchFollowers(username) {
    const request = axios.get(`${ROOT_URL}/${username}/followers`, authConfig());

    return {
        type: FETCH_FOLLOWERS,
        payload: request
    }
}

export function authRequest(user) { return { type: LOGIN_REQUEST, user } }
export function authSuccess(user) { return { type: LOGIN_SUCCESS, user } }
export function authFailure(error) { return { type: LOGIN_FAILURE, error } }
