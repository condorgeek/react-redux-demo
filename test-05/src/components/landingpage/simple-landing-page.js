/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [simple-landing-page.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.11.19, 17:25
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import SimpleSlider from '../billboard/simple-slider';
import {ConfigurationContext} from "../configuration/configuration";

import {getStaticUrl} from "../../actions/environment";
import {resolveHomePage} from "../../reducers/selectors";
import {TextAsHTML} from "../util/text-utils";

const renderTextAsHTML = (text) => {
    return text.map(entry => <TextAsHTML className="lead">{entry}</TextAsHTML>)
};

const SimpleLandingPage =  ({homePage}) => {
        const {Copy} = React.useContext(ConfigurationContext);
        const {background='', title='', subTitle='', text=[], slides=[]} = Copy && Copy.landingPage || {};

        return <div className="landing-page">
            <div className="cover-image">
                <img src={background ? getStaticUrl(background) : ''}/>
            </div>

            <div className="landing-page-container">
                <div role="main" className="inner cover">
                    <div className="cover-heading">{title}</div>
                    <TextAsHTML className="lead">{subTitle}</TextAsHTML>
                    <p className="button-container">
                        <Link to={homePage} class="btn btn-lg btn-primary mt-2">Starten</Link>
                        {/*<Link to="/login" class="btn btn-lg btn-primary">Einloggen</Link>*/}
                        <Link to="/create/account" class="btn btn-lg btn-primary mt-2">Anmelden</Link>
                    </p>
                    {renderTextAsHTML(text)}
                </div>

            </div>

            <div className="form-footer-container text-center">
                <div className='form-footer-secondary'>
                    <SimpleSlider slides={slides}/>
                </div>
            </div>
        </div>

};

function mapStateToProps(state) {
    return {
        // configuration: state.configuration,
        homePage: resolveHomePage(state)
    };
}

export default connect(mapStateToProps, {})(SimpleLandingPage);