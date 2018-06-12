import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect, Link} from 'react-router-dom';
import './index.css';

import PostsNew from './containers/posts-new';
import PostsShow from './containers/posts-show';
import AuthorShow from './containers/author-show';
import Navigation from './components/navigation';
import PublicSpace from './public-space';
import HomeSpace from './home-space';


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
                    <p>The Open Social Media Plattform for communities.</p>
                </div>
        </div>)
};


const PrivateRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props =>
        localStorage.getItem('user')
            ? (<Component {...props} />)
            // : (<Redirect to={ {pathname: "/login", state: {from: props.location}} }/>)
            : (<Redirect to="/login"/>)
    }/>
);

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {invalid: false};
        console.log('LOGIN', props);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!event.target.checkValidity()) {
            this.setState({invalid: true});
            return;
        }
        const data = new FormData(event.target);

        console.log(data.get('username'), data.get('password'));
        event.target.reset();
        this.setState({invalid: false});
    }

    render() {
        const {invalid} = this.state;

        return (
            <div className='full-height'>
                <div className="row justify-content-sm-center">
                    <div className="login-form">
                        <form noValidate onSubmit={(event) => this.handleSubmit(event)}
                              className={invalid ? 'form-invalid' : ''}>
                            <h3>Login</h3>
                            <div className="form-group">
                                <label htmlFor="email-id">Email address</label>
                                <input type="text" className="form-control" id="email-id" name="username"
                                       placeholder="Enter your Email address" required/>
                                {/*<small id="emailHelp" className="form-text text-muted">*/}
                                {/*We'll never share your email with anyone else.*/}
                                {/*</small>*/}
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordId">Password</label>
                                <input type="password" className="form-control" id="passwordId" name="password"
                                       placeholder="Enter your Password" required/>
                                {/*<div className="password-reset"><Link to="/passwordreset"> Forgot password ?</Link>*/}
                                {/*</div>*/}

                            </div>
                            {/*<div className="form-group form-check">*/}
                            {/*<input type="checkbox" className="form-check-input" id="exampleCheck1"/>*/}
                            {/*<label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>*/}
                            {/*</div>*/}
                            <button type="submit" className="btn btn-light btn-block">Login</button>
                            <div className="register">New to Kikirikii ?&nbsp;<Link to="/register"> Create
                                Account</Link> &nbsp;or&nbsp; <Link to="/register"> Forgot Password ?</Link>
                            </div>
                        </form>
                    </div>
                </div>
                <footer className="footer">
                    <div className="container">
                        <span className="text-muted">Kirikii is an open social media platform. &copy; 2018 All rights reserved.
                        Read about our <Link to="/terms"> Terms and Conditions</Link>.</span>
                    </div>
                </footer>
            </div>
        )
    };
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
                        <PrivateRoute path="/:username/home" component={HomeSpace}/>
                        <PrivateRoute path="/:username/public" component={PublicSpace}/>
                        <PrivateRoute path="/:username" strict component={PublicSpace}/>
                        {/*<Route path="/" component={PublicSpace}/>*/}
                        <Route path="/" component={Welcome}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'), () => {
        OverlayScrollbars(document.querySelectorAll('body'), {});
    });
