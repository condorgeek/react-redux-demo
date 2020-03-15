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
import {asyncFetchSpaces, EVENT_SPACE, GENERIC_SPACE, PUBLIC_SPACES} from "../../actions/spaces";
import {environment as env, getDefaultCopyFile} from '../../actions/environment';
import {getAuthorizedUsername} from "../../selectors";

export const ConfigurationContext = React.createContext({});
export const Copy = window._copy_;
export const Lang = window._language_;

class Configuration extends Component {

    constructor(props) {
        super(props);
        console.log('ENV', window._env_.VERSION, window._env_.REACT_APP_ROOT_CLIENT_URL);
        console.log('LANG', Lang.language);

        // importing module directly in the public html file
        // this.importCopy(getDefaultCopyFile());

        this.props.asyncFetchConfiguration(configuration => {
            saveLocalConfiguration(configuration);
        });

        // this.props.asyncFetchSpaces(props.username, GENERIC_SPACE, PUBLIC_SPACES);
        // this.props.asyncFetchSpaces(props.username, EVENT_SPACE, PUBLIC_SPACES);
        this.props.asyncFetchSpaces(env.DEFAULT_PUBLIC_USER, GENERIC_SPACE, PUBLIC_SPACES);
        this.props.asyncFetchSpaces(env.DEFAULT_PUBLIC_USER, EVENT_SPACE, PUBLIC_SPACES);
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

        return (
            <ConfigurationContext.Provider value={{
                // Copy: this.Module && this.Module.Copy,
                Copy: Copy,
                Lang: Lang,
            }}>
                {/*<div className='institutmed-theme'>*/}
                <div className='default-theme'>
                {/*<div className={config.theme || 'default-theme'}>*/}
                {/*<div className='salsapeople-theme'>*/}
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