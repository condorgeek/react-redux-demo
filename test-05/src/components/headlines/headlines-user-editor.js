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
import {connect} from 'react-redux';

import {HOME_SPACE, PUBLIC_ACCESS} from "../../actions/spaces";
import {asyncUpdateUserData} from "../../actions";
import WidgetCreateForm from "../widgets/widget-create-form";
import {isAuthorized, isSuperUser} from "../../selectors";
import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {NavigationCancelSubmit} from "../navigation-headlines/nav-headlines";
import {ConfigurationContext} from "../configuration/configuration";
import UserInformation from "../user-information/user-information";

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

                    {/*submit button triggers implicitely the onSubmit event  */}
                    <NavigationCancelSubmit onCancel={(e) => {
                        e.preventDefault();
                        this.toggleEditableForm();
                    }}/>

                </div>
            </form>
        </div>
    }

    render() {
        const {homedata, authname, spaceId, type = HOME_SPACE, isAuthorized, isSuperUser, Lang} = this.props;

        if (!homedata) return (<div className="fa-2xx">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        const {userdata, space} = homedata;

        return <div className="headline-user-editor">
            {isAuthorized && (homedata.isOwner || isSuperUser) &&
                this.renderSpaceNavigation(authname, space, isSuperUser, type)
            }

            <div className="active-space-frame">
                {this.renderEditableForm(homedata.space, type)}
                {isSuperUser && <WidgetCreateForm authname={authname} onRef={ref => this.widgetCreateRef = ref} mode='LEFT'/>}
            </div>

            <UserInformation className='pl-2'
                             description={space.description}
                             firstname={space.user.firstname}
                             userdata={userdata}/>
        </div>
    }
}

const mapStateToProps = state => ({
    homedata: state.homedata ? state.homedata.payload : state.homedata,
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
});

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<HeadlinesUserEditor {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default connect(mapStateToProps, {asyncUpdateUserData})(withConfigurationContext);
