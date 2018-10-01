import {
    EVENT_CHAT_CONSUMED,
    EVENT_CHAT_CONSUMED_ACK,
    EVENT_CHAT_DELIVERED,
    EVENT_CHAT_DELIVERED_ACK, EVENT_CHAT_RECEIVED, FETCH_CHAT_COUNT,
    FETCH_CHAT_ENTRIES
} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case EVENT_CHAT_DELIVERED:
        case EVENT_CHAT_DELIVERED_ACK:

            const data = {event: action.type, data: action.data};
            return [...state, Object.assign([], data)];

        case EVENT_CHAT_CONSUMED:

            console.log('EVENT_CHAT_CONSUMED', action.data);
            const consumed = {event: action.type, data: action.data};
            return state.map(entry => {
                return entry.data.id === action.data.id ? {...entry, ...consumed} : entry;
            });

        case EVENT_CHAT_CONSUMED_ACK:

            console.log('EVENT_CHAT_CONSUMED_ACK', action.data);
            const consumed_ack = {event: action.type, data: action.data};
            return state.map(entry => {
                return entry.data.id === action.data.id ? {...entry, ...consumed_ack} : entry;
            });

        case EVENT_CHAT_RECEIVED:

            const received = {event: action.type, data: action.data};
            return state.map(entry => {
                return entry.data.id === action.data.id ? {...entry, ...received} : entry;
            });

        case FETCH_CHAT_ENTRIES:

            // return [...action.payload, ...state];
            return action.payload;

        default:
            return state;
    }
}

export function ChatCountReducer(state = {}, action) {

    switch (action.type) {
        case EVENT_CHAT_CONSUMED_ACK:
            return state;

        case FETCH_CHAT_COUNT:
            return action.payload;

        default:
            return state;
    }
}