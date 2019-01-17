/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [landing-page.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 09.01.19 17:49
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {LOGIN_STATUS_SUCCESS, ROOT_STATIC_URL} from "../../actions";

class LandingPage extends Component {

    constructor(props) {
        super(props);
    }

    resolveHomePage(authorization, configuration) {
        if(authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
            return `/${authorization.user.username}/home`;
        }
        return configuration ? `/${configuration.publicpage}/home` : '/';
    }

    render() {
        const {configuration, authorization} = this.props;
        if (!configuration) return '';

        const background = `${ROOT_STATIC_URL}/${configuration.cover.background}`;

        return <div className="landing-page text-center">
            <div className="cover-image"><img src={background}/></div>

            <div className="landing-page-container">
                {/*<header className="masthead mb-auto">*/}
                <header className="masthead">
                    <div className="inner">
                        {/*<h3 className="masthead-brand">{configuration.name}</h3>*/}
                        <nav className="nav nav-masthead justify-content-center">
                            <a className="nav-link active" href="#">Home</a>
                            <a className="nav-link" href="#">Features</a>
                            <a className="nav-link" href="#">Contact</a>
                        </nav>
                    </div>
                </header>

                <div role="main" className="inner cover">
                    <h2 className="cover-heading">{configuration.cover.title}</h2>
                    <p className="lead">{configuration.cover.text[0]}</p>
                    <p className="lead">
                        <Link to={this.resolveHomePage(authorization, configuration)} class="btn btn-lg btn-primary mr-2">Starten</Link>
                        <Link to="/login" class="btn btn-lg btn-primary">Einloggen</Link>
                    </p>
                    <p className="lead">{configuration.cover.text[1]}</p>
                </div>

            </div>

            <div className="form-footer-container text-center">
                <div className='form-footer-secondary'>
                    <p className="footer-secondary-text">{configuration.cover.footer[1]}</p>
                </div>
                <div className="form-footer">
                    <p className="text-muted">{configuration.cover.footer[0]} Lesen Sie über unsere
                        <Link to="/terms"> Nutzungsbedingungen</Link> und
                        <Link to='/privacy-policy'> Datenschutzrichtlinien</Link></p>
                </div>
            </div>
        </div>

    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, configuration: state.configuration};
}

export default connect(mapStateToProps, {})(LandingPage);