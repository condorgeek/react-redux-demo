/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [public-space.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 20:49
 */

import React, {Component} from 'react';
import PostsIndex from "./components/newsfeed/posts-index";
import Sidebar from './components/sidebar/sidebar';


const PublicSpace = (props => {
    console.log('Public Space');
    const {params} = props.match;

    return (
        <div className='public-space-container'>
            <div className='row mt-1 pl-1'>
                <div className='col-sm-9'>
                    <PostsIndex username={params.username} space='global'/>
                </div>
                <div className='col-sm-3'>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
});

export default PublicSpace;