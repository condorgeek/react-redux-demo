import $ from 'jquery';

import stompClient from '../actions/stomp-client';
import toastr from "../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import NavigationUser from "./navigation-user";
import {Link, Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import {asyncFetchUserData, asyncConnectAuth, logoutRequest, ROOT_STATIC_URL} from "../actions";
import KikirikiiLogo from "./logo/kikirikii-logo";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false, user: null};
    }

    renderCurrentUser(authorization, userdata) {
        if (authorization.status === 'success') {

            if(userdata === undefined || userdata === null) {
                this.props.asyncFetchUserData(authorization.user.username);
            }

            const name = userdata !== undefined ? `${userdata.user.firstname} ${userdata.user.lastname}` : 'Loading..';
            const avatar = userdata !== undefined ? `${ROOT_STATIC_URL}/${userdata.user.avatar}` : 'Loading..';

            return (
                <NavigationUser avatar={avatar}
                                name={name}
                                to={`/${authorization.user.username}/home`}/>
            );
        }
        return <div className='warning-text'>Not logged in</div>;
    }

    connect(isAuthorized, authorization) {
        if(isAuthorized && stompClient.state() !== 'CONNECTED' && stompClient.state() !== 'CONNECTING') {
            console.log('CONNECTING');
            stompClient.connect(authorization.user.username, (body) => {
                console.log(body);

                switch(body.event) {
                    case 'REQUESTED':
                        toastr.info(body.message);
                        return;

                    case 'ACCEPTED':
                        toastr.info(body.message);
                        return;

                    case 'IGNORED':
                        toastr.info(body.message);
                        return;

                    case 'BLOCKED':
                        toastr.info(body.message);
                        return;

                    case 'UNBLOCKED':
                        toastr.info(body.message);
                        return;

                    default:

                }
                toastr.info(JSON.stringify(body));
            });
        }
    }

    logout(event) {
        event.preventDefault();
        this.setState({logged: false, user: null});
        this.props.logoutRequest();
    }

    render() {
        const {authorization, userdata} = this.props;
        const isAuthorized = authorization && authorization.status === 'success';

        console.log('NAVIGATION', authorization);
        this.connect(isAuthorized, authorization);

        if (authorization && authorization.status === 'connect') {
            this.props.asyncConnectAuth(authorization.user.username);
        }

        return (
            <div className='top-navbar'>
                <nav className="navbar navbar-expand-md navbar-dark navbar-bg-color">
                    <Link className="navbar-brand" to={isAuthorized ? `/${authorization.user.username}/public`: '/'}>
                        <KikirikiiLogo size='small'/>
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="offcanvas"
                            aria-controls="navbarTogglerId" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" onClick={() => {
                            $('.offcanvas-collapse').toggleClass('open');
                        }}
                        />
                    </button>

                    <div className="navbar-collapse offcanvas-collapse" id="navbarTogglerId">
                        <ul className="navbar-nav mr-auto">
                            {/*<li className="nav-item">*/}
                            {/*<Link className='nav-link' to='/posts/new'>Add a Post</Link>*/}
                            {/*</li>*/}
                        </ul>

                        <div className="btn-group mr-sm-4" role="group">

                            {authorization && this.renderCurrentUser(authorization, userdata.payload)}

                            <button id="loginGroupId" type="button"
                                    className="dropdown-toggle btn btn-sm"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </button>

                            <div className="dropdown-menu" aria-labelledby="loginGroupId">
                                <Link className="dropdown-item" to="/create/account">Create Account</Link>
                                <Link className="dropdown-item" to="/configure">Configure</Link>
                                <div className="dropdown-divider"/>
                                <Link className="dropdown-item" to="/login">Login</Link>
                                <a className="dropdown-item" onClick={this.logout.bind(this)}>Logout</a>
                            </div>
                        </div>

                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control-sm mr-sm-2 w-280" type="search"
                                   placeholder="Search a space"/>
                            <button className="btn btn-sm" type="submit">
                                <i className="fa fa-search" aria-hidden="true"/></button>
                        </form>

                    </div>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, userdata: state.userdata};
}

export default connect(mapStateToProps, {asyncFetchUserData, asyncConnectAuth, logoutRequest})(Navigation);