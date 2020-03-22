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
import Sidebar from '../components/sidebar/sidebar';
import BillboardCover from '../components/billboard/cover/billboard-cover';
import Chat from "../views/friends-view/chat";
import Friends from "../views/friends-view/friends";

class FriendsSpace extends Component {

    render() {
        const {location} = this.props;
        const {params} = this.props.match;
        const spacepath = 'home';
        const friendspath = 'friends';

        return (
            <div className='home-space-container'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <BillboardCover username={params.username} spacepath={spacepath} params={params}
                                        location={location}/>

                        <div className='row'>
                            <div className='col-sm-6 box-white'>
                                <Friends username={params.username}
                                         location={location}
                                         memberspath={friendspath}
                                         spaceId={friendspath}/>
                            </div>
                            <div className='col-sm-6 box-light-gray'>
                                <Chat/>
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

export default FriendsSpace;