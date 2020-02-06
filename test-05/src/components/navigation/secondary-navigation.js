/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [secondary-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 22.12.19, 16:57
 */

import React from 'react';
import {TextAsHTML} from "../util/text-utils";

const SecondaryNavigation = ({Copy}) => {
    if(!Copy || !Copy.navigation.secondaryNav) return null;

    return <div className="secondary-navigation">
        <div className="secondary-nav-box">
                <TextAsHTML className='d-inline'>{Copy.navigation.secondaryNav}</TextAsHTML>
        </div>
    </div>
};

export default SecondaryNavigation;