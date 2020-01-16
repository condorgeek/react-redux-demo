/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [personal-data.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.01.20, 13:05
 */

import React, {useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import toastr from "../../../node_modules/toastr/toastr";
import DatePicker from 'react-datepicker';

import {getAuthorizedUsername, getLoggedInUserdata} from "../../selectors";
import {asyncUpdateUserData} from "../../actions";

const UpdateAccountPersonal = (props) => {
    const {userdata, username} = props;

    const [birthday, setBirthday] = useState(userdata ? new Date(userdata.birthday) : new Date());
    const [aboutYou, setAboutYou] = useState(userdata ? userdata.aboutYou : "");
    const [gender, setGender] = useState(userdata ? userdata.gender : "NONE");
    const [marital, setMarital] = useState(userdata ? userdata.marital : "NONE");
    const [interest, setInterest] = useState(userdata ? userdata.interest : "NONE");
    const [interests, setInterests] = useState(userdata ? userdata.interests : "");
    const [studies, setStudies] = useState(userdata ? userdata.studies : "");
    const [work, setWork] = useState(userdata ? userdata.work : "");
    const [politics, setPolitics] = useState(userdata ? userdata.politics : "");
    const [religion, setReligion] = useState(userdata ? userdata.religion : "");
    const [web, setWeb] = useState(userdata ? userdata.web : "");
    const [hideYear, setHideYear] = useState(false);

    const onHandleSubmit = (event) => {
        event.preventDefault();

        const formdata = {
                birthday: moment(birthday).format('DD/MM/YYYY'),
                aboutYou: aboutYou, gender: gender, marital: marital, interest: interest,
                interests: interests, studies: studies,  work: work, politics: politics,
                religion: religion, web: web
            };

        props.asyncUpdateUserData(username, formdata, userdata => {
            toastr.info(`You have updated ${username}`);
        });
    };


    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={(e) => onHandleSubmit(e)}>
            <h2>Update Personal Data</h2>
            <div className='form-checkbox-group'>
                <label className='form-checkbox-label'>Birthday</label>
                <div className='form-checkbox-item'>
                    <input type='checkbox'
                           name='hideYear'
                           id='hideYearId'
                           checked={hideYear}
                           onChange={(e) =>
                           {
                               console.log('XXX', e.target.value, e.target.checked);
                               setHideYear(e.target.checked)
                           }}/>
                    <label htmlFor='hideYearId' className='form-checkbox-label'>Hide Year</label>
                </div>
            </div>

            <DatePicker className='form-text-input' selected={birthday}
                        onChange={(date) => setBirthday(date)}
                        placeholderText="Enter birthday" dateFormat="MMM d, yyyy"/>

            <label className='form-label'>Gender</label>
            <div className='form-radio-group'>
                <div className='form-radio-item'>
                    <input
                        value='MALE'
                        checked={gender === 'MALE'}
                        type="radio"
                        name="gender"
                        id='updateMaleId'
                        required
                        onChange={(e) => setGender(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateMaleId'>Male</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='FEMALE'
                        checked={gender === 'FEMALE'}
                        type="radio"
                        name="gender"
                        id='updateFemaleId'
                        required
                        onChange={(e) => setGender(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateFemaleId'>Female</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='NONE'
                        checked={gender === 'NONE'}
                        type="radio"
                        name="gender"
                        id='updateNoneId'
                        required
                        onChange={(e) => setGender(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateNoneId'>None</label>
                </div>

            </div>

            <label className='form-label'>Relationship</label>
            <div className='form-radio-group'>
                <div className='form-radio-item'>
                    <input
                        value='SINGLE'
                        checked={marital === 'SINGLE'}
                        type="radio"
                        name="marital"
                        id='updateSingleId'
                        required
                        onChange={(e) => setMarital(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateSingleId'>Single</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='ENGAGED'
                        checked={marital === 'ENGAGED'}
                        type="radio"
                        name="marital"
                        id='updateEngagedId'
                        required
                        onChange={(e) => setMarital(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateEngagedId'>Engaged</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='COMPLICATED'
                        checked={marital === 'COMPLICATED'}
                        type="radio"
                        name="marital"
                        id='updateComplicatedId'
                        required
                        onChange={(e) => setMarital(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateComplicatedId'>Complicated</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='NONE'
                        checked={marital === 'NONE'}
                        type="radio"
                        name="marital"
                        id='updateMNoneId'
                        required
                        onChange={(e) => setMarital(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateMNoneId'>None</label>
                </div>
            </div>


            <label className='form-label'>Interested in</label>
            <div className='form-radio-group'>
                <div className='form-radio-item'>
                    <input
                        value='MEN'
                        checked={interest === 'MEN'}
                        type="radio"
                        name="interest"
                        id='updateMenId'
                        required
                        onChange={(e) => setInterest(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateMenId'>Men</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='WOMEN'
                        checked={interest === 'WOMEN'}
                        type="radio"
                        name="interest"
                        id='updateWomenId'
                        required
                        onChange={(e) => setInterest(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateWomenId'>Women</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='BOTH'
                        checked={interest === 'BOTH'}
                        type="radio"
                        name="interest"
                        id='updateBothId'
                        required
                        onChange={(e) => setInterest(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateBothId'>Both</label>
                </div>

                <div className='form-radio-item'>
                    <input
                        value='NONE'
                        checked={interest === 'NONE'}
                        type="radio"
                        name="interest"
                        id='updateINoneId'
                        required
                        onChange={(e) => setInterest(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateINoneId'>None</label>
                </div>

            </div>

            <label className='form-label'>About You</label>
            <textarea className='form-textarea'
                value={aboutYou}
                placeholder='Tell us about you'
                type='text'
                name='aboutYou'
                rows='4'
                onChange={(e) => setAboutYou(e.target.value)}/>

            <label className='form-label'>Interests and Hobbies</label>
            <textarea className='form-textarea'
                      value={interests}
                      placeholder='Your interests and hobbies'
                      type='text'
                      name='interests'
                      rows='4'
                      onChange={(e) => setInterests(e.target.value)}/>

            <label className='form-label'>Studies/ Education</label>
            <textarea className='form-textarea'
                      value={studies}
                      placeholder='Your studies or profession'
                      type='text'
                      name='studies'
                      rows='4'
                      onChange={(e) => setStudies(e.target.value)}/>

            <label className='form-label'>Work/ Occupation</label>
            <textarea className='form-textarea'
                      value={work}
                      placeholder='Your work or occupation'
                      type='text'
                      name='work'
                      rows='4'
                      onChange={(e) => setWork(e.target.value)}/>

            <label className='form-label'>Politics</label>
            <textarea className='form-textarea'
                      value={politics}
                      placeholder='Your political inclination'
                      type='text'
                      name='politics'
                      rows='4'
                      onChange={(e) => setPolitics(e.target.value)}/>

            <label className='form-label'>Religion/ World view</label>
            <textarea className='form-textarea'
                      value={religion}
                      placeholder='Your religion, world view or philosophy'
                      type='text'
                      name='religion'
                      rows='4'
                      onChange={(e) => setReligion(e.target.value)}/>

            <label className='form-label'>Web Seite</label>
            <input className='form-text-input'
                   value={web}
                   placeholder='Deine web seite, blog'
                   type='text'
                   name='web'
                   onChange={(e) => setWeb(e.target.value)}/>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Personal Data</button>
        </form>
    </div>
};

const mapStateToProps = state => ({
    username: getAuthorizedUsername(state),
    userdata: getLoggedInUserdata(state),
});

export default connect(mapStateToProps, {asyncUpdateUserData})(UpdateAccountPersonal);

