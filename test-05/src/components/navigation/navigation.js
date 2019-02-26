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

import stompClient from '../../actions/stomp-client';
import toastr from "../../../node_modules/toastr/toastr";
import Slideout from '../../../node_modules/slideout/dist/slideout';

import React, {Component} from 'react';
import NavigationUser from "./navigation-user";
import {Link, withRouter} from "react-router-dom";

import {connect} from 'react-redux';
import {
    asyncConnectAuth, asyncFetchConfiguration, asyncFetchLoginData, authAnonymous, chatEventHandler,
    EVENT_CHAT_CONSUMED, EVENT_CHAT_CONSUMED_ACK, EVENT_CHAT_DELETED, EVENT_CHAT_DELETED_ACK,
    EVENT_CHAT_DELIVERED, EVENT_CHAT_DELIVERED_ACK, EVENT_FOLLOWER_ADDED, EVENT_FOLLOWER_BLOCKED,
    EVENT_FOLLOWER_DELETED, EVENT_FOLLOWER_UNBLOCKED, EVENT_FRIEND_ACCEPTED, EVENT_FRIEND_BLOCKED,
    EVENT_FRIEND_CANCELLED, EVENT_FRIEND_DELETED, EVENT_FRIEND_IGNORED, EVENT_FRIEND_REQUESTED,
    EVENT_FRIEND_UNBLOCKED, followerEventHandler, friendEventHandler, IMPRINT_PAGE, isMobile,
    LOGIN_STATUS_ERROR, LOGIN_STATUS_LOGOUT, LOGIN_STATUS_REQUEST, LOGIN_STATUS_SUCCESS,
    logoutRequest, PRIVACY_POLICY_PAGE, ROOT_STATIC_URL,
} from "../../actions";
import {asyncFetchHomeData, asyncSearchGlobal, resetSearchGlobal, localMediaResize, localMediaSlider} from "../../actions/spaces";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false, user: null, search: null};
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount() {
        const menu = document.getElementById('slide-menu-id');
        this.slideout = new Slideout({
            'panel': document.getElementById('slide-panel-id'),
            'menu': menu,
            'padding': 256,
            'tolerance': 70
        });

        const fixed = document.querySelector('.fixed-header');

        this.slideout.on('beforeopen', function () {
            const top = fixed.getBoundingClientRect().top;
            const bottom = fixed.getBoundingClientRect().bottom;
            const isVisible = (top >= 0) && (bottom <= window.innerHeight);

            menu.style.top = isVisible ? fixed.clientHeight + 'px' : 0;
        });

        this.slideout.on('close', function () {
            menu.style.top = fixed.clientHeight + 'px';
        });

        //
        // this.slideout.on('translate', function(translated) {
        //     fixed.style.transform = 'translateX(' + translated + 'px)';
        // });
        //
        // this.slideout.on('beforeopen', function () {
        //     fixed.style.transition = 'transform 300ms ease';
        //     fixed.style.transform = 'translateX(256px)';
        // });
        //
        // this.slideout.on('beforeclose', function () {
        //     fixed.style.transition = 'transform 300ms ease';
        //     fixed.style.transform = 'translateX(0px)';
        // });
        //
        // this.slideout.on('open', function () {
        //     fixed.style.transition = '';
        // });
        //
        // this.slideout.on('close', function () {
        //     fixed.style.transition = '';
        // });
    }


    renderCurrentUser(authorization, userdata) {
        if (authorization.status === LOGIN_STATUS_SUCCESS) {

            if (!userdata) {
                this.props.asyncFetchLoginData(authorization.user.username);
            }

            if (!userdata) return '';

            const name = userdata ? userdata.user.firstname : 'Loading..';
            const avatar = userdata ? `${ROOT_STATIC_URL}/${userdata.user.avatar}` : 'Loading..';

            return (
                <NavigationUser avatar={avatar} name={name} to={`/${authorization.user.username}/home`}/>
            );
        }
        // return <div className='warning-text'>Not logged in</div>;
        return <div className='warning-text'></div>;
    }

    webconnect(isAuthorized, authorization) {

        if (isAuthorized && stompClient.state() !== 'CONNECTED' && stompClient.state() !== 'CONNECTING') {
            console.log('CONNECTING');
            stompClient.connect(authorization.user.username, (body) => {
                if (body.event === undefined) {
                    console.log('UNKNOWN MESSAGE', body);
                    toastr.info(JSON.stringify(body));
                    return;
                }

                switch (body.event) {
                    case EVENT_FRIEND_REQUESTED:
                    case EVENT_FRIEND_ACCEPTED:
                    case EVENT_FRIEND_IGNORED:
                    case EVENT_FRIEND_CANCELLED:
                    case EVENT_FRIEND_DELETED:
                    case EVENT_FRIEND_BLOCKED:
                    case EVENT_FRIEND_UNBLOCKED:

                        body.user = JSON.parse(body.user);
                        const friend = body.user.friend;

                        /* TODO update billboard-cover - could directly update reducer without this extra call.. */
                        if (this.props.location.pathname === `/${friend.username}/home`) {
                            this.props.asyncFetchHomeData(friend.username, 'home');
                        }
                        this.props.friendEventHandler(body.event, body.user);
                        break;

                    case EVENT_FOLLOWER_BLOCKED:
                    case EVENT_FOLLOWER_UNBLOCKED:
                    case EVENT_FOLLOWER_ADDED:
                    case EVENT_FOLLOWER_DELETED:
                        body.follower = JSON.parse(body.follower);
                        this.props.followerEventHandler(body.event, body.follower);
                        break;

                    default:
                }
                console.log(body);
                body.message && toastr.info(body.message);

            }, (body) => {

                if (body.event === undefined) {
                    console.log('UNKNOWN MESSAGE', body);
                    toastr.info(JSON.stringify(body));
                    return;
                }

                switch (body.event) {
                    case EVENT_CHAT_DELIVERED:
                    case EVENT_CHAT_DELIVERED_ACK:

                        body.data = JSON.parse(body.data);
                        this.props.chatEventHandler(body.event, body.data);
                        break;

                    case EVENT_CHAT_CONSUMED:
                    case EVENT_CHAT_CONSUMED_ACK:

                        body.data = JSON.parse(body.data);
                        this.props.chatEventHandler(body.event, body.data);
                        break;

                    case EVENT_CHAT_DELETED:
                    case EVENT_CHAT_DELETED_ACK:
                        toastr.info(body.data);
                        break;

                    default:
                }
                // console.log(body);
            });
        }
    }

    logout(event) {
        event.preventDefault();
        this.setState({logged: false, user: null});
        this.props.logoutRequest();
    }

    getNameStyle(configuration) {
        const defstyle = {color: 'white', fontSize: '18px', padding: '4px 0 0 12px', display: 'inline'};
        return configuration ? {...defstyle, ...JSON.parse(configuration.style)} : defstyle;
    }

    getLogoStyle(configuration) {
        const defstyle = {padding: '4px 0 0 0 0', margin: '0 0 0 8px'};
        // return configuration ? {...defstyle, ...JSON.parse(configuration.logoStyle)} : defstyle;
        return defstyle;
    }

    getNavigationStyle() {
        const defstyle = {backgroundColor: '#183153'};
        return defstyle;
    }

    resolveHomePage(authorization, configuration) {
        if (authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
            return '/';
        }
        return configuration && configuration.public.homepage ? '/public/home' : '/';
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
            const avatar = `${ROOT_STATIC_URL}/${entry.avatar}`;
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

    isTransitioning(authorization) {
        return authorization.status === LOGIN_STATUS_REQUEST || authorization.status === LOGIN_STATUS_LOGOUT ||
            authorization.status === LOGIN_STATUS_ERROR;
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

            console.log('TOGGLE', localconfig);
            // this.props.localMediaSlider();
            // if(localconfig.status !== 'refresh') {
            //     this.props.localMediaResize();
            // }

        } else if (localconfig.config.cols === 3 && isHidden) {
            sidebar && sidebar.classList.remove("d-none");
            container && container.classList.remove("sidebar-hamburger-off");
            billboard && billboard.classList.remove("sidebar-hamburger-home");
        }
    }

    render() {
        const {authorization, logindata, configuration, location, search, spaces, events, localconfig} = this.props;
        const {params} = this.props.match;
        const isAuthorized = authorization && authorization.status === 'success';
        const isTransitioning = this.isTransitioning(authorization);

        this.webconnect(isAuthorized, authorization);

        if (authorization && authorization.status === 'connect') {
            this.props.asyncConnectAuth(authorization.user.username);
        }

        localconfig && !isMobile() && this.toggleSidebar(localconfig);

        const logo = (configuration && configuration.logo) ? `${ROOT_STATIC_URL}/${configuration.logo}` : null;

        return (
            <div className='navigation fixed-header'>
                <nav className="navbar navbar-expand-md navbar-dark navbar-bg-color">
                    {/*style={this.getNavigationStyle()}>*/}

                    <Link className="navbar-brand" to={this.resolveHomePage(authorization, configuration)}>
                        {logo && <div className="d-inline" style={this.getLogoStyle(configuration)}>
                            <img src={logo} height="30"/>
                        </div>}
                        {configuration && <div className="d-inline">
                            <div className="logo-principal">{configuration.name}</div>
                            {/*<div className="logo-secondary">{configuration.name}</div>*/}
                        </div>}
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="offcanvas-collapse">
                        <span className="navbar-toggler-icon" onClick={event => {
                            // $('.sidebar-collapse').toggleClass('open');
                            // $('.offcanvas-collapse').toggleClass('open');

                            event.preventDefault();
                            this.slideout.toggle();
                        }}
                        />
                    </button>

                    {/*<div className="navbar-collapse offcanvas-collapse" id="navbarTogglerId">*/}
                    <div className="navbar-collapse offcanvas-collapse" id="navbarTogglerId">

                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className='nav-link'
                                      to={this.resolveHomePage(authorization, configuration)}>Home</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="spacesDropdown" role="button"
                                   data-toggle="dropdown">Themen
                                </a>
                                <div className="dropdown-menu navbar-user-container">
                                    {this.renderSpaces(events)}
                                    <div className="dropdown-divider"/>
                                    {this.renderSpaces(spaces)}
                                </div>
                            </li>
                            <li className="nav-item">
                                {!isTransitioning && this.renderPage(authorization, IMPRINT_PAGE, "Impressum")}
                            </li>
                            <li className="nav-item">
                                {!isTransitioning && this.renderPage(authorization, PRIVACY_POLICY_PAGE, "Datenschutz")}
                            </li>
                        </ul>

                        <div className="btn-group mr-sm-4" role="group">
                            {authorization && this.renderCurrentUser(authorization, logindata)}
                            <button type="button" className="dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </button>

                            <div className="dropdown-menu dropdown-menu-right navbar-user-container">
                                <Link className="dropdown-item" to="/create/account">Create Account</Link>
                                <Link className="dropdown-item" to="/configure">Configure</Link>
                                <div className="dropdown-divider"/>
                                <Link className="dropdown-item" to="/login">Login</Link>
                                <a className="dropdown-item" href="#" onClick={this.logout.bind(this)}>Logout</a>
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
                                const isHidden = sidebar.classList.contains("d-none");

                                this.props.localMediaResize(isHidden ? {cols: 3} : {cols: 2});

                            }}><i className="fas fa-grip-vertical"/></button>
                        </div>}

                    </div>
                </nav>
                <div className="secondary-navigation">
                    <div className="secondary-nav-box"><span>
                        <span className="mobile-hide">So erreichen Sie uns</span> <i className="fas fa-phone"/> +49-89-740 61 962 <i className="far fa-envelope"/> info@institut-ganzheitsmedizin.de</span></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authorization: state.authorization, configuration: state.configuration,
        logindata: state.logindata ? state.logindata.payload : state.logindata,
        search: state.search, spaces: state.spaces, events: state.events,
        localconfig: state.localconfig
    };
}

export default withRouter(connect(mapStateToProps, {
    asyncFetchLoginData, asyncConnectAuth, logoutRequest, friendEventHandler, followerEventHandler, chatEventHandler,
    asyncFetchHomeData, asyncFetchConfiguration, authAnonymous, asyncSearchGlobal, resetSearchGlobal,
    localMediaResize, localMediaSlider })(Navigation));