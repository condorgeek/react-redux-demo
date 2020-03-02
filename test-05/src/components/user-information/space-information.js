/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [space-information.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 02.03.20, 13:19
 */

import React, {useContext} from 'react';
import HeadlineUserEntry from "./headline-user-entry";
import {ConfigurationContext} from "../configuration/configuration";

const SpaceInformation = (props) => {
    const {spacedata, description} = props;
    const {Lang} = useContext(ConfigurationContext);


    return <div className="mobile-headline-body">
        <HeadlineUserEntry text={description}/>
        <HeadlineUserEntry title={Lang.info.generalInformation} text={spacedata.generalInformation}/>
        <HeadlineUserEntry title={Lang.info.tickets} text={spacedata.tickets}/>
        <HeadlineUserEntry title={Lang.info.dates} text={spacedata.dates}/>
        <HeadlineUserEntry title={Lang.info.location} text={spacedata.theVenue}/>
    </div>
};

export default SpaceInformation;
