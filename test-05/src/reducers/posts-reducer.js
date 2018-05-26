import _ from 'lodash';
import {FETCH_POSTS, FETCH_POST, DELETE_POST, CREATE_POST} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case DELETE_POST:
            console.log('@reducer delete_post id=', action.payload);
            return _.omit(state, action.payload);

        case FETCH_POST:
            const post = action.payload.data;
            return {...state, [post.id]: post};

        case FETCH_POSTS:
            // return _.mapKeys(action.payload.data, "id");
            return Object.assign([], action.payload.data);

        case CREATE_POST:
            return [Object.assign([], action.payload.data), ...state];

        default:
            return state;
    }
}