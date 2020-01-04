/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [update-account.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.01.20, 09:01
 */

import React, {useState} from 'react';

const UpdateAccountBasic = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");


    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('UPDATE ACCOUNT', firstName, lastName)
        }}>
            <h2>Update Your Account</h2>
            <div className='form-group'>
                <div className='form-group-item'>
                    <label className='form-group-label'>First Name</label>
                    <input className='form-text-input'
                        value={firstName}
                        placeholder='Enter First Name'
                        type='text'
                        name='firstName'
                        onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div className='form-group-item'>
                    <label className='form-group-label'>Last Name</label>
                    <input className='form-text-input'
                        value={lastName}
                        placeholder='Enter Last Name'
                        type='text'
                        name='lastName'
                        onChange={(e) => setLastName(e.target.value)}/>
                </div>
            </div>

            <label className='form-label'>Email</label>
            <input className='form-text-input'
                value={email}
                placeholder='Enter email'
                type='email'
                name='email'
                onChange={(e) => setEmail(e.target.value)}/>


            <div className='form-group'>
                <div className='form-group-item'>
                    <label className='form-group-label'>City</label>
                    <input className='form-text-input'
                        value={city}
                        placeholder='Enter city'
                        type='text'
                        name='city'
                        onChange={(e) => setCity(e.target.value)}/>
                </div>
                <div className='form-group-item'>
                    <label className='form-group-label'>Country</label>
                    <input className='form-text-input'
                        value={country}
                        placeholder='Enter country'
                        type='text'
                        name='country'
                        onChange={(e) => setCountry(e.target.value)}/>
                </div>
            </div>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Account</button>
        </form>
    </div>
};

export default UpdateAccountBasic;

