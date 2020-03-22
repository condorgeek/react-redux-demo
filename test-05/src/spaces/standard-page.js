/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [generic-page.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 01.02.19 01:43
 */

import React, {Component} from 'react';
import Sidebar from '../components/sidebar/sidebar';
import Page from "../components/page/page";

export default class StandardPage extends Component {

    render() {
        const {location} = this.props;
        const {params} = this.props.match;
        const pagepath = `page/${params.pagename}`;

        return (
            <div className='standard-page-container'>
                <div className='row mt-1'>
                    <div className='col-sm-9'>
                        <Page pagepath={pagepath} pagename={params.pagename} params={params} location={location}/>
                    </div>
                    <div className='col-sm-3'>
                        <Sidebar username={params.username} location={location}/>
                    </div>
                </div>
            </div>
        )
    }
}
