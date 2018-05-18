import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {randompic, randomvideo} from "../static";
import YoutubePlayer from '../components/youtube-player';
import VimeoPlayer from '../components/vimeo-player';
import SoundcloudPlayer from "../components/soundcloud-player";
import Lightbox from '../vendor/image-lightbox';


class MediaGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {media: this.props.media, index: 0, open: false};
    }

    renderLightbox(index) {
        this.setState({open: true, index: index});
    }

    render() {
        const {media, index, open} = this.state;
        if (open) {
            return (
                <Lightbox
                    mainSrc={media[index]}
                    nextSrc={media[(index + 1) % media.length]}
                    prevSrc={media[(index + media.length - 1) % media.length]}
                    onCloseRequest={() => this.setState({open: false})}
                    onMovePrevRequest={() => {
                        const previous = (index + media.length - 1) % media.length;
                        this.setState({index: previous})
                    }
                    }
                    onMoveNextRequest={() => {
                        const next = (index + 1) % media.length;
                        this.setState({index: next})
                    }
                    }/>
            );
        }
        return '';
    }
}

export default class Headlines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: this.createPics(), videos: this.createMedia(), music: this.createMedia()
        };
    }

    componentDidMount() {
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
        OverlayScrollbars(document.getElementById('music-container-id'), {});
        OverlayScrollbars(document.getElementById('videos-container-id'), {});
    }

    createPics() {
        return Array(20).fill(0).map((idx) => {
            return randompic();
        })
    }

    createMedia() {
        return Array(20).fill(0).map((idx) => {
            return randomvideo();
        })
    }

    renderPics() {
        const {images} = this.state;

        return images.map((image, idx) => {
            return (<div className="card">
                <img className="card-img-top" src={image}
                     onClick={() => this.refs.imagegallery.renderLightbox(idx)}/>
            </div>)
        })
    }

    renderVideos() {
        return this.state.videos.map((url, idx) => {
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if (match != null && match.length > 2 && match[2] === 'youtube.com') {
                return <div className="card"><YoutubePlayer url={url}/></div>;

            } else if (match != null && match.length > 2 && match[2] === 'vimeo.com') {
                return <div className="card"><VimeoPlayer url={url}/></div>;

            } else if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                return '';
            }
        })
    }

    renderMusic() {

        return this.state.music.map((url, idx) => {
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                return <SoundcloudPlayer url={url}/>;
            } else return '';
        })
    }

    render() {

        return (
            <div className='headlines-container'>
                <div className='headline'>
                    <h5>Pictures</h5>
                    <span onClick={() => this.refs.imagegallery.renderLightbox(0)}>
                        <i className="fa fa-th-large" aria-hidden="true"/>Picture Gallery</span>
                </div>
                <div id='pictures-container-id' className='pictures-container'>
                    <div className='card-columns'>
                        {this.renderPics()}
                    </div>
                </div>

                <div className='headline'>
                    <h5>Videos</h5>
                    <span><i className="fa fa-youtube-play" aria-hidden="true"/>Video Gallery</span>
                </div>

                <div id='videos-container-id' className='videos-container'>
                    <div className='card-columns'>
                        {this.renderVideos()}
                    </div>
                </div>

                <div className='headline'>
                    <h5>Music</h5>
                    <span><i className="fa fa-soundcloud" aria-hidden="true"/>Music Gallery</span>
                </div>
                <div id='music-container-id' className='music-container'>
                    <div className='card-columns'>
                        {this.renderMusic()}
                    </div>
                </div>

                <MediaGallery media={this.state.images} ref='imagegallery'/>
            </div>
        );
    }
}