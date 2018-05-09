import axios from 'axios';

export const FETCH_POSTS = 'fetch_posts';
export const FETCH_POST = 'fetch_post';
export const CREATE_POST = 'create_post';
export const DELETE_POST = 'delete_post';
export const FETCH_COMMENTS = 'fetch_comments';
export const CREATE_COMMENT = 'create_comment';
export const FETCH_CONTACTS = 'fetch_contacts';
export const FETCH_FRIENDS = 'fetch_friends';
export const FETCH_FOLLOWERS = 'fetch_followers';

// const ROOT_URL = 'http://reduxblog.herokuapp.com/api';
const API_KEY = '?key=amaru01';

const ROOT_URL = 'http://localhost:8080/user';
const ROOT_USER = 'amaru.london';

export function fetchPosts() {

    const request = axios.get(`${ROOT_URL}/${ROOT_USER}/posts/home`, {headers: {'Access-Control-Allow-Origin': '*'}});

    return {
        type: FETCH_POSTS,
        payload: request
    }
}

export function createPost(values, callback) {

    const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values)
        .then(() => callback());

    return {
        type: CREATE_POST,
        payload: request
    }
}

export function createComment(postId, values, callback) {
    const request = axios.post(`${ROOT_URL}/${ROOT_USER}/comments/${postId}`, values);
        // .then(()=> callback());

    return {
        type: CREATE_COMMENT,
        payload: request,
        meta: {id: postId}
    }

}

export function fetchPost(id, callback) {
    const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`);

    console.log('@request', request);

    return {
        type: FETCH_POST,
        payload: request
    }
}

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

    const request = axios.get(`${ROOT_URL}/${ROOT_USER}/comments/${id}`);

    return {
        type: FETCH_COMMENTS,
        payload: request,
        meta: {id: id}
    }
}

export function fetchFriends(user) {

    const request = axios.get(`${ROOT_URL}/${user}/friends`);

    return {
        type: FETCH_FRIENDS,
        payload: request
    }
}

export function fetchFollowers(user) {

    const request = axios.get(`${ROOT_URL}/${user}/followers`);

    return {
        type: FETCH_FOLLOWERS,
        payload: request
    }
}