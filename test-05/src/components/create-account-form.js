import _ from 'lodash';

import React, {Component} from 'react';
import {Route, Redirect, Link} from 'react-router-dom';
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

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const formdata = {...this.state};
        this.props.callback('confirm', formdata);
    }

    handleInput(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleBack(event) {
        const form = event.target;
        event.preventDefault();
        event.stopPropagation();

        const formdata = {...this.state};
        this.props.callback('username', formdata);
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
                                   placeholder="Choose your password" required/>
                            <div className="form-text text-muted">
                                Your password must be 8-20 characters long, can contain letters, numbers
                                and optionally
                                special characters and must not contain spaces or emoji.
                            </div>
                            <div className="invalid-feedback">
                                The password is invalid. Please try again.
                            </div>
                            <label htmlFor="confirmPasswordId" className='mt-3'>Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPasswordId"
                                   value={confirmPassword}
                                   name="confirmPassword" onChange={(event) => this.handleInput(event)}
                                   placeholder="Confirm your password" required/>
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
                            <button className="btn btn-primary btn-block"
                                    onClick={(event) => this.handleBack(event)}>Back
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-primary btn-block" type="submit">Create Account
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

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const formdata = {...this.state};
        this.props.callback('password', formdata);
    }

    handleInput(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleBack(event) {
        const form = event.target;
        event.preventDefault();
        event.stopPropagation();

        const formdata = {...this.state};
        this.props.callback('basic', formdata);
    }

    render() {

        const {username, birthdate, aboutyou} = this.state;

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
                                       placeholder="Pick a username, for example first.last" required/>
                                <div id="passwordHelpBlock" className="form-text text-muted">
                                    Your username must be unique, at least 8 characters long and can
                                    contain only letters and dots, no spaces, no special characters. Please
                                    select carefully your username since it cannot be changed at a later time. Kik!
                                </div>
                                <div className="invalid-feedback">
                                    Please choose a unique username. The username is invalid or has been
                                    already taken.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-6">
                            <label htmlFor="birthdateId">Birthdate</label>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox"
                                       id="birthdateCheckId"/>
                                <label className="form-check-label" htmlFor="birthdateCheckId">Hide
                                    year</label>
                            </div>
                            <input type="text" className="form-control" id="birthdateId"
                                   placeholder="Your birthdate"
                                   value={birthdate}
                                   name="birthdate" onChange={(event) => this.handleInput(event)}
                                   required/>
                            <div className="invalid-feedback">
                                Please provide your birthdate.
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label>Gender</label></div>
                            <div className="radio-button-box ">
                                <div className="radio-button-center">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="gender"
                                               id="maleId" value="male" checked/>
                                        <label className="form-check-label"
                                               htmlFor="maleId">Male</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="gender"
                                               id="femaleId" value="female"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">Female</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-3 mt-3">
                        <div className="col-md-6">
                            <div className="d-inline"><label htmlFor="maleId">Relationship</label></div>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox"
                                       id="relationCheckId"/>
                                <label className="form-check-label"
                                       htmlFor="relationCheckId">Hide</label>
                            </div>
                            <div className="radio-button-box ">
                                <div className="radio-button-center">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="relation"
                                               id="maleId" value="single" checked/>
                                        <label className="form-check-label"
                                               htmlFor="maleId">Single</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="relation"
                                               id="femaleId" value="engaged"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">In a relationship</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="relation"
                                               id="noneId" value="complicated"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">It's complicated</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-inline"><label>Interested in</label></div>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox"
                                       id="interestCheckId"/>
                                <label className="form-check-label"
                                       htmlFor="interestCheckId">Hide</label>
                            </div>
                            <div className="radio-button-box ">
                                <div className="radio-button-center">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               id="maleId" value="single" checked/>
                                        <label className="form-check-label" htmlFor="maleId">Men</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               id="femaleId" value="engaged"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">Women</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               id="bothId" value="both"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">Both</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="interest"
                                               id="noneId" value="complicated"/>
                                        <label className="form-check-label"
                                               htmlFor="femaleId">Not interested</label>
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
                                    <input className="form-check-input" type="checkbox"
                                           id="aboutyouCheckId"/>
                                    <label className="form-check-label"
                                           htmlFor="aboutyouCheckId">Hide</label>
                                </div>
                                <textarea type="text" className="form-control" id="aboutyouId"
                                          rows="4" value={aboutyou}
                                          name="aboutyou" onChange={(event) => this.handleInput(event)}

                                          placeholder="Tell us something about you" required/>
                                <div className="form-text text-muted">
                                    Interests, life motto, anything..
                                </div>
                                <div className="invalid-feedback">
                                    Please enter a short statement about you.
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="form-text text-muted text-center mb-2">
                        Step 2 of 3. Press Continue to create your password.
                    </div>
                    <div className="form-row">
                        <div className="col-md-6">
                            <button className="btn btn-primary btn-block"
                                    onClick={(event) => this.handleBack(event)}>Back
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-primary btn-block" type="submit">Continue
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
        console.log('Create account', this.props);
    }

    handleCountry(value) {
        this.setState({country: value})
    }

    handleInput(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        const formdata = {...this.state};
        this.props.callback('username', formdata);
    }

    render() {
        const {firstname, lastname, email, confirmEmail,
            address, address2, city, zip, country} = this.state;

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
                                Please provide a valid unique email.
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="confirmEMailId">Confirm Email</label>
                            <input type="email" className="form-control" id="confirmEMailId"
                                   value={confirmEmail}
                                   name="confirmEmail"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="Confirm your email" required/>
                            <div className="invalid-feedback">
                                Emails do not match.
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="addressId">Address</label>
                                <input type="text" className="form-control" id="addressId"
                                       value={address}
                                       name="address"
                                       onChange={(event) => this.handleInput(event)}
                                       placeholder="1234 Main St" required/>
                                <div className="invalid-feedback">
                                    Please provide a valid street name and number.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="address2Id">Address 2</label>
                                <input type="text" className="form-control" id="address2Id"
                                       value={address2} name="address2"
                                       onChange={(event) => this.handleInput(event)}
                                       placeholder="Apartment, studio, or floor"/>
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
                            <label htmlFor="zipId">Zip</label>
                            <input type="text" className="form-control" id="zipId"
                                   defaultValue={zip} name="zip"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="Zip" required/>
                            <div className="invalid-feedback">
                                Please provide a valid zip.
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
                        Step 1 of 3. Press Continue to create your username.
                    </div>
                    <button className="btn btn-primary btn-block" type="submit">Continue</button>
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
            <div className="col-md-12 mb-3">
                <p>{props.formdata.firstname}, Welcome and thank you for registering with Kikirikii.</p>
                <p>Your registration was successfull. We have sent a confirmation message to your email account. Please confirm to
                    complete the registration process.</p>
                <p>Happy networking! Kik!</p>
            </div>
            <div className="form-text text-muted text-center mb-2">
                Press Login to start networking.
            </div>
            <Link to="/login" class="btn btn-primary btn-block">Login</Link>
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