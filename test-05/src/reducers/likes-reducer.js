import {CREATE_LIKE, CREATE_COMMENT_LIKE} from "../actions";

export default function LikesReducer(state = {}, action) {

    switch (action.type) {

        case CREATE_LIKE:
            if( state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        default:
            return state;
    }

}

export function CommentLikesReducer(state = {}, action) {
    switch (action.type) {

        case CREATE_COMMENT_LIKE:
            if( state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        default:
            return state;
    }
}

