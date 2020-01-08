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

import React from 'react';
import {connect} from 'react-redux';
import UpdateAccountBasic from "./update-account-basic";
import UpdateAccountPassword from "./update-account-password";
import UpdateAccountPersonal from "./update-account-personal";
import UpdateAccountAddress from "./update-account-address";
import {asyncFetchHomeData} from '../../actions/spaces';
import {getLoggedInUserdata} from "../../reducers/selectors";
import {Spinner} from "../util/spinner";

const UpdateAccount = (props) => {
    if(!props.userdata) return <Spinner/>;

    return <div>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Basic</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Password</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="messages-tab" data-toggle="tab" href="#messages" role="tab" aria-controls="messages" aria-selected="false">Personal</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="settings-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="settings" aria-selected="false">Location</a>
        </li>
    </ul>

        <div className="tab-content">
            <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <UpdateAccountBasic/>
            </div>
            <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <UpdateAccountPassword/>
            </div>
            <div className="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">
                <UpdateAccountPersonal/>
            </div>
            <div className="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
                <UpdateAccountAddress/>
            </div>
        </div>

    </div>

};

const mapStateToProps = (state) => (console.log('LOGIN', state.logindata), {
    userdata: getLoggedInUserdata(state),
});

export default connect(mapStateToProps, {asyncFetchHomeData})(UpdateAccount);

