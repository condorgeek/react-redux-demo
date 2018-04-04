import {FETCH_CONTACTS} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case FETCH_CONTACTS:
            return Object.assign([], action.payload);

        default:
            return state;

    }
}