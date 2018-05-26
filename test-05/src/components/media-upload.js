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
                <i className="fa fa-times" aria-hidden="true" onClick={()=>{this.removeFile(file)}}/>
            </div>);
        });
    }

    removeFile(file) {
        const accepted = this.state.accepted.filter(entry =>{
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
                <span>Enter some Kikirikii..</span>
                <EmojiBox id='new-media-upload' callback={this.handleTextAreaEnter.bind(this)}/>

                <div id='media-preview' className='media-upload-preview' ref={() => {
                    const mediapreview = document.getElementById('media-preview');
                    if (mediapreview != null) {
                        Sortable.create(mediapreview, {animation: 150})
                    }
                }
                }>
                    {this.renderPreview()}

                </div>
                <Dropzone className='media-upload-zone'
                          accept="image/jpeg, image/png, image/gif"
                          onDrop={this.handleFiles.bind(this)}>
                    <span className='justify-content-center'>Drag and Drop your files in this area or click for file uploader..</span>
                    <i className="fa fa-file-image-o" aria-hidden="true"/>
                </Dropzone>
            </div>
        );
    }
}

export default  MediaUpload;