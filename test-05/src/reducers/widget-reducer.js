/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [widget-reducer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.02.19 17:33
 */


import {CREATE_PAGE, CREATE_WIDGET, FETCH_PAGE, FETCH_WIDGETS, LOCAL_MEDIA_RESIZE} from "../actions/spaces";

export default function WidgetReducer(state = [], action) {
    switch (action.type) {

        case FETCH_WIDGETS:
            return action.widgets;

        case CREATE_WIDGET:
            // TODO
            return state;

        default:
            return state;
    }
}

export function PageReducer(state = {}, action) {
    switch (action.type) {

        case FETCH_PAGE:
            return action.page;

        case CREATE_PAGE:
            // TODO
            return state;

        default:
            return state;
    }
}

export function ResizeReducer(state = {cols: 3}, action) {
    switch (action.type) {

        case LOCAL_MEDIA_RESIZE:
            return action.data;

        default:
            return state;
    }
}