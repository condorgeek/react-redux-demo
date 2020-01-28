/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [create-account-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 20.07.18 09:39
 */

import _ from 'lodash';
import moment from 'moment';

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {LogoRainbow} from "../logo/logo";
import {asyncCreateUser} from "../../actions";
import {ConfigurationContext} from "../configuration/configuration";

import PasswordForm from './password-form';
import UsernameForm from './username-form';
import BasicInformationShortForm from "./basic-information-short-form";
import PersonalDataShortForm from "./personal-data-short-form";
import {TextAsHTML} from "../util/text-utils";
import {Button, ButtonLink} from "../navigation-buttons/nav-buttons";
import {BackgroundImage} from "../util/background-image";

const renderTextAsHTML = (text) => {
    return text.map(entry => <TextAsHTML>{entry}</TextAsHTML>)
};

const ErrorForm = (props) =>  {
    return(
        <div className='create-account-form'>
            <LogoRainbow title='Oops'/>
            <div className="form-row mt-4 p-4">
                <div className="col-md-12 mb-3 confirmation">
                    <p>{props.formdata.firstname},</p>
                    <p>An error has occurred while creating your account on our systems.</p>
                    <p>We apologize for the inconvenience. Please try again later.</p>
                    <p className='text-danger'>{props.error}</p>
                </div>
                <div className="form-text text-muted text-center mb-2">
                    Press Login to start networking.
                </div>
                <ButtonLink to="/login" className="btn-block">Login</ButtonLink>
            </div>
        </div>)
};


const ConfirmForm = ({Copy, formdata}) =>  {

    return(
    <div className='create-account-form'>
        <h3 className="text-center">{Copy && Copy.fullName}</h3>
        <h2 className="pt-2">Confirm your Email</h2>

        <div className="form-row mt-2 p-4">
            <div className="col-md-12 mb-3 confirmation">
                <p>Well done {formdata.firstname},</p>
                <p>Your registration was successfull. We have sent a confirmation message to your email account.
                    Please confirm the email to complete the registration process.</p>
                <p>Remember that you can change at any moment your profile settings and the visibility of your
                personal data.</p>
                <p>Happy networking and Welcome to the {Copy && Copy.fullName} community !</p>
            </div>
            <div className="form-text text-muted text-center mb-2">
                Press Login to start networking.
            </div>
            <ButtonLink to="/login" className="btn-block">Login</ButtonLink>
        </div>
    </div>)
};

class CreateAccountForm extends Component {
    constructor(props) {
        super(props);
        this.state = {form: 'basic', formdata: null}
    }

    resetFormdata() {
        return _.mapValues(this.state.formdata, (v, k) => {
            return k === 'firstname' || k === 'lastname' || k === 'email' ? v : null;
        });
    }

    setForm(form, data) {
        const formdata = {...this.state.formdata, ...data};
        if (form === 'create_account') {
            formdata['birthday'] = moment(formdata['birthday']).format('DD/MM/YYYY');
            this.props.asyncCreateUser(formdata.username, formdata);

        } else {
            this.setState({form: form, formdata: formdata});
        }
    }

    render() {
        const {formdata} = this.state;
        const {request, configuration, Copy} = this.props;

        const form = (request !== undefined && request.status === 'success') ? 'confirm' :
            (request !== undefined && request.status === 'error') ? 'error' : this.state.form;

        if (!configuration || !Copy) return null;

        return (<div className="login-form-container">
                <BackgroundImage toggle background={Copy.registerPage.background}/>

                <div className="container container-form">
                    <div className="container-form-card">
                        {form === 'basic' && <BasicInformationShortForm Copy={Copy} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'username' && <UsernameForm Copy={Copy} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'password' && <PasswordForm Copy={Copy} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'personaldata' && <PersonalDataShortForm Copy={Copy} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'confirm' && <ConfirmForm Copy={Copy} formdata={this.resetFormdata()} user={request.user}/>}
                        {form === 'error' && <ErrorForm Copy={Copy} formdata={this.resetFormdata()} error={request.error}/>}
                        </div>
                </div>

            <div className="form-footer-container">
                <div className='form-footer-secondary'>
                    <p className="footer-secondary-text">
                        {Copy && renderTextAsHTML(Copy.registerPage.text)}
                    </p>
                </div>
            </div>
            </div>

        );
    }
}

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<CreateAccountForm {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

function mapStateToProps(state, ownProps) {
    return {request: state.request,  configuration: state.configuration}
}

export default connect(mapStateToProps, {asyncCreateUser})(withConfigurationContext);