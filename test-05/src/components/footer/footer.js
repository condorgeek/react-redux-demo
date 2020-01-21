/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [footer.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 29.03.19 09:12
 */
import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import he from '../../../node_modules/he/he';
import {ConfigurationContext} from "../configuration/configuration";

const renderFooterAsHTML = (text) => {
    return text.map(entry => <p ref={ref => {
        if (ref) ref.innerHTML = he.decode(entry);
    }}>{entry}</p>)
};

export const Footer = (props) => {
    let footerBody;
    const {Copy} = useContext(ConfigurationContext);

    return <div className="footer-container">
        <footer className="footer">
            <div className="footer-navigation">
                <div className="footer-nav-logo">{Copy && Copy.fullName}</div>
                <div className="footer-nav-entry"><Link to="/public/page/imprint">Impressum</Link></div>
                <div className="footer-nav-entry"><Link to='/public/page/privacy-policy'>Datenschutz</Link>
                </div>
                <div className="footer-nav-entry" onClick={event => {
                    event.preventDefault();
                    footerBody && footerBody.classList.toggle('footer-container-body-invisible');
                }}><i className="fas fa-chevron-down"/></div>
            </div>
            <div className="footer-container-body footer-container-body-invisible"
                 ref={elem => footerBody = elem}>
                {Copy && renderFooterAsHTML(Copy.footer.text)}
            </div>
            <div className="author flex-row-reverse">
                © 2018, 2019 marcelo.krebber@gmail.com
            </div>
        </footer>
    </div>

};
