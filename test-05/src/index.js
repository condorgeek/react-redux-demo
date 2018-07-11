import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';
import anime from 'animejs';

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

        anime({
            targets: '#logo-animation .lines path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: function (el, i) {
                return i * 250
            },
            direction: 'alternate',
            loop: true
        });

    }

    render() {
        return (
            <div className='welcome-page'>
                <div className="welcome-header">
                    <div id="logo-animation" className="logo-animation">
                        {/*<svg viewBox="-70 15 360 60" style={{backgroundColor: 'black'}}>*/}
                        <svg viewBox="-100 15 420 60" style={{backgroundColor: 'black'}}>
                            <g fill="#101010" fillRule="evenodd" stroke="red" strokeWidth="0.5" className="lines">
                                <path
                                    d="m 16.82183,39.152709 v 15.747999 q 2.568222,-1.213555 5.531555,-1.213555 2.314223,0 3.922889,-1.552223 1.608667,-1.552222 1.608667,-3.838222 h 7.761111 q 0,5.277556 -3.951111,9.228667 1.778,1.608666 2.850444,4.092222 1.100667,2.483555 1.100667,5.108222 v 7.196666 h -7.761111 v -7.196666 q 0,-2.257778 -1.636889,-3.838222 -1.608667,-1.608667 -3.894667,-1.608667 -2.229555,0 -3.894666,1.608667 -1.636889,1.580444 -1.636889,3.838222 v 7.478889 H 9.1171637 V 39.152709 Z"
                                    stroke="#ff0000"/>
                                <path
                                    d="m 44.679808,39.717153 q 1.580444,0 2.737555,1.157111 1.157111,1.157111 1.157111,2.765778 0,1.580444 -1.157111,2.737555 -1.157111,1.157111 -2.737555,1.157111 -1.608667,0 -2.765778,-1.157111 -1.157111,-1.157111 -1.157111,-2.737555 0,-1.636889 1.128889,-2.765778 1.157111,-1.157111 2.794,-1.157111 z m 3.894666,8.579555 V 73.922485 H 40.756919 V 48.296708 Z"
                                    stroke="#ff7f00"/>
                                <path
                                    d="m 61.470268,39.152709 v 15.747999 q 2.568222,-1.213555 5.531555,-1.213555 2.314222,0 3.922889,-1.552223 1.608666,-1.552222 1.608666,-3.838222 h 7.761111 q 0,5.277556 -3.951111,9.228667 1.778,1.608666 2.850445,4.092222 1.100666,2.483555 1.100666,5.108222 v 7.196666 h -7.761111 v -7.196666 q 0,-2.257778 -1.636888,-3.838222 -1.608667,-1.608667 -3.894667,-1.608667 -2.229556,0 -3.894667,1.608667 -1.636888,1.580444 -1.636888,3.838222 v 7.478889 H 53.765601 V 39.152709 Z"
                                    stroke="#ffbf00"/>
                                <path
                                    d="m 89.328245,39.717153 q 1.580445,0 2.737556,1.157111 1.157111,1.157111 1.157111,2.765778 0,1.580444 -1.157111,2.737555 -1.157111,1.157111 -2.737556,1.157111 -1.608666,0 -2.765778,-1.157111 -1.157111,-1.157111 -1.157111,-2.737555 0,-1.636889 1.128889,-2.765778 1.157111,-1.157111 2.794,-1.157111 z m 3.894667,8.579555 V 73.922485 H 85.405356 V 48.296708 Z"
                                    stroke="#ffff00"/>
                                <path
                                    d="m 111.65026,48.296708 q 5.44689,0 9.36978,3.781778 3.92289,3.753555 3.92289,9.200444 h -7.76111 q 0,-2.257778 -1.63689,-3.838222 -1.60867,-1.580444 -3.89467,-1.580444 -2.20133,0 -3.86644,1.608666 -1.66511,1.608667 -1.66511,3.81 V 73.922485 H 98.414039 V 61.27893 q 0,-5.475111 3.866441,-9.228666 3.86645,-3.753556 9.36978,-3.753556 z"
                                    stroke="#00ff00"/>
                                <path
                                    d="m 134.85863,39.717153 q 1.58044,0 2.73755,1.157111 1.15711,1.157111 1.15711,2.765778 0,1.580444 -1.15711,2.737555 -1.15711,1.157111 -2.73755,1.157111 -1.60867,0 -2.76578,-1.157111 -1.15711,-1.157111 -1.15711,-2.737555 0,-1.636889 1.12889,-2.765778 1.15711,-1.157111 2.794,-1.157111 z m 3.89466,8.579555 v 25.625777 h -7.81755 V 48.296708 Z"
                                    stroke="#00ffff"/>
                                <path
                                    d="m 151.64909,39.152709 v 15.747999 q 2.56822,-1.213555 5.53155,-1.213555 2.31422,0 3.92289,-1.552223 1.60867,-1.552222 1.60867,-3.838222 h 7.76111 q 0,5.277556 -3.95111,9.228667 1.778,1.608666 2.85044,4.092222 1.10067,2.483555 1.10067,5.108222 v 7.196666 h -7.76111 v -7.196666 q 0,-2.257778 -1.63689,-3.838222 -1.60867,-1.608667 -3.89467,-1.608667 -2.22955,0 -3.89467,1.608667 -1.63688,1.580444 -1.63688,3.838222 v 7.478889 h -7.70467 V 39.152709 Z"
                                    stroke="#0080ff"/>
                                <path
                                    d="m 179.50706,39.717153 q 1.58045,0 2.73756,1.157111 1.15711,1.157111 1.15711,2.765778 0,1.580444 -1.15711,2.737555 -1.15711,1.157111 -2.73756,1.157111 -1.60866,0 -2.76577,-1.157111 -1.15712,-1.157111 -1.15712,-2.737555 0,-1.636889 1.12889,-2.765778 1.15711,-1.157111 2.794,-1.157111 z m 3.89467,8.579555 v 25.625777 h -7.81756 V 48.296708 Z"
                                    stroke="#0000ff"/>
                                <path
                                    d="m 202.41478,41.906921 q 1.43375,0.664939 1.99664,2.201485 0.56288,1.536546 -0.11394,2.995905 -0.66494,1.433756 -2.20148,1.996641 -1.53655,0.562883 -2.9703,-0.102056 -1.45937,-0.676816 -2.02224,-2.21336 -0.56289,-1.536547 0.10206,-2.970303 0.68868,-1.484963 2.18775,-2.034117 1.53655,-0.562883 3.02151,0.125805 z m -0.0765,9.421853 -10.78154,23.247341 -7.09197,-3.289078 10.78153,-23.247343 z"
                                    stroke="#8b00ff"/>
                            </g>
                        </svg>
                    </div>
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
                    <p className="mt-4">Free yourself from fake news and purge hate speech. No more tracking and
                        marketing of your
                        life data.</p>

                </div>

                <div className="form-footer">
                    <p className="text-muted"> &copy; 2018 &nbsp;<LogoSimple/> is the free, open social media platform.
                        All rights reserved. Read about our <Link to="/terms"> Terms of Use</Link> and <Link
                            to='/privacy-policy'>Privacy
                            Policy</Link>.</p>
                </div>
            </div>
        )
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
