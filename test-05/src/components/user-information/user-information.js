/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [user-info.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 28.02.20, 22:33
 */

import React, {useContext} from 'react';
import HeadlineUserEntry from "./headline-user-entry";
import {asStaticUrl} from "../util/text-utils";
import {ConfigurationContext} from "../configuration/configuration";

const UserInformation = (props) => {
    const {className, description, firstname, userdata} = props;
    const {Lang} = useContext(ConfigurationContext);

    return <div className={`user-information ${className ? className : ''}`}>
            <HeadlineUserEntry text={description} fullview={true}/>
            {userdata && <div>
                <HeadlineUserEntry title={`${Lang.user.about} ${firstname}`} text={userdata.aboutYou} fullview={true}/>
                <HeadlineUserEntry title={Lang.user.web} text={asStaticUrl(userdata.web)} fullview/>
                <HeadlineUserEntry title={Lang.user.work} text={userdata.work}/>
                <HeadlineUserEntry title={Lang.user.studies} text={userdata.studies}/>
                <HeadlineUserEntry title={Lang.user.politics} text={userdata.politics}/>
                <HeadlineUserEntry title={Lang.user.religion} text={userdata.religion}/>
                <HeadlineUserEntry title={Lang.user.interests} text={userdata.interests}/>
            </div>}
        </div>
};

export default UserInformation;