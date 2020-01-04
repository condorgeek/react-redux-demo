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

const UpdateAccountPersonal = (props) => {
    const [birthday, setBirthday] = useState("");
    const [aboutYou, setAboutYou] = useState("");
    const [gender, setGender] = useState("");
    const [marital, setMarital] = useState("");
    const [interest, setInterest] = useState("");


    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('UPDATE ACCOUNT', birthday)
        }}>
            <h2>Update Personal Data</h2>
            <label className='form-label'>Birthday</label>
            <input className='form-text-input'
                value={birthday}
                placeholder='DD/MM/YYYY'
                type='text'
                name='birthday'
                pattern="^((0|1|2|3)\d{1})\/((0|1)\d{1})\/((19|20)\d{2})$"
                required
                onChange={(e) => setBirthday(e.target.value)}/>


            <label className='form-label'>Gender</label>
            <div className='form-radio-group'>
                <div className='form-radio-item'>
                    <input
                        value='MALE'
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
                        type="radio"
                        name="interest"
                        id='updateINoneId'
                        required
                        onChange={(e) => setInterest(e.target.value)}/>
                    <label className='form-radio-label' htmlFor='updateINoneId'>None</label>
                </div>

            </div>

            <label className='form-label'>About You</label>
            <textarea className='form-text-input'
                value={aboutYou}
                placeholder='Tell us about you'
                type='text'
                name='aboutYou'
                rows='4'
                onChange={(e) => setAboutYou(e.target.value)}/>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Personal Data</button>
        </form>
    </div>
};

export default UpdateAccountPersonal;

