/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [locations.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 20.11.19, 16:27
 */

import {authConfig} from "./local-storage";

export const environment = {
    /* server locations */
    ROOT_STATIC_URL: window._env_.REACT_APP_ROOT_STATIC_URL,
    ROOT_SERVER_URL: window._env_.REACT_APP_ROOT_SERVER_URL,
    ROOT_CLIENT_URL: window._env_.REACT_APP_ROOT_CLIENT_URL,
    ROOT_STOMP_SERVER: window._env_.REACT_APP_STOMP_SERVER,
    ROOT_USER_URL: window._env_.REACT_APP_SERVER_SECURE_URL,
    ROOT_PUBLIC_URL: window._env_.REACT_APP_SERVER_PUBLIC_URL,
    DEFAULT_PUBLIC_USER: window._env_.REACT_APP_PUBLIC_USER,

    /* default reserved page names */
    PRIVACY_POLICY_PAGE: window._env_.REACT_APP_PRIVACY_POLICY_PAGE,
    CONTACT_PAGE: window._env_.REACT_APP_CONTACT_PAGE,
    TERMS_OF_USE_PAGE: window._env_.REACT_APP_TERMS_OF_USE_PAGE,
    NOT_FOUND_PAGE: window._env_.REACT_APP_NOT_FOUND_PAGE,
    IMPRINT_PAGE: window._env_.REACT_APP_IMPRINT_PAGE,

    /* configuration */
    // COPY_FILE: window._env_.REACT_APP_COPY_FILE,
    COPY_FILE: 'salsapeople-copy.js',
    SITE_PERSONALITY: 'salsapeople'
};

export const getPublicUser = () => environment.DEFAULT_PUBLIC_USER;

export const getStompServerUrl = () => environment.ROOT_STOMP_SERVER;

export const getPrivacyPolicyPageUrl = () => environment.PRIVACY_POLICY_PAGE;

export const getImprintPageUrl = () => environment.IMPRINT_PAGE;

export const getStaticImageUrl = imagename => `${environment.ROOT_STATIC_URL}/${imagename}`;

export const getRootServerUrl = path => `${environment.ROOT_SERVER_URL}/${path}`;

export const getPostsUploadUrl = username => `${environment.ROOT_SERVER_URL}/user/${username}/posts/upload`;

export const getAvatarUploadUrl = username => `${environment.ROOT_SERVER_URL}/user/${username}/avatar/upload`;

export const getLoginUrl = () => `${environment.ROOT_SERVER_URL}/public/login`;

export const getPublicUserHome = () => `/${environment.DEFAULT_PUBLIC_USER}/home`;

export const getMediaUploadPath = (username, space) => `${environment.ROOT_SERVER_URL}/user/${username}/media/upload/${space}`;

export const getValidateEmailUrl = email => `${environment.ROOT_SERVER_URL}/public/validate/email?value=${email}`;

export const getValidateUsernameUrl = username => `${environment.ROOT_SERVER_URL}/public/validate/username?value=${username}`;

export const getCopyFileUrl = () => `${process.env.PUBLIC_URL}/static/copy/${environment.SITE_PERSONALITY}-copy.js`;

console.log('ENVIRONMENT', environment);
