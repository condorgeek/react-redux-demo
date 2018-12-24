/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [billboard.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.09.18 21:01
 */

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserLink from '../public/user-link';
import PostContent from '../post/post-content';
import PostComment from '../comment/post-comment';
import {asyncCreatePost, asyncFetchPosts, asyncAddFollowee, asyncAddFriend, asyncDeleteMedia,
    ROOT_SERVER_URL, ROOT_STATIC_URL} from '../../actions/index';
import {localDeleteMedia, localUpdateMedia} from '../../actions/spaces';
import YoutubePlayer from '../players/youtube-player';
import VimeoPlayer from '../players/vimeo-player';
import SoundcloudPlayer from "../players/soundcloud-player";

import MediaUpload from './media-upload';
import MediaGallery from '../headlines/media-gallery';
import axios from 'axios';
import {authConfig} from "../../actions/bearer-config";
import {showTooltip} from "../../actions/tippy-config";


class Billboard extends Component {

    constructor(props) {
        super(props);
        this.localstate = this.localstate.bind(this)({location: props.location});
    }

    localstate(data) {
        let state = data;
        return {
            setState(newstate) {state = {...state, ...newstate}; return state; },
            getState() { return state; }
        }
    }

    componentDidMount() {
        const {username, spacename} = this.props;
        this.props.asyncFetchPosts(username, spacename);

        OverlayScrollbars(document.getElementById('billboard-home'), {});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});
    }


    uploadFiles(username, spacename, text, files) {
        const media = [];

        console.log('FILES', text);


        const uploaders = files.map(file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", text);

            return axios.post(`${ROOT_SERVER_URL}/user/${username}/posts/upload`, formData, authConfig())
                .then(response => media.push(response.data));
        });

        axios.all(uploaders).then(() => {
            this.props.asyncCreatePost(username, {title: '', text: text, media: media}, spacename, post => {
                this.props.localUpdateMedia(post.media);
            });
        });
    }

    uploadEmbeddedVideo(username, spacename, text, embedded) {
        this.props.asyncCreatePost(username, {title: '', text: text, media: embedded}, spacename);
    }

    handleTextAreaEnter(text, files, embedded) {
        const {username} = this.props.authorization.user;
        const {spacename} = this.props;

        if (embedded.length > 0) {
            this.uploadEmbeddedVideo(username, spacename, text, embedded);
        } else {
            this.uploadFiles(username, spacename, text, files);
        }
    }

    renderDeleteIcon(postId, mediaId) {
        const authname = this.props.authorization.user.username;

        return <i title="Delete image" className="fas fa-trash-alt" ref={elem => {
                    if(elem) showTooltip(elem);}
                } onClick={event => {
                    event.preventDefault();
                    this.props.asyncDeleteMedia(authname, postId, mediaId, post => {
                        this.props.localDeleteMedia([{id: mediaId}]);
                        toastr.info(`You have deleted an image from post ${post.id}`);
                    })
                }}/>
    }

    renderThumbnails(images, postId) {
        const ref = `postgallery${postId}`;

        return images.map((image, idx) => {
            const thumb = `${ROOT_STATIC_URL}/${image.url}`;

            return (<div key={`${postId}-${idx}`} className="card-gallery-entry">
                <img src={thumb} onClick={() => this.refs[ref].renderLightbox(idx + 1)}/>
                {this.renderDeleteIcon(postId, image.id)}
            </div>)
        })
    }

    renderImages(images, postId, isEditable) {
        const first = `${ROOT_STATIC_URL}/${images[0].url}`;
        const ref = `postgallery${postId}`;

        if (images.length > 2) {
            return (
                <div className='card-gallery'>
                    <div className="card-gallery-first">
                        <img src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                        {isEditable && this.renderDeleteIcon(postId, images[0].id)}
                    </div>
                    <div className='card-gallery-row'>
                        {this.renderThumbnails(images.slice(1), postId)}
                    </div>
                </div>);

        } else if (images.length === 2) {
            const second = `${ROOT_STATIC_URL}/${images[1].url}`;

            return (
                <div className='card-gallery'>
                    <div className='card-gallery-row'>
                        <div className='card-gallery-twin'>
                            <img src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                            {isEditable && this.renderDeleteIcon(postId, images[0].id)}
                        </div>
                        <div className='card-gallery-twin'>
                            <img src={second} onClick={() => this.refs[ref].renderLightbox(1)}/>
                            {isEditable && this.renderDeleteIcon(postId, images[1].id)}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='card-gallery'>
                <div className='card-gallery-first'>
                    <img  src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                    {isEditable && this.renderDeleteIcon(postId, images[0].id)}
                </div>
            </div>
        );
    }

    renderMedia(post, isEditable) {

        if (post.media.length > 0 && post.media[0].type === 'PICTURE') {
            return this.renderImages(post.media, post.id, isEditable);
        }

        return post.media.map(media => {
            switch(media.type) {
                case 'PICTURE': {
                    const mediapath = `${ROOT_STATIC_URL}/${media.url}`;
                    return <div key={media.id} className='card-placeholder'>
                        <img className='card-img' src={mediapath}/>
                    </div>;
                }

                case 'YOUTUBE':
                    return <YoutubePlayer key={media.id} url={media.url}/>;

                    case 'VIMEO':
                    return <VimeoPlayer key={media.id} url={media.url}/>;

                case 'SOUNDCLOUD':
                    return <SoundcloudPlayer key={media.id} url={media.url}/>;

                default:
                    return <div>Media not supported.. ({media.url})</div>
            }

        });

    }

    renderPosts(authname, username, posts, spacename) {
        const {authorization} = this.props;

        return (posts.map(post => {
                const title = (post.title || '').toUpperCase();
                const mediapath = post.media.map(media => `${ROOT_STATIC_URL}/${media.url}`);
                const isEditable = authname === post.user.username;

                return (
                    <div key={post.id} className="card">

                        {this.renderMedia(post, isEditable)}

                        <div className="card-body">
                            {title && <h5 className="card-title">{title}</h5>}
                            <div className="card-content">
                                <PostContent authorization={authorization} username={username} post={post} spacename={spacename}/>
                            </div>
                            <PostComment authorization={authorization} username={username} id={post.id}/>
                        </div>

                        <div className="card-footer">
                            <div className="bottom-entry">

                                <UserLink post={post}/>

                                {!isEditable && <div className="bottom-navigation">
                                    <button title={`Add ${post.user.firstname} as friend`} type="button" className="btn btn-darkblue btn-sm"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                this.props.asyncAddFriend(authname, post.user.username);
                                            }}
                                            ref={(elem)=> {
                                                if (elem === null) return;
                                                showTooltip(elem);
                                            }}><i className="fas fa-user-plus"/>
                                    </button>
                                    <button title={`Follow ${post.user.firstname}`} type="button" className="btn btn-darkblue btn-sm"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                this.props.asyncAddFollowee(authname, post.user.username);
                                            }}
                                            ref={(elem)=> {
                                                if (elem === null) return;
                                                showTooltip(elem);
                                            }}>
                                        <span className="fa-layers fa-fw">
                                            <i className="fas fa-user"/>
                                            <i className="fas fa-angle-right" data-fa-transform="shrink-12"/>
                                        </span>
                                    </button>
                                    <button title={`Block ${post.user.firstname}`} type="button" className="btn btn-darkblue btn-sm"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                console.log('Block user');
                                            }}
                                            ref={(elem)=> {
                                                if (elem === null) return;
                                                showTooltip(elem);
                                            }}><i className="fas fa-user-slash"/>
                                    </button>
                                </div>}

                            </div>
                        </div>

                        <MediaGallery media={mediapath} ref={`postgallery${post.id}`}/>

                    </div>
                );
            })
        );
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, username, spacename, spaceId, genericdata, posts} = this.props;
        const authname = authorization.user.username;
        const isEditable = (username === authname) || (genericdata && genericdata.isMember && spacename !== "home");

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchPosts(username, spacename);
        }

        if(!posts) return (<div className="comment-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        return (
            <div id="billboard-home" className='billboard-home-container'>

                <div className={isEditable ? 'card-columns' : 'd-none'}>
                    <div className='card card-body'>
                        {isEditable && <MediaUpload id={spaceId} username={authname} callback={this.handleTextAreaEnter.bind(this)}/>}
                    </div>
                </div>

                <div className='card-columns'>
                    {this.renderPosts(authname, username, posts, spacename)}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization, posts: state.posts,
        genericdata: state.genericdata ? state.genericdata.payload : state.genericdata};
}

export default connect(mapStateToProps, {asyncFetchPosts, asyncCreatePost, asyncAddFollowee, asyncAddFriend,
    asyncDeleteMedia, localDeleteMedia, localUpdateMedia})(Billboard);