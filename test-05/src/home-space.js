import React, {Component} from 'react';
import Billboard from "./components/billboard/billboard";
import Sidebar from './components/sidebar/sidebar';
import Headlines from './components/headlines';
import BillboardCover from './components/billboard/billboard-cover';

class HomeSpace extends Component {

    constructor(props) {
        super(props);
        console.log('Home Space', props);

    }

    render() {
        const {location} = this.props;
        const {params} = this.props.match;

        console.log('HOME SPACE', this.props);

        return (
            <div className='home-space-container'>
                <div className='row mt-1 pl-1'>
                    <div className='col-sm-9'>
                        <BillboardCover username={params.username} location={location}/>

                        <div className='row mt-2 pl-1'>
                            <div className='col-sm-5'>
                                <Headlines/>
                            </div>
                            <div className='col-sm-7'>
                                <Billboard username={params.username} space='home' location={location}/>
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