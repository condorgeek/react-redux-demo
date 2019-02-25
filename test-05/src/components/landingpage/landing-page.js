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
import SimpleSlider from '../billboard/simple-slider';

class LandingPage extends Component {

    constructor(props) {
        super(props);

        this.slides = [{text: ' Kommunikation, Vernetzung und Austausch von Information, Erfahrungen und Kontakten im Bereich der Ethnomedizin'},
            {text: 'Selbsterfahrung archaischer Rituale und Heilverfahren durch authentische ethnische Lehrer und Heiler'},
            {text: 'Wissenschaftliche, philosophische und spirituelle Auseinandersetzung mit ethnomedizinischen Themen'},
            {text: 'Entwicklung und Publikation neuer Lösungen für Heilung und Gesundheit im interkulturellen Kontext'},
        ];
    }



    resolveHomePage(authorization, configuration) {
        if(authorization && authorization.status === LOGIN_STATUS_SUCCESS) {
            return `/${authorization.user.username}/home`;
        }
        return configuration && configuration.public.homepage ? '/public/home' : '/';
    }

    render() {
        const {configuration, authorization} = this.props;
        if (!configuration) return '';

        // const background = `${ROOT_STATIC_URL}/${configuration.cover.background}`;
        const background = `${ROOT_STATIC_URL}/application/bair-composition.jpg`;

        return <div className="landing-page text-center">
            <div className="cover-image"><img src={background}/></div>

            <div className="landing-page-container">
                <div role="main" className="inner cover">
                    <div className="cover-heading">{configuration.cover.title}</div>
                    <p className="lead">{configuration.cover.text[0]}</p>
                    <p className="lead">
                        <Link to={this.resolveHomePage(authorization, configuration)} class="btn btn-lg btn-primary mr-2">Starten</Link>
                        {/*<Link to="/login" class="btn btn-lg btn-primary">Einloggen</Link>*/}
                    </p>

                    <div className="btn-mobile">
                        <Link to={this.resolveHomePage(authorization, configuration)} class="btn btn-lg btn-primary btn-block">Starten</Link>
                    </div>

                    <p className="lead">{configuration.cover.text[1]}</p>
                </div>

            </div>

            <div className="form-footer-container text-center">
                <div className='form-footer-secondary'>
                    {/*<p className="footer-secondary-text">{configuration.cover.footer[1]}</p>*/}

                    <SimpleSlider slides={this.slides}/>
                </div>
                <div className="form-footer">
                    <p className="text-muted">{configuration.cover.footer[0]} Lesen Sie über unsere
                        <Link to="/public/page/imprint"> Nutzungsbedingungen</Link> und
                        <Link to='/public/page/privacy-policy'> Datenschutzrichtlinien</Link></p>
                </div>
            </div>
        </div>

    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, configuration: state.configuration};
}

export default connect(mapStateToProps, {})(LandingPage);