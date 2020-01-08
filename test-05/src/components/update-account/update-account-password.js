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
import toastr from "../../../node_modules/toastr/toastr";

import React, {useState, useRef} from 'react';
import {connect} from 'react-redux';
import {asyncUpdateUserPassword} from '../../actions'
import {getAuthorizedUsername} from "../../reducers/selectors";

const UpdateAccountPassword = (props) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const formRef = useRef(null);


    const handleSubmit = (event) => {
        event.preventDefault();

        const formdata = {
            password: password, newPassword: newPassword, confirmPassword: confirmPassword
        };

        props.asyncUpdateUserPassword(props.username, formdata, user => {
            toastr.info(`You have successfully updated your password ${user.username}`);
        });

        // TODO not working
        formRef.current.reset();
    };

    return <div className='update-account-container'>
        <form className='update-account-form' ref={formRef} onSubmit={handleSubmit}>
            <h2>Update Password</h2>

            <label className='form-label'>Password</label>
            <input className='form-text-input'
                   value={password}
                   placeholder='Enter password'
                   type='password'
                   name='password'
                   required
                   onChange={(e) => setPassword(e.target.value)}/>
            <div className='form-comment'>Your current password</div>

            <hr/>
            <label className='form-label'>New Password</label>
            <input className='form-text-input'
                   value={newPassword}
                   placeholder='New password'
                   type='password'
                   name='newPassword'
                   required
                   onChange={(e) => setNewPassword(e.target.value)}/>

            <label className='form-label'>Confirm Password</label>
            <input className='form-text-input'
                   value={confirmPassword}
                   placeholder='Confirm password'
                   type='password'
                   name='confirmPassword'
                   required
                   onChange={(e) => setConfirmPassword(e.target.value)}/>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Password</button>
        </form>
    </div>
};

const mapStateToProps = (state) => ({
    username: getAuthorizedUsername(state),
});

export default connect(mapStateToProps, {asyncUpdateUserPassword})(UpdateAccountPassword);

