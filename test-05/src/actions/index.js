/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [index.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 27.09.18 13:13
 */

import axios from 'axios';
import toastr from "../../node_modules/toastr/toastr";

import {authConfig, getBearer, isPreAuthorized, refreshConfig, removeBearer, saveBearer} from "./bearer-config";
import {anonymousFetchChatCount, anonymousFetchChatEntries, anonymousFetchComments,
    anonymousFetchFollowees, anonymousFetchFollowers, anonymousFetchFriends,
    anonymousFetchFriendsPending, anonymousFetchLoginData, anonymousFetchPosts,
    anonymousFetchPostsPage} from "./anonymous";

export const CREATE_USER_REQUEST = 'create_user_request';
export const CREATE_USER_SUCCESS = 'create_user_success';
export const CREATE_USER_FAILURE = 'create_user_failure';
export const UPDATE_USERDATA = 'UPDATE_USER';
export const FETCH_POSTS = 'fetch_posts';
export const FETCH_POSTS_PAGE = 'FETCH_POSTS_PAGE';
export const FETCH_POST = 'fetch_post';
export const CREATE_POST = 'create_post';
export const UPDATE_POST = 'UPDATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const SHARE_POST = 'SHARE_POST';
export const HIDE_POST = 'HIDE_POST';
export const DELETE_POST_MEDIA = 'DELETE_POST_MEDIA';
export const FETCH_COMMENTS = 'fetch_comments';
export const CREATE_COMMENT = 'create_comment';
export const CREATE_COMMENT_LIKE = 'create_comment_like';
export const REMOVE_COMMENT_LIKE = 'REMOVE_COMMENT_LIKE';
export const CREATE_LIKE = 'create_like';
export const REMOVE_LIKE = 'REMOVE_LIKE';
export const FETCH_CONTACTS = 'fetch_contacts';
export const FETCH_FRIENDS = 'fetch_friends';
export const FETCH_FRIENDS_PENDING = 'fetch_friends_pending';
export const ADD_FRIEND = 'add_friend';
export const DELETE_FRIEND = 'delete_friend';
export const BLOCK_FRIEND = 'block_friend';
export const UNBLOCK_FRIEND = 'unblock_friend';
export const IGNORE_FRIEND = 'ignore_friend';
export const ACCEPT_FRIEND = 'accept_friend';
export const CANCEL_FRIEND = 'cancel_friend';
export const FETCH_FOLLOWERS = 'fetch_followers';
export const FETCH_FOLLOWEES = 'fetch_followees';
export const ADD_FOLLOWEE = 'add_followee';
export const BLOCK_FOLLOWER = 'block_follower';
export const UNBLOCK_FOLLOWER = 'unblock_follower';
export const DELETE_FOLLOWEE = 'delete_followee';

export const FETCH_LOGINDATA = 'FETCH_LOGINDATA';
export const UPDATE_LOGINDATA = 'UPDATE_LOGINDATA';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_CONNECT = 'LOGIN_CONNECT';
export const LOGIN_VALIDATE = 'LOGIN_VALIDATE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGIN_ANONYMOUS ='LOGIN_ANONYMOUS';

export const LOGIN_STATUS_SUCCESS = 'success';
export const LOGIN_STATUS_ERROR = 'error';
export const LOGIN_STATUS_REQUEST = 'request';
export const LOGIN_STATUS_ANONYMOUS = 'anonymous';
export const LOGIN_STATUS_LOGOUT = 'logout';
export const LOGIN_STATUS_CONNECT = 'connect';

export const FETCH_CONFIGURATION = 'FETCH_CONFIGURATION';

export const EVENT_FRIEND_REQUESTED = 'EVENT_FRIEND_REQUESTED';
export const EVENT_FRIEND_CANCELLED = 'EVENT_FRIEND_CANCELLED';
export const EVENT_FRIEND_ACCEPTED = 'EVENT_FRIEND_ACCEPTED';
export const EVENT_FRIEND_IGNORED = 'EVENT_FRIEND_IGNORED';
export const EVENT_FRIEND_DELETED = 'EVENT_FRIEND_DELETED';
export const EVENT_FRIEND_BLOCKED = 'EVENT_FRIEND_BLOCKED';
export const EVENT_FRIEND_UNBLOCKED = 'EVENT_FRIEND_UNBLOCKED';
export const EVENT_FOLLOWER_BLOCKED = 'EVENT_FOLLOWER_BLOCKED';
export const EVENT_FOLLOWER_UNBLOCKED = 'EVENT_FOLLOWER_UNBLOCKED';
export const EVENT_FOLLOWER_ADDED = 'EVENT_FOLLOWER_ADDED';
export const EVENT_FOLLOWER_DELETED = 'EVENT_FOLLOWER_DELETED';

export const EVENT_CHAT_DELIVERED = 'EVENT_CHAT_DELIVERED';
export const EVENT_CHAT_DELIVERED_ACK = 'EVENT_CHAT_DELIVERED_ACK';
export const EVENT_CHAT_CONSUMED = 'EVENT_CHAT_CONSUMED';
export const EVENT_CHAT_CONSUMED_ACK = 'EVENT_CHAT_CONSUMED_ACK';
export const EVENT_CHAT_DELETED = 'EVENT_CHAT_DELETED';
export const EVENT_CHAT_DELETED_ACK = 'EVENT_CHAT_DELETED_ACK';
export const EVENT_CHAT_RECEIVED = 'EVENT_CHAT_RECEIVED';
export const FETCH_CHAT_ENTRIES = 'FETCH_CHAT_ENTRIES';
export const FETCH_CHAT_COUNT = 'FETCH_CHAT_COUNT';

export const CHAT_ENTRY_CONSUMED = 'CONSUMED';
export const CHAT_ENTRY_DELIVERED = 'DELIVERED';
export const CHAT_ENTRY_RECEIVED = 'RECEIVED';

export const TOKEN_EXPIRED = 11;

// export const ROOT_STATIC_URL = 'http://localhost:9000';
// export const ROOT_SERVER_URL = 'http://localhost:8080';

export const ROOT_STATIC_URL = process.env.REACT_APP_ROOT_STATIC_URL;
export const ROOT_SERVER_URL = process.env.REACT_APP_ROOT_SERVER_URL;

export const ROOT_USER_URL = `${ROOT_SERVER_URL}/user`;
export const ROOT_PUBLIC_URL = `${ROOT_SERVER_URL}/public`;

export function asyncFetchPosts(username, space) {
    return isPreAuthorized() ? authFetchPosts(username, space) :
        anonymousFetchPosts(username, space);
}

export function authFetchPosts(username, space) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/posts/${space}`, authConfig())
            .then(response => {
                dispatch(fetchPosts(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchPosts(username, space))));
            });
    };

    function fetchPosts(posts) {return {type: FETCH_POSTS, posts}}
}

export function asyncFetchPostsPage(username, space, page, size=10, callback) {
    return isPreAuthorized() ? authFetchPostsPage(username, space, page, size=10, callback) :
        anonymousFetchPostsPage(username, space, page, size=10, callback);
}

export function authFetchPostsPage(username, space, page, size=10, callback) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/posts/${space}/page/${page}/${size}`, authConfig())
            .then(response => {
                dispatch(fetchPostsPage(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchPostsPage(username, space, page, size=10, callback))));
            });
    };

    function fetchPostsPage(page) {callback && callback(page); return {type: FETCH_POSTS_PAGE, page}}
}

export function asyncFetchLoginData(username) {
    return isPreAuthorized() ? authFetchLoginData(username) : anonymousFetchLoginData(username);
}

export function authFetchLoginData(username) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/userdata`, authConfig())
            .then (response => {
                dispatch(fetchLoginData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncFetchLoginData(username))))
            })
    };

    function fetchLoginData(userdata) {return{type: FETCH_LOGINDATA, userdata}}
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

    function updateUserData(userdata) {return{type: UPDATE_LOGINDATA, userdata}}
}

export function asyncUpdateUserData(username, values, callback) {
    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/userdata/update`, values, authConfig())
            .then (response => {
                dispatch(updateUserData(response.data))
            })
            .catch( error => {
                dispatch(asyncHandleError(error, ()=> dispatch(asyncUpdateUserData(username, values, callback))))
            })
    };

    function updateUserData(userdata) {callback && callback(userdata); return{type: UPDATE_USERDATA, userdata}}
}

export function asyncFetchComments(username, id) {
    return isPreAuthorized() ? authFetchComments(username, id) : anonymousFetchComments(username, id);
}

export function authFetchComments(username, id) {

    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/comments/${id}`, authConfig())
            .then(response => {
                dispatch(fetchComments(response.data, id));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchComments(username, id))));
            });

    };

    function fetchComments(comments, id) {return {type: FETCH_COMMENTS, comments, meta: {id: id}}}
}

export function asyncCreatePostLike(username, postId, values, callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/likes/${postId}`, values, authConfig())
            .then(response => {
                dispatch(createPostLike(response.data, postId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreatePostLike(username, postId, values, callback))));
            })
    };

    function createPostLike(like, postId) {callback && callback(like); return {type: CREATE_LIKE, like, meta: {id: postId}}}
}

export function asyncRemovePostLike(username, postId, likeId, callback) {

    return dispatch => {
        axios.delete(`${ROOT_USER_URL}/${username}/likes/${postId}/remove/${likeId}`, authConfig())
            .then(response => {
                dispatch(removePostLike(response.data, postId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncRemovePostLike(username, postId, likeId, callback))));
            })
    };

    function removePostLike(like, postId) {
        callback && callback(like); return {type: REMOVE_LIKE, like, meta: {id: postId}}}
}

export function asyncCreateCommentLike(username, commentId, values, callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/commentlikes/${commentId}`, values, authConfig())
            .then(response => {
                dispatch(createCommentLike(response.data, commentId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateCommentLike(username, commentId, values, callback))));
            })
    };

    function createCommentLike(like, commentId) {callback && callback(like);
    return {type: CREATE_COMMENT_LIKE, like, meta: {id: commentId}}}
}

export function asyncRemoveCommentLike(username, commentId, likeId, callback) {

    return dispatch => {
        axios.delete(`${ROOT_USER_URL}/${username}/commentlikes/${commentId}/remove/${likeId}`, authConfig())
            .then(response => {
                dispatch(removeCommentLike(response.data, commentId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncRemoveCommentLike(username, commentId, likeId, callback))));
            })
    };

    function removeCommentLike(like, commentId) {
        callback && callback(like);
        return {type: REMOVE_COMMENT_LIKE, like, meta: {id: commentId}};
    }
}

export function asyncCreateComment(username, postId, values, callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/comments/${postId}`, values, authConfig())
            .then(response => {
                dispatch(createComment(response.data, postId));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreateComment(username, postId, values, callback))));
            })
    };

    function createComment(comment, postId) {callback && callback(comment); return {type: CREATE_COMMENT, comment, meta: {id: postId}}}
}

export function asyncCreatePost(username, values, space = 'home', callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/posts/${space}`, values, authConfig())
            .then(response => {
                dispatch(createPost(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCreatePost(username, values, space, callback))));
            })
    };

    function createPost(post) {callback && callback(post); return {type: CREATE_POST, post}}
}

export function asyncUpdatePost(username, values, postId, callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/posts/${postId}/update`, values, authConfig())
            .then(response => {
                dispatch(updatePost(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncUpdatePost(username, values, postId, callback))));
            })
    };

    function updatePost(post) {callback && callback(post); return {type: UPDATE_POST, post}}
}

export function asyncDeleteMedia(username, postId, mediaId, callback) {

    return dispatch => {
        axios.delete(`${ROOT_USER_URL}/${username}/posts/${postId}/media/${mediaId}/delete`, authConfig())
            .then(response => {
                dispatch(deleteMedia(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteMedia(username, postId, mediaId, callback))));
            })
    };

    function deleteMedia(post) {callback && callback(post); return {type: DELETE_POST_MEDIA, post}}
}

export function asyncDeletePost(username, postId, callback) {

    return dispatch => {
        axios.delete(`${ROOT_USER_URL}/${username}/posts/${postId}/delete`, authConfig())
            .then(response => {
                dispatch(deletePost(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncDeletePost(username, postId, callback))));
            })
    };

    function deletePost(post) {callback && callback(post); return {type: DELETE_POST, post}}
}

export function asyncSharePost(username, spaceId, postId, values, callback) {

    return dispatch => {
        axios.post(`${ROOT_USER_URL}/${username}/space/${spaceId}/share/${postId}`, values, authConfig())
            .then(response => {
                dispatch(sharePost(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncSharePost(username, spaceId, postId, callback))));
            })
    };

    function sharePost(post) {callback && callback(post); return {type: SHARE_POST, post}}
}

/* always in public mode */
export function asyncFetchConfiguration(callback) {
    return dispatch => {
        axios.get(`${ROOT_PUBLIC_URL}/app/configuration`)
        .then(response => {
            dispatch(fetchConfiguration(response.data));
        })
        .catch(error => {
            console.log(error);
        })
    };

    function fetchConfiguration(configuration) {callback && callback(configuration); return {type: FETCH_CONFIGURATION, configuration}}
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

export function asyncValidateAuth(username, callback) {

    (!isPreAuthorized() || !username) && console.log('NOT_AUTHORIZED', username);


    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/validate/authorization`, authConfig())
            .then(response => {
                console.log('Validate/Autorization', response);
                dispatch(validateAuth(response.status));
            })
            .catch(error => {
                console.log(LOGIN_VALIDATE, error.response);
                dispatch(asyncHandleError(error));
            })
    };

    function validateAuth(httpStatus) {callback && callback(); return {type: LOGIN_VALIDATE, payload: httpStatus}}
}

/* only in auth mode */
export function asyncConnectAuth(username, callback) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/validate/authorization`, authConfig())
            .then(response => {
                console.log(LOGIN_CONNECT, response);
                dispatch(connectAuth(username));
            })
            .catch(error => {
                console.log(LOGIN_CONNECT, error.response);
                dispatch(asyncHandleError(error, ()=> dispatch(connectAuth(username))))
            })
    };

    function connectAuth(username) {callback && callback(); return {type: LOGIN_CONNECT, username}}
}

export function asyncHandleError(error, retry) {
    return dispatch => {
        const {data} = error.response;
        if(data && data.errorCode === TOKEN_EXPIRED) {
            dispatch(asyncRefreshToken(retry));

        } else {
            console.log('ERROR', data);
            toastr.error(`${data.error}. ${data.message}. Status(${data.status})`);
        }
    }
}

/* only in auth mode */
function asyncRefreshToken(retry) {
    return dispatch => {
        axios.get(`${ROOT_SERVER_URL}/public/token`, refreshConfig())
            .then(response => {
                console.log('REFRESH OK', response);
                // const bearer = JSON.parse(localStorage.getItem('bearer'));
                // const refresh = {...bearer, 'token': response.data.token};
                // localStorage.setItem('bearer', JSON.stringify(refresh));

                saveBearer({...getBearer(), 'token': response.data.token});
                retry && retry();
            })
            .catch(error => {

                console.log('SECURITY ERROR, error');
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

export function asyncFetchFriends(username) {
    return isPreAuthorized() ? authFetchFriends(username) : anonymousFetchFriends(username);
}

export function authFetchFriends(username) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/friends`, authConfig())
            .then(response => {
                dispatch(fetchFriends(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchFriends(username))));
            });
    };

    function fetchFriends(friends) {return {type: FETCH_FRIENDS, friends}}
}

export function asyncFetchFriendsPending(username) {
    return isPreAuthorized() ? authFetchFriendsPending(username) : anonymousFetchFriendsPending(username);
}

export function authFetchFriendsPending(username) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/friends/pending`, authConfig())
            .then(response => {
                dispatch(fetchFriendsPending(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchFriendsPending(username))));
            });
    };

    function fetchFriendsPending(friends) {return {type: FETCH_FRIENDS_PENDING, friends}}
}

export function asyncFetchFollowers(username) {
    return isPreAuthorized() ? authFetchFollowers(username) : anonymousFetchFollowers(username);
}

export function authFetchFollowers(username) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/followers`, authConfig())
            .then(response => {
                dispatch(fetchFollowers(response));
            })
            .catch(error =>{
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchFollowers(username))));
            })
    };

    function fetchFollowers(response) {return {type: FETCH_FOLLOWERS, payload: response }}
}

export function asyncFetchFollowees(username) {
    return isPreAuthorized() ? authFetchFollowees(username) : anonymousFetchFollowees(username);
}

export function authFetchFollowees(username) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/followees`, authConfig())
            .then(response => {
                dispatch(fetchFollowees(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchFollowees(username))));
            })
    };

    function fetchFollowees(followees) { return {type: FETCH_FOLLOWEES, followees}}
}

export function asyncAddFollowee(username, followee, callback) {
    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/followee/add`, {followee: followee}, authConfig())
            .then(response => {
                dispatch(addFollowee(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncAddFollowee(username, followee, callback))));
            });
    };

    function addFollowee(followee) { callback && callback(followee); return {type: ADD_FOLLOWEE, followee}}
}

export function asyncDeleteFollowee(username, followee, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/followee/delete`, {followee: followee}, authConfig())
            .then(response => {
                dispatch(deleteFollowee(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteFollowee(username, followee, callback))));
            });
    };

    function deleteFollowee(followee) {callback && callback(followee); return {type: DELETE_FOLLOWEE, followee}}
}

export function asyncBlockFollower(username, follower, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/follower/block`, {follower: follower}, authConfig())
            .then(response => {
                dispatch(blockFollower(response))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncBlockFollower(username, follower, callback))));
            });
    };

    function blockFollower(response) {if(callback!==undefined){callback(username)} return {type: BLOCK_FOLLOWER, payload: response}}
}

export function asyncUnblockFollower(username, follower, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/follower/unblock`, {follower: follower}, authConfig())
            .then(response => {
                dispatch(unblockFollower(response))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncUnblockFollower(username, follower, callback))));
            });
    };

    function unblockFollower(response) {if(callback!== undefined) {callback(username)} return {type: UNBLOCK_FOLLOWER, payload: response}}
}

export function asyncAddFriend(username, friend, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/add`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(addFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncAddFriend(username, friend, callback))));
            });
    };

    function addFriend(friend) {if(callback !== undefined){callback(friend)} return {type: ADD_FRIEND, friend}}
}

export function asyncDeleteFriend(username, friend, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/delete`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(deleteFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncDeleteFriend(username, friend, callback))));
            });
    };

    function deleteFriend(friend) {callback && callback(friend); return {type: DELETE_FRIEND, friend}}
}

export function asyncBlockFriend(username, friend, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/block`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(blockFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncBlockFriend(username, friend, callback))));
            });
    };

    function blockFriend(friend) {callback && callback(friend); return {type: BLOCK_FRIEND, friend}}
}

export function asyncUnblockFriend(username, friend, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/unblock`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(unblockFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncUnblockFriend(username, friend, callback))));
            });
    };

    function unblockFriend(friend) {callback && callback(friend); return {type: UNBLOCK_FRIEND, friend}}
}

export function asyncIgnoreFriend(username, friend, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/ignore`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(ignoreFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncIgnoreFriend(username, friend, callback))));
            });
    };

    function ignoreFriend(friend) {callback && callback(friend); return {type: IGNORE_FRIEND, friend}}
}

export function asyncCancelFriend(username, friend, callback) {
    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/cancel`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(cancelFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncCancelFriend(username, friend, callback))));
            });
    };

    function cancelFriend(friend) {if(callback !== undefined){callback(friend)} return {type: CANCEL_FRIEND, friend}}
}

export function asyncAcceptFriend(username, friend, callback) {

    return dispatch => {
        axios.put(`${ROOT_USER_URL}/${username}/friend/accept`, {friend: friend}, authConfig())
            .then(response => {
                dispatch(acceptFriend(response.data))
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncAcceptFriend(username, friend, callback))));
            });
    };

    function acceptFriend(friend) {callback && callback(friend); return {type: ACCEPT_FRIEND, friend}}
}

export function asyncFetchChatEntries(username, chatId, callback) {
    return isPreAuthorized() ? authFetchChatEntries(username, chatId, callback) :
        anonymousFetchChatEntries(username, chatId, callback);
}

export function authFetchChatEntries(username, chatId, callback) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/chat/${chatId}/entries`, authConfig())
            .then(response => {
                dispatch(fetchChatEntries(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchChatEntries(username, chatId, callback))));
            })
    };

    function fetchChatEntries(data) {if(callback !== undefined){callback()} return {type: FETCH_CHAT_ENTRIES, payload: data}}
}

export function asyncFetchChatCount(username, chatId, callback) {
    return isPreAuthorized() ? authFetchChatCount(username, chatId, callback)
        : anonymousFetchChatCount(username, chatId, callback);
}

export function authFetchChatCount(username, chatId, callback) {
    return dispatch => {
        axios.get(`${ROOT_USER_URL}/${username}/chat/${chatId}/count`, authConfig())
            .then(response => {
                dispatch(fetchChatCount(response.data));
            })
            .catch(error => {
                dispatch(asyncHandleError(error, () => dispatch(asyncFetchChatCount(username, chatId, callback))));
            })
    };
    function fetchChatCount(data) {if(callback !== undefined){callback()} return {type: FETCH_CHAT_COUNT, payload: data}}
}

export function friendEventHandler(event, user) {return {type: event, user}}
export function followerEventHandler(event, follower) {return {type: event, follower}}
export function chatEventHandler(event, data) {return {type: event, data}}
export function authRequest(user) {return {type: LOGIN_REQUEST, user}}
export function authSuccess(user) {return {type: LOGIN_SUCCESS, user}}
export function authFailure(error) {return {type: LOGIN_FAILURE, error}}
export function authAnonymous(user) {return {type: LOGIN_ANONYMOUS, user}}

export function logoutRequest() {
    removeBearer();
    window.location = "/";
    return {type: LOGOUT_REQUEST}
}
