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
import CreateAccountForm, {CreateUsernameForm, CreatePasswordForm} from './components/create-account-form';
import {LOGO_FULL, LOGO_HEAD} from "./static";


import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

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
            <div className="welcome-page">
                <div className="welcome-video">
                    <video id="video-id" loop="loop" muted="muted" autoPlay="autoplay">
                        <source src="http://localhost:9000/kikirikii-rooster-moana.mp4" type="video/mp4"/>
                    </video>
                </div>
                <div className="content">
                    <div className='logo'>
                        <img src={LOGO_FULL}/>
                        <div className='logo-rainbow'>
                            <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
                        </div>
                    </div>
                    <div className='text'><p>The Open Social Media Plattform for your community.
                        Connect to your friends and followers. Create your own space. No hassles, no tracking,
                        no spying on you... NO suspicious clouds either.. Your data belongs to you only.
                        No unwanted, harrassing postings. NO manipulation. Take control back and speak out.</p>
                    </div>

                    <div className="actions"><Link to={"/create/account"} class="btn btn-primary mr-3">Create Account</Link>
                        <Link to="/login" class="btn btn-primary">Login</Link></div>
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
                        <Route path={"/create/username"} component={CreateUsernameForm}/>
                        <Route path={"/create/password"} component={CreatePasswordForm}/>
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
