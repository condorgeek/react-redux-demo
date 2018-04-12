import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class YoutubePlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {clicked: false};
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.refs.youtube);
        console.log('youtube-placeholder', node);
    }

    embedUrl(url) {
        const videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        return videoid ? `https://www.youtube.com/embed/${videoid[1]}?autoplay=1&loop=1&controls=1&rel=0&origin=https://www.kikiriki.com` : '';
    }

    thumb(url) {
        const videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        return videoid ? `https://img.youtube.com/vi/${videoid[1]}/hqdefault.jpg` : '';
    }

    onClick(event) {
        event.preventDefault();
        this.setState({clicked: true});
    }

    renderVideo() {

        if (this.state.clicked) {
            return (
                <div className="embed-responsive embed-responsive-16by9">
                    <iframe className="embed-responsive-item" src={this.embedUrl(this.props.url)} allowFullScreen/>
                </div>);
        }
        return (
            <a href='' onClick={this.onClick.bind(this)}><img className="card-img" ref='youtube'
                 src={this.thumb(this.props.url)}
                 /></a>
        );
    }

    render() {
        return (
            <div>{this.renderVideo()}</div>
        );
    }
}