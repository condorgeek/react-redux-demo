/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [selectors.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 20.11.19, 17:38
 */

import {environment as env} from "../actions/environment";
import {loginStatus} from "../actions";

export const resolveHomePage = state => {
    const {authorization, configuration} = state;
    const isHomepage = configuration && configuration.public.homepage;

    if (authorization && authorization.status === loginStatus.SUCCESS) {
        return isHomepage ? `/${configuration.public.homepage}/home` : '/';
    }
    return isHomepage ? `/${env.DEFAULT_PUBLIC_USER}/home` : '/';

};

export const isTransitioning = state => {
    const {authorization} = state;

    return authorization.status === loginStatus.REQUEST || authorization.status === loginStatus.LOGOUT ||
        authorization.status === loginStatus.ERROR;
};

export const isAuthorized = state => state.authorization && state.authorization.status === loginStatus.SUCCESS;
export const isSuperUser = state => isAuthorized(state) && state.authorization.user.isSuperUser;

// resolveHomePage(authorization, configuration) {
//     const isHomepage = configuration && configuration.public.homepage;
//
//     if (authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
//         return isHomepage ? `/${configuration.public.homepage}/home` : '/';
//     }
//     return isHomepage ? `/${DEFAULT_PUBLIC_USER}/home` : '/';
// }

// export const resolveHomePage = state => {
//     const {authorization, configuration} = state;
//
//     console.log('CONFIGURATION', authorization, configuration);
//
//     if(authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
//         return `/${authorization.user.username}/home`;
//     }
//     return configuration && configuration.public.homepage ? `/${env.DEFAULT_PUBLIC_USER}/home` : '/';
//
// };