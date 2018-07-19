import React, {Component} from 'react';
import {LogoRainbow} from "../logo";

export default class PasswordForm extends Component {

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
        this.props.callback('create_account', formdata);
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