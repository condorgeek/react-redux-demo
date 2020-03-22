/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [home-space.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.10.18 15:48
 */

import React from 'react';
import Sidebar from '../components/sidebar/sidebar';
import BillboardCover from '../components/billboard/cover/billboard-cover';
import SpacesView from "../views/spaces-view/spaces-view";

const SpacesSpace = (props) => {
    const {location} = props;
    const {params} = props.match;
    const spacepath = 'home';
    const spacesViewPath = 'spaces';

    return <div className='home-space-container'>
        <div className='row'>
            <div className='col-sm-9'>
                <BillboardCover username={params.username} spacepath={spacepath} params={params}
                                location={location}/>

                <div className='row'>
                    <div className='col-sm-6 box-white'>
                        <SpacesView username={params.username}
                                location={location}
                                path={spacesViewPath}/>
                    </div>
                    <div className='col-sm-6 box-light-gray'>
                        Empty
                    </div>
                </div>

            </div>
            <div className='col-sm-3'>
                <Sidebar username={params.username} location={location}/>
            </div>
        </div>
    </div>
};

export default SpacesSpace;