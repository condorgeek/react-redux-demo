/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [update-account-password.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.01.20, 12:37
 */

import React, {useState} from 'react';

const UpdateAccountPassword = (props) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('UPDATE ACCOUNT', password)
        }}>
            <h2>Update Password</h2>

            <label className='form-label'>Password</label>
            <input className='form-text-input'
                value={password}
                placeholder='Enter password'
                type='password'
                name='password'
                onChange={(e) => setPassword(e.target.value)}/>

                <hr/>
            <label className='form-label'>New Password</label>
            <input className='form-text-input'
                value={newPassword}
                placeholder='New password'
                type='password'
                name='newPassword'
                onChange={(e) => setNewPassword(e.target.value)}/>

            <label className='form-label'>Confirm Password</label>
            <input className='form-text-input'
                value={confirmPassword}
                placeholder='Confirm password'
                type='password'
                name='confirmPassword'
                onChange={(e) => setConfirmPassword(e.target.value)}/>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Password</button>
        </form>
    </div>
};

export default UpdateAccountPassword;

