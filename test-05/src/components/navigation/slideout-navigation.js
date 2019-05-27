/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [slideout-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 18.02.19 08:25
 */

import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {
    IMPRINT_PAGE,
    LOGIN_STATUS_ERROR,
    LOGIN_STATUS_LOGOUT,
    LOGIN_STATUS_REQUEST,
    LOGIN_STATUS_SUCCESS, PRIVACY_POLICY_PAGE
} from "../../actions";

class SlideoutNavigation extends Component {

    constructor(props) {
        super(props);
    }

    resolveHomePage(authorization, configuration) {
        if(authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
            return '/';
        }

        return  '/public/home';
    }

    renderSpaces(spaces) {
        if(!spaces) return '';

        return spaces.map(space => {
            const target = `/${space.user.username}/space/${space.id}`;
            return <Link key={space.id} className="dropdown-item" to={target} href="#">{space.name}</Link>
        });
    }

    renderPage(authorization, page, label) {
        if(!authorization) return '';

        return <Link className='nav-link' to={`/${authorization.user.username}/page/${page}`}>{label}</Link>
    }

    isTransitioning(authorization) {
        return authorization.status === LOGIN_STATUS_REQUEST || authorization.status === LOGIN_STATUS_LOGOUT ||
            authorization.status === LOGIN_STATUS_ERROR;
    }

    render() {
        const {authorization, spaces, events} = this.props;
        const isTransitioning = this.isTransitioning(authorization);

        return <div id="slide-menu-id" className="slide-navigation">
            <div className="slideout-navigation">
                <Link className='dropdown-item' to={this.resolveHomePage(authorization)}>Home</Link>
                <div className="dropdown-divider"/>
                {this.renderSpaces(events)}

                <div className="dropdown-divider"/>
                {this.renderSpaces(spaces)}

                <div className="dropdown-divider"/>

                {!isTransitioning && <Link className='dropdown-item'
                                           to={`/${authorization.user.username}/page/${IMPRINT_PAGE}`}>Impressum</Link>}
                {!isTransitioning && <Link className='dropdown-item mb-3'
                                           to={`/${authorization.user.username}/page/${PRIVACY_POLICY_PAGE}`}>Datenschutz</Link>}
            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return { authorization: state.authorization, spaces: state.spaces, events: state.events };
}

export default connect(mapStateToProps, {})(SlideoutNavigation)