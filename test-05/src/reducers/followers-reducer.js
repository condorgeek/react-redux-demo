import {
    BLOCK_FOLLOWER,
    UNBLOCK_FOLLOWER,
    FETCH_FOLLOWERS,
    EVENT_FOLLOWER_ADDED,
    EVENT_FOLLOWER_DELETED
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWERS:
            return Object.assign([], action.payload.data);

        case BLOCK_FOLLOWER:
            return Object.assign([], action.payload.data);

        case UNBLOCK_FOLLOWER:
            return Object.assign([], action.payload.data);

        case EVENT_FOLLOWER_ADDED:
            return [...state, Object.assign([], action.follower)];

        case EVENT_FOLLOWER_DELETED:
            const active = state.filter( follower => { return follower.id !==  action.follower.id });
            return Object.assign([], active);

        default:
            return state;
    }
}