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

import React, {Component} from 'react';
import Billboard from "../components/billboard/billboard";
import Sidebar from '../components/sidebar/sidebar';
import Headlines from '../components/headlines/headlines';
import BillboardCover from '../components/billboard/cover/billboard-cover';

class HomeSpace extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {location} = this.props;
        const {params} = this.props.match;
        const spacepath = 'home';

        return (
            <div className='home-space-container'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <BillboardCover username={params.username} spacepath={spacepath} params={params}
                                        location={location}/>

                        <div className='row mt-2 pl-1'>
                            <div className='col-sm-5'>
                                <Headlines  username={params.username} spacename={spacepath} spaceId={spacepath}
                                            location={location}/>
                            </div>
                            <div className='col-sm-7'>
                                <Billboard username={params.username} spacename={spacepath} spaceId={spacepath} params={params}
                                           location={location}/>
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

export default HomeSpace;