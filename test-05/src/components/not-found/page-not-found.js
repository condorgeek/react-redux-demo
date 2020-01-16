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
import {Link} from 'react-router-dom';
import {getSearchParams, resolveHomePage} from "../../selectors";

const PageNotFound = (props) => {
    const {homepage, params} = props;

    return <div className='page-not-found-container'>
        <div className='page-not-found-body'>
            <div className='teaser'>404</div>
            <div className='message'>We could not find this page.
                <div className='message-small'>{params && params.get('message')}</div>
            </div>
        </div>
        <div className='page-not-found-link'>
            <span>Go back to the </span>
            <Link to={homepage}>Homepage</Link>
        </div>
    </div>
};

const mapStateToProps = (state, ownProps) => ({
    params: getSearchParams(ownProps.location),
    homepage: resolveHomePage(state),
});
export default connect(mapStateToProps, {})(PageNotFound);