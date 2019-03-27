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
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {Link} from 'react-router-dom';

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
import {isConfiguration} from "./actions/bearer-config";
import Configuration from "./components/navigation/configuration";
import StandardPage from "./spaces/standard-page";
import SlideoutNavigation from "./components/navigation/slideout-navigation";

const createStoreWithMiddleware = applyMiddleware(thunk, promiseMiddleware)(createStore);

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

const theme = React.createContext('institutmed-theme');

const Footer = (props) => {
    return <div className="footer-container">
        <footer className="footer">
            <div className="containerss">
                <div className="footer-navigation">
                    <div className="footer-nav-logo">Institut für Ganzheitsmedizin e.V.</div>
                    <div className="footer-nav-entry"><Link to="/public/page/imprint">Impressum</Link></div>
                    <div className="footer-nav-entry"><Link to='/public/page/privacy-policy'>Datenschutz</Link></div>
                </div>
                <div className="footer-container-body">
                    <p>© 2019, München - Institut für Ganzheitsmedizin e.V. Alle Rechte vorbehalten.</p>
                    <p>Verantwortlich für den Inhalt gem. §10 Abs.3 MDStV: Institut für Ganzheitsmedizin e.V.
                        D-81671 Muenchen, Germany. Das Institut arbeitet gemeinnützig anerkannt zur Förderung der
                        Wissenschaft, Forschung und Bildung, des öffentlichen Gesundheitswesens und der
                        Weltgesundheit.</p>
                    <p>VR 205146 München • StNr 143/217/16254 • BetriebsNr 30382260<br/>Tel: +49-89-740 61 962
                        • Fax: +49-89-490 53 045 • info@institut-ganzheitsmedizin.de</p>
                    <p>The Institute is a non-profit- organization for science, research and teaching, for public
                        health and International health.</p>
                </div>
            </div>
            <div className="author flex-row-reverse">
                © Kikirikii Social Plattform - Cybergent Ltd - Marcelo H. Krebber - marcelo.krebber@gmail.com
            </div>
        </footer>
    </div>
};

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Configuration>
            <BrowserRouter>
                <div>
                    <Navigation/>
                    <div id="slide-menu-id" className="slide-navigation">
                        <SlideoutNavigation/>
                    </div>

                    <div id="slide-panel-id" className='container-fluid'>
                        <Switch>
                            <Route path={"/login"} component={LoginForm}/>
                            <Route path={"/create/account"} component={CreateAccountForm}/>
                            <PrivateRoute path="/:username/home" component={HomeSpace}/>
                            <PrivateRoute path="/:username/space/:spaceId" component={GenericSpace}/>
                            <PrivateRoute path="/:username/page/:pagename" component={StandardPage}/>
                            <PrivateRoute path="/:username/public" component={PublicSpace}/>
                            <PrivateRoute path="/:username" strict component={HomeSpace}/>
                            <Route path="/" component={LandingPage}/>
                        </Switch>
                    </div>
                    <Footer/>
                </div>
            </BrowserRouter>
        </Configuration>
    </Provider>

    , document.getElementById('root'), () => {
        OverlayScrollbars(document.querySelectorAll('body'), {
            callbacks: {
                onScrollStop: event => {
                    showForceVisibleImages();
                }
            }
        });
    });
