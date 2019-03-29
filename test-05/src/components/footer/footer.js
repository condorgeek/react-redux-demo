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
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export class Footer extends Component {

    render() {
        return <div className="footer-container">
            <footer className="footer">
                <div className="containerss">
                    <div className="footer-navigation">
                        <div className="footer-nav-logo">Institut für Ganzheitsmedizin e.V.</div>
                        <div className="footer-nav-entry"><Link to="/public/page/imprint">Impressum</Link></div>
                        <div className="footer-nav-entry"><Link to='/public/page/privacy-policy'>Datenschutz</Link>
                        </div>
                        <div className="footer-nav-entry" onClick={event => {
                            event.preventDefault();
                            this.footerBody && this.footerBody.classList.toggle('footer-container-body-invisible');
                            console.log('CLICK');
                        }}><i className="fas fa-chevron-down"/></div>
                    </div>
                    <div className="footer-container-body" ref={elem => this.footerBody = elem}>
                        <p>© 2019, München - Institut für Ganzheitsmedizin e.V. Alle Rechte vorbehalten.</p>
                        <p>Verantwortlich für den Inhalt gem. §10 Abs.3 MDStV: Institut für Ganzheitsmedizin e.V.
                            D-81671 Muenchen, Germany. Das Institut arbeitet gemeinnützig anerkannt zur Förderung der
                            Wissenschaft, Forschung und Bildung, des öffentlichen Gesundheitswesens und der
                            Weltgesundheit.</p>
                        <p>VR 205146 München • StNr 143/217/16254 • BetriebsNr 30382260<br/>Tel: +49-89-740 61 962
                            • Fax: +49-89-490 53 045 • info@institut-ganzheitsmedizin.de</p>
                        <p>The Institute is a non-profit- organization for science, research and teaching, for public
                            health and International health.</p>
                    </div>
                </div>
                <div className="author flex-row-reverse">
                    {/*© Kikirikii Social Plattform - Cybergent Ltd - Marcelo H. Krebber - marcelo.krebber@gmail.com*/}
                    © 2018, 2019 marcelo.krebber@gmail.com
                </div>
            </footer>
        </div>
    }

}