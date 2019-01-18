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

export default class NavigationUser extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="user-login">
                <img className="thumb" src={this.props.avatar}/>
                {/*<span className='badge badge-pill badge-light'>12</span>*/}

                <Link to={this.props.to}>{this.props.name}</Link>
            </div>
        );
    }
}