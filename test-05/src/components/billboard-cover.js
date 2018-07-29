import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncUpdateSpaceCover, asyncFetchSpaceData, asyncValidateAuth,
    ROOT_SERVER_URL, ROOT_STATIC_URL} from "../actions";
import {authConfig} from "../actions/bearer-config";

class BillboardCover extends Component {

    constructor(props) {
        super(props);

        this.state={location: props.location};
        this.props.asyncFetchSpaceData(props.username);
        this.localstate = this.localstate.bind(this)({location: props.location});
    }

    localstate(data) {
        let state = data;
        return {
            setState(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            getState() {
                return state;
            }
        }
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

    getFullName(isEditable, payload, spacedata) {
        return isEditable ? `${payload.user.firstname} ${payload.user.lastname}` :
            spacedata !== undefined ? `${spacedata.space.user.firstname} ${spacedata.space.user.lastname}` : 'Loading..';
    }

    getResidence(isEditable, payload, spacedata) {
        return isEditable ? `${payload.userdata.address.city} ${payload.userdata.address.country}` :
           spacedata !== undefined ? `${spacedata.userdata.address.city} ${spacedata.userdata.address.country}` : 'Loading..';
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, userdata, username} = this.props;
        const payload = this.props.userdata.payload;
        const spacedata = this.props.spacedata.payload;

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceData(username);
        }

        console.log('BILLBOARD_COVER', spacedata);

        const isEditable = spacedata !== undefined  && payload !== undefined && spacedata.space.user.username === payload.user.username;

        const fullname = this.getFullName(isEditable, payload, spacedata);
        const residence = this.getResidence(isEditable, payload, spacedata);

        const cover = spacedata !== undefined ? `${ROOT_STATIC_URL}/${spacedata.space.cover}` : 'Loading..';
        const avatar = isEditable ? `${ROOT_STATIC_URL}/${payload.user.avatar}` :
            spacedata !== undefined ? `${ROOT_STATIC_URL}/${spacedata.space.user.avatar}` : 'Loading..';

        return (
            <div className='billboard-cover'>
                <span title={`${fullname}, ${residence}`}><img src={cover}/></span>

                {isEditable && <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={event => this.validateAuth(event)}
                           onChange={event => this.uploadSpaceCover(event, payload.user.username)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                }

                <div className='billboard-profile'>
                    <img src={avatar}/>

                    {isEditable && <label for="avatarUploadId">
                        <input type="file" id="avatarUploadId"
                               onClick={event => this.validateAuth(event)}
                               onChange={event => this.uploadUserAvatar(event, payload.user.username)}/>
                        <i className="fa fa-picture-o" aria-hidden="true"/>
                    </label>
                    }
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
