/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headline-editor.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.12.18 19:04
 */

import toastr from "../../../node_modules/toastr/toastr";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import he from '../../../node_modules/he/he';

import {showTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {EVENT_SPACE, GENERIC_SPACE, PUBLIC_ACCESS, RESTRICTED_ACCESS, asyncUpdateSpace} from "../../actions/spaces";

class HeadlineEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.tooltips = [];
    }

    componentDidMount() {
        if(this.refElem) this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    }

    componentDidUpdate() {
        if(this.refElem) this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    }

    getIcon() {
        return this.state.open ? <i className="far fa-minus-square"/> : <i className="far fa-plus-square"/>;
    }

    getTitle() {
        return this.state.open ? 'Less content': 'More content'
    }

    render() {
        const {title, text, icon} = this.props;
        if(!text) return '';
        const isOverflow = text.length > 380;
        const content = isOverflow && !this.state.open ? text.slice(0, 380) : text;


        return <div className="headline-entry">
            {title && <h6><i className={icon}/> {title} </h6>}
            <div className="d-inline" ref={elem => {
                if(!elem) return;
                this.refElem = elem;
                elem.innerHTML = he.decode(elem.innerHTML);

            }}>{content}</div>

            {isOverflow && <button className="btn btn-darkblue btn-sm" title={this.getTitle()}
                                   onClick={event => {
                                       event.preventDefault();
                                       this.setState({open: !this.state.open});
                                   }} ref={elem => {
                if (elem === null) return;
                this.tooltips.push(showTooltip(elem));
            }}>{this.getIcon()}</button>}

        </div>;
    }
}

class HeadlinesEditor extends Component {

    constructor(props) {
        super(props);
        this.state= {start: moment(), isFormInvalid: '', formdata: {access: PUBLIC_ACCESS}};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {space} = nextProps.genericdata;
        const spacedata = space.spacedata || {};

        this.setState({formdata: {name: space.name, description: space.description, access: space.access,
                generalInformation: spacedata.generalInformation, theVenue: spacedata.theVenue,
                theCity: spacedata.theCity, accommodation: spacedata.accommodation,
                travelInformation: spacedata.travelInformation, charityRun: spacedata.charityRun,
                tickets: spacedata.tickets, dates: spacedata.dates, keyDates: spacedata.keyDates
        }});
    }

    renderSpaceNavigation(authname, space, type) {

        const isOwner = space && (space.user.username === authname);
        const toggleId = `edit-open-${space.id}`;
        const nameId = `edit-name-${space.id}`;

        return <div className="headline-navigation">
            {isOwner &&
            <button title="Edit space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        const toggle = document.getElementById(toggleId);
                        if (toggle) {
                            toggle.classList.toggle('active-show');
                        }
                        setTimeout(() => {
                            document.getElementById(nameId).focus();
                        }, 500);
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-edit"/>
            </button>}
        </div>
    }

    handleChange(event) {
        const form = event.target;
        const formdata = Object.assign(this.state.formdata, {[form.name]: form.value});
        this.setState({formdata: formdata});
    }

    handleOnChangeDate(date) {
        this.setState({start: date});
    }

    handleSubmit(event, authname, focusId, spaceId) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(focusId).focus();

        if (!event.target.checkValidity()) {
            this.setState({ isFormInvalid: 'form-invalid'});
            return;
        }
        this.setState({ isFormInvalid: '' });
        // event.target.reset();

        this.props.asyncUpdateSpace(authname, spaceId, this.state.formdata, space => {
                toastr.info(`You have updated ${space.name}`);
            });
    }

    renderEditableForm(authname, space, type, icon="fas fa-users") {

        const toggleId = `edit-open-${space.id}`;
        const nameId = `edit-name-${space.id}`;
        const spacedata = space.spacedata || {};

        const {isFormInvalid, formdata} = this.state;

        return <div className="active-space-toggle" id={toggleId}>
            <form noValidate className={isFormInvalid}
                  onSubmit={event => this.handleSubmit(event, authname, nameId, space.id)}>
                <div className='active-space'>
                    <input type="text" id={nameId} name="name" placeholder={`Enter name..`}
                           value={formdata.name}
                           onChange={event => this.handleChange(event)} required/>
                    <textarea name="description" placeholder={`Enter description..`}
                              value={formdata.description}
                              onChange={event => this.handleChange(event)} required/>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="access"
                               checked={formdata.access === PUBLIC_ACCESS}
                               onChange={(event) => this.handleChange(event)}
                               id="publicId" value={PUBLIC_ACCESS} required/>
                        <label className="form-check-label"
                               htmlFor="publicId">Public</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="access"
                               checked={formdata.access === RESTRICTED_ACCESS}
                               onChange={(event) => this.handleChange(event)}
                               id="restrictedId" value={RESTRICTED_ACCESS}/>
                        <label className="form-check-label"
                               htmlFor="restrictedId">Restricted Access</label>
                    </div>

                    {type === EVENT_SPACE &&
                    <DatePicker selected={this.state.start}
                                onChange={this.handleOnChangeDate.bind(this)}
                                showTimeSelect timeFormat="HH:mm" timeIntervals={30}
                                placeholderText="Enter date and time" dateFormat="LLL"
                                timeCaption="Time" minDate={moment()}
                                dateFormat="LLL" popperPlacement="left"/>}

                    <textarea name="generalInformation" placeholder={`General information..`}
                              value={formdata.generalInformation}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="theVenue" placeholder={`The Venue..`}
                              value={formdata.theVenue}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="theCity" placeholder={`The City..`}
                              value={formdata.theCity}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="accommodation" placeholder={`Hotel & Accommodation..`}
                              value={formdata.accommodation}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="travelInformation" placeholder={`Public transportation..`}
                              value={formdata.travelInformation}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="tickets" placeholder={`Tickets..`}
                              value={formdata.tickets}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="charityRun" placeholder={`Charity..`}
                              value={formdata.charityRun}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="dates" placeholder={`Dates..`}
                              value={formdata.dates}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="keyDates" placeholder={`Key Dates..`}
                              value={formdata.keyDates}
                              onChange={event => this.handleChange(event)}/>

                    <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                        <i className={`${icon} mr-1`}/>Save
                    </button>
                </div>
            </form>
        </div>
    }

    render() {
        const {genericdata, authname, spaceId, type = GENERIC_SPACE} = this.props;

        if (!genericdata) return (<div className="fa-2x">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        const spacedata = genericdata.space.spacedata;

        return <div>
            <div className='headline'><h5>About this Space</h5>
                {this.renderSpaceNavigation(authname, genericdata.space, type)}
            </div>

            <div className="active-space-frame">
                {this.renderEditableForm(authname, genericdata.space, type)}
            </div>
            <div className="headline-body">
                <h4>{genericdata.space.name}</h4>
                <HeadlineEntry text={genericdata.space.description}/>
                {spacedata && <HeadlineEntry title='General Information' text={spacedata.generalInformation} icon='fas fa-info-circle'/>}
                {spacedata && <HeadlineEntry title='Location' text={spacedata.theVenue} icon='fas fa-hotel'/>}
                {spacedata && <HeadlineEntry title='City' text={spacedata.theCity} icon='fas fa-city'/>}
                {spacedata && <HeadlineEntry title='Hotel' text={spacedata.accommodation} icon='fas fa-bed'/>}
                {spacedata && <HeadlineEntry title='Public Transportation' text={spacedata.travelInformation} icon='fas fa-bus'/>}
                {spacedata && <HeadlineEntry title='Tickets' text={spacedata.tickets} icon='fas fa-ticket-alt'/>}
                {spacedata && <HeadlineEntry title='Charity' text={spacedata.charityRun} icon='fas fa-hand-holding-usd'/>}
                {spacedata && <HeadlineEntry title='Dates' text={spacedata.dates} icon='fas fa-calendar-alt'/>}
                {spacedata && <HeadlineEntry title='Key Dates' text={spacedata.keyDates} icon='fas fa-calendar-check'/>}
            </div>
        </div>
    }
}
function mapStateToProps(state) {
    return {
        genericdata: state.genericdata ? state.genericdata.payload : null
    };
}

export default connect(mapStateToProps, {asyncUpdateSpace})(HeadlinesEditor);
