import React, {Component} from 'react';
import axios from 'axios';

import {Route, Redirect, Link} from 'react-router-dom';
import {authRequest, authSuccess, authFailure} from '../../actions/index';
import {LogoSimple, LogoSimpleRainbow, LogoRainbow} from "../logo/logo";
import {connect} from 'react-redux';
import {ROOT_SERVER_URL} from "../../actions/index";
import stompClient from '../../actions/stomp-client';


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
        // this.stomp = this.stomp.bind(this)({queue: "/app/hello", topic:"/topic/greetings"});
    }

    // stomp(props) {
    //     var client = null;
    //     var isConnected = false;
    //
    //     return {
    //         connect: () => {
    //             client = StompJS.Stomp.over(() => new SockJS('http://localhost:8080/stomp/websocket/test'));
    //             client.reconnect_delay = 10000;
    //             client.connect({}, function (frame) {
    //                 console.log('CONNECT ' + frame);
    //                 client.subscribe(props.topic, function (greeting) {
    //                     console.log('WEBSOCKET', greeting);
    //                     toastr.warning(JSON.stringify(greeting));
    //                 });
    //                 isConnected = true;
    //             });
    //         },
    //         disconnect: () => {
    //             if(isConnected) client.disconnect();
    //         },
    //         send: (message) => {
    //             if(isConnected) client.send(props.queue, {}, JSON.stringify(message));
    //         }
    //     }
    // }

    loginUser(username, password) {
        const config = {
            headers: {'X-Requested-With': 'XMLHttpRequest'},
        };

        console.log(JSON.parse(localStorage.getItem('bearer')));

        this.props.authRequest({username});
        axios.post(`${ROOT_SERVER_URL}/public/login`, {username: username, password: password}, config)
            .then(response => {
                if (response.data) {

                    console.log('login', response.data);

                    const bearer = {...response.data, 'username': username};
                    localStorage.setItem('bearer', JSON.stringify(bearer));
                }
                stompClient.connect();
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

            setTimeout(()=> {
                stompClient.send({message:"logged in successfully", from: authorization.user.username});
            }, 5000);

            return <Redirect to={from}/>
        }

        if (invalid && authorization.status !== 'request' && authorization.user != null) {
            this.setState({invalid: false});
        }

        return (
            <div>
                <div className="container container-form">
                    <div className="row">
                        <div className="col">
                            <div className="container-form-card">
                                <div className="create-account-form login-form">
                                    {/*<div className="login-form">*/}
                                    <LogoRainbow title='Login'/>
                                    <form noValidate onSubmit={(event) => this.handleSubmit(event)}
                                          className={invalid ? 'form-invalid' : ''}>
                                        <div className="form-row mt-2">
                                            <div className="col-md-12 mb-3">

                                                <div className="form-group">
                                                    <label htmlFor="email-id">Email address</label>
                                                    <input type="text" className="form-control" id="email-id"
                                                           name="username"
                                                           placeholder="Enter your Email address" required/>
                                                    {authorization.status === 'error' &&
                                                    <div className='form-error-message'>
                                                        <p>{authorization.error.response.data.message}</p>
                                                    </div>
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="passwordId">Password</label>
                                                    <input type="password" className="form-control" id="passwordId"
                                                           name="password"
                                                           placeholder="Enter your Password" required/>
                                                    {authorization.status === 'error' &&
                                                    <div className='form-error-message'>
                                                        <p>{authorization.error.response.data.message}</p>
                                                    </div>
                                                    }
                                                </div>

                                                <button type="submit" className="btn btn-block mt-5">
                                                    <span>Login {authorization.status === 'request' &&
                                                    <i className="fa fa-spinner fa-spin fa-fw"/>}</span>
                                                </button>
                                                <div className="register">New to Kikirikii ?&nbsp;<Link
                                                    to="/create/account"> Create
                                                    Account</Link> &nbsp;or&nbsp; <Link to="/reset/password"> Forgot
                                                    Password
                                                    ?</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='form-privacy'>
                            <p className="privacy-text">
                                This website uses your email address to identify you and login into
                                the <LogoSimpleRainbow/> social
                                media plattform. This website does not sell or expose publicly this information, nor tracks
                                your activity for marketing purposes. By using this website and it's services you agree
                                to our Terms of Use and Privacy Policy (see the links below).
                            </p>
                        </div>
                    </div>
                </div>
                <div className="form-footer">
                    <p className="text-muted"> &copy; 2018 &nbsp;<LogoSimple/> is the free, open social media platform.
                        All rights reserved. Read about our <Link to="/terms"> Terms of Use</Link> and <Link
                            to='/privacy-policy'>Privacy
                            Policy</Link>.</p>
                </div>
            </div>


        )
    };
}

function mapStateToProps(state) {
    return {authorization: state.authorization};
}

export default connect(mapStateToProps, {authRequest, authSuccess, authFailure})(LoginForm);