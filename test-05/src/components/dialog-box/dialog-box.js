/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [dialog-box.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 13.01.20, 17:56
 */

import React, {useEffect} from 'react';
import ReactModal from 'react-modal';

const DialogBox = (props) => {
    const {isOpen, setIsOpen, title, action, callback, data} = props;

    useEffect(() => {
        ReactModal.setAppElement(props.root || '#root');
    }, []);

    return <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}
                       className="standard-dialog-box"
                       overlayClassName="standard-dialog-box-overlay">
        <div className='dialog-box-container'>
            <div className='dialog-box-header'>
                <span className='dialog-box-title'>{title}</span>
                <span className='btn btn-outline-primary dialog-box-close-btn' onClick={() => setIsOpen(false)}>
                    <i className="fas fa-times"/>
                </span>
            </div>
            <div className='dialog-box-content'>
                {props.children}
            </div>
            <div className='dialog-box-footer'>
                <button className='btn btn-primary' onClick={() => setIsOpen(false)}>Cancel</button>
                <button className='btn btn-primary' onClick={(e) => {
                    callback(e, data);
                    setIsOpen(false)
                }}>{action}</button>
            </div>
        </div>
    </ReactModal>
};

export default DialogBox;