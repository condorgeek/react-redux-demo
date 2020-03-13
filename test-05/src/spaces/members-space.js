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

import React from 'react';
import Sidebar from '../components/sidebar/sidebar';
import BillboardGenericCover from '../components/billboard/cover/billboard-generic-cover';
import Members from "../components/members-view/members";
import MemberProfile from "../components/members-view/member-profile";

const MembersSpace = (props) => {

    const {location} = props;
    const {params} = props.match;
    const spacepath = `generic/${params.spaceId}`;
    const memberspath = `members/${params.spaceId}`;

    return <div className='members-space-container'>
        <div className='row'>
            <div className='col-sm-9'>
                <BillboardGenericCover ownername={params.username} spacepath={spacepath}
                                       spaceId={params.spaceId}
                                       params={params}
                                       location={location}/>
                <div className='row'>
                    <div className='col-sm-6 box-white'>
                        <Members memberspath={memberspath} location={location}
                                 username={params.username}
                                 spaceId={params.spaceId}/>
                    </div>
                    <div className='col-sm-6 box-light-gray'>
                        <MemberProfile/>
                    </div>
                </div>

            </div>
            <div className='col-sm-3'>
                <Sidebar username={params.username} location={location}/>
            </div>
        </div>
    </div>
};

export default MembersSpace;
