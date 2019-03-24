// Parameter documentation: https://developers.google.com/youtube/player_parameters#cc_load_policy

import React, {Component} from 'react';
import {PLACEHOLDER} from "../../static";
import {YOUTUBE_REGEX} from "../../actions/";

export default class YoutubePlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {clicked: false};
    }

    resolveUrl(media) {
        YOUTUBE_REGEX.lastIndex = 0;
        const videoId = YOUTUBE_REGEX.exec(media.url);

        return videoId && videoId.length > 1 ?
            `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&loop=1&controls=2&rel=0` :
            `${media.url}?autoplay=1&loop=1&controls=2&rel=0`
    }

    resolveThumbnail(media) {
        if(!media.thumbnail) {
            YOUTUBE_REGEX.lastIndex = 0;
            const videoId = YOUTUBE_REGEX.exec(media.url);

            return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : '';
        }
        return media.thumbnail;
    }

    renderVideo(media) {

        if (this.state.clicked) {
            return (
                <div className="embed-responsive embed-responsive-1by1">
                    <iframe className="embed-responsive-item"
                            src={this.resolveUrl(media)}
                            allowFullScreen/>
                </div>)
        }

        return (
            <a href='' onClick={event => {
                event.preventDefault();
                this.setState({clicked: true});
            }}>
                <img className="card-img" src={PLACEHOLDER} data-src={this.resolveThumbnail(media)}/>
            </a>
        );
    }

    render() {
        const {media} = this.props;

        return (
            <div className='youtube-player'>
                {media && this.renderVideo(media)}
            </div>
        );
    }
}