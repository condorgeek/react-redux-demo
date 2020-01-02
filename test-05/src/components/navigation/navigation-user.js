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

// export default class NavigationUser extends Component {
//
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//
//         return (
//             <div className="user-login" {...this.props}>
//                 <Link to={this.props.to}>
//                     <img className="thumb" src={this.props.avatar}/>
//                     <div className="user-login-name">{this.props.name}</div>
//                 </Link>
//             </div>
//         );
//     }
// }


const NavigationUser = (props) => {
    return <div className="user-login"  {...props}>
        <Link to={props.to}>
            <img className="thumb" src={props.avatar}/>
            <div className="user-login-name">{props.name}</div>
        </Link>
    </div>
};

export default NavigationUser;

