import React, {Component} from 'react';
import Billboard from "./containers/billboard";
import Sidebar from './containers/sidebar';
import Headlines from './components/headlines';
import BillboardCover from './components/billboard-cover';

const HomeSpace = (props => {
    console.log('Home Space', props);

    const {params} = props.match;

    return (
        <div className='home-space-container'>
            <div className='row mt-1 pl-1'>
                <div className='col-sm-9'>
                    <BillboardCover username={params.username}/>

                    <div className='row mt-2 pl-1'>
                        <div className='col-sm-5'>
                            <Headlines/>
                        </div>
                        <div className='col-sm-7'>
                            <Billboard username={params.username} space='home'/>
                        </div>
                    </div>

                </div>
                <div className='col-sm-3'>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
});

export default HomeSpace;