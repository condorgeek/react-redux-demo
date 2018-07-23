import {FETCH_USERDATA} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case FETCH_USERDATA:
            return {status: 'success', payload: action.userdata};

        default:
            return state;
    }
}