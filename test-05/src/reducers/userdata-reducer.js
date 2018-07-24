import {FETCH_USERDATA, UPDATE_USERDATA} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case FETCH_USERDATA:
            return {status: 'success', payload: action.userdata};

        case UPDATE_USERDATA:
            return {status: 'updated', payload: action.userdata};

        default:
            return state;
    }
}