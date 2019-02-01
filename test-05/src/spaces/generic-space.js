/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [generic-space.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.10.18 15:48
 */

import React, {Component} from 'react';
import Billboard from "../components/billboard/billboard";
import Sidebar from '../components/sidebar/sidebar';
import HeadlinesGeneric from '../components/headlines/headlines-generic';
import BillboardGenericCover from '../components/billboard/billboard-generic-cover';

export default class GenericSpace extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {location} = this.props;
        const {params} = this.props.match;
        const spacepath = `generic/${params.spaceId}`;

        return (
            <div className='home-space-container'>
                <div className='row mt-1'>
                    <div className='col-sm-9'>
                        <BillboardGenericCover ownername={params.username} spacepath={spacepath} spaceId={params.spaceId}
                                               params={params} location={location}/>

                        <div className='row mt-2 pl-1'>
                            <div className='col-sm-5'>
                                {<HeadlinesGeneric space={spacepath} spaceId={params.spaceId} params={params}
                                                   location={location}/>}
                            </div>
                            <div className='col-sm-7'>
                                <Billboard username={params.username} spaceId={params.spaceId} spacename={spacepath}
                                           params={params} location={location}/>
                            </div>
                        </div>

                    </div>
                    <div className='col-sm-3'>
                        <Sidebar username={params.username} location={location}/>
                    </div>
                </div>
            </div>
        )
    }
}
