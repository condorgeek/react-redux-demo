import _ from 'lodash';
import {FETCH_FOLLOWERS} from "../actions";

export default function (state = {}, action) {

    switch (action.type) {

        case FETCH_FOLLOWERS:
            return _.mapKeys(action.payload.data, "id");

        default:
            return state;
    }
}