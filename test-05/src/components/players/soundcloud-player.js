// documentation
// https://developers.soundcloud.com/docs/api/html5-widget
// https://w.soundcloud.com/player/api_playground.html

import React, {Component} from 'react';

export default class SoundcloudPlayer extends Component {


    embedUrl(url) {
        return `https://w.soundcloud.com/player/?url=${url}&show_artwork=true&auto_play=false&buying=false&sharing=false&single_active=true`;
    }

    render() {
        return (
            <div className='soundcloud-player'>
                <iframe src={this.embedUrl(this.props.url)}
                        width="100%" height="166" scrolling="no" frameBorder="no">
                </iframe>
            </div>
        );
    }
}