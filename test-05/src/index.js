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

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';

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
// import LandingPage from './components/landingpage/landing-page';
import SimpleLandingPage from "./components/landingpage/simple-landing-page";

import Configuration from "./components/configuration/configuration";
import StandardPage from "./spaces/standard-page";
import SlideoutNavigation from "./components/slideout-navigation/slideout-navigation";
import SlideoutProvider from "./components/slideout-navigation/slideout-provider";
import {Footer} from "./components/footer/footer";

const logMiddleware = store => next => action => {
    console.log('>>>', action, store);
    next(action);
};

const middleware = [thunk, promiseMiddleware, logMiddleware];
const store = createStore(reducers, applyMiddleware(...middleware));

export const IndexRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return localStorage.getItem('bearer')
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);

export const PrivateRouteStrict = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return localStorage.getItem('bearer')
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);

// effectively not doing anything because defaults to public user
export const PrivateRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return <Component {...props} />
    }}/>
);

ReactDOM.render(
    <Provider store={store}>
        <Configuration>
            <BrowserRouter>
                <SlideoutProvider>
                    <SlideoutNavigation/>
                    <div id="slide-panel-id" >
                        <div className='container-fluid'>
                        <Navigation/>
                        <Switch>
                            <Route path={"/login"} component={LoginForm}/>
                            <Route path={"/create/account"} component={CreateAccountForm}/>
                            <PrivateRoute path="/:username/home" component={HomeSpace}/>
                            <PrivateRoute path="/:username/space/:spaceId" component={GenericSpace}/>
                            <PrivateRoute path="/:username/page/:pagename" component={StandardPage}/>
                            <PrivateRoute path="/:username/public" component={PublicSpace}/>
                            <PrivateRoute path="/:username" strict component={HomeSpace}/>
                            <Route path="/" component={SimpleLandingPage}/>
                        </Switch>
                        <Footer/>
                        </div>
                    </div>
                </SlideoutProvider>
            </BrowserRouter>
        </Configuration>
    </Provider>

    , document.getElementById('root'), () => {
    });
