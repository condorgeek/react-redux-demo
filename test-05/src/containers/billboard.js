import _ from 'lodash';
import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserLink from '../components/public/user-link';
import PostContent from '../components/post-content';
import PostComment from '../components/post-comment';
import {fetchPosts, createPost} from '../actions/index';
import YoutubePlayer from '../components/youtube-player';
import VimeoPlayer from '../components/vimeo-player';
import SoundcloudPlayer from "../components/soundcloud-player";

import MediaUpload from '../components/media-upload';

class Billboard extends Component {

    componentDidMount() {
        this.props.fetchPosts(this.props.space);
        OverlayScrollbars(document.getElementById('billboard-home'), {});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});
    }

    handleTextAreaEnter(text, files) {
        const media = files.map(file => {
            return {url: file.name, type: 'PICTURE'}
        });
        this.props.createPost({title: '', text: text, media: media});
    }

    renderThumbnails(thumbnails) {

        return thumbnails.map((thumb, idx) => {
            const image = `http://localhost:9000${thumb.url}`;

            return (<div className="card-gallery-entry">
                <img src={image}/>
                {/*onClick={() => this.refs.imagegallery.renderLightbox(idx)}/>*/}
            </div>)
        })
    }

    renderImages(images) {
        const first = `http://localhost:9000${images[0].url}`;

        if (images.length > 2) {
            return (
                <div className='card-gallery'>
                    <img className='card-gallery-first' src={first}/>
                    <div className='card-gallery-row'>
                        {this.renderThumbnails(images.slice(1))}
                    </div>
                </div>);

        } else if (images.length === 2) {
            const second = `http://localhost:9000${images[1].url}`;

            return (
                <div className='card-gallery'>
                    <div className='card-gallery-row'>
                        <img className='card-gallery-first' src={first}/>
                        <img className='card-gallery-first' src={second}/>
                    </div>
                </div>
            );
        }

        return (
            <div className='card-gallery'>
                <img className='card-gallery-first' src={first}/>
            </div>
        );
    }

    renderMedia(post) {

        if (post.media.length > 0 && post.media[0].type === 'PICTURE') {
            return this.renderImages(post.media);
        }

        return post.media.map(media => {
            if (media.type === 'PICTURE') {
                const picture = `http://localhost:9000${media.url}`;
                return (
                    <div className='card-placeholder'>
                        <img className='card-img' src={picture}/>
                    </div>);

            } else {
                const match = media.url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

                if (match != null && match.length > 2 && match[2] === 'youtube.com') {
                    return <YoutubePlayer url={media.url}/>;

                } else if (match != null && match.length > 2 && match[2] === 'vimeo.com') {
                    return <VimeoPlayer url={media.url}/>;

                } else if (match != null && match.length > 2 && match[2] === 'soundcloud.com') {
                    return <SoundcloudPlayer url={media.url}/>;
                }

                return <div>Media not supported.. ({media.url})</div>;
            }
        });

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