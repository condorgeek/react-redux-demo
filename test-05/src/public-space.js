import React, {Component} from 'react';
import PostsIndex from "./containers/posts-index";
import Sidebar from './containers/sidebar';


const PublicSpace = (props => {
    console.log('Public Space');

    return (
        <div className=''>
            <div className='row mt-2 pl-1'>
                <div className='col-sm-9'>
                    <PostsIndex space='global'/>
                </div>
                <div className='col-sm-3'>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
});

export default PublicSpace;