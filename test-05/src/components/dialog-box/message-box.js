/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [message-box.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 14.01.20, 17:38
 */

import React from 'react';

import DialogBox from "./dialog-box";
import {getStaticImageUrl} from "../../actions/environment";

const MessageBox = (props) => {
    const {data} = props;

    return <DialogBox {...props}>
        <div className='standard-form-selection'>
            <div className='standard-form-selection-avatar'>
                <img src={getStaticImageUrl(data.avatar)}/>
            </div>
            {props.children}
        </div>
    </DialogBox>
};

export default MessageBox;