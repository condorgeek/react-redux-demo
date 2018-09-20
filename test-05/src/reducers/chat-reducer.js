import {EVENT_CHAT_ACK, EVENT_CHAT_SIMPLE, FETCH_CHAT_ENTRIES} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case EVENT_CHAT_SIMPLE:
            const data = {event: action.type, data: action.data};
            return [...state, Object.assign([], data)];


        case EVENT_CHAT_ACK:
            const ack = {event: action.type, data: action.data};
            return [...state, Object.assign([], ack)];

        case FETCH_CHAT_ENTRIES:
            return [...action.payload, ...state];

        default:
            return state;
    }
}