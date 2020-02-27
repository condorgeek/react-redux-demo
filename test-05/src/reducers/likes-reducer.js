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
    FETCH_COMMENTS, FETCH_POSTS_PAGE
} from "../actions";

export default function LikesReducer(state = {}, action) {

    switch (action.type) {

        case CREATE_LIKE:
            if (state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.like)};

        case REMOVE_LIKE: // TODO is this doing smthg ?
            return {...state, [action.meta.id]: Object.assign([], action.like)};

        // @Deprecated (s. below page fetching)
        case FETCH_POSTS:
            return action.posts.reduce((likes, post) => {
                likes[post.id] = post.likes;
                return likes;
            }, {});

        case FETCH_POSTS_PAGE:
            return action.page.content.reduce((likes, post) => {
                likes[post.id] = post.likes;
                return likes;
            }, state);

        default:
            return state;
    }

}

export function CommentLikesReducer(state = {}, action) {
    switch (action.type) {

        case FETCH_COMMENTS:
            return action.comments.reduce((likes, comment) => {
               likes[comment.id] = comment.likes;
               return likes;
            }, state);

        case CREATE_COMMENT_LIKE:
            if (state[action.commentId] === undefined) {
                state[action.commentId] = [];
            }
            return {...state, [action.commentId]: Object.assign([], action.like)};

        case REMOVE_COMMENT_LIKE:
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

