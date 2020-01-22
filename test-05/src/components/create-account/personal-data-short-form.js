/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [personal-data-short-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.03.19 12:24
 */

import React, {Component} from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import {Button} from "../buttons/buttons";


export default class PersonalDataShortForm extends Component {
    defaultState = {birthday: null};

    constructor(props) {
        super(props);
        this.state = {...this.defaultState, ...this.props.formdata}
    }

    handleSubmit(event) {
        const form = event.target;
        form.classList.add('was-validated');
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false ||
            moment(this.state.birthday).isAfter(moment().subtract(16, 'years'))) {
            return;
        }

        const formdata = {...this.state};
        this.props.callback('password', formdata);
    }

    handleInput(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    setBirthday(date) {
        const elem = document.getElementById('birthdayId');
        if(moment(date).isAfter(moment().subtract(16, 'years'))) {
            elem.classList.add('is-invalid');
            console.log('date invalid');
        }
        this.setState({['birthday']: date});
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

        const {birthday, aboutYou, gender, birthdayHide, aboutYouHide} = this.state;
        const {Copy} = this.props;

        return (
            <div className='create-account-form'>
                <h3 className="text-center">{Copy && Copy.fullName}</h3>
                <h2 className="pt-2">Personal Data</h2>
                <form className="needs-validation mt-2" noValidate
                      onSubmit={(event) => this.handleSubmit(event)}>

                    <div className="form-row">
                        <div className="col-md-12">
                            <label htmlFor="birthdayId">Birthday</label>
                            <div className="form-check mb-2 mr-sm-2 checkbox-right">
                                <input className="form-check-input" type="checkbox" name="birthdayHide"
                                       checked={birthdayHide}
                                       onChange={(event) => this.handleCheckbox(event)}
                                       id="birthdayHideId"/>
                                <label className="form-check-label" htmlFor="birthdayHideId">Hide
                                    year</label>
                            </div>

                            <DatePicker className='form-control' name="birthday" id="birthdayId"
                                        selected={birthday}
                                        required
                                        onChange={(date) => this.setBirthday(date)}
                                        placeholderText="DD/MM/YYYY" dateFormat="dd/MM/yyyy"/>

                            <div id="passwordHelpBlock" className="form-text text-muted">
                                Enter as DD/MM/YYYY.
                            </div>
                            <div className="invalid-feedback">
                                Invalid date or not at least 16 years old.
                            </div>
                        </div>

                    </div>

                    <div className="form-row mb-3 mt-3">
                        <div className="col-md-12">

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
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="gender"
                                               checked={gender==='NONE'}
                                               onChange={(event) => this.handleInput(event)}
                                               id="noneId" value="NONE"/>
                                        <label className="form-check-label"
                                               htmlFor="noneId">None</label>
                                    </div>

                                </div>
                            </div>
                            <div className="invalid-feedback">
                                Please provide your gender.
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="aboutyouId">About you (Optional)</label>
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
                                          placeholder="Profession, interests, life motto, anything.."/>
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
                            <Button block onClick={(event) => this.handleBack(event)}>Back</Button>
                        </div>
                        <div className="col-md-6">
                            <Button block type="submit">Continue</Button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
