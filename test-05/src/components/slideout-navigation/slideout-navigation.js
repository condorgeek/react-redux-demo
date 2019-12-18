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
 * Last modified: 16.10.19, 20:28
 */

import React, {Component, useContext} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';

import {loginStatus} from "../../actions";
import {SlideoutContext} from "./slideout-provider";
import {getImprintPageUrl, getPrivacyPolicyPageUrl} from "../../actions/environment";
import {isTransitioning} from "../../reducers/selectors";

const HomeLink = (props) => {
    const {close} = useContext(SlideoutContext);

    const homepage = (props.authorization && props.authorization.status === loginStatus.SUCCESS) ? '/' : '/public/home';

    return <div className='home-link'>
        <Link className='dropdown-item' to={homepage} onClick={() => close()}>Home</Link>
        <i className="fas fa-bars" onClick={() => close()}/>
    </div>
};


const SlideLink = (props) => {
    const {close, overlayScrollbars} = useContext(SlideoutContext);
    const {space} = props;

    const closeSlideout = () => {
        close();
        overlayScrollbars.scroll({x:0, y:0});
    };

    const target = `/${space.user.username}/space/${space.id}`;
    return <Link key={space.id} className="dropdown-item" to={target} href="#" onClick={closeSlideout}>
        {space.name}
    </Link>
};

const PageLink = (props) => {
    const {close, overlayScrollbars} = useContext(SlideoutContext);
    const {authorization, page} = props;

    const closeSlideout = () => {
        close();
        overlayScrollbars.scroll({x:0, y:0});
    };

    return <Link className='dropdown-item' to={`/${authorization.user.username}/page/${page}`}
                 onClick={closeSlideout}>
        {props.children}
    </Link>
};

class SlideoutNavigation extends Component {

    constructor(props) {
        super(props);
    }

    renderSpaces(spaces) {
        if(!spaces) return '';
        return spaces.map(space => {
            return <SlideLink space={space}/>
        });
    }

    renderPage(authorization, page, label) {
        if(!authorization) return '';

        return <Link className='nav-link' to={`/${authorization.user.username}/page/${page}`}>{label}</Link>
    }

    render() {
        const {authorization, spaces, events, isTransitioning} = this.props;

        return <div id="slide-menu-id">
            <div className="slideout-navigation slideout-navigation-menu">
                <HomeLink authorization={authorization}/>
                <div className="dropdown-divider"/>
                {this.renderSpaces(events)}

                <div className="dropdown-divider"/>
                {this.renderSpaces(spaces)}

                <div className="dropdown-divider"/>

                {!isTransitioning && <PageLink authorization={authorization} page={getImprintPageUrl()}>Impressum</PageLink>}
                {!isTransitioning && <PageLink authorization={authorization} page={getPrivacyPolicyPageUrl()}>
                    Datenschutz
                </PageLink>}

                <span className='mb-5'/>
            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return { authorization: state.authorization,
        spaces: state.spaces,
        events: state.events,
        isTransitioning: isTransitioning(state),
    };
}

export default connect(mapStateToProps, {})(SlideoutNavigation)