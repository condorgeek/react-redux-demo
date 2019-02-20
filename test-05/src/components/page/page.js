/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [page.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 09.02.19 13:47
 */

import he from '../../../node_modules/he/he';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {asyncFetchPage} from "../../actions/spaces";

class Page extends Component {

    constructor(props) {
        super(props);
        this.pathname = props.location.pathname;
        this.props.asyncFetchPage(props.authorization.user.username, props.pagename);
    }

    render() {
        const {page, authorization, location, pagename} = this.props;

        if(this.pathname !== location.pathname) {
            this.pathname = location.pathname;
            this.props.asyncFetchPage(authorization.user.username, pagename);
        }

        return <div className="page">
            <div className="page-content" ref={elem =>{
                if(!elem) return;
                elem.innerHTML = he.decode(elem.innerHTML)
            }}>
            {page && page.content}
            </div>

        </div>
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, page: state.page}
}

export default connect(mapStateToProps, {asyncFetchPage})(Page)