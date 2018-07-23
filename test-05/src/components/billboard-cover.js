import React, {Component} from 'react';
import {connect} from 'react-redux';
import {asyncFetchUserData} from "../actions";
import {ROOT_STATIC_URL} from "../actions";

class BillboardCover extends Component {

    constructor(props) {
        super(props);

        this.props.asyncFetchUserData(props.username);
    }

    uploadCoverImage(event) {
        console.log(event);
    }

    uploadUserImage(event) {
        console.log(event);
    }

    render() {
        const {authorization, userdata} = this.props;
        const payload = this.props.userdata.payload;

        const name = payload !== undefined ? `${payload.user.firstname} ${payload.user.lastname}` : 'Loading..';
        const location = payload != undefined ? `${payload.userdata.address.city} ${payload.userdata.address.country}` : 'Loading..';
        const cover = payload !== undefined ? `${ROOT_STATIC_URL}/${payload.user.username}/cover/cover-pic.jpg`: 'Loading..';
        const profile = payload !== undefined ? `${ROOT_STATIC_URL}/${payload.user.username}/profile/profile-pic.jpg` : 'Loading..';

        return (
            <div className='billboard-cover'>
                <span title={`${name}, ${location}`}><img src={cover}/></span>
                <i className="fa fa-picture-o" aria-hidden="true" onClick={event => this.uploadCoverImage(event)}/>


                <div className='billboard-profile'>
                    <img src={profile}/>
                    <i className="fa fa-picture-o" aria-hidden="true" onClick={event => this.uploadUserImage(event)}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, userdata: state.userdata};
}

export default connect(mapStateToProps, {asyncFetchUserData})(BillboardCover);
