/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [spinner.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.01.20, 14:11
 */
import React from 'react';

export const Spinner = () => {
    return <div className="spinner">
        <i className="fas fa-spinner fa-spin"/>
    </div>
};

export const SpinnerBig = () => {
    return <div className="fa-2x spinner">
        <i className="fas fa-spinner fa-spin"/>
    </div>
};