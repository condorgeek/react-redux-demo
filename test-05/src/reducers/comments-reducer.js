import {FETCH_COMMENTS, CREATE_COMMENT} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case FETCH_COMMENTS:
            return  {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        case CREATE_COMMENT:
            state[action.meta.id].unshift(action.payload.data);
            return {...state, [action.meta.id]: Object.assign([], state[action.meta.id])};

        default:
            return state;
    }

}

