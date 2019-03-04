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

import {saveSiteConfiguration} from "../../actions/bearer-config";
import {asyncFetchConfiguration} from "../../actions";

class Configuration extends Component {

    constructor(props) {
        super(props);

        this.props.asyncFetchConfiguration(configuration => {
            saveSiteConfiguration(configuration);
        });
    }

    render() {
        const {configuration} = this.props;
        if (!configuration) return '';

        console.log('CONFIG', configuration);

        return (
            <div className={configuration.theme}>
                {this.props.children}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {configuration: state.configuration};
}

export default connect(mapStateToProps, {asyncFetchConfiguration, saveSiteConfiguration})(Configuration)