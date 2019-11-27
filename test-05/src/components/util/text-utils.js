/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [text-utils.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 24.11.19, 13:06
 */

import he from '../../../node_modules/he/he';
import React from 'react';

export const TextAsHTML = (props) => {
    return <p {...props} ref={ref => {if(ref) ref.innerHTML = he.decode(props.children);}}>
        {props.children}
    </p>
};
