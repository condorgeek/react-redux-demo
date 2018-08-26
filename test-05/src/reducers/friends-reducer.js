import {
    ADD_FRIEND,
    BLOCK_FRIEND,
    DELETE_FRIEND,
    FETCH_FRIENDS,
    FETCH_FRIENDS_PENDING, IGNORE_FRIEND,
    UNBLOCK_FRIEND
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FRIENDS:
            return Object.assign([], action.payload.data);

        case ADD_FRIEND:
            return Object.assign([], action.payload.data);

        case DELETE_FRIEND:
            return Object.assign([], action.payload.data);

        case BLOCK_FRIEND:
            return Object.assign([], action.payload.data);

        case UNBLOCK_FRIEND:
            return Object.assign([], action.payload.data);

        default:
            return state;
    }
}

export function FriendsPending (state = [], action) {

    switch (action.type) {

        case FETCH_FRIENDS_PENDING:
            return Object.assign([], action.payload.data);

        case IGNORE_FRIEND:
            return Object.assign([], action.payload.data);

        default:
            return state;
    }
}