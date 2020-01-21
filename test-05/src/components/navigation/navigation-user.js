/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [navigation-user.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 25.07.18 11:23
 */

import React, {Component} from 'react';
import {Link} from 'react-router-dom';

const NavigationUser = (props) => {
    return <div className='navigation-user-container'  {...props}>
        <Link to={props.to}>
            <img className='navigation-user-avatar' src={props.avatar}/>
            <div className='navigation-user-name'>{props.name}</div>
        </Link>
    </div>
};

export default NavigationUser;

