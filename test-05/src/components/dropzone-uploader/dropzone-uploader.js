/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [dropzone-uploader.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 27.02.20, 14:09
 */

import Dropzone from "react-dropzone";
import Sortable from 'sortablejs';
import toastr from "toastr";
import axios from 'axios';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {asyncValidateAuth} from "../../actions";
import {asyncAddSpaceMedia} from "../../actions/spaces";
import {getMediaUploadPath} from "../../actions/environment";
import {authConfig} from "../../actions/local-storage";
import {ConfigurationContext} from "../configuration/configuration";

class DropzoneUploader extends Component {

    state = {files: []};

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    componentWillUnmount() {
        this.state.files.forEach(file => window.URL.revokeObjectURL(file.preview));
    }

    /* @Public - the upload action must be triggered from the outside */
    onUpload = (event) => {
        event.preventDefault();
        const {files} = this.state;

        if(files.length === 0) {
            console.log('NO FILES SELECTED');
            return;
        }

        const {username, spacepath = 'home'} = this.props;
        const ordered = [];

        /* reorder images if necessary */
        const children = document.getElementById(`upload-modal-preview-${spacepath}`).children;
        [...children].forEach(child => {
            child.dataset.position && ordered.push(files[child.dataset.position]);
        });

        this.uploadFiles(username, spacepath, ordered);

    };

    /* @Private - intended for internal use only */
    uploadFiles = (username, spacepath, files) => {
        const spacemedia = [];

        /* keep ordering of the files array as in idx */
        const uploaders = files.map((file, idx) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", "");

            return axios.post(getMediaUploadPath(username, spacepath), formData, authConfig())
            .then(response => {
                const uploaded = response.data;
                uploaded.position = idx;
                spacemedia.push(uploaded);
            });
        });

        axios.all(uploaders).then(() => {
            this.props.asyncAddSpaceMedia(username, spacepath, {media: spacemedia}, space => {
                toastr.info(`Images for ${space.name} uploaded successfully.`);
            });
        });
    };

    /* @Public */
    getFiles = () => {
        return this.state.files;
    };

    onDrop = (accepted) => {
        const {files, username} = this.props;
        const media = Object.assign([], files);

        /* create preview */
        accepted.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })).forEach(file => media.push(file));

        this.props.asyncValidateAuth(username);
        this.setState({files: media});
    };

    removeFile = (file) => {
        const files = this.state.files.filter(entry => entry.name !== file.name);
        window.URL.revokeObjectURL(file.preview);
        this.setState({files: files});
    };

    renderPreview = (username) => {
        const {files} = this.state;
        files.length > 0 && this.props.asyncValidateAuth(username);

        return files.map((file, idx) => {
            return <div key={file.name} className='media-upload-item' data-position={idx}>
                <img src={`${file.preview}`}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeFile(file)
                }}/>
            </div>;
        });
    };

    render() {

        const {className, username, spacepath, Lang} = this.props;

        return <div className={`media-rich-editor ${className ? className :''}`}>
            <div id={`upload-modal-preview-${spacepath}`} className="media-upload-preview" ref={elem => {
                elem && Sortable.create(elem, {animation: 150});
            }}>
                {this.renderPreview(username)}
            </div>

            <Dropzone className='media-upload-zone'
                      accept="image/jpeg, image/png, image/gif, image/svg+xml"
                      onDrop={this.onDrop}>
                <i className="fas fa-cloud-upload-alt"/>
                <span className='justify-content-center'>{Lang.dialog.dragAndDrop}</span>
            </Dropzone>
        </div>
    }
}

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<DropzoneUploader {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default connect(null, {asyncValidateAuth, asyncAddSpaceMedia})(withConfigurationContext);