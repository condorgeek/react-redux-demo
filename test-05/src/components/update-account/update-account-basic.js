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
import toastr from "../../../node_modules/toastr/toastr";

import React, {useState} from 'react';
import {connect} from 'react-redux';
import {getLoggedInUser} from "../../reducers/selectors";
import {asyncUpdateUserAccount} from '../../actions';

const UpdateAccountBasic = (props) => {
    const {user} = props;

    const [firstName, setFirstName] = useState(user ? user.firstname : '');
    const [lastName, setLastName] = useState(user ? user.lastname : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [username, setUsername] = useState(user ? user.username : '');

    const handleSubmit = (event) => {
        event.preventDefault();

        const formdata = {
            firstname: firstName, lastname: lastName, email: email
        };

        props.asyncUpdateUserAccount(user.username, formdata, user => {
            toastr.info(`You have updated the account of ${user.username}`);
        });
    };

    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={handleSubmit}>
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

            <div className='form-comment'>Notice that a valid email address is required for
                confirming your account and recovering your password in case of loss</div>


            <label className='form-label'>Username</label>
            <input className='form-text-input form-text-disabled'
                   value={username}
                   placeholder='Enter username'
                   type='text'
                   name='username'
                   disabled
                   onChange={(e) => setUsername(e.target.value)}/>
            <div className='form-comment'>The username cannot be changed at this time</div>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Account</button>
        </form>
    </div>
};

const mapStateToProps = state => ({
    user: getLoggedInUser(state),
});

export default connect(mapStateToProps, {asyncUpdateUserAccount})(UpdateAccountBasic);

