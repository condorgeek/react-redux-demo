/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [configuration-context.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 23.05.20, 12:14
 */
import React from 'react';

import {ConfigurationContext} from "../configuration/configuration";

export const withConfigurationContext = Component => props => {
    return <ConfigurationContext.Consumer>
        {(values) => (<Component {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};