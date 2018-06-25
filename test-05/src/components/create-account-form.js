import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

import {LOGO_FULL} from "../static";

function logo(classname) {
    return <div className={classname}>
        <span>K</span><span>i</span><span>k</span><span>i</span><span>r</span><span>i</span><span>k</span><span>i</span><span>i</span>
    </div>
}

export class CreatePasswordForm extends Component {

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)

        this.props.history.push("/create/password");
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className='create-account-form'>
                            <div className='logo'>
                                <img src={LOGO_FULL}/>
                                {logo('logo-rainbow')}
                                <div className='title'>SET YOUR PASSWORD</div>
                            </div>
                            <form className="needs-validation mt-3" noValidate
                                  onSubmit={(event) => this.handleSubmit(event)}>
                                <div className="col-md-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="passwordId">Password</label>
                                        <input type="password" className="form-control mb-2" id="passwordId"
                                               placeholder="Choose your password" required/>
                                        <label htmlFor="password2Id">Repeat Password</label>
                                        <input type="password" className="form-control" id="password2Id"
                                               placeholder="Repeat your password" required/>
                                        <div id="passwordHelpBlock" className="form-text text-muted">
                                            Your password must be 8-20 characters long, contain letters and numbers and optionally
                                            special characters and must not contain spaces or emoji.
                                        </div>
                                        <div className="invalid-feedback">
                                            The password is invalid. Please try again.
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="invalidCheck"
                                               required/>
                                        <label className="form-check-label" htmlFor="invalidCheck">
                                            Agree to terms and conditions
                                        </label>
                                        <div className="invalid-feedback">
                                            You must agree before submitting.
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block" type="submit">Create Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class CreateUsernameForm extends Component {

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)

        this.props.history.push("/create/password");
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className='create-account-form'>
                            <div className='logo'>
                                <img src={LOGO_FULL}/>
                                {logo('logo-rainbow')}
                                <div className='title'>PICK A USERNAME</div>
                            </div>
                            <form className="needs-validation mt-3" noValidate
                                  onSubmit={(event) => this.handleSubmit(event)}>
                                <div className="col-md-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="usernameId">Username</label>
                                        <input type="text" className="form-control" id="usernameId"
                                               placeholder="Pick a username, for example first.last" required/>
                                        <div id="passwordHelpBlock" className="form-text text-muted">
                                            Your username must be unique, at least 8 characters long and can contain
                                            only
                                            letters and dots, no spaces, no special characters. Please notice your
                                            username cannot be cid="pd at a later time. Kik!
                                        </div>
                                        <div className="invalid-feedback">
                                            Please choose a unique username. The username is invalid or has been already
                                            taken.
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="invalidCheck"
                                               required/>
                                        <label className="form-check-label" htmlFor="invalidCheck">
                                            Agree to terms and conditions
                                        </label>
                                        <div className="invalid-feedback">
                                            You must agree before submitting.
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block" type="submit">Continue</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class CreateAccountForm extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('Create account', this.props);
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // : (<Redirect to={{pathname: "/login", state: {from: props.location}}}/>)

        this.props.history.push("/create/username");
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className='create-account-form'>
                            <div className='logo'>
                                <img src={LOGO_FULL}/>
                                {logo('logo-rainbow')}
                                <div className='title'>CREATE ACCOUNT</div>
                            </div>
                            <form className="needs-validation mt-3" noValidate
                                  onSubmit={(event) => this.handleSubmit(event)}>
                                <div className="form-row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstnameId">First name</label>
                                        <input type="text" className="form-control" id="firstnameId"
                                               placeholder="First name"
                                               required/>

                                        <div className="invalid-feedback">
                                            Please enter your first name.
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastnameId">Last name</label>
                                        <input type="text" className="form-control" id="lastnameId"
                                               placeholder="Last name"
                                               required/>
                                        <div className="invalid-feedback">
                                            Please enter your last name.
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="emailId">Email</label>
                                        <input type="email" className="form-control" id="emailId"
                                               placeholder="email@example.com" required/>
                                        <div className="invalid-feedback">
                                            Please provide a valid unique email.
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="passwordId">Password</label>
                                        <input type="password" className="form-control" id="passwordId"
                                               placeholder="Password" required/>
                                        {/*<small id="passwordHelpBlock" className="form-text text-muted">*/}
                                        {/*Your password must be 8-20 characters long, contain letters and numbers, and must not*/}
                                        {/*contain spaces or emoji.*/}
                                        {/*</small>*/}
                                        <div className="invalid-feedback">
                                            Your password must be 8-20 characters long, contain letters and numbers, and
                                            must not
                                            contain spaces or emoji.
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-md-8 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="addressId">Address</label>
                                            <input type="text" className="form-control" id="addressId"
                                                   placeholder="1234 Main St" required/>
                                            <div className="invalid-feedback">
                                                Please provide a valid street name and number.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="address2Id">Address 2</label>
                                            <input type="text" className="form-control" id="address2Id"
                                                   placeholder="Apartment, studio, or floor"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="cityId">City</label>
                                        <input type="text" className="form-control" id="cityId" placeholder="City"
                                               required/>
                                        <div className="invalid-feedback">
                                            Please provide a valid city.
                                        </div>
                                    </div>
                                    {/*<div className="col-md-3 mb-3">*/}
                                    {/*<label htmlFor="stateId">State</label>*/}
                                    {/*<input type="text" className="form-control" id="stateId" placeholder="State"*/}
                                    {/*required/>*/}
                                    {/*<div className="invalid-feedback">*/}
                                    {/*Please provide a valid state.*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="zipId">Zip</label>
                                        <input type="text" className="form-control" id="zipId" placeholder="Zip"
                                               required/>
                                        <div className="invalid-feedback">
                                            Please provide a valid zip.
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="countryId">Country</label>
                                        <input type="text" className="form-control" id="countryId" placeholder="UK"
                                               required/>
                                        <div className="invalid-feedback">
                                            Please provide a valid country.
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="invalidCheck"
                                               required/>
                                        <label className="form-check-label" htmlFor="invalidCheck">
                                            Agree to terms and conditions
                                        </label>
                                        <div className="invalid-feedback">
                                            You must agree before submitting.
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block" type="submit">Continue</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateAccountForm;