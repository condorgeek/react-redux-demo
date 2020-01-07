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
import {connect} from 'react-redux';
import {getLoggedInUserdata} from "../../reducers/selectors";

const UpdateAccountAddress = (props) => {
    const [city, setCity] = useState(props.userdata ? props.userdata.address.city : '');
    const [country, setCountry] = useState(props.userdata ? props.userdata.address.country : '');
    const [cityFrom, setCityFrom] = useState('');
    const [countryFrom, setCountryFrom] = useState( '');

    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={(e) => {
            e.preventDefault();
            console.log('UPDATE ADDRESS', city)
        }}>
            <h2>Update Your Location</h2>

            <h3 className='form-section-header'>Where you live</h3>
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
                    <input className='form-text-input '
                           value={country}
                           placeholder='Enter country'
                           type='text'
                           name='country'
                           onChange={(e) => setCountry(e.target.value)}/>
                </div>
            </div>

            <div className='form-comment form-comment-tidy'>Enter the city and country where you currently live</div>

            <hr/>

            <h3 className='form-section-header'>Where you come from</h3>
            <div className='form-group'>
                <div className='form-group-item'>
                    <label className='form-group-label'>City</label>
                    <input className='form-text-input'
                           value={cityFrom}
                           placeholder='Enter city from'
                           type='text'
                           name='cityFrom'
                           onChange={(e) => setCityFrom(e.target.value)}/>
                </div>
                <div className='form-group-item'>
                    <label className='form-group-label'>Country</label>
                    <input className='form-text-input '
                           value={countryFrom}
                           placeholder='Enter country'
                           type='text'
                           name='countryFrom'
                           onChange={(e) => setCountryFrom(e.target.value)}/>
                </div>
            </div>

            <div className='form-comment form-comment-tidy'>Enter the city and country where you come from</div>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update location</button>
        </form>
    </div>
};

const mapStateToProps = (state) => ({
    userdata: getLoggedInUserdata(state),
});

export default connect(mapStateToProps, {})(UpdateAccountAddress);

