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
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

import Navigation from './components/navigation/navigation';
import PublicSpace from './spaces/public-space';
import HomeSpace from './spaces/home-space';
import GenericSpace from './spaces/generic-space';
import MembersSpace from "./spaces/members-space";
import FriendsSpace from "./spaces/friends-space";
import PendingSpace from "./spaces/pending-space";

import LoginForm from './components/login/login-form';
import CreateAccountForm from './components/create-account/create-account-form';

import SimpleLandingPage from "./components/landingpage/simple-landing-page";
import Configuration from "./components/configuration/configuration";
import StandardPage from "./spaces/standard-page";
import SlideoutProvider from "./components/slideout-navigation/slideout-provider";
import Footer from "./components/footer/footer";
import UpdateAccount from "./components/update-account/update-account";
import ManageSite from "./components/manage-site/manage-site";
import PageNotFound from "./components/not-found/page-not-found";
import ErrorPage from "./components/not-found/error-page";

import reducers from './reducers';
import './index.css';

const logMiddleware = store => next => action => {
    console.log('>>>', action, store.getState());
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
                    <Navigation/>
                    <Switch>
                        <Route exact path={"/login"} component={LoginForm}/>
                        <Route exact path={"/create/account"} component={CreateAccountForm}/>
                        <Route exact path={"/update/account"} component={UpdateAccount}/>
                        <Route exact path={"/manage/site"} component={ManageSite}/>
                        <Route exact path={"/page-not-found"} component={PageNotFound}/>
                        <Route exact path={"/error-page"} component={ErrorPage}/>
                        <PrivateRoute path="/:username/home" exact strict component={HomeSpace}/>
                        <PrivateRoute path="/:username/space/:spaceId" exact strict component={GenericSpace}/>
                        <PrivateRoute path="/:username/members/:spaceId" exact strict component={MembersSpace}/>
                        <PrivateRoute path="/:username/friends" exact strict component={FriendsSpace}/>
                        <PrivateRoute path="/:username/pending" exact strict component={PendingSpace}/>
                        <PrivateRoute path="/:username/page/:pagename" exact strict component={StandardPage}/>
                        <PrivateRoute path="/:username/public" strict component={PublicSpace}/>
                        {/*<PrivateRoute path="/:username" strict component={HomeSpace}/>*/}
                        <Route path="/:nomatch" component={PageNotFound}/>
                        <Route path="/" component={SimpleLandingPage}/>
                    </Switch>
                    <Footer/>
                </SlideoutProvider>
            </BrowserRouter>
        </Configuration>
    </Provider>

    , document.getElementById('root'), () => {
    });
