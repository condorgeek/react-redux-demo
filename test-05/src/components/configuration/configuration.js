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

import {getLocalConfiguration, saveLocalConfiguration} from "../../actions/local-storage";
import {asyncFetchConfiguration} from "../../actions";
import {asyncFetchSpaces, EVENT_SPACE, GENERIC_SPACE} from "../../actions/spaces";
import {environment as env, getDefaultCopyFile} from '../../actions/environment';
import {getAuthorizedUsername} from "../../selectors";

export const ConfigurationContext = React.createContext({});
export const Copy = window._copy_;

class Configuration extends Component {

    constructor(props) {
        super(props);
        console.log('ENV', window._env_.VERSION, window._env_.REACT_APP_ROOT_CLIENT_URL);

        // importing module directly in the public html file
        // this.importCopy(getDefaultCopyFile());

        this.props.asyncFetchConfiguration(configuration => {
            saveLocalConfiguration(configuration);
        });

        this.props.asyncFetchSpaces(props.username, GENERIC_SPACE);
        this.props.asyncFetchSpaces(props.username, EVENT_SPACE);
    }

    importCopy = async (copyfile) => {
        this.Module = await import(
            /* webpackMode: "eager" */
            /* webpackPrefetch: true */
            /* webpackPreload: true */
            `../../copy/${copyfile}`);

        console.log('IMPORTED', this.Module);
    };

    render() {
        const {configuration} = this.props;
        const config = configuration || getLocalConfiguration();

        if (!config) return null;

        console.log('CONFIG', config);
        console.log('COPY', Copy);

        return (
            <ConfigurationContext.Provider value={{
                // Copy: this.Module && this.Module.Copy,
                Copy: Copy,
            }}>
                {/*<div className={config.theme}>*/}
                <div className='salsapeople-theme'>
                    {this.props.children}
                </div>
            </ConfigurationContext.Provider>
        )
    }
}

function mapStateToProps(state) {
    return {
        configuration: state.configuration,
        username: getAuthorizedUsername(state),
    };
}

export default connect(mapStateToProps, {asyncFetchConfiguration, asyncFetchSpaces})(Configuration)