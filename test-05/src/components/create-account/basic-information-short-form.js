/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [basic-information-form-short.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.03.19 12:07
 */

import React, {Component} from 'react';
import axios from 'axios';
import {CountryDropdown} from 'react-country-region-selector';
import {getValidateEmailUrl} from "../../actions/environment";
import {Button} from "../navigation-buttons/nav-buttons";

export default class BasicInformationShortForm extends Component {

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

        axios.get(getValidateEmailUrl(email.value))
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
        const {firstname, lastname, email, confirmEmail, city, country} = this.state;
        const {Copy} = this.props;

        const isConfirmEmail = false;

        return (
            <div className='create-account-form'>
                <h3 className="text-center">{Copy && Copy.fullName}</h3>
                <h2 className="pt-2">Create Account</h2>

                <form className="needs-validation mt-2" noValidate
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
                        <div className="form-group col-md-12">
                            <label htmlFor="emailId">Email</label>
                            <input type="email" className="form-control" id="emailId"
                                   value={email}
                                   name="email"
                                   pattern="[^\s@]+@[^\s@]+\.[^\s@]+$"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="email@example.com" required/>
                            <div className="invalid-feedback">
                                Email is invalid or is already in use by another account.
                            </div>
                            <div className="form-text text-muted">
                                A valid email address is required
                            </div>
                        </div>
                    </div>


                    {isConfirmEmail && <div className="form-row">
                        <div className="form-group col-md-12">
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
                    </div>}

                    <div className="form-row mb-5">
                        <div className="col-md-6">
                            <label htmlFor="cityId">City</label>
                            <input type="text" className="form-control" id="cityId"
                                   value={city} name="city"
                                   onChange={(event) => this.handleInput(event)}
                                   placeholder="City" required/>
                            <div className="invalid-feedback">
                                Please provide a valid city.
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="countryId">Country</label>
                            <CountryDropdown name="country" value={country} valueType="short" classes="form-control"
                                             required
                                             onChange={(value) => this.handleCountry(value)}/>

                            <div className="invalid-feedback">
                                Please provide a valid country.
                            </div>
                        </div>
                    </div>
                    <div className="form-text text-muted text-center mb-2">
                        Step 1 of 4. Press Continue to create your username.
                    </div>
                    <Button block type="submit">Continue</Button>
                </form>
            </div>
        )
    }
}
