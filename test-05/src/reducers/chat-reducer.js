import _ from 'lodash';
import {
    ADD_FOLLOWEE,
    DELETE_FOLLOWEE, EVENT_CHAT_ACK, EVENT_CHAT_SIMPLE,
    EVENT_FOLLOWER_BLOCKED,
    EVENT_FOLLOWER_UNBLOCKED,
    FETCH_FOLLOWEES
} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case EVENT_CHAT_SIMPLE:
            return {...action.data, event: action.type};

        case EVENT_CHAT_ACK:
            return {...action.data, event: action.type};

        default:
            return state;
    }
}