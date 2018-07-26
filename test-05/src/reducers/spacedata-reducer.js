import {FETCH_SPACEDATA, UPDATE_SPACEDATA} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case FETCH_SPACEDATA:
            return {status: 'success', payload: action.spacedata};

        case UPDATE_SPACEDATA:
            return {status: 'updated', payload: action.spacedata};

        default:
            return state;
    }
}