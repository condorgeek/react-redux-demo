import React, {Component} from 'react';
import {LogoRainbow} from "../logo/logo";
import axios from 'axios';
import {ROOT_SERVER_URL} from '../../actions/index';
import {CountryDropdown} from 'react-country-region-selector';

export default class BasicInformationForm extends Component {

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
