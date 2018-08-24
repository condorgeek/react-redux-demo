import _ from 'lodash';
import {ADD_FOLLOWEE, DELETE_FOLLOWEE, FETCH_FOLLOWEES} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWEES:
            return Object.assign([], action.payload.data);

            case ADD_FOLLOWEE:
                return Object.assign([], action.payload.data);

        case DELETE_FOLLOWEE:
            return state;

        default:
            return state;
    }
}