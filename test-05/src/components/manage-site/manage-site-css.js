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

const ManageSiteCSS = (props) => {
    const [customCSS, setCustomCSS] = useState("");
    const [customFont, setCustomFont] = useState("");

    return <div className='standard-form-container'>
        <form className='standard-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('MANAGE SITE', customCSS)
        }}>
            <h2>Manage Site CSS</h2>
            <label className='form-label'>Site custom CSS</label>
            <textarea className='form-textarea'
                      value={customCSS}
                      placeholder='Enter site custom CSS'
                      type='text'
                      name='customCSS'
                      rows='10'
                      onChange={(e) => setCustomCSS(e.target.value)}/>
            <div className='form-comment'>The CSS will be globally available. All css classes must start with the prefix '.custom-'</div>

            <label className='form-label'>Site custom font</label>
            <input className='form-text-input'
                   value={customFont}
                   placeholder='Enter custom font family'
                   type='text'
                   name='customFont'
                   onChange={(e) => setCustomFont(e.target.value)}/>

            <div className='form-comment'>Only google fonts supported</div>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update CSS</button>
        </form>
    </div>
};

export default ManageSiteCSS;

