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

import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {CONTEXT_VIEW_SPACE, EVENT_SPACE, GENERIC_SPACE, asyncFetchSpaces} from "../../actions/spaces";

const renderEvents = (props) => {
    return props.viewEvents.map(event => {
        return <div key={event.id}>
            {event.name}
        </div>
    })
};

const renderSpaces = (props) => {
    return props.viewSpaces.map(space => {
        return <div key={space.id}>
            {space.name}
        </div>
    })
};

const SpacesView = (props) => {
    const {username, viewSpaces, viewEvents} = props;

    /** componentDidMount */
    useEffect(() => {
        username && props.asyncFetchSpaces(username, GENERIC_SPACE, CONTEXT_VIEW_SPACE);
        username && props.asyncFetchSpaces(username, EVENT_SPACE, CONTEXT_VIEW_SPACE);
    }, [username]);

    console.log('SPACES', username, props);

    return <div className='spaces-view-container'>
        <h4>{viewSpaces.length + viewEvents.length} Spaces</h4>

        <h4>Events</h4>
        {renderEvents(props)}

        <h4>Spaces</h4>
        {renderSpaces(props)}
    </div>
};

const mapStateToProps = (state) => ({
    viewSpaces: state.viewSpaces,
    viewEvents: state.viewEvents,
});

export default connect(mapStateToProps, {asyncFetchSpaces})(SpacesView);

