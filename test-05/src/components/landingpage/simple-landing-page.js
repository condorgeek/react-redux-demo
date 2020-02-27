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
import SimpleSlider from '../slider/simple-slider';
import {ConfigurationContext} from "../configuration/configuration";

import {resolveHomePage} from "../../selectors";
import {TextAsHTML} from "../util/text-utils";
import {ButtonLink} from "../navigation-buttons/nav-buttons";
import {BackgroundImage} from "../util/background-image";


const renderTextAsHTML = (text) => {
    return text.map(entry => <TextAsHTML className="lead">{entry}</TextAsHTML>)
};

const dictionary = homePage => link => {
    const _dictionary = {'%HOME%': homePage, '%LOGIN%': '/login', '%REGISTER%': '/create/account'};
    return _dictionary[link] || link;
};

const renderButtons = (dictionary, buttons) => {
    return buttons.map(button => {
        return <ButtonLink large to={dictionary(button.link)} className="mt-2">
            {button.name}
        </ButtonLink>
    });
};

const SimpleLandingPage =  ({homePage}) => {
        const {Copy} = React.useContext(ConfigurationContext);
        const {background='', title='', subTitle='', text=[], slides=[]} = Copy && Copy.landingPage || {};


        return <div className="landing-page">
            <BackgroundImage background={background}/>

            <div className="landing-page-container">
                <div role="main" className="inner cover">
                    <div className="cover-heading">{title}</div>
                    <TextAsHTML className="lead">{subTitle}</TextAsHTML>

                    {Copy.landingPage.buttons && <p className="button-container">
                        {renderButtons(dictionary(homePage), Copy.landingPage.buttons)}
                    </p>}

                    {renderTextAsHTML(text)}
                </div>

            </div>

            <div className="form-footer-container text-center">
                <div className='landing-page-slider'>
                    <SimpleSlider slides={slides}/>
                </div>
            </div>
        </div>

};

function mapStateToProps(state) {
    return {
        homePage: resolveHomePage(state)
    };
}

export default connect(mapStateToProps, {})(SimpleLandingPage);