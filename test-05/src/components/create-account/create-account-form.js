import _ from 'lodash';

import React, {Component} from 'react';
import {Route, Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {LogoSimple, LogoSimpleRainbow, LogoRainbow} from "../logo/logo";

import PasswordForm from './password-form';
import PersonalDataForm from './personal-data-form';
import UsernameForm from './username-form';
import BasicInformationForm from './basic-information-form';
import {asyncCreateUser} from "../../actions";



const ErrorForm = (props) =>  {
    return(
        <div className='create-account-form'>
            <LogoRainbow title='Oops'/>
            <div className="form-row mt-4 p-4">
                <div className="col-md-12 mb-3 confirmation">
                    <p>{props.formdata.firstname},</p>
                    <p>An error has occurred while creating your account on our systems.</p>
                    <p>We apologize for the inconvenience. Please try again later.</p>
                </div>
                <div className="form-text text-muted text-center mb-2">
                    Press Login to start networking.
                </div>
                <Link to="/login" class="btn btn-block">Login</Link>
            </div>
        </div>)
};


const ConfirmForm = (props) =>  {
    return(
    <div className='create-account-form'>
        <LogoRainbow title='Confirm Your Email'/>
        <div className="form-row mt-4 p-4">
            <div className="col-md-12 mb-3 confirmation">
                <p>Well done {props.formdata.firstname},</p>
                <p>Your registration was successfull. We have sent a confirmation message to your email account.
                    Please confirm the email to complete the registration process.</p>
                <p>Remember that you can change at any moment your profile settings and the visibility of your
                personal data.</p>
                <p>Happy networking and Welcome to the Kikirikii community !</p>
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
        const {request} = this.props;

        const form = (request !== undefined && request.status === 'success') ? 'confirm' :
            (request !== undefined && request.status === 'error') ? 'error' : this.state.form;

        return (<div>
                <div className="container container-form">
                    <div className="row">
                        <div className="col">
                            <div className="container-form-card">
                                {form === 'basic' && <BasicInformationForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'username' && <UsernameForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'password' && <PasswordForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'personaldata' && <PersonalDataForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'confirm' && <ConfirmForm formdata={this.resetFormdata()}/>}
                                {form === 'error' && <ErrorForm formdata={this.resetFormdata()}/>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='form-privacy'>
                            <p className="privacy-text">
                                Your account holds information to identify you and to iteract within the <LogoSimpleRainbow/> social
                                media plattform. This website does not sell or expose publicly this information, nor tracks
                                your activity for marketing purposes. By using this website and it's services you agree to
                                our Terms of Use and Privacy Policy (see the links below).
                            </p>
                        </div>
                    </div>
                </div>
                <div className="form-footer">
                    <p className="text-muted"> &copy; 2018 &nbsp;<LogoSimple/> is the free, open social media platform.
                        All rights reserved. Read about our <Link to="/terms"> Terms of Use</Link> and <Link to='/privacy-policy'>Privacy
                            Policy</Link>.</p>
                </div>
            </div>

        );
    }
}

function mapStateToProps(state, ownProps) {
    return {request: state.request}
}

export default connect(mapStateToProps, {asyncCreateUser})(CreateAccountForm);