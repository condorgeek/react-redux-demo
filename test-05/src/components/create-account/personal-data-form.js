/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [personal-data-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.07.18 14:43
 */

import React, {Component} from 'react';
import {LogoRainbow} from "../logo/logo";
import moment from 'moment';

export default class PersonalDataForm extends Component {
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
