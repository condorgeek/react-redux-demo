import {
    ACCEPT_FRIEND,
    ADD_FRIEND,
    BLOCK_FRIEND,
    CANCEL_FRIEND,
    DELETE_FRIEND,
    FETCH_FRIENDS,
    FETCH_FRIENDS_PENDING,
    IGNORE_FRIEND,
    EVENT_FRIEND_ACCEPTED,
    EVENT_FRIEND_IGNORED,
    EVENT_FRIEND_REQUESTED,
    EVENT_FRIEND_BLOCKED,
    EVENT_FRIEND_UNBLOCKED,
    EVENT_FRIEND_DELETED,
    EVENT_FRIEND_CANCELLED,
    UNBLOCK_FRIEND
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FRIENDS:
            return Object.assign([], action.payload.data);

        case DELETE_FRIEND:
            return Object.assign([], action.payload.data);

        case BLOCK_FRIEND:
            return Object.assign([], action.payload.data);

        case UNBLOCK_FRIEND:
            return Object.assign([], action.payload.data);

        case ACCEPT_FRIEND:
            return [...state, Object.assign([], action.payload.data)];

        case EVENT_FRIEND_ACCEPTED:
            return [...state, Object.assign([], action.user)];

        case EVENT_FRIEND_BLOCKED:
        case EVENT_FRIEND_UNBLOCKED:
            return state.map(friend => {
                return friend.id === action.user.id ? {...friend, ...action.user} : friend;
            });

        case EVENT_FRIEND_DELETED:
            const active = state.filter( friend => { return friend.id !==  action.user.id });
            return Object.assign([], active);

        default:
            return state;
    }
}

export function FriendsPending (state = [], action) {

    switch (action.type) {

        case ADD_FRIEND:
            return Object.assign([], action.payload.data);

        case FETCH_FRIENDS_PENDING:
            return Object.assign([], action.payload.data);

        case IGNORE_FRIEND:
            return Object.assign([], action.payload.data);

        case CANCEL_FRIEND:
            return Object.assign([], action.payload.data);

        case ACCEPT_FRIEND:
            const accepted = action.payload.data;
            const pending = state.filter((friend) => { return friend.id !== accepted.id });
            return Object.assign([], pending);

        case EVENT_FRIEND_REQUESTED:
            return [...state, Object.assign([], action.user)];

        case EVENT_FRIEND_IGNORED:
        case EVENT_FRIEND_ACCEPTED:
        case EVENT_FRIEND_CANCELLED:
            const pending_msg = state.filter( friend => { return friend.id !==  action.user.id });
            return Object.assign([], pending_msg);

        default:
            return state;
    }
}