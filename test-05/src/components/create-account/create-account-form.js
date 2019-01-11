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

import React, {Component} from 'react';
import {Route, Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {LogoSimple, LogoSimpleRainbow, LogoRainbow} from "../logo/logo";

import PasswordForm from './password-form';
import PersonalDataForm from './personal-data-form';
import UsernameForm from './username-form';
import BasicInformationForm from './basic-information-form';
import {asyncCreateUser, ROOT_STATIC_URL} from "../../actions";

const ErrorForm = (props) =>  {
    return(
        <div className='create-account-form'>
            <LogoRainbow title='Oops'/>
            <div className="form-row mt-4 p-4">
                <div className="col-md-12 mb-3 confirmation">
                    <p>{props.formdata.firstname},</p>
                    <p>An error has occurred while creating your account on our systems.</p>
                    <p>We apologize for the inconvenience. Please try again later.</p>
                    <p className='text-danger'>{this.props.error}</p>
                </div>
                <div className="form-text text-muted text-center mb-2">
                    Press Login to start networking.
                </div>
                <Link to="/login" class="btn btn-block">Login</Link>
            </div>
        </div>)
};


const ConfirmForm = (props) =>  {
    const {configuration} = this.props;

    return(
    <div className='create-account-form'>
        <h3 className="text-center">{configuration.name}</h3>
        <h2 className="pt-2">Confirm your Email</h2>

        <div className="form-row mt-2 p-4">
            <div className="col-md-12 mb-3 confirmation">
                <p>Well done {props.formdata.firstname},</p>
                <p>Your registration was successfull. We have sent a confirmation message to your email account.
                    Please confirm the email to complete the registration process.</p>
                <p>Remember that you can change at any moment your profile settings and the visibility of your
                personal data.</p>
                <p>Happy networking and Welcome to the {configuration.name} community !</p>
            </div>
            <div className="form-text text-muted text-center mb-2">
                Press Login to start networking.
            </div>
            <Link to="/login" class="btn btn-block">Login</Link>
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
            this.props.asyncCreateUser(formdata.username, formdata);

        } else {
            this.setState({form: form, formdata: formdata});
        }
    }

    render() {
        const {formdata} = this.state;
        const {request, configuration} = this.props;

        const form = (request !== undefined && request.status === 'success') ? 'confirm' :
            (request !== undefined && request.status === 'error') ? 'error' : this.state.form;
        if (!configuration) return '';

        // const background = `${ROOT_STATIC_URL}/${configuration.cover.background}`;
        const background = `${ROOT_STATIC_URL}/application/der-taufer.jpg`;

        return (<div className="login-form-container">
                <div className="cover-image"><img src={background}/></div>

                <div className="container container-form">
                    <div className="container-form-card">
                        {form === 'basic' && <BasicInformationForm configuration={configuration} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'username' && <UsernameForm configuration={configuration} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'password' && <PasswordForm configuration={configuration} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'personaldata' && <PersonalDataForm configuration={configuration} formdata={formdata} callback={this.setForm.bind(this)}/>}
                        {form === 'confirm' && <ConfirmForm configuration={configuration} formdata={this.resetFormdata()} user={request.user}/>}
                        {form === 'error' && <ErrorForm configuration={configuration} formdata={this.resetFormdata()} error={request.error}/>}
                        </div>
                </div>

            <div className="form-footer-container text-center">
                <div className='form-footer-secondary'>
                    <p className="footer-secondary-text">
                        Wir erfassen personenbezogene Daten, um Sie zu identifizieren und Ihnen die Interaktion innerhalb der
                        Plattform des Instituts für Ganzheitsmedizin e.V. zu ermöglichen. Diese Website verkauft oder
                        veröffentlicht diese Informationen nicht und verfolgt Ihre Aktivitäten nicht für Marketingzwecke.
                        Mit der Nutzung dieser Website und ihrer Dienstleistungen erklären Sie sich mit unseren
                        Nutzungsbedingungen und Datenschutzrichtlinien einverstanden (siehe die untenstehenden Links)
                    </p>
                </div>
                <div className="form-footer">
                    <p className="text-muted"> &copy; 2018 &nbsp;{configuration.name} is the free, open social media platform.
                        All rights reserved. Read about our <Link to="/terms"> Terms of Use</Link> and <Link to='/privacy-policy'>Privacy
                            Policy</Link>.</p>
                </div>
            </div>


            </div>

        );
    }
}

function mapStateToProps(state, ownProps) {
    return {request: state.request,  configuration: state.configuration}
}

export default connect(mapStateToProps, {asyncCreateUser})(CreateAccountForm);