import $ from 'jquery';
import _ from 'lodash';
import Sortable from '../../node_modules/sortablejs/Sortable';

import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import EmojiBox from '../components/emoji-box';
import SoundcloudPlayer from "../components/soundcloud-player";
import axios from 'axios';


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
        return this.state.accepted.map(file => {
            return (<div className='media-upload-item'>
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
            return (<div className='media-upload-item'>
                <img src={embedded.thumbnail}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeEmbedded(embedded)
                }}/>
            </div>);

        } else if (embedded.type === 'VIMEO') {
            if (embedded.thumbnail === undefined || embedded.thumbnail.length === 0) {
                this.getVimeoThumbnail(embedded);
                return <div>Loading..</div>
            }
            console.log('2', embedded);
            return (<div className='media-upload-item'>
                <img src={embedded.thumbnail}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeEmbedded(embedded)
                }}/>
            </div>);

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

        this.setState({accepted: accepted});
    }

    removeEmbedded(file) {
        const embedded = this.state.embedded.filter(entry => {
            return (entry.url === file.url) ? null : entry;
        });

        this.setState({embedded: embedded});
    }

    handleFiles(accepted, rejected) {
        const media = Object.assign([], this.state.accepted);
        media.push(...accepted);

        this.setState({accepted: media});
    }

    handleTextAreaEnter(text) {
        this.props.callback(text, this.state.accepted, this.state.embedded);

        this.state.accepted.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({accepted: [], rejected: [], embedded: []});
    }

    handleFormUpload(url, type) {

        console.log('form', url);

        if (url != null && url.length > 0) {
            this.setState({embedded: [{id: 0, thumbnail: '', url: url, type: type}]});
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
                <EmojiBox id='new-media-upload'
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
                              onDrop={this.handleFiles.bind(this)}>
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

export default MediaUpload;