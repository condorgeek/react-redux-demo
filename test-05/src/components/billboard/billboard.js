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
import moment from 'moment';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserLink from '../public/user-link';
import PostContent from '../post/post-content';
import PostComment from '../comment/post-comment';
import {
    asyncCreatePost,
    asyncFetchPosts,
    asyncFetchPostsPage,
    asyncAddFollowee,
    asyncAddFriend,
    asyncDeleteMedia,
} from '../../actions/index';
import {localDeleteMedia, localUpdateMedia} from '../../actions/spaces';
import {showVisibleImages, showForceVisibleImages} from "../../actions/image-handler";
import YoutubePlayer from '../players/youtube-player';
import VimeoPlayer from '../players/vimeo-player';
import SoundcloudPlayer from "../players/soundcloud-player";

import MediaUpload from './media-upload';
import MediaGallery from '../headlines/media-gallery';
import axios from 'axios';
import {authConfig} from "../../actions/local-storage";
import {showTooltip} from "../../actions/tippy-config";
import {PLACEHOLDER} from "../../static";
import {getPostsUploadUrl, getPublicUser, getStaticImageUrl} from "../../actions/environment";
import {allowComments, isAuthorized, isSuperUser, isTransitioning} from "../../selectors";

const ONE_MINUTE = 1000 * 60;

class Billboard extends Component {

    constructor(props) {
        super(props);
        this.localstate = this.localstate.bind(this)({location: props.location, next: 0, first: true, last: false, moment: moment()});
        this.onScrollStop = this.onScrollStop.bind(this);
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
        this.props.asyncFetchPostsPage(username, spacename, 0, 8, page => {
            this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
        });

        OverlayScrollbars(document.getElementById('billboard-home'), {callbacks: {onScrollStop: this.onScrollStop}});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});
    }

    onScrollStop(event) {
        const {username, spacename} = this.props;
        const {next, last, first, when} = this.localstate.getState();

        const elem = event.target;
        showForceVisibleImages();

        // console.log('STOP', elem.scrollHeight, elem.scrollTop, elem.clientHeight, elem.scrollTop + elem.clientHeight);

        /* fetch next page of posts */
        if(!last && (elem.scrollTop + elem.clientHeight >= elem.scrollHeight)) {
            this.props.asyncFetchPostsPage(username, spacename, next , 8, page => {
                this.localstate.setState({next: page.number + 1, first: page.first, last: page.last});
            });

        } else if(elem.scrollTop === 0 && (!first || moment().diff(when) > ONE_MINUTE )) {
            this.props.asyncFetchPostsPage(username, spacename, 0, 8, page => {
                this.localstate.setState({next: page.number + 1, first: page.first, last: page.last, when: moment()});
            });
        }
    }

    uploadFiles(username, spacename, text, files) {
        const media = [];

        /* keep ordering of the files array as in idx */
        const uploaders = files.map((file, idx) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", text);

            return axios.post(getPostsUploadUrl(username), formData, authConfig())
            .then(response => {
                const uploaded = response.data;
                uploaded.position = idx;
                media.push(uploaded);
            });

        });

        axios.all(uploaders).then(() => {
            this.props.asyncCreatePost(username, {title: '', text: text, media: media}, spacename, post => {
                this.props.localUpdateMedia(post.media);
            });
        });
    }

    uploadEmbeddedVideo(username, spacename, text, embedded) {

        console.log('VIDEO', username, spacename, text, embedded);

        this.props.asyncCreatePost(username, {title: '', text: text, media: embedded}, spacename);
    }

    handleTextAreaEnter(text, files, embedded) {
        const {authorization, username, spacename} = this.props;
        const authname = authorization.user.username;
        const isSuperUser = authorization.user.isSuperUser;

        if (embedded.length > 0) {
            this.uploadEmbeddedVideo(isSuperUser ? username : authname, spacename, text, embedded);
        } else {
            this.uploadFiles(isSuperUser ? username : authname, spacename, text, files);
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

    renderThumbnails(images, postId, isAuthorized) {
        const ref = `postgallery${postId}`;

        return images.map((image, idx) => {
            const thumb = getStaticImageUrl(image.url);

            return (<div key={`${postId}-${idx}`} className="card-gallery-entry">
                <img src={PLACEHOLDER} data-src={thumb} onClick={() => this.refs[ref].renderLightbox(idx + 1)}/>
                {isAuthorized && this.renderDeleteIcon(postId, image.id)}
            </div>)
        })
    }

    renderImages(images, postId, isEditable, isAuthorized) {
        const first = getStaticImageUrl(images[0].url);
        const ref = `postgallery${postId}`;

        if (images.length > 2) {
            return (
                <div className='card-gallery'>
                    <div className="card-gallery-first">
                        <img className="card-img-top" src={PLACEHOLDER} data-src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                        {isAuthorized && isEditable && this.renderDeleteIcon(postId, images[0].id)}
                    </div>
                    <div className='card-gallery-row'>
                        {this.renderThumbnails(images.slice(1), postId, isAuthorized)}
                    </div>
                </div>);

        } else if (images.length === 2) {
            const second = getStaticImageUrl(images[1].url);

            return (
                <div className='card-gallery'>
                    <div className='card-gallery-row'>
                        <div className='card-gallery-twin'>
                            <img className="card-img-top" src={PLACEHOLDER} data-src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                            {isAuthorized && isEditable && this.renderDeleteIcon(postId, images[0].id)}
                        </div>
                        <div className='card-gallery-twin'>
                            <img className="card-img-top" src={PLACEHOLDER} data-src={second} onClick={() => this.refs[ref].renderLightbox(1)}/>
                            {isAuthorized && isEditable && this.renderDeleteIcon(postId, images[1].id)}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='card-gallery'>
                <div className='card-gallery-first'>
                    <img  className="card-img-top" src={PLACEHOLDER} data-src={first} onClick={() => this.refs[ref].renderLightbox(0)}/>
                    {isAuthorized && isEditable && this.renderDeleteIcon(postId, images[0].id)}
                </div>
            </div>
        );
    }

    renderMedia(post, isEditable, isAuthorized) {

        if (post.media.length > 0 && post.media[0].type === 'PICTURE') {
            return this.renderImages(post.media, post.id, isEditable, isAuthorized);
        }

        return post.media.map(media => {
            switch(media.type) {
                case 'PICTURE': {
                    const mediapath = getStaticImageUrl(media.url);
                    return <div key={media.id} className='card-placeholder'>
                        <img className='card-img' src="holderjs/400x300" data-src={mediapath}/>
                    </div>;
                }

                case 'YOUTUBE':
                    return <YoutubePlayer key={media.id} url={media.url} media={media}/>;

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
        const {authorization, configuration, allowComments, isAuthorized, isSuperUser} = this.props;

        console.log('ALLOW_COMMENTS', allowComments);

        return (posts.map(post => {
                const title = (post.title || '').toUpperCase();
                const mediapath = post.media.map(media => getStaticImageUrl(media.url));
                const isEditable = (authname === post.user.username) || isSuperUser;
                const hideFooter = !allowComments && post.user.username === getPublicUser();

                return (
                    <div key={post.id} className="card">

                        {!hideFooter && <div className='card-header'>
                            <div className="bottom-entry">

                                <UserLink post={post} allowComments={allowComments}/>

                                {isAuthorized && !isEditable && <div className="bottom-navigation">
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
                        </div>}

                        {this.renderMedia(post, isEditable, isAuthorized)}

                        <div className="card-body">
                            {title && <h4 className="card-title">{title}</h4>}
                            <div className="card-content">
                                <PostContent authorization={authorization} username={username} post={post}
                                             spacename={spacename} configuration={configuration}/>
                            </div>
                            {allowComments &&
                            <PostComment authorization={authorization} username={username} id={post.id}
                                         configuration={configuration}/>}
                        </div>

                        <MediaGallery media={mediapath} ref={`postgallery${post.id}`}/>

                    </div>
                );
            })
        );
    }

    render() {
        const {location} = this.localstate.getState();
        const {authorization, username, spacename, spaceId, genericdata, posts, configuration,
            isTransitioning, isAuthorized, isSuperUser} = this.props;

        if(isTransitioning) return null;

        const authname = authorization.user.username;
        const isEditable = (username === authname)
            || (genericdata && genericdata.isMember && spacename !== "home")
            || isSuperUser;

        if (location.pathname !== this.props.location.pathname) {
            this.localstate.setState({location: this.props.location});
            this.props.asyncFetchPostsPage(username, spacename, 0, 8, page => {
                this.localstate.setState({next: page.number + 1, first: page.first, last: page.last});
            });
        }

        if(!posts) return (<div className="comment-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        return (
            <div id="billboard-home" className='billboard-home-container' onScroll={
                event => {
                    showVisibleImages(event.target);
                }} ref={elem => {
                    showVisibleImages();
                }}>

                <div className={isEditable  ? 'card-columns' : 'd-none'}>
                    {isAuthorized && isEditable && <div className='card card-body'>
                        <MediaUpload id={spaceId}
                                     username={isSuperUser ? username : authname}
                                     callback={this.handleTextAreaEnter.bind(this)}/>
                    </div>}
                </div>

                <div className='card-columns'>
                    {this.renderPosts(authname, username, posts, spacename)}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {authorization: state.authorization,
        posts: state.posts,
        configuration: state.configuration,
        genericdata: state.genericdata ? state.genericdata.payload : state.genericdata,
        isTransitioning: isTransitioning(state),
        isAuthorized: isAuthorized(state),
        allowComments: allowComments(state),
        isSuperUser: isSuperUser(state)
    };
}

export default connect(mapStateToProps, {asyncFetchPosts, asyncFetchPostsPage, asyncCreatePost, asyncAddFollowee, asyncAddFriend,
    asyncDeleteMedia, localDeleteMedia, localUpdateMedia})(Billboard);