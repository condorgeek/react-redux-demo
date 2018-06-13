import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect, Link} from 'react-router-dom';
import './index.css';

import Navigation from './components/navigation';
import PublicSpace from './public-space';
import HomeSpace from './home-space';
import LoginForm, {PrivateRoute} from './components/login-form';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

const Welcome = (props) => {
    console.log(props);
    return (
        <div className="welcome-page">
                <div className="welcome-video">
                        <video id="video-id" loop="loop" muted="muted" autoPlay="autoplay">
                            <source src="http://localhost:9000/kikirikii-rooster-low.mp4" type="video/mp4"/>
                        </video>
                </div>
                <div className="content">
                    <h3>Welcome to Kikirikii</h3>
                    <p>The Open Social Media Plattform for communities. No hassles, no tracking, no spying on you... Your data belongs to you only.
                        No unwanted, harrassing postings. Time to speak out.</p>
                </div>
        </div>)
};

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div className='violett-sheme'>
                <Navigation/>

                <div className='container-fluid'>
                    <Switch>
                        {/*<Route path="/posts/new" component={PostsNew}/>*/}
                        {/*<Route path="/posts/:id" component={PostsShow}/>*/}
                        {/*<Route path={"/author/:author/:id"} component={AuthorShow}/>*/}
                        <Route path={"/login"} component={LoginForm}/>
                        <PrivateRoute path="/:username/home" component={HomeSpace}/>
                        <PrivateRoute path="/:username/public" component={PublicSpace}/>
                        <PrivateRoute path="/:username" strict component={PublicSpace}/>
                        <Route path="/" component={Welcome}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'), () => {
        OverlayScrollbars(document.querySelectorAll('body'), {});
    });
