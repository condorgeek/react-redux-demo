import React, {Component} from 'react';
import axios from 'axios';

import {Route, Redirect, Link} from 'react-router-dom';
import {authRequest, authSuccess, authFailure} from '../actions/index';
import {connect} from 'react-redux';
import {ROOT_SERVER_URL} from "../actions/index";
import {LOGO_FULL} from "../static";


export const PrivateRoute = ({component: Component, ...parameters}) => (
    <Route {...parameters} render={props => {
        return localStorage.getItem('bearer')
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)
    }}/>
);

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {invalid: false};
    }


    loginUser(username, password) {
        const config = {
            headers: {'X-Requested-With': 'XMLHttpRequest'},
        };

        console.log(JSON.parse(localStorage.getItem('bearer')));

        this.props.authRequest({username});
        axios.post(`${ROOT_SERVER_URL}/public/login`, {username: username, password: password}, config)
            .then(response => {
                if (response.data) {
                    const bearer = {...response.data, 'username': username};
                    localStorage.setItem('bearer', JSON.stringify(bearer));
                }
                this.props.authSuccess({username});
            })
            .catch(error => {
                this.props.authFailure(error);
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!event.target.checkValidity()) {
            this.setState({invalid: true});
            return;
        }
        const data = new FormData(event.target);
        event.target.reset();

        this.loginUser(data.get('username'), data.get('password'));
    }

    logo(classname) {
        return <div className={classname}>
            <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>

        </div>
    }

    render() {
        const {invalid} = this.state;
        const {authorization} = this.props;

        if (authorization.status === 'success') {
            const {from} = this.props.location.state || {from: {pathname: `/${authorization.user.username}/public`}};
            return <Redirect to={from}/>
        }

        if (invalid && authorization.status !== 'request' && authorization.user != null) {
            this.setState({invalid: false});
        }

        return (
            <div className='full-height'>
                <div className="row justify-content-sm-center">

                    <div className="login-form">
                        <div className='logo'>
                            <img src={LOGO_FULL}/>
                            {this.logo('logo-rainbow')}
                            <div className='title'>LOGIN</div>
                        </div>

                        <form noValidate onSubmit={(event) => this.handleSubmit(event)}
                              className={invalid ? 'form-invalid' : ''}>
                            {/*<h3>Login</h3>*/}
                            <div className="form-group">
                                <label htmlFor="email-id">Email address</label>
                                <input type="text" className="form-control" id="email-id" name="username"
                                       placeholder="Enter your Email address" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordId">Password</label>
                                <input type="password" className="form-control" id="passwordId" name="password"
                                       placeholder="Enter your Password" required/>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                <span>Login
                                    {authorization.status === 'request' && <i className="fa fa-spinner fa-spin fa-fw"/>}
                                </span>
                            </button>
                            <div className="register">New to Kikirikii ?&nbsp;<Link to="/create/account"> Create
                                Account</Link> &nbsp;or&nbsp; <Link to="/reset/password"> Forgot Password ?</Link>
                            </div>

                            {authorization.status === 'error' &&
                            <div className='form-error-message text-center'>
                                <p>{authorization.error.response.data.message}</p>
                            </div>
                            }
                        </form>
                    </div>
                </div>
                <div className='privacy'>
                <span className='privacy-text'><p>
                    This website uses information from your kikirikii.com account to identify you and allow you access to the
                    Kikirikii social media plattform. By using this website and it's services you agree to our
                    Terms of Use and Privacy Policy (see the links below).
                </p></span>
                </div>

                <footer className="footer">
                    <div className="container">
                        <span className="text-muted"> &copy; 2018, {this.logo('logo-simple')} is the free, open social media platform. All rights reserved.
                            Read about our <Link to="/terms"> Terms of Use</Link> and <Link to='/privacy-policy'>Privacy Policy</Link>.</span>
                    </div>
                </footer>
            </div>
        )
    };
}

function mapStateToProps(state) {
    return {authorization: state.authorization};
}

export default connect(mapStateToProps, {authRequest, authSuccess, authFailure})(LoginForm);