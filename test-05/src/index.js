/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [index.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 21:01
 */

import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import './index.css';

import Navigation from './components/navigation/navigation';
import PublicSpace from './spaces/public-space';
import HomeSpace from './spaces/home-space';
import GenericSpace from './spaces/generic-space';

import LoginForm from './components/login/login-form';
import CreateAccountForm from './components/create-account/create-account-form';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import promiseMiddleware from 'redux-promise';
import reducers from './reducers';
import {showForceVisibleImages} from "./actions/image-handler";
import LandingPage from './components/landingpage/landing-page';
import {getSiteConfiguration, isConfiguration, isPreAuthorized} from "./actions/bearer-config";

const createStoreWithMiddleware = applyMiddleware(thunk, promiseMiddleware)(createStore);

export const IndexRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return localStorage.getItem('bearer')
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);

export const PrivateRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        const {publicpage} = getSiteConfiguration();

        return (isPreAuthorized() || publicpage) ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);


ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div className='violett-sheme'>
                <Navigation/>

                <div className='container-fluid'>
                    <Switch>
                        <Route path={"/login"} component={LoginForm}/>
                        <Route path={"/create/account"} component={CreateAccountForm}/>
                        <PrivateRoute path="/:username/home" component={HomeSpace}/>
                        <PrivateRoute path="/:username/space/:spaceId" component={GenericSpace}/>
                        <PrivateRoute path="/:username/public" component={PublicSpace}/>
                        {/*<PrivateRoute path="/:username" strict component={PublicSpace}/>*/}
                        <PrivateRoute path="/:username" strict component={HomeSpace}/>
                        {/*<Route path="/" component={Welcome}/>*/}
                        <Route path="/" component={LandingPage}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'), () => {
        OverlayScrollbars(document.querySelectorAll('body'), {callbacks: {onScrollStop: event => {
                    showForceVisibleImages();
                }}});
    });
