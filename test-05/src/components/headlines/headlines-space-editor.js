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

import {EVENT_SPACE, GENERIC_SPACE, PUBLIC_ACCESS, RESTRICTED_ACCESS, asyncUpdateSpace,
    asyncAssignSpaceChildren} from "../../actions/spaces";
import WidgetCreateForm from "../widgets/widget-create-form";
import {isAuthorized, isSuperUser} from "../../selectors";


class _HeadlineChildrenEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {isFormInvalid: false, formdata: {children: this.populateChildren(props.space)}};
    }

    populateChildren(space) {
        return space.children && space.children.map(space => space.name).join("\n");
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ formdata: {children: this.populateChildren(nextProps.space)}});
    }

    handleSubmit = event => {
        event.preventDefault();

        const {authname, space} = this.props;
        const children = [];
        const text = this.state.formdata.children.trim();

        text.split(/,|[\r\n]+/g).forEach(space => space !== ""  && children.push(space));
        console.log('SUBMIT', {parentId: space.id, children: children});

        this.props.asyncAssignSpaceChildren(authname, space.id, {parentId: space.id, children: children},
                space => {

            console.log('AFTER', space);

            toastr.info(`${space.children ? space.children.length : 0 } child spaces assigned successfully.`);
        });
    };

    handleChange = event => {
          this.setState({formdata: {children: event.target.value}});
    };

    render() {

        const {authname, space} = this.props;
        const {isFormInvalid, formdata} = this.state;
        const spacedata = space.spacedata || {};
        const menuId = `edit-menu-${space.id}`;

        return <div className="active-space-frame">
            <div className="active-space-toggle" id={menuId}>
                <form noValidate className={isFormInvalid}
                      onSubmit={event => this.handleSubmit(event, authname, space.id)}>
                    <div className='active-space'>

                    <textarea name="children" placeholder={`Enter child spaces..`}
                              value={formdata.children || ''}
                              onChange={event => this.handleChange(event)}/>

                        <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                            <i className="fas fa-cloud-upload-alt"/>Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }
}

const HeadlineChildrenEditor = connect(null, {asyncAssignSpaceChildren})(_HeadlineChildrenEditor);

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
        return this.state.open ? <span><i className="far fa-minus-square"/> Less..</span>:
            <span><i className="far fa-plus-square"/> More..</span>;
    }

    getTitle() {
        return this.state.open ? 'Less content': 'More content'
    }

    isFullview(text) {
        const regex = /<div.*[class|className]\s*=.*fullview.*?>/ig;
        return this.props.fullview ? true : regex.test(text);
    }

    breakText(text, num) {
        return text.split(" ").splice(0, num).join(" ");
    }

    render() {
        const {title, text, icon, fullview} = this.props;
        if(!text) return '';

        const isOverflow = !this.isFullview(text) && text.length > 380;
        const content = isOverflow && !this.state.open ? this.breakText(text, 40) : text;

        return <div className="headline-entry">
            {title && <h6 className='d-block'><i className={icon}/> XXX{title} </h6>}
            <div className="headline-entry-text" ref={elem => {
                if(!elem) return;
                this.refElem = elem;
                elem.innerHTML = he.decode(elem.innerHTML);
            }}>AAA{content}</div>

            {isOverflow && <button className="btn btn-more btn-sm" title={this.getTitle()}
                                   onClick={event => {
                                       event.preventDefault();
                                       this.setState({open: !this.state.open});
                                       setTimeout(() => {
                                           if (document.activeElement !== document.body) document.activeElement.blur();
                                       }, 500)
                                   }} ref={elem => {
                if (elem === null) return;
                this.tooltips.push(showTooltip(elem));
            }}>{this.getIcon()}</button>}

        </div>;
    }
}

class HeadlinesSpaceEditor extends Component {

    constructor(props) {
        super(props);
        this.state= {start: moment(), isFormInvalid: '', formdata: {access: PUBLIC_ACCESS}};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(!nextProps.genericdata) return;
        this.populateForm(nextProps.genericdata.space)
    }

    populateForm(space) {
        const spacedata = space.spacedata || {};

        this.setState({formdata: {name: space.name, description: space.description,
                ranking: space.ranking, access: space.access,
                generalInformation: spacedata.generalInformation, theVenue: spacedata.theVenue,
                theCity: spacedata.theCity, accommodation: spacedata.accommodation,
                travelInformation: spacedata.travelInformation, charityRun: spacedata.charityRun,
                tickets: spacedata.tickets, dates: spacedata.dates, keyDates: spacedata.keyDates,
                startDate: spacedata.startDate ? new Date(spacedata.startDate) : new Date()
            }});
    }

    renderSpaceNavigation(authname, space, isSuperUser, type) {

        const {genericdata} = this.props;
        const isOwner = space && (space.user.username === authname);
        const menuId = `edit-menu-${space.id}`;
        const toggleId = `edit-open-${space.id}`;
        const nameId = `edit-name-${space.id}`;

        return <div className="headline-navigation">

            {isSuperUser &&
            <button title="Create new Widget" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        this.widgetCreateRef && this.widgetCreateRef.toggle();
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-cog"/>
            </button>}

            {(isOwner || isSuperUser) &&
            <button title="Edit Menu" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        const toggle = document.getElementById(menuId);
                        if (toggle) {
                            const visible = toggle.classList.toggle('active-show');
                            visible && this.populateForm(genericdata.space);
                        }
                        setTimeout(() => {
                            document.getElementById(nameId).focus();
                        }, 500);
                    }}
                    ref={(elem) => {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}><i className="fas fa-list"/>
            </button>}

            {isOwner &&
            <button title="Edit space" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        const toggle = document.getElementById(toggleId);
                        if (toggle) {
                            const visible = toggle.classList.toggle('active-show');
                            visible && this.populateForm(genericdata.space);
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

        const formdata = Object.assign(this.state.formdata,
            {startDate: moment(this.state.startDate).format('YYYY-MM-DD')});

        this.props.asyncUpdateSpace(authname, spaceId, formdata, space => {
            toastr.info(`You have updated ${space.name}`);
        });

    }

    handleOnChangeDate = (date) => {
        this.setState(this.state.formdata.startDate, date);
    };

    renderEditableForm(authname, space, type, icon="fas fa-cloud-upload-alt") {

        const toggleId = `edit-open-${space.id}`;
        const nameId = `edit-name-${space.id}`;
        const spacedata = space.spacedata || {};

        const {isFormInvalid, formdata} = this.state;

        return <div className="active-space-toggle" id={toggleId}>
            <form noValidate className={isFormInvalid}
                  onSubmit={event => this.handleSubmit(event, authname, nameId, space.id)}>
                <div className='active-space'>
                    <input type="text" id={nameId} name="name" placeholder={`Enter name..`}
                           value={formdata.name || ''}
                           onChange={event => this.handleChange(event)} required/>

                    <textarea name="description" placeholder={`Enter description..`}
                              value={formdata.description || ''}
                              onChange={event => this.handleChange(event)} required/>

                    <input type="text" name="ranking" className="mb-2" placeholder={`Ranking.. (0-9999)`}
                           value={formdata.ranking || ''}
                           pattern="[0-9.]+"
                           maxLength="4"
                           onChange={event => this.handleChange(event)} />

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

                    {space.type === EVENT_SPACE &&
                    <DatePicker selected={formdata.startDate}
                                onChange={this.handleOnChangeDate}
                                placeholderText="Event start date" dateFormat="MMM d, yyyy"
                                timeCaption="Time" minDate={new Date()}
                                popperPlacement="right"/>}

                    <textarea name="generalInformation" placeholder={`General information..`}
                              value={formdata.generalInformation || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="tickets" placeholder={`Tickets..`}
                              value={formdata.tickets || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="dates" placeholder={`Dates..`}
                              value={formdata.dates || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="theVenue" placeholder={`The Venue..`}
                              value={formdata.theVenue || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="theCity" placeholder={`The City..`}
                              value={formdata.theCity || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="accommodation" placeholder={`Hotel & Accommodation..`}
                              value={formdata.accommodation || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="travelInformation" placeholder={`Public transportation..`}
                              value={formdata.travelInformation || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="charityRun" placeholder={`Charity..`}
                              value={formdata.charityRun || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="keyDates" placeholder={`Key Dates..`}
                              value={formdata.keyDates || ''}
                              onChange={event => this.handleChange(event)}/>

                    <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                        <i className={`${icon} mr-1`}/>Save
                    </button>
                </div>
            </form>
        </div>
    }

    render() {
        const {genericdata, authname, spaceId, type = GENERIC_SPACE, authorization, isAuthorized, isSuperUser} = this.props;

        if (!genericdata) return (<div className="fa-2xx">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        const {id, spacedata} = genericdata.space;
        const isOwner = genericdata.space && (genericdata.space.user.username === authname);
        const isEvent = genericdata.space.type === 'EVENT';
        const startDate = isEvent && spacedata.startDate ? spacedata.startDate : genericdata.space.created;

        return <div className="headline-user-editor">

            <div className="headline-display-box">
                <div className="headline-display-text">
                    <span className="headline-text">{genericdata.space.name}</span>
                </div></div>

            {isAuthorized && isOwner && <div className='headline'>
                {/*<h5>About</h5>*/}
                {this.renderSpaceNavigation(authname, genericdata.space, isSuperUser, type)}
            </div>}

            <div className="active-space-frame">
                <HeadlineChildrenEditor authname={authname} space={genericdata.space}/>
                {isSuperUser && <WidgetCreateForm authname={authname} onRef={ref => this.widgetCreateRef = ref} mode='LEFT'/>}
                {this.renderEditableForm(authname, genericdata.space, type)}
            </div>

            <div className="headline-body">

                {isEvent && <div className="headline-date-container">
                    <div className="headline-date">
                        <div className="month">{moment(startDate).format('MMM')}</div>
                        <div className="day">{moment(startDate).format('DD')}</div>
                    </div>
                </div>}

                <h4>{genericdata.space.name}</h4>
                <HeadlineEntry text={genericdata.space.description} fullview={true}/>
                {spacedata && <div>
                    <HeadlineEntry title='General Information' text={spacedata.generalInformation} fullview={true} icon='fas fa-info-circle'/>
                    <HeadlineEntry title='Tickets' text={spacedata.tickets} icon='fas fa-ticket-alt'/>
                    <HeadlineEntry title='Dates' text={spacedata.dates} icon='fas fa-calendar-alt'/>
                    <HeadlineEntry title='Location' text={spacedata.theVenue} icon='fas fa-hotel'/>
                    <HeadlineEntry title='City' text={spacedata.theCity} icon='fas fa-city'/>
                    <HeadlineEntry title='Public Transportation' text={spacedata.travelInformation} icon='fas fa-bus'/>
                    <HeadlineEntry title='Hotel' text={spacedata.accommodation} icon='fas fa-bed'/>
                    <HeadlineEntry title='Charity' text={spacedata.charityRun} icon='fas fa-hand-holding-usd'/>
                    <HeadlineEntry title='Key Dates' text={spacedata.keyDates} icon='fas fa-calendar-check'/>
                </div>}
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    genericdata: state.genericdata ? state.genericdata.payload : null,
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
});

export default connect(mapStateToProps, {asyncUpdateSpace})(HeadlinesSpaceEditor);
