import _ from 'lodash';
import {FETCH_FOLLOWERS} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FOLLOWERS:
            return Object.assign([], action.payload.data);

        default:
            return state;
    }
}