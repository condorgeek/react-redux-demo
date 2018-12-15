/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headlines.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 30.08.18 13:17
 */

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {randompic, randomvideo} from "../../static/index";
import YoutubePlayer from '../players/youtube-player';
import VimeoPlayer from '../players/vimeo-player';
import SoundcloudPlayer from "../players/soundcloud-player";
import MediaGallery from './media-gallery';

import {asyncFetchSpaceMedia} from '../../actions/spaces';
import {ROOT_STATIC_URL} from "../../actions";

class Headlines extends Component {

    constructor(props) {
        super(props);
        this.state = {videos: this.createMedia(), music: this.createMedia()};
        this.localstate = this.localstate.bind(this)({location: props.location});

        this.props.asyncFetchSpaceMedia(props.username, props.spaceId);
    }

    localstate(data) {
        let state = data;
        let tooltips = [];
        let media = [];
        return {
            setState(newstate) { state = {...state, ...newstate}; return state; },
            getState() {return state;},
            pushTooltip(tooltip) {tooltips.push(tooltip)},
            removeTooltips() {
                    tooltips.forEach(tooltip => {tooltip.destroy();}); tooltips = [];
                },
            pushMedia(path) {media.push(path)},
            removeMedia() {media = [] },
            getMedia() { return media }
        }
    }

    componentDidMount() {
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
        OverlayScrollbars(document.getElementById('music-container-id'), {});
        OverlayScrollbars(document.getElementById('videos-container-id'), {});
    }

    componentWillUnmount() {
        this.localstate.removeTooltips();
        this.localstate.removeMedia();
    }

    createMedia() {
        return Array(20).fill(0).map((idx) => {
            return randomvideo();
        })
    }

    renderPics(medialist) {

        if (!medialist) return (<div className="fa-2x">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        this.localstate.removeMedia();

        return medialist.filter(media => media.type === 'PICTURE').map((media, idx) => {
            const url = `${ROOT_STATIC_URL}/${media.url}`;
            this.localstate.pushMedia(url);

            return (<div key={idx} className="card">
                <img className="card-img-top" src={url}
                     onClick={() => this.refs.imagegallery.renderLightbox(idx)}/>
            </div>)
        })
    }


    renderVideos() {
        return this.state.videos.map((url, idx) => {
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if (match != null && match.length > 2 && match[2] === 'youtube.com') {
                return <div key={idx} className="card"><YoutubePlayer url={url}/></div>;

            } else if (match != null && match.length > 2 && match[2] === 'vimeo.com') {
                return <div key={idx} className="card"><VimeoPlayer url={url}/></div>;

            } else if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                return '';
            }
        })
    }

    renderMusic() {

        return this.state.music.map((url, idx) => {
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                return <SoundcloudPlayer key={idx} url={url}/>;
            } else return '';
        })
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, username, media, spacename, spaceId} = this.props;

        console.log('MEDIA', media);

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.removeMedia();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceMedia(username, spaceId);
            return "";
        }

        return (
            <div className='headlines-container'>
                <div className='headline'>
                    <h5>Pictures</h5>
                    <span onClick={() => this.refs.imagegallery.renderLightbox(0)}>
                        <i className="fa fa-th-large" aria-hidden="true"/>Picture Gallery</span>
                </div>
                <div id='pictures-container-id' className='pictures-container'>
                    <div className='card-columns'>
                        {this.renderPics(media)}
                    </div>
                </div>

                <div className='headline'>
                    <h5>Videos</h5>
                    <span onClick={() => this.refs.videogallery.renderLightbox(0)}>
                        <i className="fa fa-youtube-play" aria-hidden="true"/>Video Gallery</span>
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

                <MediaGallery media={this.localstate.getMedia()} ref='imagegallery'/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, media: state.media};
}

export default connect(mapStateToProps, {asyncFetchSpaceMedia})(Headlines);