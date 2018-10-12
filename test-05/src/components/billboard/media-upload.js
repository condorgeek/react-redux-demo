/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [media-upload.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 21:01
 */

import $ from 'jquery';
import _ from 'lodash';
import Sortable from '../../../node_modules/sortablejs/Sortable';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import Dropzone from 'react-dropzone';
import EmojiEditableBox from '../emoji-editor/emoji-editable-box';
import SoundcloudPlayer from "../players/soundcloud-player";
import axios from 'axios';
import {asyncValidateAuth} from "../../actions/index";


class FormUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {invalid: false};
        this.className = this.className.bind(this)();
    }

    className() {
        const classes = {'YOUTUBE': 'fa-youtube', 'VIMEO': 'fa-vimeo-square', 'SOUNDCLOUD': 'fa-soundcloud'};
        return {
            get(type) {
                return classes[type];
            }
        }
    }

    handleForm(event) {
        event.preventDefault();
        if (!event.target.checkValidity()) {
            this.setState({invalid: true});
            return;
        }
        const data = new FormData(event.target);
        this.setState({invalid: false});
        this.props.callback(data.get('url'), this.props.type);
        event.target.reset();
    }

    render() {
        const {invalid} = this.state;
        const className = this.className.get(this.props.type);

        return (
            <form noValidate onSubmit={(event) => this.handleForm(event)}
                  className={invalid ? 'form-invalid' : ''}>
                <div className="input-group media-upload-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className={`fa ${className}`}/></span>
                    </div>
                    <input type="text" name='url' className="form-control" autoComplete="off"
                           placeholder={this.props.placeholder}
                           pattern={this.props.pattern}
                    />
                </div>
            </form>
        );
    }
}

class MediaUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {accepted: [], rejected: [], embedded: [], processing: false};

        this.toggler = this.toggler.bind(this)();
    }

    renderImagesPreview() {
        const {accepted} = this.state;
        accepted.length > 0 && this.props.asyncValidateAuth(this.props.username);

        return accepted.map(file => {
            return (<div key={file.name} className='media-upload-item'>
                <img src={`${file.preview}`}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeFile(file)
                }}/>
            </div>);
        });
    }

    getYoutubeThumbnail(url) {
        const videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        return videoid ? `https://img.youtube.com/vi/${videoid[1]}/hqdefault.jpg` : '';
    }

    getVimeoThumbnail(embedded) {
        if (this.state.processing === true) return;

        const videoid = embedded.url.match(/(?:https?:\/{2})?(?:w{3}\.)?vimeo(?:be)?\.(?:com)(?:\/watch\?v=|\/)([^\s&]+)/);

        this.setState({processing: true});
        axios.get(`http://vimeo.com/api/v2/video/${videoid[1]}.json`)
            .then(response => {
                embedded.thumbnail = response.data[0].thumbnail_large;
                this.setState({embedded: [embedded], processing: false});
            });
    }

    renderVideoPreview() {
        const embedded = this.state.embedded[0];

        if (embedded.type === 'YOUTUBE') {
            embedded.thumbnail = this.getYoutubeThumbnail(embedded.url);
            return (<div className='youtube-preview'><div className='media-upload-item'>
                <img src={embedded.thumbnail}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeEmbedded(embedded)
                }}/>
            </div></div>);

        } else if (embedded.type === 'VIMEO') {
            if (embedded.thumbnail === undefined || embedded.thumbnail.length === 0) {
                this.getVimeoThumbnail(embedded);
                return <div>Loading..</div>
            }
            return (<div className='vimeo-preview'><div className='media-upload-item'>
                <img src={embedded.thumbnail}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeEmbedded(embedded)
                }}/>
            </div></div>);

        } else if (embedded.type === 'SOUNDCLOUD') {
            return <SoundcloudPlayer url={embedded.url}/>;
        }
    }

    renderPreview() {
        if (this.state.embedded.length > 0) {
            return this.renderVideoPreview();
        }
        return this.renderImagesPreview();
    }

    removeFile(file) {
        const accepted = this.state.accepted.filter(entry => {
            return (entry.name === file.name) ? null : entry;
        });

        window.URL.revokeObjectURL(file.preview);
        this.setState({accepted: accepted});
    }

    removeEmbedded(file) {
        const embedded = this.state.embedded.filter(entry => {
            return (entry.url === file.url) ? null : entry;
        });

        this.setState({embedded: embedded});
    }

    handleFilesUpload(accepted, rejected) {
        const media = Object.assign([], this.state.accepted);
        media.push(...accepted);

        this.setState({accepted: media, rejected: [], embedded: []});
    }

    handleTextAreaEnter(text) {
        this.props.callback(text, this.state.accepted, this.state.embedded);

        this.state.accepted.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({accepted: [], rejected: [], embedded: []});
    }

    handleFormUpload(url, type) {
        if (url != null && url.length > 0) {
            this.state.accepted.forEach(file => window.URL.revokeObjectURL(file.preview));

            this.setState({accepted: [],  rejected: [], embedded: [{id: 0, thumbnail: '', url: url, type: type}]});
        }
    }

    toggler() {
        let state = {
            '#media-upload-id': false,
            '#youtube-upload-id': false,
            '#vimeo-upload-id': false,
            '#soundcloud-upload-id': false
        };
        return {
            toggle(current) {
                state = _.mapValues(state, (value, key) => {
                    if (key !== current) {
                        $(key).collapse('hide');
                        return false;
                    }
                    return value;
                });
                state[current] = !state[current];
                $(current).collapse('toggle');
            }
        }
    }

    render() {
        return (
            <div className='media-upload'>
                <EmojiEditableBox id='new-media-upload'
                                  callback={this.handleTextAreaEnter.bind(this)}
                                  mediaupload={(event) => {
                              event.preventDefault();
                              this.toggler.toggle('#media-upload-id');
                          }}
                                  youtube={(event) => {
                              event.preventDefault();
                              this.toggler.toggle('#youtube-upload-id');
                          }}
                                  vimeo={(event) => {
                              event.preventDefault();
                              this.toggler.toggle('#vimeo-upload-id');
                          }}
                                  soundcloud={(event) => {
                              event.preventDefault();
                              this.toggler.toggle('#soundcloud-upload-id');
                          }}
                />

                <div id='media-preview' className='media-upload-preview' ref={() => {
                    const mediapreview = document.getElementById('media-preview');
                    if (mediapreview != null) {
                        Sortable.create(mediapreview, {animation: 150})
                    }
                }}>
                    {this.renderPreview()}
                </div>

                <div id='media-upload-id' className="collapse">
                    <Dropzone className='media-upload-zone'
                              accept="image/jpeg, image/png, image/gif"
                              onDrop={this.handleFilesUpload.bind(this)}>
                        <span className='justify-content-center'>Drag and Drop your files in this area or click for file selection..</span>
                        <i className="fa fa-file-image-o" aria-hidden="true"/>
                    </Dropzone>
                </div>

                <div id='youtube-upload-id' className="collapse">
                    <FormUpload type="YOUTUBE"
                                placeholder="Enter a valid Youtube link here.."
                                pattern="^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+"
                                callback={this.handleFormUpload.bind(this)}
                    />
                </div>

                <div id='vimeo-upload-id' className="collapse">
                    <FormUpload type="VIMEO"
                                placeholder="Enter a valid Vimeo link here.."
                                pattern="^(http(s)?:\/\/)?((w){3}.)?vimeo?(\.com)?\/.+"
                                callback={this.handleFormUpload.bind(this)}
                    />
                </div>

                <div id='soundcloud-upload-id' className="collapse">
                    <FormUpload type="SOUNDCLOUD"
                                placeholder="Enter a valid Soundcloud link here.."
                                pattern="^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+/?$"
                                callback={this.handleFormUpload.bind(this)}
                    />
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps, {asyncValidateAuth})(MediaUpload);