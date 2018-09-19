import {EVENT_CHAT_ACK, EVENT_CHAT_SIMPLE} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case EVENT_CHAT_SIMPLE:
            const data = {...action.data, event: action.type};
            return [...state, Object.assign([], data)];


        case EVENT_CHAT_ACK:
            const ack = {...action.data, event: action.type};
            return [...state, Object.assign([], ack)];

        default:
            return state;
    }
}