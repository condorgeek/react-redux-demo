import {CREATE_LIKE} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case CREATE_LIKE:
            if( state[action.meta.id] === undefined) {
                state[action.meta.id] = [];
            }
            return {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        default:
            return state;
    }

}

