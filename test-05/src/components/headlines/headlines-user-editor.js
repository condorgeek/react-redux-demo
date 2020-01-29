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

import toastr from "../../../node_modules/toastr/toastr";
import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';

import {HOME_SPACE, PUBLIC_ACCESS} from "../../actions/spaces";
import {asyncUpdateUserData} from "../../actions";
import HeadlineUserEntry from './headline-user-entry';
import WidgetCreateForm from "../widgets/widget-create-form";
import {isAuthorized, isSuperUser} from "../../selectors";
import {FlatButton, FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";

class HeadlinesUserEditor extends Component {

    constructor(props) {
        super(props);
        this.state= {isFormInvalid: '', formdata: {access: PUBLIC_ACCESS}};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(!nextProps.homedata) return;
        this.populateForm(nextProps.homedata);
    }

    populateForm(homedata) {
        const {space, userdata} = homedata;

        this.setState({isFormInvalid: '', formdata: {
                ranking: space.ranking,
                aboutYou: userdata.aboutYou, web: userdata.web, politics: userdata.politics, religion: userdata.religion,
                work: userdata.work, studies: userdata.studies, interests: userdata.interests
            }});
    }

    renderSpaceNavigation(authname, space, isSuperUser, type) {
        const {homedata} = this.props;
        const isOwner = space && (space.user.username === authname);

        return <NavigationRow>
            <NavigationGroup/>
            <NavigationGroup>
                <FlatIcon circle onClick={(event) => {
                    event.preventDefault();
                    this.widgetCreateRef && this.widgetCreateRef.toggle();
                }}>
                    <Icon className="fas fa-cog" title='Create widget'/>
                </FlatIcon>
                <FlatIcon circle  onClick={(event) => {
                    event.preventDefault();
                    const visible = this.toggleEditableForm();
                    visible && this.populateForm(homedata);
                }}>
                    <Icon className="fas fa-edit" title='Edit user'/>
                </FlatIcon>
            </NavigationGroup>
        </NavigationRow>
    }

    handleChange(event) {
        const form = event.target;
        const formdata = Object.assign(this.state.formdata, {[form.name]: form.value});
        this.setState({formdata: formdata});
    }

    handleSubmit(event, space) {
        event.preventDefault();
        event.stopPropagation();

        if (!event.target.checkValidity()) {
            this.setState({ isFormInvalid: 'form-invalid'});
            return;
        }

        this.props.asyncUpdateUserData(space.user.username, this.state.formdata, userdata => {
                toastr.info(`You have updated ${space.user.fullname}`);
            });
    }

    toggleEditableForm = () => {
        const visible = this.formRef.classList.toggle('active-show');
        setTimeout(() => {
            this.focusRef.focus();
        }, 500);

        return visible;
    };

    renderEditableForm(space, type, icon="fas fa-users") {

        const {isFormInvalid, formdata} = this.state;

        return <div className="active-space-toggle" ref={ref => this.formRef = ref}>
            <h4 className='clr-navy'>Edit User Data</h4>
            <form noValidate className={isFormInvalid}
                  onSubmit={event => this.handleSubmit(event, space)}>
                <div className='active-space'>
                    <textarea name="aboutYou" placeholder={`About you..`}
                              ref={ref => this.focusRef = ref}
                              value={formdata.aboutYou || ''}
                              onChange={event => this.handleChange(event)} required/>

                    <textarea name="work" placeholder={`Work..`}
                              value={formdata.work || ''}
                              onChange={event => this.handleChange(event)}/>

                    <textarea name="web" placeholder={`Web..`}
                              value={formdata.web || ''}
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

                    <NavigationRow className='mb-1'>
                        <NavigationGroup/>
                        <NavigationGroup>
                            <FlatButton btn small title='Cancel' className='btn-light mr-2' onClick={(e) => {
                                e.preventDefault();
                                this.toggleEditableForm();
                            }}>
                                <i className="fas fa-times mr-1"/>Cancel
                            </FlatButton>

                            <FlatButton btn small type="submit" title='Save' className='btn-outline-primary'>
                                <i className="fas fa-save mr-1"/>Save
                            </FlatButton>
                        </NavigationGroup>
                    </NavigationRow>


                </div>
            </form>
        </div>
    }

    /* must return static html to be passed to headlineuserentry component */
    asStaticUrl(web) {
        if(!web) return '';
        const regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm;

        const list =  web.split(/,|\r|\n/).map(entry => {
            const matches = regex.exec(entry.trim());
            const domain = matches && matches.length > 0 ? matches[0] : entry.trim();

            return `<li><a href=${entry.trim()} target='_blank'> ${domain}</a> <i class="fas fa-external-link-alt "></i></li>`;
        });

        return ReactDOMServer.renderToStaticMarkup(<ul className="headline-user-list btn-plattform">{list}</ul>);
    }

    render() {
        const {homedata, authname, spaceId, type = HOME_SPACE, isAuthorized, isSuperUser} = this.props;

        if (!homedata) return (<div className="fa-2xx">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        const {userdata, space} = homedata;

        return <div className="headline-user-editor">

            {/*<div className="headline-display-box">*/}
            {/*    <div className="headline-display-text">*/}
            {/*        <span className="headline-text">{space.user.fullname}</span>*/}
            {/*    </div></div>*/}

            {isAuthorized && (homedata.isOwner || isSuperUser) &&
                this.renderSpaceNavigation(authname, space, isSuperUser, type)
            }

            <div className="active-space-frame">
                {this.renderEditableForm(homedata.space, type)}
                {isSuperUser && <WidgetCreateForm authname={authname} onRef={ref => this.widgetCreateRef = ref} mode='LEFT'/>}
            </div>

            <div className="headline-body">
                <HeadlineUserEntry text={space.description} fullview={true}/>
                {userdata && <div>
                    <HeadlineUserEntry title={`About ${space.user.firstname}`} text={userdata.aboutYou} fullview={true}/>
                    <HeadlineUserEntry title='Web' text={this.asStaticUrl(userdata.web)} fullview={true}/>
                    <HeadlineUserEntry title='Work' text={userdata.work}/>
                    <HeadlineUserEntry title='Studies' text={userdata.studies}/>
                    <HeadlineUserEntry title='Politics' text={userdata.politics}/>
                    <HeadlineUserEntry title='Religion' text={userdata.religion}/>
                    <HeadlineUserEntry title='Interests' text={userdata.interests}/>
                </div>}
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    homedata: state.homedata ? state.homedata.payload : state.homedata,
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
});

export default connect(mapStateToProps, {asyncUpdateUserData})(HeadlinesUserEditor);
