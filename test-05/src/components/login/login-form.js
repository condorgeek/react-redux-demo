/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [login-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.09.18 18:50
 */

import React, {Component} from 'react';
import axios from 'axios';

import {Link, Redirect} from 'react-router-dom';
import {authFailure, authRequest, authSuccess} from '../../actions/index';
import {connect} from 'react-redux';
import {getBearer, saveBearer, isSuperUser} from "../../actions/local-storage";
import {getLoginUrl, getStaticImageUrl} from "../../actions/environment";
import {ConfigurationContext} from "../configuration/configuration";
import {animateElement, TextAsHTML} from "../util/text-utils";

const renderTextAsHTML = (text) => {
    return text.map(entry => <TextAsHTML>{entry}</TextAsHTML>)
};

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {invalid: false};
    }

    loginUser(username, password) {
        const config = {
            headers: {'X-Requested-With': 'XMLHttpRequest'},
        };

        this.props.authRequest({username});
        axios.post(getLoginUrl(), {username: username, password: password}, config)
        .then(response => {
            if (response.data) {
                saveBearer({...response.data, 'username': username});
            }
            this.props.authSuccess({username: username, isSuperUser: isSuperUser(response.data)});
        })
        .catch(error => {
            this.props.authFailure(error);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!event.target.checkValidity()) {
            this.setState({invalid: true});
            animateElement(document.getElementById("loginId"));
            return;
        }
        const data = new FormData(event.target);
        event.target.reset();

        this.loginUser(data.get('username'), data.get('password'));
    }


    getErrorMessage(error) {
        return error.response !== undefined ? error.response.data.message : JSON.stringify(error);
    }

    render() {
        const {invalid} = this.state;
        const {authorization, configuration, Copy} = this.props;

        console.log('CONTEXT', Copy);

        if (authorization.status === 'success') {
            // const {from} = this.props.location.state || {from: {pathname: `/${authorization.user.username}/public`}};
            const {from} = this.props.location.state || {from: {pathname: `/${authorization.user.username}/home`}};
            return <Redirect to={from}/>
        }

        if (invalid && authorization.status !== 'request' && authorization.user != null) {
            this.setState({invalid: false});
        }

        // if (!configuration) return '';

        return (
            <div className="login-form-container">

                <div className="cover-image">
                    <img src={Copy ? getStaticImageUrl(Copy.loginPage.background) : ''}/>
                </div>

                <div className="container-form">
                        <div className="create-account-form login-form">
                            <h3 className="text-center">{Copy && Copy.navigation.fullName}</h3>
                            <h2 className="pt-3">Login</h2>
                            <form noValidate onSubmit={(event) => this.handleSubmit(event)}
                                  className={invalid ? 'form-invalid' : ''}>
                                <div className="form-row mt-2">
                                    <div className="col-md-12 mb-3">

                                        <div className="form-group">
                                            <label htmlFor="email-id">Email address</label>
                                            <input type="text" className="form-control" id="email-id"
                                                   name="username"
                                                   placeholder="Enter your Username" required/>
                                            {authorization.status === 'error' &&
                                            <div className='form-error-message'>
                                                <p>{this.getErrorMessage(authorization.error)}</p>
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
                                                <p>{this.getErrorMessage(authorization.error)}</p>
                                            </div>
                                            }
                                        </div>

                                        {/*<button type="submit" className="btn btn-lg btn-block mt-5" id="loginId">*/}
                                        <button type="submit" className="btn btn-lg btn-primary btn-block mt-5" id="loginId">
                                                    <span>Login {authorization.status === 'request' &&
                                                    <i className="fa fa-spinner fa-spin fa-fw"/>}</span>
                                        </button>

                                    </div>
                                </div>
                            </form>

                            <div className="register">New here ?&nbsp;<Link
                                to="/create/account"> Create
                                Account</Link> &nbsp;or&nbsp; <Link to="/reset/password"> Forgot
                                Password
                                ?</Link>
                            </div>
                        </div>
                </div>

                <div className="form-footer-container text-center">
                    <div className='form-footer-secondary'>
                        <p className="footer-secondary-text">
                            {Copy && renderTextAsHTML(Copy.loginPage.text)}
                        </p>
                    </div>
                </div>

            </div>
        )
    };
}

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<LoginForm {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

function mapStateToProps(state) {
    return {authorization: state.authorization, configuration: state.configuration};
}

export default connect(mapStateToProps, {authRequest, authSuccess, authFailure})(withConfigurationContext);