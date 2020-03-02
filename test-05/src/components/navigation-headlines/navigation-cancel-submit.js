/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [navigation-cancel-submit.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 02.03.20, 14:13
 */

// ---------------------------------------------------------------------------------------------------
// on Submit implicitely triggers the obSubmit event on the parent form
// onCancel expects to toggle ie close some toggle component ie. a SidebarToggler
// ---------------------------------------------------------------------------------------------------

import React, {useContext} from 'react';
import {FlatButton, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {TogglerContext} from "./nav-headlines";

export const NavigationCancelSubmit = (props) => {
    const {className, onCancel, onSubmit, submitText='Save', ...otherProps} = props;
    const {toggle} = useContext(TogglerContext);

    return <NavigationRow className={`navigation-cancel-submit ${className && className}`}>
        <NavigationGroup/>
        <NavigationGroup>
            <FlatButton btn small title='Cancel' className='btn-light mr-2' onClick={onCancel ? onCancel : toggle}>
                <i className="fas fa-times mr-1"/>Cancel
            </FlatButton>

            <FlatButton btn small type="submit" title='Save' className='btn-outline-primary'>
                <i className="fas fa-save mr-1"/>{submitText}
            </FlatButton>
        </NavigationGroup>
    </NavigationRow>
};