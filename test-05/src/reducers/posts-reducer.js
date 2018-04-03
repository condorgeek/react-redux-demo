import _ from 'lodash';
import {FETCH_POSTS, FETCH_POST, DELETE_POST} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case DELETE_POST:

            console.log('@reducer delete_post id=', action.payload);

            return _.omit(state, action.payload);

        case FETCH_POST:

            console.log('@fetch_post', action);

            const post = action.payload.data;

            // state2 = {...state};
            // state2[post.id] = post;
            // return state2;

            return {...state, [post.id]: post};



            // ACHTUNG !!!!!!!!!!!!!!!!!!!!!!!!!



        case FETCH_POSTS:
            // return _.mapKeys(action.payload.data, "id");
            return _.mapKeys(action.payload, "id");

        default:
            return state;
    }
}