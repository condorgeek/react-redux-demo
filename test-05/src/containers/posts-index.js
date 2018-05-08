import _ from 'lodash';
import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';
// import {Player} from '../../node_modules/video-react';
import YoutubePlayer from '../components/youtube-player';
import VimeoPlayer from '../components/vimeo-player';
import SoundcloudPlayer from "../components/soundcloud-player";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconLink from '../components/util/icon-link';
import AuthorLink from '../components/author-link';
import {randompic, randomvideo, userthumb} from "../static/index";
import HeartToggler from '../components/heart-toggler';
import PostContent from '../components/post-content';
import PostComment from '../components/post-comment';
import {fetchPosts} from '../actions/index';

class PostsIndex extends Component {

    componentDidMount() {
        this.props.fetchPosts();
        OverlayScrollbars(document.getElementById('global-space'), {});
        OverlayScrollbars(document.getElementsByClassName('new-comment'), {});
    }

    renderMedia(post) {
        const mediatype = Math.floor((Math.random() * 2) + 1) - 1;

        if (mediatype === 0) {
            const picture = randompic();
            return (
                <div className='card-placeholder'>
                    <a title={picture} href={`/posts/${post.id}`}>
                        <img className="card-img" src={picture}/>
                    </a>
                </div>);
        } else {
            const url = randomvideo();
            const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

            if(match != null && match.length > 2 && match[2] === 'youtube.com') {
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
        const names = ['Jack London', 'Thomas Right', 'Lena Deutsch', 'Barbara Stevens'];

        return (_.map(this.props.posts, post => {

                const title = (post.title || '').toUpperCase();
                const mins = Math.floor((Math.random() * 59) + 1);
                const name = names[Math.floor((Math.random() * 4) + 1) - 1];

                return (
                    <div className="card">

                            {this.renderMedia(post)}

                        <div className="card-body">

                            <h5 className="card-title">{title}</h5>
                            <div className="card-content">
                                <PostContent content={post.text || ''} id={post.id}/>
                            </div>

                            <PostComment id={post.id}/>

                            <div className='card-link'>
                                <IconLink to={`/posts/${post.id}`} icon='fa-id-card-o'>
                                    <span className='text'>Details</span>
                                </IconLink>
                                <span><HeartToggler/></span>
                            </div>

                        </div>

                        <div className="card-footer">
                            <div className='user-thumb-wrapper'>
                                <AuthorLink img={userthumb()}
                                            name={name}
                                            to={`/author/${name}/${post.id}`}/>
                                <span className='text'>{mins} min</span>
                            </div>
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

                <h3>Global Space</h3>

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

export default connect(mapStateToProps, {fetchPosts})(PostsIndex);