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
import {isAuthorized, isRegistration, isSuperUser, isTransitioning, logoutUser} from "../../selectors";
import {ConfigurationContext} from "../configuration/configuration";

const HomeLink = (props) => {
    const {close} = useContext(SlideoutContext);

    const homepage = (props.authorization && props.authorization.status === loginStatus.SUCCESS) ? '/' : '/public/home';

    return <div className='home-link'>
        <Link className='dropdown-item' to={homepage} onClick={() => close()}>{props.name}</Link>
        <i className="fas fa-bars" onClick={() => close()}/>
    </div>
};


const SpaceLink = (props) => {
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

const SlideLink = props => {
    const {close, overlayScrollbars} = useContext(SlideoutContext);
    const {to, name} = props;

    const closeSlideout = () => {
        close();
        overlayScrollbars.scroll({x:0, y:0});
    };

    return <Link className="dropdown-item" to={to} onClick={closeSlideout}>{name}</Link>
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

        return <React.Fragment>
            <div className="dropdown-divider"/>
            {spaces.map(space => {
                return <SpaceLink key={space.id} space={space}/>
            })}
        </React.Fragment>

    }

    renderPage(authorization, page, label) {
        if(!authorization) return '';

        return <Link className='nav-link' to={`/${authorization.user.username}/page/${page}`}>{label}</Link>
    }

    render() {
        const {authorization, publicSpaces, publicEvents, isTransitioning, isAuthorized, isSuperUser,
            isRegistration, Lang} = this.props;

        return <div id="slide-menu-id">
            <div className="slideout-navigation slideout-navigation-menu">
                <HomeLink authorization={authorization} name={Lang.nav.header.home}/>
                <div className="dropdown-divider"/>

                {(isSuperUser || isRegistration) &&
                    <SlideLink to="/create/account" name={Lang.nav.submenu.createAccount}/>}
                {isSuperUser && <SlideLink to="/manage/site" name={Lang.nav.submenu.manageSite}/>}
                {isAuthorized && <SlideLink to="/update/account" name={Lang.nav.submenu.yourAccount}/>}
                {isAuthorized && <div className="dropdown-divider"/>}
                <SlideLink to="/login" name={Lang.nav.submenu.login}/>
                <a className="dropdown-item" href="#" onClick={this.props.logoutUser}>{Lang.nav.submenu.logout}</a>

                {this.renderSpaces(publicEvents)}

                {this.renderSpaces(publicSpaces)}

                <div className="dropdown-divider"/>

                {!isTransitioning &&
                <PageLink authorization={authorization} page={getImprintPageUrl()}>{Lang.nav.header.imprint}</PageLink>}
                {!isTransitioning && <PageLink authorization={authorization} page={getPrivacyPolicyPageUrl()}>
                    {Lang.nav.header.privacy}
                </PageLink>}

                <span className='mb-5'/>
            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return { authorization: state.authorization,
        publicSpaces: state.publicSpaces,
        publicEvents: state.publicEvents,
        isTransitioning: isTransitioning(state),
        isAuthorized: isAuthorized(state),
        isSuperUser: isSuperUser(state),
        isRegistration: isRegistration(state)
    };
}

const mapDispatchToProps = dispatch => ({
    logoutUser: () => logoutUser(dispatch)
});

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<SlideoutNavigation {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default connect(mapStateToProps, mapDispatchToProps)(withConfigurationContext)