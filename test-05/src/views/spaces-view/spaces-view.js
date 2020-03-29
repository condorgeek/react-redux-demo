/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [spaces.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 22.03.20, 16:18
 */
import moment from 'moment';
import toastr from "../../../node_modules/toastr/toastr";

import React, {useEffect, useRef, useContext} from 'react';
import {connect} from 'react-redux';
import {CONTEXT_VIEW_SPACE, EVENT_SPACE, GENERIC_SPACE,
    asyncFetchSpaces,
    asyncCreateSpace} from "../../actions/spaces";
import SidebarEntryEvent from "../../components/sidebar/lists/sidebar-entry-event";
import {getAuthorizedUsername, isAuthorized} from "../../selectors";
import SidebarEntrySpace from "../../components/sidebar/lists/sidebar-entry-space";
import {NavigationToggler, SidebarHeadline} from "../../components/navigation-headlines/nav-headlines";
import {FlatButton, FlatIcon, Icon} from "../../components/navigation-buttons/nav-buttons";
import CreateSpaceForm from "../../components/sidebar/forms/create-space-form";
import {ConfigurationContext} from "../../components/configuration/configuration";


const isMemberOf = state => (type, space) => {
        const isFound =  (type === EVENT_SPACE) ? state.events.find(event => event.id === space.id) :
            state.spaces.find(event => event.id === space.id);

        return !!isFound;
};

const handleCreateSpace = (props) => (type, formdata) => {
    const {authname} = props;

    if(!formdata.description || !formdata.access) {
        toastr.warning("Cannot create space. Mandatory fields missing.");
        return;
    }
    if(type === 'EVENT' && !formdata.start) {
        toastr.warning("Cannot create space. Start date missing.");
        return;
    }
    const startdate = type === 'EVENT' ? moment(formdata.start).format('YYYY-MM-DD') : null;

    props.asyncCreateSpace(authname, type, {
        name: formdata.name,
        description: formdata.description,
        access: formdata.access,
        start: startdate, end: startdate}
    );
};


const renderEvents = (props) => {
    const {authname, isAuthorized, viewEvents, isMemberOf} = props;

    return viewEvents.map(event => {
        const isOwner = authname === event.user.username;
        const isMember = isMemberOf(EVENT_SPACE, event);

        return <div key={event.id}>
            <SidebarEntryEvent authname={authname}
                               space={event}
                               isAuthorized={isAuthorized}
                               isOwner={isOwner}
                               isMember={isMember}/>
        </div>
    })
};

const renderSpaces = (props) => {
    const {authname, isAuthorized, viewSpaces, isMemberOf} = props;

    return viewSpaces.map(space => {
        const isOwner = authname === space.user.username;
        const isMember = isMemberOf(GENERIC_SPACE, space);

        console.log(space.name, isMember);

        return <div key={space.id}>
            <SidebarEntrySpace authname={authname}
                               space={space}
                               isAuthorized={isAuthorized}
                               isOwner={isOwner}
                               isMember={isMember}/>
        </div>
    })
};

const SpacesView = (props) => {
    const {username, authname, viewSpaces, viewEvents,} = props;
    const eventTogglerRef = useRef(null);
    const spaceTogglerRef = useRef(null);
    const {Lang} = useContext(ConfigurationContext);

    /** componentDidMount */
    useEffect(() => {
        username && props.asyncFetchSpaces(username, GENERIC_SPACE, CONTEXT_VIEW_SPACE);
        username && props.asyncFetchSpaces(username, EVENT_SPACE, CONTEXT_VIEW_SPACE);
    }, [username]);

    return <div className='spaces-view-container'>

        {/*EVENTS*/}
        {/*TODO @marcelo create component for this (same as in sidebar)*/}

        <SidebarHeadline title={Lang.nav.sidebar.events}>
            {isAuthorized && <FlatButton btn small title='Create event'
                className='clr-blue' onClick={(e) => {
                    e.preventDefault();
                    eventTogglerRef.current.toggle();
            }}>
                <Icon className='fas fa-calendar-plus mr-1'/>
                <span>Create Event</span>
            </FlatButton>}
        </SidebarHeadline>

        {isAuthorized && <NavigationToggler onRef={(ref) => eventTogglerRef.current = ref}>
            <CreateSpaceForm authname={authname}
                             type={EVENT_SPACE}
                             callback={handleCreateSpace(props)}/>
        </NavigationToggler>}

        {renderEvents(props)}

        {/*SPACES*/}
        {/*TODO @marcelo create component for this (same as in sidebar)*/}

        <SidebarHeadline title={Lang.nav.sidebar.spaces}>
            {isAuthorized && <FlatButton btn small title='Create space' onClick={(e) => {
                e.preventDefault();
                spaceTogglerRef.current.toggle();
            }}>
                <Icon  className='fas fa-th-large mr-1'/>
                <span>Create space</span>
            </FlatButton>}

            {/*TODO create widget*/}
            {/*{isAuthorized && isSuperUser && <FlatIcon circle onClick={(e) => {*/}
            {/*    e.preventDefault();*/}
            {/*    this.widgetRef.toggle()}}>*/}
            {/*    <Icon title='Create widget' className='fas fa-cog'/>*/}
            {/*</FlatIcon>}*/}

        </SidebarHeadline>

        {isAuthorized && <NavigationToggler onRef={(ref) => spaceTogglerRef.current = ref}>
            <CreateSpaceForm authname={authname} type={GENERIC_SPACE} display="space"
                             callback={handleCreateSpace(props)}/>
        </NavigationToggler>}

        {renderSpaces(props)}
    </div>
};

const mapStateToProps = (state) => ({
    isMemberOf: isMemberOf(state),
    authname: getAuthorizedUsername(state),
    isAuthorized: isAuthorized(state),
    viewSpaces: state.viewSpaces,
    viewEvents: state.viewEvents,
});

export default connect(mapStateToProps, {asyncFetchSpaces, asyncCreateSpace})(SpacesView);

