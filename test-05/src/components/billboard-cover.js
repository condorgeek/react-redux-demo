import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncFetchUserData, asyncUpdateUserImage, asyncValidateAuth, ROOT_SERVER_URL, ROOT_STATIC_URL} from "../actions";
import {authConfig} from "../actions/bearer-config";

class BillboardCover extends Component {

    constructor(props) {
        super(props);

        this.props.asyncFetchUserData(props.username);
    }

    validateAuth(event) {
        this.props.asyncValidateAuth(this.props.username);
    }

    uploadCoverImage(event) {
        console.log(event);
    }

    uploadUserImage(event, username) {
        event.preventDefault();
        const filelist = event.target.files;

        if(filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/profile/upload`, formData, authConfig())
            .then(response => {
                console.log('success', response.data);
                this.props.asyncUpdateUserImage(username, {path: response.data});
            })
            .catch(error => console.log(error));
    }

    render() {
        const {authorization, userdata} = this.props;
        const payload = this.props.userdata.payload;


        console.log(payload);

        const name = payload !== undefined ? `${payload.user.firstname} ${payload.user.lastname}` : 'Loading..';
        const location = payload != undefined ? `${payload.userdata.address.city} ${payload.userdata.address.country}` : 'Loading..';
        const cover = payload !== undefined ? `${ROOT_STATIC_URL}/${payload.user.username}/cover/cover-pic.jpg` : 'Loading..';
        const profile = payload !== undefined ? `${ROOT_STATIC_URL}/${payload.user.thumbnail}` : 'Loading..';

        return (
            <div className='billboard-cover'>
                <span title={`${name}, ${location}`}><img src={cover}/></span>
                <i className="fa fa-picture-o" aria-hidden="true" onClick={event => this.uploadCoverImage(event)}/>

                <div className='billboard-profile'>
                    <img src={profile}/>
                    <label for="profileUploadId">
                        <input type="file" id="profileUploadId"
                               onClick={event => this.validateAuth(event)}
                               onChange={event => this.uploadUserImage(event, payload.user.username)}/>
                        <i className="fa fa-picture-o" aria-hidden="true"/>
                    </label>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, userdata: state.userdata};
}

export default connect(mapStateToProps, {asyncFetchUserData, asyncValidateAuth, asyncUpdateUserImage})(BillboardCover);
