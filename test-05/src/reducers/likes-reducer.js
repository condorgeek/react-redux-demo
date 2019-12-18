/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [likes-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 14.05.18 14:18
 */
import {
    CREATE_LIKE,
    CREATE_COMMENT_LIKE,
    REMOVE_LIKE,
    REMOVE_COMMENT_LIKE,
    FETCH_POSTS,
    FETCH_COMMENTS
} from "../actions";

export default function LikesReducer(state = {}, action) {

    switch (action.type) {

        case CREATE_LIKE:
            if( state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.like)};

        case REMOVE_LIKE: // TODO is this doing smthg ?
            return {...state, [action.meta.id]: Object.assign([], action.like)};

        case FETCH_POSTS:
            return action.posts.reduce((obj, post) => {
                    obj[post.id] = post.likes;
                    return obj;
                }, {});

        default:
            return state;
    }

}

const keyBy = (array, key) => (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export function CommentLikesReducer(state = [], action) {
    switch (action.type) {

        case FETCH_COMMENTS:
            // return  {...state, [action.id]: Object.assign([], action.comments)};

            // const list = action.comments.map(comment => {
            //     console.log('XX', comment)
            //     // return {[comment.id]: comment.likes}
            //     return {...state,[comment.id]: comment.likes }
            // });


        return  Object.values(keyBy(action.comments, 'id'));


        case CREATE_COMMENT_LIKE:
            // if( state[action.meta.id] === undefined) {
            //     state[action.meta.id] = [];
            // }
            // return {...state, [action.meta.id]: Object.assign([], action.like)};

            if( state[action.commentId] === undefined) {
                state[action.commentId] = [];
            }
            return {...state, [action.commentId]: Object.assign([], action.like)};

        case REMOVE_COMMENT_LIKE:
            console.log('REMOVE_COMMENT_LIKE', action);

            // return {...state, [action.meta.id]: Object.assign([], action.like)};
            return {...state, [action.commentId]: Object.assign([], action.like)};

        default:
            return state;
    }
}

export const getComment = (state, postId, commentId) => {
    return state.comments[postId].find(entry => entry.id === commentId);
};

export const getCommentLikes = (state, postId, commentId) => {
    return state.comments[postId].find(entry => entry.id === commentId).likes;
};

