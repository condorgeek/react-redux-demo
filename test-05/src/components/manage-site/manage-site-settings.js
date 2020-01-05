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

const ManageSiteSettings = (props) => {
    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [theme, setTheme] = useState("");
    const [publicUser, setPublicUser] = useState("");

    return <div className='standard-form-container'>
        <form className='standard-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('MANAGE SITE', fullName, shortName)
        }}>
            <h2>Manage Site</h2>
            <label className='form-label'>Site Full name</label>
            <input className='form-text-input'
                   value={fullName}
                   placeholder='Enter site full name'
                   type='text'
                   name='fullName'
                   onChange={(e) => setFullName(e.target.value)}/>
            <div className='form-comment'>The name of the site in desktop size</div>


            <label className='form-label'>Site Short name</label>
            <input className='form-text-input'
                   value={shortName}
                   placeholder='Enter site short name'
                   type='text'
                   name='shortName'
                   onChange={(e) => setShortName(e.target.value)}/>
            <div className='form-comment'>The name of the site in mobile mode</div>


            <label className='form-label'>Theme</label>
            <input className='form-text-input'
                   value={theme}
                   placeholder='Enter site theme'
                   type='text'
                   name='theme'
                   onChange={(e) => setTheme(e.target.value)}/>

            <label className='form-label'>Default public user</label>
            <input className='form-text-input'
                   value={publicUser}
                   placeholder='Enter default public user'
                   type='text'
                   name='publicUser'
                   onChange={(e) => setPublicUser(e.target.value)}/>

            <div className='form-comment'>Changing the default user implies changing the url of all public pages.</div>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update Settings</button>
        </form>
    </div>
};

export default ManageSiteSettings;

