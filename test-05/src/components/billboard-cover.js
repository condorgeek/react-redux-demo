import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncUpdateSpaceCover, asyncFetchSpaceData, asyncValidateAuth,
    ROOT_SERVER_URL, ROOT_STATIC_URL} from "../actions";
import {authConfig} from "../actions/bearer-config";

class BillboardCover extends Component {

    constructor(props) {
        super(props);

        this.props.asyncFetchSpaceData(props.username);
    }

    validateAuth(event) {
        this.props.asyncValidateAuth(this.props.username);
    }

    uploadSpaceCover(event, username) {
        event.preventDefault();
        const filelist = event.target.files;

        if (filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/cover/upload`, formData, authConfig())
            .then(response => {
                this.props.asyncUpdateSpaceCover(username, {path: response.data});
            })
            .catch(error => console.log(error));
    }

    uploadUserAvatar(event, username) {
        event.preventDefault();
        const filelist = event.target.files;

        if (filelist.length !== 1) return;

        const formData = new FormData();
        formData.append("file", filelist.item(0));
        axios.post(`${ROOT_SERVER_URL}/user/${username}/avatar/upload`, formData, authConfig())
            .then(response => {
                this.props.asyncUpdateUserAvatar(username, {path: response.data});
            })
            .catch(error => console.log(error));
    }

    render() {
        const {authorization, userdata} = this.props;
        const payload = this.props.userdata.payload;
        const spacedata = this.props.spacedata.payload;

        const name = payload !== undefined ? `${payload.user.firstname} ${payload.user.lastname}` : 'Loading..';
        const location = payload !== undefined ? `${payload.userdata.address.city} ${payload.userdata.address.country}` : 'Loading..';
        const cover = spacedata !== undefined ? `${ROOT_STATIC_URL}/${spacedata.space.cover}` : 'Loading..';
        const avatar = payload !== undefined ? `${ROOT_STATIC_URL}/${payload.user.avatar}` : 'Loading..';

        return (
            <div className='billboard-cover'>
                <span title={`${name}, ${location}`}><img src={cover}/></span>
                <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={event => this.validateAuth(event)}
                           onChange={event => this.uploadSpaceCover(event, payload.user.username)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                <div className='billboard-profile'>
                    <img src={avatar}/>
                    <label for="avatarUploadId">
                        <input type="file" id="avatarUploadId"
                               onClick={event => this.validateAuth(event)}
                               onChange={event => this.uploadUserAvatar(event, payload.user.username)}/>
                        <i className="fa fa-picture-o" aria-hidden="true"/>
                    </label>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, userdata: state.userdata, spacedata: state.spacedata};
}

export default connect(mapStateToProps, {asyncValidateAuth, asyncUpdateUserAvatar,
    asyncUpdateSpaceCover, asyncFetchSpaceData})(BillboardCover);
