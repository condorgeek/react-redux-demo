import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Redirect, Route, Switch} from 'react-router-dom';
import './index.css';

import Navigation from './components/navigation';
import PublicSpace from './public-space';
import HomeSpace from './home-space';
import LoginForm, {PrivateRoute} from './components/login-form';
import CreateAccountForm from './components/create-account-form';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';
import {LogoWelcomeRainbow, LogoSimple} from "./components/logo";

const createStoreWithMiddleware = applyMiddleware(thunk, promiseMiddleware)(createStore);


export const IndexRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return localStorage.getItem('bearer')
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);


class Welcome extends Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    componentDidMount() {
        setTimeout(() => {
            document.getElementById('video-id').play()
                .then(() => console.log('Playing'))
                .catch((error) => console.log(error));
        }, 1000);

    }

    render() {
        return (
            <div className='welcome-page'>
                <div className="welcome-header">
                    <div className="welcome-video">
                        <video id="video-id" loop="loop" muted="muted" autoPlay="autoplay">
                            <source src="http://localhost:9000/kikirikii-rooster-moana.mp4" type="video/mp4"/>
                        </video>
                    </div>
                    <div className="sidebar">
                        <div className='text'><p>The Open Social Media Plattform for your community.</p>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <p>No hassles, no tracking, no spying on you... NO suspicious clouds either.. Your data
                        belongs
                        to you only.
                        No unwanted, harrassing postings. NO manipulation.</p>
                    <p>Take control back and speak out.</p>

                    <div className="button-content">
                        <Link to={"/create/account"} class="btn ">Get startet</Link>
                        <Link to="/login" class="btn ">Login</Link>
                    </div>

                    <p className="mt-4">Free yourself from fake news and purge hate speech. No more tracking and marketing of your
                    life data.</p>

                </div>


                {/*<div className='row'>*/}
                    {/*<div className='col col-md-12'>*/}
                        {/*<div className="content">*/}

                        {/*/!*<div className="welcome-video">*!/*/}
                        {/*/!*<video id="video-id" loop="loop" muted="muted" autoPlay="autoplay">*!/*/}
                        {/*/!*<source src="http://localhost:9000/kikirikii-rooster-moana.mp4" type="video/mp4"/>*!/*/}
                        {/*/!*</video>*!/*/}
                        {/*/!*</div>*!/*/}


                        {/*<LogoWelcomeRainbow/>*/}
                        {/*<div className='text'><p>The Open Social Media Plattform for your community.</p>*/}
                        {/*<p>Connect to your friends and followers. Create your own space.</p>*/}
                        {/*<p>No hassles, no tracking, no spying on you... NO suspicious clouds either.. Your data belongs to you only.*/}
                        {/*No unwanted, harrassing postings. NO manipulation.</p>*/}
                        {/*<p>Take control back and speak out.</p>*/}
                        {/*</div>*/}


                        {/*</div>*/}
                        {/*<div className="form-row  button-content">*/}
                            {/*<div className='col col-md-6'>*/}
                                {/*<Link to={"/create/account"} class="btn btn-primary btn-block">Create Account</Link>*/}
                            {/*</div>*/}
                            {/*<div className='col col-md-6'>*/}
                                {/*<Link to="/login" class="btn btn-primary btn-block">Login</Link>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

                <div className="form-footer">
                    <p className="text-muted"> &copy; 2018 &nbsp;<LogoSimple/> is the free, open social media platform.
                        All rights reserved. Read about our <Link to="/terms"> Terms of Use</Link> and <Link
                            to='/privacy-policy'>Privacy
                            Policy</Link>.</p>
                </div>
            </div>)
    }
}

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
                        <Route path={"/create/account"} component={CreateAccountForm}/>
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
