/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [emoji-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 05.10.18 13:31
 */

import {bindRawTooltip} from "../../actions/tippy-config";
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {
    asyncCreatePostLike, asyncRemovePostLike, asyncAddFollowee, asyncAddFriend,
    asyncUpdatePost,
} from "../../actions/index";

import MediaUpload from "../billboard/media-upload";
import axios from 'axios';
import {authConfig} from "../../actions/local-storage";
import {localUpdateMedia} from "../../actions/spaces";
// import StarRating from "./star-rating";
import {getPostsUploadUrl, getStaticImageUrl} from "../../actions/environment";
import {isAuthorized, isSuperUser} from "../../selectors";
import SharePostButton from "./buttons/share-post-button";
import EditPostButton from "./buttons/edit-post-button";
import DeletePostButton from "./buttons/delete-post-button";


class LikeNavigation extends Component {

    constructor(props) {
        super(props);
        this.handleFriendshipAction = this.handleFriendshipAction.bind(this);
        this.handleTextAreaEnter = this.handleTextAreaEnter.bind(this);
        this.localstate = this.localstate.bind(this)(
            {indexedByReaction: null, liked: null, likedId: null, username: null});
    }

    localstate(data) {
        let state = data;
        let tooltips = [];
        return {
            set(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            get() {
                return state;
            },
            pushTooltip(tooltip) {
                tooltips.push(tooltip)
            },
            removeTooltips() {
                tooltips.forEach(tooltip => {
                    tooltip.destroy();
                });
                tooltips = [];
            }
        }
    }

    componentWillUnmount() {
        this.localstate.removeTooltips();
    }

    buildIndexByReaction(authname, likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};

        likes.forEach(like => {
            if (authname === like.user.username) {
                const localstate = this.localstate.set(
                    {username: authname, liked: like.reaction, likedId: like.id});
            }
            index[like.reaction].push(like);
        });
        return index;
    }

    handleFriendshipAction(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {action, authname, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, event.target, timestamp);
                event.stopPropagation();

                this.props.asyncAddFriend(authname, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', props, event.target, timestamp);
                event.stopPropagation();

                this.props.asyncAddFollowee(authname, username);
                return false;

            case 'LINK_TO':
                console.log('LINK_TO', username);
                event.stopPropagation();

                this.props.history.push(`/${username}/home`);
                return false;

            default:
                return;
        }
    }

    personAsLiteral(count) {
        return `${count} ${(count > 1) ? ' Persons' : ' Person'}`;
    }

    renderTooltip(reaction, likes) {

        const persons = (reaction === this.localstate.get().liked)
            ? (likes.length > 1) ? "You and " + this.personAsLiteral(likes.length - 1) : "You"
            : this.personAsLiteral(likes.length);

        return <div className="like-tooltip like-tooltip-scrollbar">
            <div className="like-tooltip-title">{reaction} {persons}</div>
            <ul className="like-tooltip-list">
                {this.renderTooltipEntries(likes)}
            </ul>
        </div>
    }

    renderTooltipEntries(likes) {

        return likes.map(like => {
            const avatar = getStaticImageUrl(like.user.avatar);
            const data = {authname: this.props.authname, username: like.user.username};

            return <li key={like.id} className="like-tooltip-entry">
                <span className="like-link" data-props={JSON.stringify({...data, action: 'LINK_TO'})}
                      onClick={(elem) => console.log(elem)}>
                    <img className='user-thumb' src={avatar}/>
                    {like.user.firstname} {like.user.lastname}
                </span>
                <div className="like-tooltip-buttons">
                    <button className="btn btn-tooltip btn-sm"
                            data-props={JSON.stringify({...data, action: 'ADD_FRIENDSHIP'})}>
                        Add friend
                    </button>
                    <button className="btn btn-tooltip btn-sm"
                            data-props={JSON.stringify({...data, action: 'FOLLOW_USER'})}>
                        Follow
                    </button>
                </div>
            </li>
        })
    }

    handleLikePost(event, reaction) {
        event.preventDefault();
        const {authname, username, postId} = this.props;

        this.props.asyncCreatePostLike(authname, postId, {username: authname, reaction: reaction});
    }

    handleUnlikePost(event, reaction) {
        event.preventDefault();
        const {authname, postId} = this.props;
        const {likedId} = this.localstate.get();

        this.props.asyncRemovePostLike(authname, postId, likedId, () => {
            this.localstate.set({liked: null, likedId: null, username: null});
        });
    }

    renderStatistics(indexedLikes, reaction) {

        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const tooltip = bindRawTooltip(elem, this.renderTooltip(reaction, indexedLikes[reaction]),
                             {callback: this.handleFriendshipAction, scrollbar: '.like-tooltip-scrollbar'});
                         this.localstate.pushTooltip(tooltip);
                     }}>
                    {indexedLikes[reaction].length}</div>
            </div> : ""
    }

    renderLikeEntries() {
        const {indexedByReaction, liked} = this.localstate.get();

        return ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'].map(reaction => {
            const selected = liked && reaction === liked;
            const disabled = liked && reaction !== liked;

            return (
                <div key={reaction} className="like-entry">
                    {!liked && <span className={`icon-${reaction.toLowerCase()} like-emoji`}
                                     onClick={event => this.handleLikePost(event, reaction)}/>}
                    {selected && <div className={`icon-${reaction.toLowerCase()} like-emoji like-emoji-selected`}
                                      onClick={event => this.handleUnlikePost(event, reaction)}>
                        <i className="fas fa-check"/></div>}
                    {disabled && <div className={`icon-${reaction.toLowerCase()} like-emoji-disabled`}/>}

                    {this.renderStatistics(indexedByReaction, reaction)}
                </div>
            )
        })
    }

    updatePostDataAndImages(authname, post, spacename, text, files) {
        const mediapath = [];

        /* upload images */
        const uploaders = files.map(file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", text);

            return axios.post(getPostsUploadUrl(authname), formData, authConfig())
            .then(response => mediapath.push(response.data));
        });

        /* update text and media */
        axios.all(uploaders).then(() => {
            this.props.asyncUpdatePost(authname, {text: text, media: mediapath}, post.id, updated => {
                if (post.media && mediapath.length) {
                    const reduced = updated.media.filter(media => post.media.every(m1 => m1.id !== media.id));
                    this.props.localUpdateMedia(reduced);
                }
                toastr.info(`You have updated a post in ${updated.space.name}`);
            })
        });
    }

    updatePostEmbeddedVideo(username, spacename, text, embedded) {
        /* nothing at the moment */
    }

    handleTextAreaEnter(text, files, embedded) {
        const {authname, post, spacename} = this.props;

        if (embedded.length > 0) {
            this.updatePostEmbeddedVideo(authname, spacename, text, embedded);
        } else {
            this.updatePostDataAndImages(authname, post, spacename, text, files);
        }
    }

    render() {
        const {
            authname, authorization, postId, post, likes, spaces, spacename, configuration,
            isAuthorized, isSuperUser
        } = this.props;

        likes && this.localstate.removeTooltips();
        likes && this.localstate.set({indexedByReaction: this.buildIndexByReaction(authname, likes)});

        const isEditable = authname === post.user.username;
        const isAdmin = authname === post.space.user.username;
        const allowLikes = isAuthorized || (configuration && configuration.public.likes === true);

        return (

            <div className="like-container" onClick={event => {
                // thru event bubbling generated in RawEditableBox
                this.portalRef && this.portalRef.close(event.target.id)
            }}>

                {allowLikes && <div className="like-navigation">
                    <div>
                        {this.renderLikeEntries()}
                        {(likes && likes.length > 0) &&
                        <div className="like-count">
                            <div className='badge badge-pill badge-light'>{likes.length}</div>
                        </div>}
                    </div>

                    {isAuthorized && <div className="like-content-navigation">
                        {/*{(isAdmin || isSuperUser) && <span className="like-content-stars">*/}
                        {/*    <StarRating post={this.props.post} authorization={authorization}/>*/}
                        {/*</span>}*/}

                        <SharePostButton authname={authname} postId={postId} spaces={spaces}/>

                        {(isEditable || isSuperUser) &&
                        <EditPostButton authname={authname} postId={postId} updateBoxId={`update-box-${postId}`}
                                        ref={elem => {
                                            this.portalRef = elem;
                                        }}>
                            <MediaUpload id={`post-${postId}`} text={post.text} username={authname}
                                         callback={this.handleTextAreaEnter} rawmode={true}/>
                        </EditPostButton>}

                        {(isEditable || isAdmin || isSuperUser) &&
                        <DeletePostButton authname={authname} postId={postId}/>}
                    </div>}

                </div>}

                <div className="update-box-marker" id={`update-box-${postId}`}/>

            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    likes: state.likes[ownProps.postId] ? state.likes[ownProps.postId] : [],
    spaces: state.spaces,
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
});

export default withRouter(connect(mapStateToProps, {
    asyncCreatePostLike, asyncRemovePostLike,
    asyncAddFollowee, asyncAddFriend, asyncUpdatePost, localUpdateMedia
})(LikeNavigation));