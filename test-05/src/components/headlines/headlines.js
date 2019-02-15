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

import YoutubePlayer from '../players/youtube-player';
import VimeoPlayer from '../players/vimeo-player';
import SoundcloudPlayer from "../players/soundcloud-player";
import MediaGallery from './media-gallery';

import {asyncFetchSpaceMedia} from '../../actions/spaces';
import {
    LOGIN_STATUS_ERROR,
    LOGIN_STATUS_LOGOUT,
    LOGIN_STATUS_REQUEST,
    LOGIN_STATUS_SUCCESS,
    ROOT_STATIC_URL
} from "../../actions";
import HeadlinesUserEditor from "./headlines-user-editor";
import {Widget} from "../sidebar/widget";

class Headlines extends Component {

    constructor(props) {
        super(props);
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

    renderVideos(medialist) {
        return medialist.filter(media => ['YOUTUBE', 'VIMEO'].some(v => v === media.type)).map((media, idx) => {
            switch(media.type) {
                case 'YOUTUBE':
                    return <div key={idx} className="card"><YoutubePlayer url={media.url}/></div>;

                case 'VIMEO':
                    return <div key={idx} className="card"><VimeoPlayer url={media.url}/></div>;

                default: return '';
            }
        })
    }

    renderMusic(medialist) {
        return medialist.filter(media => media.type === 'SOUNDCLOUD').map((media, idx) => {
                return <SoundcloudPlayer key={idx} url={media.url}/>;
        })
    }

    isTransitioning(authorization) {
        return authorization.status === LOGIN_STATUS_REQUEST || authorization.status === LOGIN_STATUS_LOGOUT ||
            authorization.status === LOGIN_STATUS_ERROR;
    }

    renderTopWidgets(widgets) {
        if(!widgets) return '';
        return widgets.filter(widget => widget.pos === 'LTOP').map(widget => {
            return <Widget widget={widget}/>
        })
    }

    renderBottomWidgets(widgets) {
        if(!widgets) return '';
        return widgets.filter(widget => widget.pos === 'LBOTTOM').map(widget => {
            return <Widget widget={widget}/>
        })
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, username, media, spacename, spaceId, widgets} = this.props;
        const isAuthorized = authorization.status === LOGIN_STATUS_SUCCESS;

        if(this.isTransitioning(authorization)) return '';

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.removeTooltips();
            this.localstate.removeMedia();
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchSpaceMedia(username, spaceId);
            return "";
        }

        return (
            <div className='headlines-container'>

                <HeadlinesUserEditor authname={authorization.user.username} spaceId={spaceId} isAuthorized={isAuthorized}/>

                <div className="widget-container">
                    {this.renderTopWidgets(widgets)}
                </div>

                <div className='headline'>
                    <h6><i className="fa fa-windows" aria-hidden="true"/> Pictures</h6>
                </div>
                <div id='pictures-container-id' className='pictures-container'>
                    <div className='card-columns'>
                        {this.renderPics(media)}
                    </div>
                </div>

                <div className='headline'>
                    <h6><i className="fa fa-youtube-play" aria-hidden="true"/> Videos</h6>
                </div>

                <div id='videos-container-id' className='videos-container'>
                    <div className='card-columns'>
                        {this.renderVideos(media)}
                    </div>
                </div>

                <div className='headline'>
                    <h6><i className="fa fa-soundcloud" aria-hidden="true"/> Music</h6>
                </div>
                <div id='music-container-id' className='music-container'>
                    <div className='card-columns'>
                        {this.renderMusic(media)}
                    </div>
                </div>

                <MediaGallery media={this.localstate.getMedia()} ref='imagegallery'/>

                <div className="widget-container pt-4">
                    {this.renderBottomWidgets(widgets)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, media: state.media,
        widgets: state.widgets
    };
}

export default connect(mapStateToProps, {asyncFetchSpaceMedia})(Headlines);