import {FETCH_COMMENTS} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case FETCH_COMMENTS:
            return Object.assign([], action.payload);

        default:
            return state;
    }

}