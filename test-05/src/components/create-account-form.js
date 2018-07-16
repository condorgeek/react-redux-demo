import _ from 'lodash';

import React, {Component} from 'react';
import axios from 'axios';
import {ROOT_SERVER_URL} from '../actions/index';


import {Route, Redirect, Link} from 'react-router-dom';
import moment from 'moment';
import {LogoSimple, LogoSimpleRainbow, LogoRainbow} from "./logo";
import {CountryDropdown} from 'react-country-region-selector';


export class PasswordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {...this.props.formdata};
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            return;
        }

        const formdata = {...this.state};
        this.props.callback('confirm', formdata);
    }

    handleInput(event) {
        const elem = event.target;
        this.setState({[elem.name]: elem.value});
    }

    handleConfirmPassword(event) {
        const {password} = this.state;
        const elem = event.target;
        elem.classList.remove('is-invalid');
        if(elem.value !== password) {
            elem.classList.add('is-invalid');
        }
        this.setState({[elem.name]: elem.value});
    }

    handleBack(event) {
        const form = event.target;
        const formdata = {...this.state};
        this.props.callback('personaldata', formdata);
    }

    render() {
        const {password, confirmPassword} = this.state;

        return (
            <div className='create-account-form'>
                <LogoRainbow title='Set your Password'/>
                <form className="needs-validation mt-4" noValidate
                      onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="col-md-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="passwordId">Password</label>
                            <input type="password" className="form-control mb-2" id="passwordId"
                                   value={password}
                                   name="password" onChange={(event) => this.handleInput(event)}
                                   placeholder="Choose your password"
                                   pattern="^[\w!@#$&()\/-?+=*^%-.,]{8,30}$"
                                   minLength="8" maxLength="20" required/>
                            <div className="form-text text-muted">
                                Your password must be at least 8 characters long and can contain letters, numbers
                                and special characters excluding spaces or emoji.
                            </div>
                            <div className="invalid-feedback">
                                The password is invalid. Please try again.
                            </div>
                            <label htmlFor="confirmPasswordId" className='mt-3'>Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPasswordId"
                                   value={confirmPassword}
                                   name="confirmPassword" onChange={(event) => this.handleConfirmPassword(event)}
                                   placeholder="Confirm your password"
                                   minLength="8" maxLength="20" required/>
                            <div className="form-text text-muted">
                                Please confirm your password.
                            </div>
                            <div className="invalid-feedback">
                                The passwords do not match. Please try again.
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="invalidCheck"
                                   required/>
                            <label className="form-check-label" htmlFor="invalidCheck">
                                I Agree to terms and conditions
                            </label>
                            <div className="invalid-feedback">
                                You must agree before submitting.
                            </div>
                        </div>
                    </div>
                    <div className="form-text text-muted text-center mb-2">
                        You are almost done. Please press on Create Account to start networking on
                        Kikirikii.
                    </div>
                    <div className="form-row">
                        <div className="col-md-6">
                            <button className="btn btn-block"
                                    onClick={(event) => this.handleBack(event)}>Back
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-block" type="submit">Create Account
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}

export class PersonalDataForm extends Component {
    defaultState = {birthday: null};

    constructor(props) {
        super(props);
        this.state = {...this.defaultState, ...this.props.formdata}
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        const birthday = moment(this.state.birthday, "DD/MM/YYYY");

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false || birthday.isAfter(moment().subtract(16, 'years'))) {
            return;
        }

        const formdata = {...this.state};
        this.props.callback('password', formdata);
    }

    handleInput(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleBirthday(event) {
        const elem = event.target;
        const date = moment(elem.value, "DD/MM/YYYY");

        elem.classList.remove('is-invalid');
        if(!date.isValid() || date.isAfter(moment().subtract(16, 'years'))) {
            elem.classList.add('is-invalid');
            console.log('date invalid');
        }
        this.setState({[elem.name]: elem.value});
    }

    handleCheckbox(event) {
        const elem = event.target;
        this.setState({[elem.name]: elem.checked});
    }

    handleBack(event) {
        const form = event.target;
        const formdata = {...this.state};
        this.props.callback('username', formdata);
    }

    render() {

        const {birthday, aboutYou, gender, marital, interest, birthdayHide, maritalHide, interestHide, aboutYouHide} = this.state;

        return (
            <div className='create-account-form'>
                <LogoRainbow title='Personal Data'/>
                <form className="needs-validation mt-4" noValidate
                      onSubmit={(event) => this.handleSubmit(event)}>

                    <div className="form-row">
                        <div className="col-md-6">
                            <label htmlFor="birthdayId">Birthday</label>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox" name="birthdayHide"
                                       checked={birthdayHide}
                                       onChange={(event) => this.handleCheckbox(event)}
                                       id="birthdayHideId"/>
                                <label className="form-check-label" htmlFor="birthdayHideId">Hide
                                    year</label>
                            </div>
                            <input className="form-control" name ="birthday" id="birthdayId"
                                    value={birthday}
                                    pattern="^((0|1|2|3)\d{1})\/((0|1)\d{1})\/((19|20)\d{2})$"
                                    onChange={(event) => this.handleBirthday(event)}
                                    placeholder="DD/MM/YYYY" required/>

                            <div id="passwordHelpBlock" className="form-text text-muted">
                                Enter your birthday as DD/MM/YYYY.
                            </div>
                            <div className="invalid-feedback">
                                Invalid date or not at least 16 years old.
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label>Gender</label></div>
                            <div className="radio-button-box">
                                <div className="radio-button-center">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="gender"
                                               checked={gender==='MALE'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="maleId" value="MALE" required/>
                                        <label className="form-check-label"
                                               htmlFor="maleId">Male</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="gender"
                                               checked={gender==='FEMALE'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="femaleId" value="FEMALE"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">Female</label>
                                    </div>

                                </div>
                            </div>
                            <div className="invalid-feedback">
                                Please provide your gender.
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-3 mt-3">
                        <div className="col-md-12">
                            <div className="d-inline"><label htmlFor="maleId">Relationship status</label></div>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox" name="maritalHide"
                                       checked={maritalHide}
                                       onChange={(event) => this.handleCheckbox(event)}
                                       id="maritalCheckId"/>
                                <label className="form-check-label"
                                       htmlFor="maritalCheckId">Hide</label>
                            </div>
                            <div className="radio-button-box">
                                <div className="radio-button-center">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="marital"
                                               checked={marital==='SINGLE'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="singleId" value="SINGLE" required/>
                                        <label className="form-check-label"
                                               htmlFor="singleId">Single</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="marital"
                                               checked={marital==='ENGAGED'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="engagedId" value="ENGAGED"/>
                                        <label className="form-check-label"
                                               htmlFor="engagedId">In a relationship</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="marital"
                                               checked={marital==='COMPLICATED'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="complicatedId" value="COMPLICATED"/>
                                        <label className="form-check-label"
                                               htmlFor="complicatedId">It's complicated</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mt-3">
                            <div className="d-inline"><label>Interested in</label></div>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox" name="interestHide"
                                       checked={interestHide}
                                       onChange={(event) => this.handleCheckbox(event)}
                                       id="interestHideId"/>
                                <label className="form-check-label"
                                       htmlFor="interestHideId">Hide</label>
                            </div>
                            <div className="radio-button-box ">
                                <div className="radio-button-center">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               checked={interest==='MEN'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="menId" value="MEN" required/>
                                        <label className="form-check-label" htmlFor="menId">Men</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               checked={interest==='WOMEN'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="womenId" value="WOMEN"/>
                                        <label className="form-check-label"
                                               htmlFor="womenId">Women</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               checked={interest==='BOTH'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="bothId" value="BOTH"/>
                                        <label className="form-check-label"
                                               htmlFor="bothId">Both</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               checked={interest==='NONE'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="noneId" value="NONE"/>
                                        <label className="form-check-label"
                                               htmlFor="noneId">Not interested</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="aboutyouId">About you</label>
                                <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                    <input className="form-check-input" type="checkbox" name="aboutYouHide"
                                           checked={aboutYouHide}
                                           onChange={(event) => this.handleCheckbox(event)}
                                           id="aboutYouHideId"/>
                                    <label className="form-check-label"
                                           htmlFor="aboutYouHideId">Hide</label>
                                </div>
                                <textarea type="text" className="form-control" id="aboutYouId"
                                          rows="4" value={aboutYou}
                                          name="aboutYou" onChange={(event) => this.handleInput(event)}
                                          placeholder="Tell us something about you" required/>

                                <div className="form-text text-muted">
                                    Profession, interests, life motto, anything..
                                </div>
                                <div className="invalid-feedback">
                                    Please enter a short statement about you.
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="form-text text-muted text-center mb-2">
                        Step 3 of 4. Press Continue to create your password.
                    </div>
                    <div className="form-row">
                        <div className="col-md-6">
                            <button className="btn btn-block"
                                    onClick={(event) => this.handleBack(event)}>Back
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-block" type="submit">Continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export class UsernameForm extends Component {

    constructor(props) {
        super(props);
        this.state = {...this.props.formdata}
    }

    validateUsernameIsUnique() {
        const username = document.getElementById('usernameId');

        axios.get(`${ROOT_SERVER_URL}/public/validate/username?value=${username.value}`)
            .then(response=> {
                if(response.data === true) {
                    username.classList.add('is-invalid');
                    return;
                }
                const formdata = {...this.state};
                this.props.callback('personaldata', formdata);

            }).catch(error => {
            username.classList.add('is-invalid');
        });
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            return;
        }

       return this.validateUsernameIsUnique();
    }

    handleInput(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleBack(event) {
        const form = event.target;
        const formdata = {...this.state};
        this.props.callback('basic', formdata);
    }

    render() {

        const {username} = this.state;

        return (
            <div className='create-account-form'>
                <LogoRainbow title='Pick a Username'/>
                <form className="needs-validation mt-4" noValidate
                      onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="form-row">

                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="usernameId">Username</label>
                                <input type="text" className="form-control" id="usernameId"
                                       value={username}
                                       name="username" onChange={(event) => this.handleInput(event)}
                                       placeholder="Pick a username, for example first.last"
                                       minLength="8" maxLength="30"
                                       pattern="^(?=.{8,20}$)(?![.])(?!.*[.]{2})[a-z0-9.]+(?<![.])$"
                                       required/>
                                <div id="passwordHelpBlock" className="form-text text-muted">
                                    Your username must be unique, at least 8 characters long and can
                                    contain letters, numbers and dots. Please select carefully your username
                                    since it cannot be changed at a later time. Kik!
                                </div>
                                <div className="invalid-feedback">
                                    Please try again. The username is invalid or has been already taken.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-text text-muted text-center mt-4 mb-2">
                        Step 2 of 4. Press Continue to enter some personal data.
                    </div>
                    <div className="form-row">
                        <div className="col-md-6">
                            <button className="btn btn-block"
                                    onClick={(event) => this.handleBack(event)}>Back
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-block" type="submit">Continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}



class BasicInformationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {...this.props.formdata}
    }

    componentDidMount() {
        // console.log('Create account', this.props);
    }

    handleCountry(value) {
        this.setState({country: value})
    }

    handleInput(event) {
        const elem = event.target;
        this.setState({[elem.name]: elem.value});
    }

    handleConfirmEmail(event) {
        const {email} = this.state;
        const elem = event.target;
        elem.classList.remove('is-invalid');
        if(elem.value !== email) {
            elem.classList.add('is-invalid');
        }
        this.setState({[elem.name]: elem.value});
    }

    validateEmailIsUnique() {
        const email = document.getElementById('emailId');
        const confirmEmail = document.getElementById('confirmEmailId');

        axios.get(`${ROOT_SERVER_URL}/public/validate/email?value=${email.value}`)
            .then(response=> {
                if(response.data === true) {
                    email.classList.add('is-invalid');
                    confirmEmail.value = "";
                    return;
                }
                const formdata = {...this.state};
                this.props.callback('username', formdata);

            }).catch(error => {
                email.classList.add('is-invalid');
                confirmEmail.value = "";
        });
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            return;
        }

       return this.validateEmailIsUnique();
    }

    render() {
        const {firstname, lastname, email, confirmEmail,
            street, street2, city, areacode, country} = this.state;

        return (
            <div className='create-account-form'>
                <LogoRainbow title='Create Account'/>
                <form className="needs-validation mt-4" noValidate
                      onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="firstnameId">First name</label>
                            <input type="text" className="form-control" id="firstnameId"
                                   value = {firstname}
                                   name="firstname"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="First name" required/>

                            <div className="invalid-feedback">
                                Please enter your first name.
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastnameId">Last name</label>
                            <input type="text" className="form-control" id="lastnameId"
                                   value = {lastname}
                                   name="lastname"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="Last name" required/>
                            <div className="invalid-feedback">
                                Please enter your last name.
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="emailId">Email</label>
                            <input type="email" className="form-control" id="emailId"
                                   value={email}
                                   name="email"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="email@example.com" required/>
                            <div className="invalid-feedback">
                                Email is invalid or is already in use by another account.
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="confirmEmailId">Confirm Email</label>
                            <input type="email" className="form-control" id="confirmEmailId"
                                   value={confirmEmail}
                                   name="confirmEmail"
                                   onChange={(event) => this.handleConfirmEmail(event)}
                                   placeholder="Confirm your email" required/>
                            <div className="invalid-feedback">
                                Emails do not match.
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="streetId">Address</label>
                                <input type="text" className="form-control" id="streetId"
                                       value={street}
                                       name="street"
                                       onChange={(event) => this.handleInput(event)}
                                       placeholder="1234 Main St" required/>
                                <div className="invalid-feedback">
                                    Please provide a valid street name and number.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="street2Id">Address 2</label>
                                <input type="text" className="form-control" id="street2Id"
                                       value={street2} name="street2"
                                       onChange={(event) => this.handleInput(event)}
                                       placeholder="Apartment, floor"/>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-5">
                        <div className="col-md-4">
                            <label htmlFor="cityId">City</label>
                            <input type="text" className="form-control" id="cityId"
                                   value={city} name="city"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="City" required/>
                            <div className="invalid-feedback">
                                Please provide a valid city.
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="areacodeId">Area Code</label>
                            <input type="text" className="form-control" id="areacodeId"
                                   defaultValue={areacode} name="areacode"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="Area code" required/>
                            <div className="invalid-feedback">
                                Please provide a valid area code.
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="countryId">Country</label>
                            <CountryDropdown name="country" value={country} valueType="short" classes="form-control" required onChange={(value) => this.handleCountry(value)}/>

                            <div className="invalid-feedback">
                                Please provide a valid country.
                            </div>
                        </div>
                    </div>
                    <div className="form-text text-muted text-center mb-2">
                        Step 1 of 4. Press Continue to create your username.
                    </div>
                    <button className="btn btn-block" type="submit">Continue</button>
                </form>
            </div>
        )
    }
}

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

    createAccount(formdata) {

        console.log('formdata', formdata);

        // CREATE ACCOUNT
        const formreset = _.mapValues(this.state.formdata, (v, k) => {
            return k === 'firstname' || k === 'lastname' || k === 'email' ? v : null;
        });

        console.log('formreset', formreset);
        this.setState({form: 'confirm', formdata: formreset});
    }

    setForm(form, data) {
        const formdata = {...this.state.formdata, ...data};
        
        console.log('FORM', formdata);

        if (form === 'create_account') {
            this.createAccount(formdata);

        } else {
            this.setState({form: form, formdata: formdata});
        }
    }

    render() {
        const {form, formdata} = this.state;
        return (<div>
                <div className="container container-form">
                    <div className="row">
                        <div className="col">
                            <div className="container-form-card">
                                {form === 'basic' && <BasicInformationForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'username' && <UsernameForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'password' && <PasswordForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'personaldata' && <PersonalDataForm formdata={formdata} callback={this.setForm.bind(this)}/>}
                                {form === 'confirm' && <ConfirmForm formdata={formdata}/>}
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

export default CreateAccountForm;