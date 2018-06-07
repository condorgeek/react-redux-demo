import React, {Component} from 'react';
import Billboard from "./containers/billboard";
import Sidebar from './containers/sidebar';
import Headlines from './components/headlines';


class BillboardCover extends Component {

    uploadCoverImage(event) {
        console.log(event);
    }

    uploadUserImage(event) {
        console.log(event);
    }

    render() {
        return(
            <div className='billboard-cover'>
                <span title="Amaru London, London UK"><img  src="/static/pics/london-mk-fb.jpg"/></span>
                <i className="fa fa-picture-o" aria-hidden="true" onClick={event => this.uploadCoverImage(event)}/>


                <div className='billboard-profile'>
                    <img  src="/static/users/amaru-pic.jpg"/>
                    <i className="fa fa-picture-o" aria-hidden="true" onClick={event => this.uploadUserImage(event)}/>
                </div>
            </div>
        );
    }
}

const HomeSpace = (props => {
    console.log('Home Space');

    return (
        <div className='home-space-container'>
            <div className='row mt-2 pl-1'>
                <div className='col-sm-9'>
                    <BillboardCover/>

                    <div className='row mt-2 pl-1'>
                        <div className='col-sm-5'>
                            <Headlines/>
                        </div>
                        <div className='col-sm-7'>
                            <Billboard space='home'/>
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