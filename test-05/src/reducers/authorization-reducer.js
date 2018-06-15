import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST} from "../actions";


const bearer = JSON.parse(localStorage.getItem('bearer'));
const initial = bearer ? {status: 'success', user: {username: bearer.username} } : {};

export default function (state = initial, action) {

    switch (action.type) {
        case LOGIN_REQUEST:
            return {status: 'request', user: null};

        case LOGIN_SUCCESS:
            return {status: 'success', user: action.user};

        case LOGIN_FAILURE:
            return {status: 'error', user: null, error: action.error};

        case LOGOUT_REQUEST:
            return {status: 'logout', user: null};

        default:
            return state;
    }
}