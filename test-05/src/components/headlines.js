import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {randompic, randomvideo} from "../static";
import YoutubePlayer from '../components/youtube-player';
import VimeoPlayer from '../components/vimeo-player';
import SoundcloudPlayer from "../components/soundcloud-player";

export default class Headlines extends Component {

    componentDidMount() {
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
        OverlayScrollbars(document.getElementById('music-container-id'), {});
        OverlayScrollbars(document.getElementById('videos-container-id'), {});
    }

    renderPics() {
        return Array(20).fill(0).map((idx) => {
            return (<div className="card">
                <img className="card-img-top" src={randompic()}/>
            </div>)
        })
    }

    renderVideos() {
        return Array(8).fill(0).map((idx) => {
            const url = randomvideo();
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
        return Array(8).fill(0).map((idx) => {
            const url = randomvideo();
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                return <SoundcloudPlayer url={url}/>;
            } else return '';
        })
    }

    render() {
        return (
            <div className='headlines-container'>
                <h5>Pictures</h5>
                <div id='pictures-container-id' className='pictures-container'>
                    <div className='card-columns'>
                        {this.renderPics()}
                    </div>
                </div>
                <h5>Videos</h5>
                <div id='videos-container-id' className='videos-container'>
                    <div className='card-columns'>
                        {this.renderVideos()}
                    </div>
                </div>
                <h5>Music</h5>
                <div id='music-container-id' className='music-container'>
                    <div className='card-columns'>
                        {this.renderMusic()}
                    </div>
                </div>

            </div>
        );
    }
}