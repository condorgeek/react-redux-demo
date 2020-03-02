/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [create-space-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 30.01.20, 14:43
 */
import DatePicker from 'react-datepicker';

import React, {Component} from 'react';
import {EVENT_SPACE, PUBLIC_ACCESS, RESTRICTED_ACCESS} from "../../../actions/spaces";

import 'react-datepicker/dist/react-datepicker.css';
import {NavigationCancelSubmit} from "../../navigation-headlines/navigation-cancel-submit";


export default class CreateSpaceForm extends Component {

    constructor(props) {
        super(props);
        this.state = {access: PUBLIC_ACCESS, start: new Date(), isFormInvalid: ''}; /* form data */
    }

    handleChange(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleSubmit(focusId, type, event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(focusId).focus();

        if (!event.target.checkValidity()) {
            this.setState({isFormInvalid: 'form-invalid'});
            return;
        }
        this.setState({isFormInvalid: ''});
        event.target.reset();

        const formdata = {...this.state};
        this.props.callback(type, formdata);

    }

    handleOnChangeDate(date) {

        console.log('PICKER', date.toISOString());

        this.setState({start: date});
    }

    render() {
        const {className, authname, type, icon} = this.props;
        const display = this.props.display || type.toLowerCase();
        const {access, isFormInvalid} = this.state;

        // TODO refactor unneeded id's
        const nameId = `${type}-name-${authname}`;

        return <div className={`active-space-frame ${className && className}`}>
            <h4>Create Space</h4>
            <form noValidate className={isFormInvalid}
                  onSubmit={event => this.handleSubmit(nameId, type, event)}>
                <div className='active-space'>
                    <input type="text" id={nameId} name="name" placeholder={`Enter ${display} name..`}
                           onChange={event => this.handleChange(event)} required/>
                    <textarea name="description" placeholder={`Enter ${display} description..`}
                              onChange={event => this.handleChange(event)} required/>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="access"
                               checked={access === PUBLIC_ACCESS}
                               onChange={(event) => this.handleChange(event)}
                               id="publicId" value={PUBLIC_ACCESS} required/>
                        <label className="form-check-label"
                               htmlFor="publicId">Public</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="access"
                               checked={access === RESTRICTED_ACCESS}
                               onChange={(event) => this.handleChange(event)}
                               id="restrictedId" value={RESTRICTED_ACCESS}/>
                        <label className="form-check-label"
                               htmlFor="restrictedId">Restricted Access</label>
                    </div>

                    {type === EVENT_SPACE && <DatePicker selected={new Date(this.state.start)}
                                                         onChange={this.handleOnChangeDate.bind(this)}
                                                         placeholderText="Enter date and time" dateFormat="MMM d, yyyy"
                                                         timeCaption="Time" minDate={new Date()}
                                                         popperPlacement="left"/>}

                    <NavigationCancelSubmit className='pb-1'/>

                </div>
            </form>

        </div>
    }
}