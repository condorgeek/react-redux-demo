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

import $ from 'jquery';

import stompClient from '../../actions/stomp-client';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import NavigationUser from "./navigation-user";
import {Link, withRouter} from "react-router-dom";

import {connect} from 'react-redux';
import {asyncConnectAuth, asyncFetchLoginData, chatEventHandler,
    EVENT_CHAT_CONSUMED, EVENT_CHAT_CONSUMED_ACK, EVENT_CHAT_DELETED, EVENT_CHAT_DELETED_ACK,
    EVENT_CHAT_DELIVERED, EVENT_CHAT_DELIVERED_ACK, EVENT_FOLLOWER_ADDED, EVENT_FOLLOWER_BLOCKED,
    EVENT_FOLLOWER_DELETED, EVENT_FOLLOWER_UNBLOCKED, EVENT_FRIEND_ACCEPTED, EVENT_FRIEND_BLOCKED,
    EVENT_FRIEND_CANCELLED, EVENT_FRIEND_DELETED, EVENT_FRIEND_IGNORED, EVENT_FRIEND_REQUESTED,
    EVENT_FRIEND_UNBLOCKED, ROOT_STATIC_URL, LOGIN_STATUS_SUCCESS,
    followerEventHandler, friendEventHandler, logoutRequest, asyncFetchConfiguration, authAnonymous,
} from "../../actions";
import {asyncFetchHomeData} from "../../actions/spaces";
import {saveSiteConfiguration} from "../../actions/bearer-config";
import Sidebar from "../sidebar/sidebar";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false, user: null};
        // this.props.asyncFetchConfiguration(configuration => {
        //     saveSiteConfiguration(configuration);
        // });
    }

    renderCurrentUser(authorization, userdata) {
        if (authorization.status === LOGIN_STATUS_SUCCESS) {

            if (!userdata) {
                this.props.asyncFetchLoginData(authorization.user.username);
            }

            if(!userdata) return '';

            const name = userdata ? `${userdata.user.firstname} ${userdata.user.lastname}` : 'Loading..';
            const avatar = userdata ? `${ROOT_STATIC_URL}/${userdata.user.avatar}` : 'Loading..';

            return (
                <NavigationUser avatar={avatar} name={name} to={`/${authorization.user.username}/home`}/>
            );
        }
        return <div className='warning-text'>Not logged in</div>;
    }

    connect(isAuthorized, authorization) {

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
        if(authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
            return '/';
        }
        return configuration && configuration.public.homepage ? '/public/home' : '/';
    }

    render() {
        const {authorization, logindata, configuration, location} = this.props;
        const {params} = this.props.match;

        const isAuthorized = authorization && authorization.status === 'success';

        this.connect(isAuthorized, authorization);

        if (authorization && authorization.status === 'connect') {
            this.props.asyncConnectAuth(authorization.user.username);
        }

        const logo = (configuration && configuration.logo) ? `${ROOT_STATIC_URL}/${configuration.logo}` : null;

        return (
            <div className='top-navbar'>
                <nav className="navbar navbar-expand-md navbar-dark navbar-bg-color"
                     style={this.getNavigationStyle()}>

                    <Link className="navbar-brand" to={this.resolveHomePage(authorization, configuration)}>
                        {logo && <div className="d-inline" style={this.getLogoStyle(configuration)}>
                            <img src={logo} height="30"/>
                        </div>}
                        {configuration && <div className="d-inline">
                            <div className="logo-principal">institutmed</div>
                            <div className="logo-secondary">{configuration.name}</div>
                        </div>}
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="offcanvas-collapse">
                        <span className="navbar-toggler-icon" onClick={() => {
                            $('.sidebar-collapse').toggleClass('open');
                            $('.offcanvas-collapse').toggleClass('open');
                        }}
                        />
                    </button>

                    <div className="navbar-collapse offcanvas-collapse" id="navbarTogglerId">

                        <ul className="navbar-nav ml-auto">
                            {/*<li className="nav-item">*/}
                            {/*<Link className='nav-link' to='#'>Themes</Link>*/}
                            {/*</li>*/}
                        </ul>

                        <div className="btn-group mr-sm-4" role="group">
                            {authorization && this.renderCurrentUser(authorization, logindata)}
                            <button type="button" className="dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </button>

                            <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="/create/account">Create Account</Link>
                                <Link className="dropdown-item" to="/configure">Configure</Link>
                                <div className="dropdown-divider"/>
                                <Link className="dropdown-item" to="/login">Login</Link>
                                <a className="dropdown-item" onClick={this.logout.bind(this)}>Logout</a>
                            </div>
                        </div>

                        {/*<form className="form-inline my-2 my-lg-0">*/}
                            {/*<input className="form-control-sm mr-sm-2 w-280" type="search"*/}
                                   {/*placeholder="Search a space"/>*/}
                            {/*<button className="btn btn-sm" type="submit">*/}
                                {/*<i className="fa fa-search"/></button>*/}
                        {/*</form>*/}


                        <div className="nav-item dropdown my-2 my-auto">
                            <button className="nav-link dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown">
                                <i className="fa fa-search"/></button>

                            <div className="dropdown-menu dropdown-menu-right navbar-search-container">
                                <form className="navbar-search-form" onSubmit={event => {
                                    event.preventDefault();
                                    console.log('SUBMIT SEARCH');
                                }}>
                                    <input className="form-control-sm  navbar-search-input" type="search"
                                           placeholder="Search" onChange={event => {
                                               event.preventDefault();
                                               console.log(event.target.value);
                                    }}/>
                                </form>
                                <a className="dropdown-item" href="#">Weltkongress 2019</a>
                                <a className="dropdown-item" href="#">Pablo Russell</a>
                            </div>
                        </div>

                        <div className="sidebar-collapse">
                            <Sidebar username={params.username} location={location}/>
                        </div>

                    </div>




                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authorization: state.authorization, configuration: state.configuration,
        logindata: state.logindata ? state.logindata.payload : state.logindata
    };
}

export default withRouter(connect(mapStateToProps, {
    asyncFetchLoginData, asyncConnectAuth, logoutRequest, friendEventHandler, followerEventHandler, chatEventHandler,
    asyncFetchHomeData, asyncFetchConfiguration, authAnonymous})(Navigation));