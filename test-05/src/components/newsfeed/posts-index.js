/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [posts-index.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 05.10.18 20:23
 */

import _ from 'lodash';
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
// import {Player} from '../../node_modules/video-react';
import YoutubePlayer from '../players/youtube-player';
import VimeoPlayer from '../players/vimeo-player';
import SoundcloudPlayer from "../players/soundcloud-player";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconLink from '../util/icon-link';
import UserLink from '../public/user-link';
import {randompic, randomvideo} from "../../static/index";
// import HeartToggler from '../components/heart-toggler';
import PostContent from '../billboard/post-content';
import PostComment from '../billboard/post-comment';
import {asyncFetchPosts} from '../../actions/index';
import  ImageZoom from 'react-medium-image-zoom';

class PostsIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {username: this.props.username, space: this.props.space};
    }

    componentDidMount() {
        const {username, space} = this.state;

        this.props.asyncFetchPosts(username, space);
        OverlayScrollbars(document.getElementById('global-space'), {});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});

        const { match, location, history } = this.props;

        console.log(match, location, history);
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

                                <PostContent username={this.state.username} content={post.text || ''} id={post.id}
                                             likes={post.likes} created={post.created}/>
                            </div>

                            <PostComment id={post.id}/>

                            {/*<div className='card-link'>*/}
                                {/*<IconLink to={`/posts/${post.id}`} icon='fa-id-card-o'>*/}
                                    {/*<span className='text'>Details</span>*/}
                                {/*</IconLink>*/}
                                {/*<span><HeartToggler/></span>*/}
                            {/*</div>*/}

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
            <div id="global-space" className='body-container'>
                <div className='float-right'>
                    <IconLink to='/posts/new' icon='fa-plus-square'>Add a Post</IconLink>
                </div>

                <h3>Public Space</h3>

                <div className='card-columns'>
                    {/*<Player*/}
                    {/*playsInline*/}
                    {/*poster="/assets/poster.png"*/}
                    {/*src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"*/}
                    {/*/>*/}
                    {this.renderPosts()}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {posts: state.posts};
}

export default connect(mapStateToProps, {asyncFetchPosts})(PostsIndex);