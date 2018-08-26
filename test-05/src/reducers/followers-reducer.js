import {BLOCK_FOLLOWER, UNBLOCK_FOLLOWER, FETCH_FOLLOWERS} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWERS:
            return Object.assign([], action.payload.data);

        case BLOCK_FOLLOWER:
            return Object.assign([], action.payload.data);

        case UNBLOCK_FOLLOWER:
            return Object.assign([], action.payload.data);

        default:
            return state;
    }
}