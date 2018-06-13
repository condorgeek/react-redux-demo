import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case LOGIN_REQUEST:
            return {status: 'request', user: null};

        case LOGIN_SUCCESS:
            return {status: 'success', user: action.user};

        case LOGIN_FAILURE:
            return {status: 'error', user: null, error: action.error};

        default:
            return state;
    }
}