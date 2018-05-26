import _ from 'lodash';
import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserLink from '../components/public/user-link';
import {randompic, randomvideo} from "../static/index";
import PostContent from '../components/post-content';
import PostComment from '../components/post-comment';
import {fetchPosts, createPost} from '../actions/index';
import YoutubePlayer from '../components/youtube-player';
import VimeoPlayer from '../components/vimeo-player';
import SoundcloudPlayer from "../components/soundcloud-player";
import ImageZoom from 'react-medium-image-zoom';

import MediaUpload from '../components/media-upload';

class Billboard extends Component {

    componentDidMount() {
        this.props.fetchPosts(this.props.space);
        OverlayScrollbars(document.getElementById('billboard-home'), {});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});
    }

    handleTextAreaEnter(text, files) {
        const media = files.map(file => {return {url: file.name, type: 'PICTURE'}});
        this.props.createPost({title: '', text: text, media: media});
    }

    renderMedia(post) {
        const mediatype = Math.floor((Math.random() * 2) + 1) - 1;

        if (mediatype === 0) {
            const picture = randompic();
            return (
                <div className='card-placeholder'>
                    <ImageZoom image={{
                        src: picture,
                        alt: `/posts/${post.id}`,
                        className: 'card-img',
                        // style: { width: '50em' }
                    }}/>
                </div>);
        } else {
            const url = randomvideo();
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if (match != null && match.length > 2 && match[2] === 'youtube.com') {
                return <YoutubePlayer url={url}/>;

            } else if (match != null && match.length > 2 && match[2] === 'vimeo.com') {
                return <VimeoPlayer url={url}/>;

            } else if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                return <SoundcloudPlayer url={url}/>;
            }

            return <div>Media not supported.. ({url})</div>;
        }
    }

    renderPosts() {

        return (_.map(this.props.posts, post => {
                const title = (post.title || '').toUpperCase();
                const mins = Math.floor((Math.random() * 59) + 1);

                return (
                    <div key={post.id} className="card">

                        {this.renderMedia(post)}

                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                            <div className="card-content">
                                <PostContent content={post.text || ''} id={post.id} likes={post.likes}/>
                            </div>
                            <PostComment id={post.id}/>
                        </div>

                        <div className="card-footer">
                            <UserLink user={post.user} min={mins}/>
                        </div>
                    </div>
                );
            })
        );
    }

    render() {
        return (
            <div id="billboard-home" className='billboard-home-container'>
                {/*<div className='float-right'>*/}
                {/*<IconLink to='/posts/new' icon='fa-plus-square'>Add a Post</IconLink>*/}
                {/*</div>*/}
                {/*<h3>Amaru's Space</h3>*/}

                <div className='card-columns'>
                    <div className='card card-body'>
                        <MediaUpload callback={this.handleTextAreaEnter.bind(this)}/>
                    </div>
                </div>
                <div className='card-columns'>
                    {this.renderPosts()}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {posts: state.posts};
}

export default connect(mapStateToProps, {fetchPosts, createPost})(Billboard);