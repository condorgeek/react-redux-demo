import {CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {
        case CREATE_USER_REQUEST:
            return {status: 'request', user: null};

        case CREATE_USER_SUCCESS:
            return {status: 'success', user: action.user};

        case CREATE_USER_FAILURE:
            return {status: 'error', user: null, error: action.error};

        default:
            return state;
    }
}