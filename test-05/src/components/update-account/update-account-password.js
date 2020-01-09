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

import React, {useState} from 'react';
import {connect} from 'react-redux';
import {asyncUpdateUserPassword, resetError} from '../../actions'
import {getAuthorizedUsername, getLastErrorFor} from "../../reducers/selectors";
import {animateElement} from "../util/text-utils";


const UpdateAccountPassword = (props) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!event.target.checkValidity() || props.error) {
            animateElement(document.getElementById("updatePwdId"));
            return;
        }

        const formdata = {
            password: password, newPassword: newPassword, confirmPassword: confirmPassword
        };

        props.asyncUpdateUserPassword(props.username, formdata, user => {
            toastr.info(`You have successfully updated your password ${user.username}`);
        });

        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        event.target.reset();
    };

    return <div className='update-account-container'>
        <form noValidate className={`update-account-form ${props.error ? 'form-invalid':''}`} onSubmit={handleSubmit}>
            <h2>Update Password</h2>

            <label className='form-label'>Password</label>
            <input className='form-text-input'
                   value={password}
                   placeholder='Enter password'
                   type='password'
                   name='password'
                   required
                   onChange={(e) => setPassword(e.target.value)}
                   onFocus={() => {if(props.error) props.resetError()}}
            />
            {props.error && <div className='form-error-message'>{props.error.message}</div>}
            {!props.error && <div className='form-comment'>Your current password</div>}

            <hr/>
            <label className='form-label'>New Password</label>
            <input className='form-text-input'
                   value={newPassword}
                   placeholder='New password'
                   type='password'
                   name='newPassword'
                   pattern="^[\w!@#$&()\/-?+=*^%-.,]{8,30}$"
                   minLength="8" maxLength="20"
                   required
                   onChange={(e) => setNewPassword(e.target.value)}
                   onFocus={() => {if(props.error) props.resetError()}}/>

            <label className='form-label'>Confirm Password</label>
            <input className='form-text-input'
                   value={confirmPassword}
                   placeholder='Confirm password'
                   type='password'
                   name='confirmPassword'
                   pattern="^[\w!@#$&()\/-?+=*^%-.,]{8,30}$"
                   minLength="8" maxLength="20"
                   required
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   onFocus={() => {if(props.error) props.resetError()}}/>
            <div className='form-comment'>Your password must be at least 8 characters long and can contain letters, numbers
                and special characters excluding spaces or emoji.</div>

            <button className='btn btn-primary form-submit-btn' type='submit' id='updatePwdId'>Update Password</button>
        </form>
    </div>
};

const mapStateToProps = (state) => ({
    error: getLastErrorFor(state, 401),
    username: getAuthorizedUsername(state),
});

export default connect(mapStateToProps, {asyncUpdateUserPassword, resetError})(UpdateAccountPassword);

