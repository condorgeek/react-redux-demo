/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 27.09.18 17:46
 */

import React, {Component, useContext} from 'react';
import NavigationUser from "./navigation-user";
import {Link, withRouter} from "react-router-dom";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ConfigurationContext} from '../configuration/configuration';
import {SlideoutContext} from "../slideout-navigation/slideout-provider";
import {
    asyncConnectAuth,
    asyncFetchConfiguration,
    asyncFetchLoginData,
    isMobile,
    logoutRequest,
    loginStatus} from "../../actions";
import {
    asyncFetchHomeData,
    asyncSearchGlobal,
    resetSearchGlobal,
    localMediaResize,
} from "../../actions/spaces";

import {webConnect} from '../messaging/web-connect';
import {
    getAuthorizedUsername,
    isAuthorized,
    isRegistration,
    isSuperUser,
    isTransitioning,
    resolveHomePage
} from "../../selectors";
import {
    getImprintPageUrl,
    getPrivacyPolicyPageUrl,
    getStaticImageUrl
} from "../../actions/environment";
import SecondaryNavigation from "./secondary-navigation";


const SlideoutToggler = ({isAuthorized, username, logindata}) => {
    const {toggle} = useContext(SlideoutContext);

    const name = logindata ? logindata.user.firstname : 'Loading..';
    const avatar = logindata ? getStaticImageUrl(logindata.user.avatar) : 'Loading..';

    return <div>
        <button className="navbar-toggler" type="button" data-toggle="offcanvas-collapse">

            {isAuthorized && <NavigationUser avatar={avatar} name={name} to={`/${username}/home`}/>}

            <span className="navbar-toggler-icon" onClick={event => {
                event.preventDefault();
                toggle();
            }}/>
    </button>
    </div>
};

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false, user: null, search: null};
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    renderCurrentUser(authorization, logindata) {
        if (authorization.status === loginStatus.SUCCESS) {
            if (!logindata) {
                this.props.asyncFetchLoginData(authorization.user.username);
                return '';
            }

            const name = logindata ? logindata.user.firstname : 'Loading..';
            const avatar = logindata ? getStaticImageUrl(logindata.user.avatar) : 'Loading..';
            return <NavigationUser avatar={avatar} name={name} to={`/${authorization.user.username}/home`}/>;
        }
        return <div className='warning-text'>Not logged in</div>;
    }

    logout(event) {
        event.preventDefault();
        this.setState({logged: false, user: null});
        this.props.logoutRequest();
    }

    handleSearchSubmit(event) {
        const {authorization} = this.props;
        const {search} = this.state;
        event.preventDefault();

        if (!search || search.length < 2) {
            this.props.resetSearchGlobal();
            return;
        }

        this.props.asyncSearchGlobal(authorization.user.username, search, 10, result => {
            console.log("SEARCH DONE");
        });
    }

    handleSearchChange(event) {
        event.preventDefault();
        this.setState({search: event.target.value})
    }

    renderSearchResult(search) {
        return search.map(entry => {
            const avatar = getStaticImageUrl(entry.avatar);
            const className = entry.type === 'SPACE' ? 'navbar-rectangular' : 'navbar-rounded';
            const name = entry.type === 'SPACE' ? entry.name : `${entry.name} (${entry.username})`;

            return <Link className="dropdown-item" to={entry.url}>
                <div className="navbar-avatar">
                    <div className={className}><img src={avatar}/></div>
                </div>
                {name}
            </Link>
        });
    }

    renderSpaces(spaces) {
        if (!spaces) return '';

        return spaces.map(space => {
            const target = `/${space.user.username}/space/${space.id}`;
            return <Link key={space.id} className="dropdown-item" to={target} href="#">{space.name}</Link>
        });
    }

    renderPage(authorization, page, label) {
        if (!authorization) return '';
        return <Link className='nav-link' to={`/${authorization.user.username}/page/${page}`}>{label}</Link>
    }

    toggleSidebar(localconfig) {
        if (localconfig.status === 'refresh') {
            this.props.localMediaResize();
            return;
        }

        const sidebar = document.querySelector(".sidebar-container");
        const container = document.querySelector(".home-space-container");
        const billboard = document.querySelector(".billboard-home-container");
        const isHidden = sidebar && sidebar.classList.contains("d-none");

        if (localconfig.config.cols === 2 && !isHidden) {
            sidebar && sidebar.classList.add("d-none");
            container && container.classList.add("sidebar-hamburger-off");
            billboard && billboard.classList.add("sidebar-hamburger-home");

        } else if (localconfig.config.cols === 3 && isHidden) {
            sidebar && sidebar.classList.remove("d-none");
            container && container.classList.remove("sidebar-hamburger-off");
            billboard && billboard.classList.remove("sidebar-hamburger-home");
        }
    }

    render() {

        const {authorization, logindata, configuration, location, search, spaces, events,
            localconfig, homePage, Copy, Lang, isTransitioning, isAuthorized, isSuperUser, isRegistration, username} = this.props;
        const {params} = this.props.match;

        this.props.webConnect(isAuthorized, authorization, this.props.location);

        if (authorization && authorization.status === 'connect') {
            this.props.asyncConnectAuth(authorization.user.username);
        }

        localconfig && !isMobile() && this.toggleSidebar(localconfig);

        const logo = (Copy && Copy.navigation.logo) ? getStaticImageUrl(Copy.navigation.logo) : null;

        return (
            <div className='navigation fixed-header'>
                <nav className="navbar navbar-expand-md navbar-dark navbar-bg-color">
                    <Link className="navbar-brand" to="/">
                        {logo && <div className="logo-image-principal">
                            <img src={logo} height="30"/>
                        </div>}
                        {Copy && <div className="d-inline">
                            <div className="logo-text-principal">{Copy.navigation.fullName}</div>
                            <div className="logo-text-secondary">{Copy.navigation.shortName}</div>
                        </div>}
                    </Link>

                    {/*{authorization && this.renderCurrentUser(authorization, logindata)}*/}
                    <SlideoutToggler isAuthorized={isAuthorized} username={username} logindata={logindata}/>

                    <div className="navbar-collapse offcanvas-collapse" id="navbarTogglerId">
´
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className='nav-link' to={homePage}>{Lang.nav.header.home}</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="spacesDropdown" role="button"
                                   data-toggle="dropdown">{Lang.nav.header.spaces}
                                </a>
                                <div className="dropdown-menu navbar-user-container">
                                    {this.renderSpaces(events)}
                                    <div className="dropdown-divider"/>
                                    {this.renderSpaces(spaces)}
                                </div>
                            </li>
                            <li className="nav-item">
                                {!isTransitioning && this.renderPage(authorization, getImprintPageUrl(),
                                    Lang.nav.header.imprint)}
                            </li>
                            <li className="nav-item">
                                {!isTransitioning && this.renderPage(authorization, getPrivacyPolicyPageUrl(),
                                    Lang.nav.header.privacy)}
                            </li>
                        </ul>

                        <div className="btn-group mr-sm-4" role="group">
                            {authorization && this.renderCurrentUser(authorization, logindata)}
                            <button type="button" className="dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </button>

                            <div className="dropdown-menu dropdown-menu-right navbar-user-container">
                                {(isSuperUser || isRegistration) &&
                                <Link className="dropdown-item" to="/create/account">{Lang.nav.submenu.createAccount}</Link>}
                                {isSuperUser && <Link className="dropdown-item" to="/manage/site">{Lang.nav.submenu.manageSite}</Link>}
                                {isAuthorized && <Link className="dropdown-item" to="/update/account">{Lang.nav.submenu.yourAccount}</Link>}
                                {isAuthorized && <div className="dropdown-divider"/>}
                                <Link className="dropdown-item" to="/login">{Lang.nav.submenu.login}</Link>
                                <a className="dropdown-item" href="#" onClick={this.logout.bind(this)}>{Lang.nav.submenu.logout}</a>
                            </div>
                        </div>

                        <div className="nav-item dropdown my-2 my-auto">
                            <button className="nav-link dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" onClick={event => {
                                const elem = document.getElementById("navSearchId");
                                elem && elem.focus();
                            }}>
                                <i className="fa fa-search"/></button>

                            <div className="dropdown-menu dropdown-menu-right navbar-search-container">
                                <form className="navbar-search-form" onSubmit={this.handleSearchSubmit}>
                                    <input id="navSearchId" name="search" autoComplete="off"
                                           className="form-control  navbar-search-input" type="search"
                                           placeholder="Search" onChange={this.handleSearchChange}/>
                                </form>

                                <div className="navbar-search-result">
                                    {this.renderSearchResult(search)}
                                </div>

                            </div>
                        </div>

                        {!isMobile() && <div className="nav-item sidebar-hamburger ml-3">
                            <button className="nav-link btn btn-sm" onClick={event => {
                                event.preventDefault();
                                const sidebar = document.querySelector(".sidebar-container");
                                if(sidebar) {
                                    const isHidden = sidebar.classList.contains("d-none");
                                    this.props.localMediaResize(isHidden ? {cols: 3} : {cols: 2});
                                }

                            }}><i className="fas fa-grip-vertical"/></button>
                        </div>}

                    </div>
                </nav>

                <SecondaryNavigation Copy={Copy}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    authorization: state.authorization,
    configuration: state.configuration,
    logindata: state.logindata ? state.logindata.payload : state.logindata,
    search: state.search, spaces: state.spaces, events: state.events,
    localconfig: state.localconfig,
    homePage: resolveHomePage(state),
    isTransitioning: isTransitioning(state),
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
    isRegistration: isRegistration(state),
    username: getAuthorizedUsername(state)
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators({ asyncFetchLoginData,
        asyncConnectAuth,
        logoutRequest,
        asyncFetchHomeData,
        asyncFetchConfiguration,
        asyncSearchGlobal,
        resetSearchGlobal,
        localMediaResize}, dispatch),
    webConnect: webConnect(dispatch)
});

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<Navigation {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withConfigurationContext));