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

const ManageSiteUsers = (props) => {
    const [search, setSearch] = useState("");

    return <div className='standard-form-container'>
        <form className='standard-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('MANAGE USERS', )
        }}>
            <h2>Manage Users</h2>
            <label className='form-label'>Find a user</label>
            <input className='form-text-input'
                      value={search}
                      placeholder='Enter user name'
                      type='text'
                      name='search'
                      onChange={(e) => setSearch(e.target.value)}/>
            <div className='form-comment'>Enter name, last name or username</div>

            <div className='form-button-group'>
                <button className='btn btn-primary form-submit-btn' type='submit'>Block User</button>
                <button className='btn btn-primary form-submit-btn' type='submit'>Delete User</button>
            </div>
        </form>
    </div>
};

export default ManageSiteUsers;

