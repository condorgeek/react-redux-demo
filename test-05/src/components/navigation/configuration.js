/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [configuration.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 25.01.19 17:22
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getSiteConfiguration, saveSiteConfiguration} from "../../actions/bearer-config";
import {asyncFetchConfiguration} from "../../actions";

class Configuration extends Component {

    constructor(props) {
        super(props);

        console.log('ENV', window._env_.VERSION, window._env_.REACT_APP_ROOT_CLIENT_URL);

        this.props.asyncFetchConfiguration(configuration => {
            saveSiteConfiguration(configuration);
        });
    }

    render() {
        const {configuration} = this.props;
        const config = configuration || getSiteConfiguration();

        if (!config) return '';

        return (
            <div className={config.theme}>
                {this.props.children}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {configuration: state.configuration};
}

export default connect(mapStateToProps, {asyncFetchConfiguration, saveSiteConfiguration})(Configuration)