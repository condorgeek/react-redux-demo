import $ from 'jquery';
import Sortable from '../../node_modules/sortablejs/Sortable';

import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import EmojiBox from '../components/emoji-box';

class MediaUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {accepted: [], rejected: []}
    }

    renderPreview() {
        return this.state.accepted.map(file => {
            return (<div className='media-upload-item'>
                <img src={`${file.preview}`}/>
                <i className="fa fa-times-circle fa-inverse" aria-hidden="true" onClick={() => {
                    this.removeFile(file)
                }}/>
            </div>);
        });
    }

    removeFile(file) {
        const accepted = this.state.accepted.filter(entry => {
            return (entry.name === file.name) ? null : entry;
        });

        this.setState({accepted: accepted});
    }

    handleFiles(accepted, rejected) {
        const media = Object.assign([], this.state.accepted);
        media.push(...accepted);

        this.setState({accepted: media});
    }

    handleTextAreaEnter(text) {
        this.props.callback(text, this.state.accepted);

        this.state.accepted.forEach(file => window.URL.revokeObjectURL(file.preview));
        this.setState({accepted: [], rejected: []});
    }

    render() {

        return (
            <div className='media-upload'>
                <EmojiBox id='new-media-upload'
                          callback={this.handleTextAreaEnter.bind(this)}
                          mediaupload={(event)=>{
                              event.preventDefault();
                              $(`#media-upload-id`).collapse('toggle');
                          }}
                          youtube={(event)=>{
                              event.preventDefault();
                              $(`#youtube-upload-id`).collapse('toggle');
                          }}
                          vimeo={(event)=>{
                              event.preventDefault();
                              $(`#vimeo-upload-id`).collapse('toggle');
                          }}
                          soundcloud={(event)=>{
                              event.preventDefault();
                              $(`#soundcloud-upload-id`).collapse('toggle');
                          }}
                />

                <div id='media-upload-id'  className="collapse">
                    <div id='media-preview' className='media-upload-preview' ref={() => {
                        const mediapreview = document.getElementById('media-preview');
                        if (mediapreview != null) {
                            Sortable.create(mediapreview, {animation: 150})
                        }
                    }}>
                        {this.renderPreview()}
                    </div>
                    <Dropzone className='media-upload-zone'
                              accept="image/jpeg, image/png, image/gif"
                              onDrop={this.handleFiles.bind(this)}>
                        <span className='justify-content-center'>Drag and Drop your files in this area or click for file selection..</span>
                        <i className="fa fa-file-image-o" aria-hidden="true"/>
                    </Dropzone>
                </div>

                <div id='youtube-upload-id' className="collapse">
                    <div className="input-group media-upload-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-youtube"/></span>
                        </div>
                        <input type="text" className="form-control" placeholder='Enter your Youtube Url here..'/>
                    </div>
                </div>

                <div id='vimeo-upload-id' className="collapse">
                    <div className="input-group media-upload-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-vimeo-square"/></span>
                        </div>
                        <input type="text" className="form-control" placeholder='Enter your VimeoUrl here..'/>
                    </div>
                </div>

                <div id='soundcloud-upload-id' className="collapse">
                    <div className="input-group media-upload-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-soundcloud"/></span>
                        </div>
                        <input type="text" class="form-control" placeholder='Enter your Soundcloud Url here..'/>
                    </div>
                </div>

            </div>
        );
    }
}

export default MediaUpload;