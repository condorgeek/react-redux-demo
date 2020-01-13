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
import ManageSiteSettings from "./manage-site-settings";
import ManageSiteCSS from "./manage-site-css";
import ManageSiteUsers from "./manage-site-users";

const ManageSite = (props) => {

    return <div className='standard-tab-navigation'>
        <ul class="nav nav-tabs justify-content-center11" id="myTab" role="tablist">
            <li className="nav-item">
                <a className="nav-link active" id="messages-tab" data-toggle="tab" href="#messages" role="tab"
                   aria-controls="messages" aria-selected="false">Users</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home"
                   aria-selected="true">Site Settings</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                   aria-controls="profile" aria-selected="false">CSS</a>
            </li>
        </ul>

        <div className="tab-content">
            <div className="tab-pane active" id="messages" role="tabpanel" aria-labelledby="messages-tab">
                <ManageSiteUsers/>
            </div>
            <div className="tab-pane" id="home" role="tabpanel" aria-labelledby="home-tab">
                <ManageSiteSettings/>
            </div>
            <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <ManageSiteCSS/>
            </div>
        </div>

    </div>


};

export default ManageSite;

