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
 * Last modified: 11.02.20, 10:55
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {asyncValidateAuth} from "../../../actions";
import {asyncAddSpaceMedia} from "../../../actions/spaces";
import DialogBox from "../../dialog-box/dialog-box";
import DropzoneUploader from '../../dropzone-uploader/dropzone-uploader';

class CoverUploadModal extends Component {
    state = {open: false};

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    /* @Public */
    onOpen = () => {
        this.setState({open: true});
    };

    onClose = () => {
        this.setState({open: false});
    };

    onLazyUpload = (event) => {
        this.uploaderRef && this.uploaderRef.onUpload(event);
    };

    render() {
        const {open} = this.state;
        const {spacepath, username} = this.props;

        return <DialogBox wide isOpen={open} setIsOpen={this.onClose}
                        title='Upload cover files'
                        action='Upload files'
                       callback={this.onLazyUpload}>
                <DropzoneUploader
                    spacepath={spacepath}
                    username={username}
                    onRef={(ref) => this.uploaderRef = ref}>
                </DropzoneUploader>

            </DialogBox>
    }
}

export default connect(null, {asyncValidateAuth, asyncAddSpaceMedia})(CoverUploadModal)
