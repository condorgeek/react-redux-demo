import _ from 'lodash';
import {FETCH_FRIENDS} from "../actions";

export default function (state = [], action) {

    switch (action.type) {

        case FETCH_FRIENDS:
            return Object.assign([], action.payload.data);


        default:
            return state;
    }
}