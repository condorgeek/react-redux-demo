import _ from 'lodash';
import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserLink from '../components/public/user-link';
import PostContent from '../components/post-content';
import PostComment from '../components/post-comment';
import {asyncFetchPosts, asyncCreatePost, ROOT_STATIC_URL, ROOT_SERVER_URL} from '../actions/index';
import YoutubePlayer from '../components/players/youtube-player';
import VimeoPlayer from '../components/players/vimeo-player';
import SoundcloudPlayer from "../components/players/soundcloud-player";

import MediaUpload from '../components/media-upload';
import MediaGallery from '../components/media-gallery';
import axios from 'axios';
import {authConfig} from "../actions/bearer-config";

class Billboard extends Component {

    constructor(props) {
        super(props);
        this.state = {username: this.props.username, space: this.props.space};
        this.localstate = this.localstate.bind(this)({location: props.location});
    }

    localstate(data) {
        let state = data;
        return {
            setState(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            getState() {
                return state;
            }
        }
    }

    componentDidMount() {
        const {username, space} = this.state;

        this.props.asyncFetchPosts(username, space);
        OverlayScrollbars(document.getElementById('billboard-home'), {});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});
    }

    uploadFiles(text, files) {
        const {username} = this.state;
        const media = [];
        const uploaders = files.map(file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", text);
            return axios.post(`${ROOT_SERVER_URL}/user/${username}/posts/upload`, formData, authConfig())
                .then(response => media.push(response.data));
        });

        axios.all(uploaders).then(() => {
            this.props.asyncCreatePost(username, {title: '', text: text, media: media});
        });
    }

    uploadEmbeddedVideo(text, embedded) {
        this.props.asyncCreatePost(this.state.username, {title: '', text: text, media: embedded});
    }

    handleTextAreaEnter(text, files, embedded) {
        if(embedded.length > 0) {
            this.uploadEmbeddedVideo(text, embedded);
        } else {
            this.uploadFiles(text, files);
        }
    }

    renderThumbnails(thumbnails, id) {
        const ref = `postgallery${id}`;

        return thumbnails.map((thumb, idx) => {
            const image = `${ROOT_STATIC_URL}/${thumb.url}`;

            return (<div className="card-gallery-entry">
                <img src={image}
                     onClick={() => this.refs[ref].renderLightbox(idx + 1)}
                />
            </div>)
        })
    }

    renderImages(images, id) {
        const first = `${ROOT_STATIC_URL}/${images[0].url}`;
        const ref = `postgallery${id}`;

        if (images.length > 2) {
            return (
                <div className='card-gallery'>
                    <img className='card-gallery-first' src={first}
                         onClick={() => this.refs[ref].renderLightbox(0)}
                    />
                    <div className='card-gallery-row'>
                        {this.renderThumbnails(images.slice(1), id)}
                    </div>
                </div>);

        } else if (images.length === 2) {
            const second = `${ROOT_STATIC_URL}/${images[1].url}`;

            return (
                <div className='card-gallery'>
                    <div className='card-gallery-row'>
                        <div className='card-gallery-twin'>
                            <img src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                        </div>
                        <div className='card-gallery-twin'>
                            <img src={second} onClick={() => this.refs[ref].renderLightbox(1)}/>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='card-gallery'>
                <img className='card-gallery-first' src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
            </div>
        );
    }

    renderMedia(post) {

        if (post.media.length > 0 && post.media[0].type === 'PICTURE') {
            return this.renderImages(post.media, post.id);
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
        const {posts, authorization, username} = this.props;
        const {location} = this.localstate.getState();

        if(location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchPosts(username, this.state.space);
        }

        return (_.map(posts, post => {
                const title = (post.title || '').toUpperCase();
                const mins = Math.floor((Math.random() * 59) + 1);
                const urls = post.media.map(media => `http://localhost:9000/${media.url}`);

                return (
                    <div key={post.id} className="card">

                        {this.renderMedia(post)}

                        <div className="card-body">
                            {title && <h5 className="card-title">{title}</h5>}
                            <div className="card-content">
                                <PostContent username={this.state.username} content={post.text || ''} id={post.id} likes={post.likes}/>
                            </div>
                            <PostComment authorization={authorization} username={this.state.username} id={post.id}/>
                        </div>

                        <div className="card-footer">
                            <UserLink user={post.user} min={mins}/>
                        </div>

                        <MediaGallery media={urls} ref={`postgallery${post.id}`}/>

                    </div>
                );
            })
        );
    }

    render() {

        console.log('BILLBOARD', this.props);

        return (
            <div id="billboard-home" className='billboard-home-container'>
                <div className='card-columns'>
                    <div className='card card-body'>
                        <MediaUpload username={this.state.username} callback={this.handleTextAreaEnter.bind(this)}/>
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
    return {authorization: state.authorization, posts: state.posts};
}

export default connect(mapStateToProps, {asyncFetchPosts, asyncCreatePost})(Billboard);