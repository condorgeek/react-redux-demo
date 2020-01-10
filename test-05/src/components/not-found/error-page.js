/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [page-not-found.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 10.01.20, 10:51
 */

import React from 'react';
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom';
import {getLastErrorFor, getSearchParams, resolveHomePage} from "../../reducers/selectors";

const ErrorPage = (props) => {
    const {homepage, params} = props;

    return <div className='error-page-container'>
        <div className='error-page-body'>
            <div className='teaser'>{params && params.get('status') || 400}</div>
            <div className='message'>Ooops... An error has occurred. Please retry.
                <div className='message-small'>{params && params.get('message')}</div>
            </div>
        </div>
        <div className='page-not-found-link'>
            <span>Go back to the </span>
            <Link to={props.homepage}>Homepage</Link>
        </div>
    </div>
};

const mapStateToProps = (state, ownProps) => ({
    params: getSearchParams(ownProps.location),
    error: getLastErrorFor(state, 400),
    homepage: resolveHomePage(state),
});
export default withRouter(connect(mapStateToProps, {})(ErrorPage));