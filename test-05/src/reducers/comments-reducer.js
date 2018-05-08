import {FETCH_COMMENTS} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case FETCH_COMMENTS:
            return  {...state, [action.meta.id]: Object.assign([], action.payload.data)};

        default:
            return state;
    }

}

