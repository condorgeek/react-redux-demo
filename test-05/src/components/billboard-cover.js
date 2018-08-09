import holderjs from 'holderjs';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {asyncUpdateUserAvatar, asyncUpdateSpaceCover, asyncFetchSpaceData, asyncValidateAuth,
    ROOT_SERVER_URL, ROOT_STATIC_URL} from "../actions";
import {authConfig} from "../actions/bearer-config";

class Coverholder extends Component {
    render() {
        const holder = `holder.js/800x300?auto=yes&random=yes&text=${this.props.text}&size=16`;
        return <img src={holder}/>
    }
}

class Avatarholder extends Component {
    render() {
        const {firstname, lastname} = this.props;
        // const holder = `holder.js/160x160?auto=yes&theme=social&text=${firstname.charAt(0)}${lastname.charAt(0)}&size=28`;
        const holder = `holder.js/160x160?auto=yes&random=yes&text=${firstname.charAt(0)}${lastname.charAt(0)}&size=28`;
        return <img src={holder}/>
    }
}

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

    componentDidMount() {
        holderjs.run();
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

    getCoverImage(spacedata) {
        if(spacedata !== undefined) {
            const {cover, name} = spacedata.space;
            return cover !== null ? <img src={`${ROOT_STATIC_URL}/${cover}`}/> :
                <Coverholder text={name} ref={() => holderjs.run() }/>;
        }
        return 'Loading..';
    }

    getAvatarImage(isEditable, payload, spacedata) {
        if(payload === undefined || spacedata === undefined) return 'Loading';

        const avatar = isEditable ? payload.user.avatar :
            spacedata !== undefined ? spacedata.space.user.avatar : null;

        const {firstname, lastname} = spacedata.space.user;

        return avatar !== null ? <img src={`${ROOT_STATIC_URL}/${avatar}`}/> :
            <Avatarholder firstname={firstname} lastname={lastname} ref={() => holderjs.run() }/>;
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, userdata, username} = this.props;
        const payload = this.props.userdata.payload;
        const spacedata = this.props.spacedata.payload;

        console.log(spacedata);

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceData(username);
        }

        const isEditable = spacedata !== undefined  && payload !== undefined && spacedata.space.user.username === payload.user.username;
        const fullname = this.getFullName(isEditable, payload, spacedata);
        const residence = this.getResidence(isEditable, payload, spacedata);
        const friends = spacedata != null ? spacedata.friends : 0;
        const followers = spacedata != null ? spacedata.followers : 0;

        return (
            <div className='billboard-cover'>
                <span title={`${fullname}, ${residence}`}>
                    {this.getCoverImage(spacedata)}
                </span>

                {isEditable && <label htmlFor="coverUploadId">
                    <input type="file" id="coverUploadId"
                           onClick={event => this.validateAuth(event)}
                           onChange={event => this.uploadSpaceCover(event, payload.user.username)}/>
                    <i className="fa fa-picture-o" aria-hidden="true" />
                </label>
                }

                <div className="friends-navigation">
                    <button type="button" className="btn btn-billboard btn-sm">
                    Friends <div className="badge badge-light d-inline">{friends || 123}</div>
                    </button>
                    <button type="button" className="btn btn-billboard btn-sm">
                    Followers <div className="badge badge-light d-inline">{followers || 45}</div>
                    </button>
                </div>

                <div className='billboard-profile'>
                    {this.getAvatarImage(isEditable, payload, spacedata)}

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
