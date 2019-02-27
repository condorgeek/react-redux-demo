/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headlines-user-editor.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 17.12.18 13:55
 */

import moment from 'moment';
import toastr from "../../../node_modules/toastr/toastr";

import {showTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {HOME_SPACE, PUBLIC_ACCESS} from "../../actions/spaces";
import {asyncUpdateUserData} from "../../actions";
import HeadlineUserEntry from './headline-user-entry';

class HeadlinesUserEditor extends Component {

    constructor(props) {
        super(props);
        this.state= {start: moment(), isFormInvalid: '', formdata: {access: PUBLIC_ACCESS}};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(!nextProps.homedata) return;
        this.populateForm(nextProps.homedata);
    }

    populateForm(homedata) {
        const {space, userdata} = homedata;

        this.setState({isFormInvalid: '', formdata: {firstname: space.user.firstname, lastname: space.user.lastname,
                ranking: space.ranking,
                aboutYou: userdata.aboutYou, web: userdata.web, politics: userdata.politics, religion: userdata.religion,
                work: userdata.work, studies: userdata.studies, interests: userdata.interests
            }});
    }

    renderSpaceNavigation(authname, space, type) {

        const {homedata} = this.props;
        const isOwner = space && (space.user.username === authname);
        const toggleId = `edit-open-${space.id}`;
        const nameId = `edit-name-${space.id}`;

        return <div className="headline-navigation">
            {isOwner &&
            <button title="Edit user" type="button" className="btn btn-darkblue btn-sm"
                    onClick={(event) => {
                        event.preventDefault();
                        const toggle = document.getElementById(toggleId);
                        if (toggle) {
                            const visible = toggle.classList.toggle('active-show');
                            visible && this.populateForm(homedata);
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

    handleSubmit(event, space, focusId) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(focusId).focus();

        if (!event.target.checkValidity()) {
            this.setState({ isFormInvalid: 'form-invalid'});
            return;
        }
        // this.setState({ isFormInvalid: '' });
        // event.target.reset();

        this.props.asyncUpdateUserData(space.user.username, this.state.formdata, userdata => {
                toastr.info(`You have updated ${space.user.fullname}`);
            });

    }

    renderEditableForm(space, type, icon="fas fa-users") {

        const toggleId = `edit-open-${space.id}`;
        const nameId = `edit-name-${space.id}`;

        const {isFormInvalid, formdata} = this.state;

        return <div className="active-space-toggle" id={toggleId}>
            <form noValidate className={isFormInvalid}
                  onSubmit={event => this.handleSubmit(event, space, nameId, space.id)}>
                <div className='active-space'>
                    <input type="text" id={nameId} name="firstname" placeholder={`Enter firstname..`}
                           value={formdata.firstname || ''}
                           onChange={event => this.handleChange(event)} required/>
                    <input type="text" id={nameId} name="lastname" placeholder={`Enter lastname..`}
                           value={formdata.lastname || ''}
                           onChange={event => this.handleChange(event)} required/>

                    <textarea name="aboutYou" placeholder={`About you..`}
                              // value={formdata.aboutYou || ''} maxlength="124"
                              value={formdata.aboutYou || ''}
                              onChange={event => this.handleChange(event)} required/>

                    <textarea name="work" placeholder={`Work..`}
                              value={formdata.work || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="web" placeholder={`Web..`}
                              value={formdata.web || ''} maxLength="124"
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="religion" placeholder={`Religion..`}
                              value={formdata.religion || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="politics" placeholder={`Politics..`}
                              value={formdata.politics || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="studies" placeholder={`Studies..`}
                              value={formdata.studies || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="interests" placeholder={`Interests..`}
                              value={formdata.interests || ''}
                              onChange={event => this.handleChange(event)}/>

                    <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                        <i className={`${icon} mr-1`}/>Save
                    </button>
                </div>
            </form>
        </div>
    }

    asUrl(web) {
        if(!web) return '';

        const list =  web.split(",").map(entry => {
            return `<li><a href=${entry.trim()} target='_blank'> ${entry.trim()}</a> <i class="fas fa-external-link-alt "></i></li>`;
        });

        return <ul className="headline-user-list btn-plattform">{list}</ul>;
    }

    render() {
        const {homedata, authname, spaceId, type = HOME_SPACE, isAuthorized} = this.props;

        if (!homedata) return (<div className="fa-2xx">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        const {userdata, space} = homedata;

        return <div className="headline-user-editor">

            <div className="headline-display-box">
                <div className="headline-display-text">
                    <span className="headline-text">{space.user.fullname}</span>
                </div></div>

            <h4 className="mt-3">{space.user.fullname}</h4>

            <HeadlineUserEntry text={space.description}/>

            {isAuthorized && homedata.isOwner && <div className='headline'><h5>About</h5>
                {this.renderSpaceNavigation(authname, space, type)}
            </div>}

            <div className="active-space-frame">
                {this.renderEditableForm(homedata.space, type)}
            </div>
            <div className="headline-body">
                {/*<h4>{space.user.fullname}</h4>*/}
                {/*<HeadlineUserEntry text={space.description}/>*/}
                {userdata && <div>
                    <HeadlineUserEntry title={`About ${space.user.firstname}`} text={userdata.aboutYou} icon='fas fa-user-circle'/>
                    <HeadlineUserEntry title='Web' text={this.asUrl(userdata.web)} icon='fas fa-home'/>
                    <HeadlineUserEntry title='Work' text={userdata.work} icon='fas fa-user-tie'/>
                    <HeadlineUserEntry title='Studies' text={userdata.studies} icon='fas fa-user-graduate'/>
                    <HeadlineUserEntry title='Politics' text={userdata.politics} icon='fas fa-landmark'/>
                    <HeadlineUserEntry title='Religion' text={userdata.religion} icon='fas fa-place-of-worship'/>
                    <HeadlineUserEntry title='Interests' text={userdata.interests} icon='fas fa-theater-masks'/>
                </div>}
            </div>
        </div>
    }
}
function mapStateToProps(state) {
    return {
        homedata: state.homedata ? state.homedata.payload : state.homedata
    };
}

export default connect(mapStateToProps, {asyncUpdateUserData})(HeadlinesUserEditor);
