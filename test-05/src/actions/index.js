import axios from 'axios';
import {authConfig, refreshConfig} from "./bearer-config";

export const CREATE_USER_REQUEST = 'create_user_request';
export const CREATE_USER_SUCCESS = 'create_user_success';
export const CREATE_USER_FAILURE = 'create_user_failure';
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
export const FETCH_FOLLOWEES = 'fetch_followees';
export const ADD_FOLLOWEE = 'add_followee';
export const BLOCK_FOLLOWER = 'block_follower';
export const DELETE_FOLLOWEE = 'delete_followee';
export const FETCH_USERDATA = 'fetch_userdata';
export const UPDATE_USERDATA = 'update_userdata';
export const FETCH_SPACEDATA = 'fetch_spacedata';
export const UPDATE_SPACEDATA = 'update_spacedata';

export const LOGIN_REQUEST = 'login_request';
export const LOGIN_SUCCESS = 'login_success';
export const LOGIN_FAILURE = 'login_failure';
export const LOGIN_VALIDATE = 'login_validate';
export const LOGOUT_REQUEST = 'logout_request';

export const TOKEN_EXPIRED = 11;

export const ROOT_STATIC_URL = 'http://localhost:9000';
export const ROOT_SERVER_URL = 'http://localhost:8080';
export const ROOT_USER_URL = `${ROOT_SERVER_URL}/user`;

const ROOT_PUBLIC_URL = `${ROOT_SERVER_URL}/public`;

// @Deprecated
// const ROOT_URL = 'http://reduxblog.herokuapp.com/api';
const API_KEY = '?key=amaru01';


export function asyncFetchPosts(username, space) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/posts/${space}`, authConfig())
            .then(response => {
                dispatch(fetchPosts(response))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchPosts(username, space))));
            });
    };

    function fetchPosts(response) {return {type: FETCH_POSTS, payload: response}}
}

export function asyncFetchUserData(username) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/userdata`, authConfig())
            .then (response => {
                dispatch(fetchUserData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncFetchUserData(username))))
            })
    };

    function fetchUserData(userdata) {return{type: FETCH_USERDATA, userdata}}
}

export function asyncUpdateUserAvatar(username, values) {
    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/userdata/avatar`, values, authConfig())
            .then (response => {
                dispatch(updateUserData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateUserAvatar(username, values))))
            })
    };

    function updateUserData(userdata) {return{type: UPDATE_USERDATA, userdata}}
}

export function asyncFetchSpaceData(username) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/space/home`, authConfig())
            .then (response => {
                dispatch(fetchSpaceData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncFetchSpaceData(username))))
            })
    };

    function fetchSpaceData(spacedata) {return{type: FETCH_SPACEDATA, spacedata}}
}

export function asyncUpdateSpaceCover(username, values) {
    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/space/cover`, values, authConfig())
            .then (response => {
                dispatch(updateSpaceData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateSpaceCover(username, values))))
            })
    };

    function updateSpaceData(spacedata) {return{type: UPDATE_SPACEDATA, spacedata}}
}

export function asyncFetchComments(username, id) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/comments/${id}`, authConfig())
            .then(response => {
                dispatch(fetchComments(response, id));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchComments(username, id))));
            });

    };

    function fetchComments(response, id) {return {type: FETCH_COMMENTS, payload: response, meta: {id: id}}}
}

export function asyncCreateLike(username, postId, values) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/likes/${postId}`, values, authConfig())
            .then(response => {
                dispatch(createLike(response, postId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateLike(username, postId, values))));
            })
    };

    function createLike(response, postId) {return {type: CREATE_LIKE, payload: response, meta: {id: postId}}}
}

export function asyncCreateCommentLike(username, commentId, values) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/commentlikes/${commentId}`, values, authConfig())
            .then(response => {
                dispatch(createCommentLike(response, commentId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateCommentLike(username, commentId, values))));
            })
    };

    function createCommentLike(response, commentId) {return {type: CREATE_COMMENT_LIKE, payload: response, meta: {id: commentId}}}
}

export function asyncCreateComment(username, postId, values, callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/comments/${postId}`, values, authConfig())
            .then(response => {
                dispatch(createComment(response, postId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateComment(username, postId, values))));
            })
    };

    function createComment(response, postId) {return {type: CREATE_COMMENT, payload: response, meta: {id: postId}}}
}

export function asyncCreatePost(username, values, space = 'home') {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/posts/${space}`, values, authConfig())
            .then(response => {
                dispatch(createPost(response));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreatePost(username, values, space))));
            })
    };

    function createPost(response) {return {type: CREATE_POST, payload: response}}
}

export function asyncCreateUser(username, values) {
    return dispatch => {
        dispatch(createUserRequest());
        axios.post(`${ROOT_PUBLIC_URL}/user/create/${username}`, values)
            .then(response => {
                dispatch(createUserSuccess(response.data));
            })
            .catch(error => {
                dispatch(createUserFailure(error));
            })
    };

    function createUserRequest() {return {type: CREATE_USER_REQUEST}}
    function createUserSuccess(user) {return {type: CREATE_USER_SUCCESS, user}}
    function createUserFailure(error) {return {type: CREATE_USER_FAILURE, error}}
}

export function asyncValidateAuth(username) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/validate/authorization`, authConfig())
            .then(response => {
                console.log('Validate/Autorization', response);
                dispatch(validateAuth(response.status));
            })
            .catch(error => {
                console.log('Validate', error.response);
                dispatch(asyncHandleError(error));
            })
    };

    function validateAuth(httpStatus) {return {type: LOGIN_VALIDATE, payload: httpStatus}}
}

export function asyncHandleError(error, retry) {
    return dispatch => {
        const {data} = error.response;
        if(data && data.errorCode === TOKEN_EXPIRED) {
            console.log(retry);
            dispatch(asyncRefreshToken(retry));

        } else {
            dispatch(logoutRequest());
        }
    }
}

function asyncRefreshToken(retry) {
    return dispatch => {
        axios.get(`${ROOT_SERVER_URL}/public/token`, refreshConfig())
            .then(response => {
                console.log('REFRESH OK', response);
                const bearer = JSON.parse(localStorage.getItem('bearer'));
                const refresh = {...bearer, 'token': response.data.token};
                localStorage.setItem('bearer', JSON.stringify(refresh));
                retry && retry();
            })
            .catch(error => {
                dispatch(logoutRequest());
            });
    };
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

export function fetchPosts(username, space) {
    const request = axios.get(`${ROOT_USER_URL}/${username}/posts/${space}`, authConfig());
    return {
        type: FETCH_POSTS,
        payload: request
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

export function fetchFollowees(username) {
    const request = axios.get(`${ROOT_USER_URL}/${username}/followees`, authConfig());

    return {
        type: FETCH_FOLLOWEES,
        payload: request
    }
}

export function asyncAddFollowee(username, followee) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/followee/add`, {followee: followee}, authConfig())
            .then(response => {

                console.log(response);

                dispatch(addFollowee(response))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncAddFollowee(username, followee))));
            });
    };

    function addFollowee(response) {return {type: ADD_FOLLOWEE, payload: response}}
}


export function authRequest(user) {return {type: LOGIN_REQUEST, user}}
export function authSuccess(user) {return {type: LOGIN_SUCCESS, user}}
export function authFailure(error) {return {type: LOGIN_FAILURE, error}}

export function logoutRequest() {
    localStorage.removeItem('bearer');
    window.location = "/";
    return {type: LOGOUT_REQUEST}
}
