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

import {asyncFetchConfiguration, ROOT_STATIC_URL} from "../../actions";

class LandingPage extends Component {

    constructor(props) {
        super(props);
        this.props.asyncFetchConfiguration();
    }

    render() {
        const {configuration} = this.props;
        if (!configuration) return '';

        const background = `${ROOT_STATIC_URL}/${configuration.cover.background}`;

        console.log('LANDING', configuration);

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
                        <Link to={`${configuration.homepage}/home`} class="btn btn-lg btn-secondary mr-2">Starten</Link>
                        <Link to="/login" class="btn btn-lg btn-secondary">Einloggen</Link>
                    </p>
                    <p className="lead">{configuration.cover.text[1]}</p>
                </div>

            </div>

            <div className="form-footer-container text-center">
                <div className='form-footer-secondary'>
                    <p className="footer-secondary-text">
                        Schwerpunkte des Instituts sind
                        &bull; Kommunikation, Vernetzung und Austausch von Information, Erfahrungen und Kontakten im Bereich der Ethnomedizin
                        &bull; Selbsterfahrung archaischer Rituale und Heilverfahren durch authentische ethnische Lehrer und Heiler
                        &bull; Wissenschaftliche, philosophische und spirituelle Auseinandersetzung mit ethnomedizinischen Themen
                        &bull; Entwicklung und Publikation neuer Lösungen für Heilung und Gesundheit im interkulturellen Kontext
                    </p>
                </div>
                <div className="form-footer">
                    <p className="text-muted">{configuration.cover.footer} Read about our <Link to="/terms"> Terms of Use</Link> and <Link to='/privacy-policy'>Privacy
                        Policy</Link>.</p>
                </div>
            </div>


        </div>

    }
}

function mapStateToProps(state) {
    return {configuration: state.configuration};
}

export default connect(mapStateToProps, {asyncFetchConfiguration})(LandingPage);