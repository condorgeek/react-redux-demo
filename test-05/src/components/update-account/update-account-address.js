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
import {CountryDropdown} from 'react-country-region-selector';

import React, {useState} from 'react';
import {connect} from 'react-redux';
import {getAuthorizedUsername, getLoggedInUserdata} from "../../reducers/selectors";
import {asyncUpdateUserAddress} from '../../actions';

const UpdateAccountAddress = (props) => {
    const {username, userdata} = props;

    const [city, setCity] = useState(userdata ? userdata.address.city : '');
    const [country, setCountry] = useState(userdata ? userdata.address.country : '');
    const [cityFrom, setCityFrom] = useState('');
    const [countryFrom, setCountryFrom] = useState( '');

    const handleSubmit = (event) => {
        event.preventDefault();

        const formdata = {
            city: city, country: country,
            cityFrom: cityFrom, countryFrom: countryFrom
        };

        props.asyncUpdateUserAddress(username, formdata, userdata => {
            toastr.info(`You have updated the address for ${username}`);
        });

    };

    return <div className='update-account-container'>
        <form className='update-account-form' onSubmit={handleSubmit}>
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
                           required
                           onChange={(e) => setCity(e.target.value)}/>
                </div>
                <div className='form-group-item'>
                    <label className='form-group-label'>Country</label>
                    <CountryDropdown classes="form-country-input"
                                     value={country} valueType="full"
                                     name="country"
                                     defaultOptionLabel='Select country..'
                                     required
                                     onChange={(value) => setCountry(value)}/>
                </div>
            </div>

            <div className='form-comment form-comment-tidy'>Enter the city and country where you currently live</div>

            <hr/>

            <h3 className='form-section-header'>Where you come from</h3>
            <div className='form-group'>
                <div className='form-group-item'>
                    <label className='form-group-label'>City</label>
                    <input className='form-text-input form-text-disabled'
                           value={cityFrom}
                           placeholder='Enter city from'
                           type='text'
                           name='cityFrom'
                           disabled
                           onChange={(e) => setCityFrom(e.target.value)}/>
                </div>
                <div className='form-group-item'>
                    <label className='form-group-label'>Country</label>
                    <input className='form-text-input form-text-disabled'
                           value={countryFrom}
                           placeholder='Enter country'
                           type='text'
                           name='countryFrom'
                           disabled
                           onChange={(e) => setCountryFrom(e.target.value)}/>
                </div>


            </div>

            <div className='form-comment form-comment-tidy'>Enter the city and country where you come from</div>

            <button className='btn btn-primary form-submit-btn' type='submit'>Update location</button>
        </form>
    </div>
};

const mapStateToProps = (state) => ({
    username: getAuthorizedUsername(state),
    userdata: getLoggedInUserdata(state),
});

export default connect(mapStateToProps, {asyncUpdateUserAddress})(UpdateAccountAddress);

