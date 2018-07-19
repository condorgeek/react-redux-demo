import React, {Component} from 'react';
import {LogoRainbow} from "../logo";
import axios from 'axios';
import {ROOT_SERVER_URL} from '../../actions/index';

export default class UsernameForm extends Component {

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
