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
import {asyncValidateAuth, YOUTUBE_REGEX} from "../../actions/index";
import RawEditableBox from "../emoji-editor/raw-editable-box";

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
                    <input type="text" name="url" className="form-control" autoComplete="off" required
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

        this.handleOnDropFiles = this.handleOnDropFiles.bind(this);
        this.handleFormUpload = this.handleFormUpload.bind(this);

        this.toggler = this.toggler.bind(this)(props.id);
    }

    componentWillUnmount() {
        this.state.accepted.forEach(file => window.URL.revokeObjectURL(file.preview));
    }

    renderImagesPreview() {
        const {accepted} = this.state;
        accepted.length > 0 && this.props.asyncValidateAuth(this.props.username);

        return accepted.map((file, idx) => {
            return (<div key={file.name} className='media-upload-item' data-position={idx}>
                <img src={`${file.preview}`}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeFile(file)
                }}/>
            </div>);
        });
    }

    getYoutubeThumbnail(url) {
        YOUTUBE_REGEX.lastIndex = 0;
        const videoid = YOUTUBE_REGEX.exec(url);
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

    handleOnDropFiles(accepted, rejected) {
        const media = Object.assign([], this.state.accepted);

        /* create preview */
        accepted.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })).forEach(file => media.push(file));

        this.setState({accepted: media, rejected: [], embedded: []});
    }

    handleTextAreaEnter(text) {
        const {accepted, embedded} = this.state;
        const {id} = this.props;
        const ordered = [];

        /* reorder images if necessary */
        const children = document.getElementById(`upload-preview-${id}`).children;
        [...children].forEach(child => {
            ordered.push(accepted[child.dataset.position]);
        });

        this.props.callback(text, ordered, embedded);

        accepted.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({accepted: [], rejected: [], embedded: []});
    }

    handleFormUpload(url, type) {
        if (url != null && url.length > 0) {
            this.state.accepted.forEach(file => window.URL.revokeObjectURL(file.preview));

            this.setState({accepted: [],  rejected: [], embedded: [{id: 0, thumbnail: '', url: url, type: type}]});
        }
    }

    toggler(id) {
        let state = {};
        state[`#media-upload-${id}`] = false;
        state[`#youtube-upload-${id}`] = false;
        state[`#vimeo-upload-${id}`] = false;
        state[`#soundcloud-upload-${id}`] = false;

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
        const {id, text, rawmode} = this.props;

        return (
            <div className='media-upload'>
                {!rawmode && <EmojiEditableBox id={`editable-box-${id}`} text={text}
                                  callback={this.handleTextAreaEnter.bind(this)}
                                  mediaupload={(event) => {
                              event.preventDefault();
                              this.toggler.toggle(`#media-upload-${id}`);
                          }}
                                  youtube={(event) => {
                              event.preventDefault();
                              this.toggler.toggle(`#youtube-upload-${id}`);
                          }}
                                  vimeo={(event) => {
                              event.preventDefault();
                              this.toggler.toggle(`#vimeo-upload-${id}`);
                          }}
                                  soundcloud={(event) => {
                              event.preventDefault();
                              this.toggler.toggle(`#soundcloud-upload-${id}`);
                          }}
                />}

                {rawmode && <RawEditableBox id={`editable-box-${id}`} text={text}
                                callback={this.handleTextAreaEnter.bind(this)}
                                mediaupload={(event) => {
                                    event.preventDefault();
                                    this.toggler.toggle(`#media-upload-${id}`);
                                }}
                                youtube={(event) => {
                                    event.preventDefault();
                                    this.toggler.toggle(`#youtube-upload-${id}`);
                                }}
                                vimeo={(event) => {
                                    event.preventDefault();
                                    this.toggler.toggle(`#vimeo-upload-${id}`);
                                }}
                                soundcloud={(event) => {
                                    event.preventDefault();
                                    this.toggler.toggle(`#soundcloud-upload-${id}`);
                                }}
                />}

                <div id={`upload-preview-${id}`} className='media-upload-preview' ref={elem => {
                    elem && Sortable.create(elem, {animation: 150});
                    }}> {this.renderPreview()}
                </div>

                <div id={`media-upload-${id}`} className="collapse">
                    <Dropzone className='media-upload-zone'
                              accept="image/jpeg, image/png, image/gif, image/svg+xml"
                              onDrop={this.handleOnDropFiles}>
                        <span className='justify-content-center'>Drag and Drop here or click</span>
                        <i className="fas fa-cloud-upload-alt"/>
                    </Dropzone>
                </div>

                <div id={`youtube-upload-${id}`} className="collapse">
                    <FormUpload type="YOUTUBE"
                                placeholder="Enter a valid Youtube link here.."
                                pattern="^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+"
                                callback={this.handleFormUpload}
                    />
                </div>

                <div id={`vimeo-upload-${id}`} className="collapse">
                    <FormUpload type="VIMEO"
                                placeholder="Enter a valid Vimeo link here.."
                                pattern="^(http(s)?:\/\/)?((w){3}.)?vimeo?(\.com)?\/.+"
                                callback={this.handleFormUpload}
                    />
                </div>

                <div id={`soundcloud-upload-${id}`} className="collapse">
                    <FormUpload type="SOUNDCLOUD"
                                placeholder="Enter a valid Soundcloud link here.."
                                pattern="^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+/?$"
                                callback={this.handleFormUpload}
                    />
                </div>

            </div>
        );
    }
}

export default connect(null, {asyncValidateAuth})(MediaUpload);