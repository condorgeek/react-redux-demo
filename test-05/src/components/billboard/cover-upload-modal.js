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

import Modal from "react-responsive-modal";
import {ROOT_SERVER_URL} from "../../actions";
import {authConfig} from "../../actions/bearer-config";
import {asyncValidateAuth} from "../../actions";
import {asyncAddSpaceMedia} from "../../actions/spaces";

class CoverUploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {files: [], open: false}
    }

    onOpen = () => {
        this.setState({open: true});
    };

    onClose = () => {
        this.state.files.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({files: [], open: false});
    };

    onDrop = (accepted) => {
        const {authorization} = this.props;
        const media = Object.assign([], this.state.files);

        /* create preview */
        accepted.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })).forEach(file => media.push(file));

        this.props.asyncValidateAuth(authorization.user.username);
        this.setState({files: media});
    };

    onUpload = (event) => {
        event.preventDefault();

        const {files} = this.state;
        const {space, authorization} = this.props;
        const ordered = [];

        /* reorder images if necessary */
        const children = document.getElementById(`upload-modal-preview-${space.id}`).children;
        [...children].forEach(child => {
            child.dataset.position && ordered.push(files[child.dataset.position]);
        });

        console.log('ORDERED', ordered);

        this.uploadFiles(authorization.user.username, "home", ordered);

        files.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({files: [], open: false});

    };

    uploadFiles(username, spacename, files) {
        const spacemedia = [];

        /* keep ordering of the files array as in idx */
        const uploaders = files.map((file, idx) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", "");

            return axios.post(`${ROOT_SERVER_URL}/user/${username}/media/upload/${spacename}`, formData, authConfig())
            .then(response => {
                const uploaded = response.data;
                uploaded.position = idx;
                spacemedia.push(uploaded);
            });
        });

        axios.all(uploaders).then(() => {
            this.props.asyncAddSpaceMedia(username, spacename, {media: spacemedia}, space => {
                console.log('ADDED', space);
                // this.props.localUpdateMedia(post.media);
            });
        });
    }

    removeFile(file) {
        const files = this.state.files.filter(entry => entry.name !== file.name);

        window.URL.revokeObjectURL(file.preview);
        this.setState({files: files});
    }

    renderPreview(authorization) {
        const {files} = this.state;
        files.length > 0 && this.props.asyncValidateAuth(authorization.user.username);

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
        const {container, authorization, space} = this.props;

        return (
            <div className="cover-upload-modal">
                <div onClick={event => this.onOpen()}>
                    <i className="far fa-images" aria-hidden="true"/>
                </div>

                <Modal open={open} onClose={this.onClose} center container={container.current}
                       classNames={{
                           closeButton: "modal-close-button",
                           closeIcon: "modal-close-icon"
                       }}
                       styles={{closeButton:{color: 'red'}}}
                >
                    <div className="cover-media-upload">
                        <h6>Upload cover files</h6>

                        <div className="media-upload">
                            <div id={`upload-modal-preview-${space.id}`} className="media-upload-preview" ref={elem => {
                                elem && Sortable.create(elem, {animation: 150});
                            }}>
                                {this.renderPreview(authorization)}
                                {files.length > 0 && <div className="mt-1 mb-2 d-flex flex-row-reverse">
                                    <button className="btn btn-light" onClick={this.onUpload}><i className="fas fa-cloud-upload-alt"/> Upload</button>
                                    <button className="btn btn-light mr-1" onClick={this.onClose}><i className="fas fa-times"/> Cancel</button>
                                </div>}
                            </div>

                            <Dropzone className='media-upload-zone'
                                      accept="image/jpeg, image/png, image/gif, image/svg+xml"
                                      onDrop={this.onDrop}>
                                <i className="fas fa-cloud-upload-alt"/>
                                <span className='justify-content-center'>Drag and Drop here or click</span>
                            </Dropzone>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(null, {asyncValidateAuth, asyncAddSpaceMedia})(CoverUploadModal)
