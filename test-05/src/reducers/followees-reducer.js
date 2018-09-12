import _ from 'lodash';
import {
    ADD_FOLLOWEE,
    DELETE_FOLLOWEE,
    EVENT_FOLLOWER_BLOCKED,
    EVENT_FOLLOWER_UNBLOCKED,
    FETCH_FOLLOWEES
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWEES:
            return Object.assign([], action.payload.data);

        case ADD_FOLLOWEE:
            return Object.assign([], action.payload.data);

        case DELETE_FOLLOWEE:
            return Object.assign([], action.payload.data);

        // actually followee..
        case EVENT_FOLLOWER_BLOCKED:
        case EVENT_FOLLOWER_UNBLOCKED:
            return state.map(follower => {
                return follower.id === action.follower.id ? {...follower, ...action.follower} : follower;
            });

        default:
            return state;
    }
}