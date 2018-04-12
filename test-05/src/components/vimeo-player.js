import React, {Component} from 'react';

export default class VimeoPlayer extends Component {

    embedUrl(url) {
        const videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?vimeo(?:be)?\.(?:com)(?:\/watch\?v=|\/)([^\s&]+)/);

        console.log('VIMEO ID', videoid);

        return videoid ? `https://player.vimeo.com/video/${videoid[1]}?byline=0&portrait=0` : '';
    }

    render() {
        return (
            <div className="embed-responsive embed-responsive-1by1">
                <iframe className="embed-responsive-item"
                        src={this.embedUrl(this.props.url)}
                        webkitallowfullscreen mozallowfullscreen allowFullScreen/>
            </div>);
    }
}