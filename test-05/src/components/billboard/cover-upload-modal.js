/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [cover-upload-modal.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 29.01.19 21:51
 */
import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import Dropzone from "react-dropzone";
import Sortable from '../../../node_modules/sortablejs/Sortable';
import toastr from "../../../node_modules/toastr/toastr";

// import Modal from "react-responsive-modal"; // TODO remove deprecated dependency
import {authConfig} from "../../actions/local-storage";
import {asyncValidateAuth} from "../../actions";
import {asyncAddSpaceMedia} from "../../actions/spaces";
import {getMediaUploadPath} from "../../actions/environment";
import DialogBox from "../dialog-box/dialog-box";

class CoverUploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {files: [], open: false}
    }

    componentDidMount() {
        // manually resolve the reference for component
        this.props.onRef && this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef && this.props.onRef(null);
    }

    onOpen = () => {
        this.setState({open: true});
    };

    onClose = () => {
        this.state.files.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({files: [], open: false});
    };

    onDrop = (accepted) => {
        const {username} = this.props;
        const media = Object.assign([], this.state.files);

        /* create preview */
        accepted.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })).forEach(file => media.push(file));

        this.props.asyncValidateAuth(username);
        this.setState({files: media});
    };

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

        files.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({files: [], open: false});

    };

    uploadFiles(username, spacepath, files) {
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
    }

    removeFile(file) {
        const files = this.state.files.filter(entry => entry.name !== file.name);

        window.URL.revokeObjectURL(file.preview);
        this.setState({files: files});
    }

    renderPreview(username) {
        const {files} = this.state;
        files.length > 0 && this.props.asyncValidateAuth(username);

        return files.map((file, idx) => {
            return (<div key={file.name} className='media-upload-item' data-position={idx}>
                <img src={`${file.preview}`}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeFile(file)
                }}/>
            </div>);
        });
    }

    render() {
        const {open, files} = this.state;
        const {container, authorization, spacepath, username} = this.props;

        return (
            <DialogBox wide isOpen={open} setIsOpen={this.onClose}
                        title='Upload cover files'
                        action='Upload files'
                       callback={this.onUpload}>

                <div className="media-upload">
                    <div id={`upload-modal-preview-${spacepath}`} className="media-upload-preview" ref={elem => {
                                elem && Sortable.create(elem, {animation: 150});
                            }}>
                        {this.renderPreview(username)}
                    </div>

                    <Dropzone className='media-upload-zone'
                              accept="image/jpeg, image/png, image/gif, image/svg+xml"
                              onDrop={this.onDrop}>
                        <i className="fas fa-cloud-upload-alt"/>
                        <span className='justify-content-center'>Drag and Drop here or click</span>
                    </Dropzone>
                </div>
            </DialogBox>
        )
    }
}

export default connect(null, {asyncValidateAuth, asyncAddSpaceMedia})(CoverUploadModal)
