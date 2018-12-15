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

import {bindRawTooltip, showTooltip} from "../../actions/tippy-config";
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {asyncCreatePostLike, asyncRemovePostLike, asyncAddFollowee, asyncAddFriend,
    asyncDeletePost, asyncSharePost, asyncUpdatePost, ROOT_SERVER_URL} from "../../actions/index";

import {ROOT_STATIC_URL} from "../../actions";
import MediaUpload from "../billboard/media-upload";
import axios from 'axios';
import {authConfig} from "../../actions/bearer-config";
import {localDeleteMedia, localUpdateMedia} from "../../actions/spaces";

class _ButtonSharePost extends Component {

    constructor(props) {
        super(props);
        this.handleShareAction = this.handleShareAction.bind(this);
        this.tooltips = [];
    }

    componentWillUnmount() {
        this.tooltips.forEach(tooltip => {tooltip.destroy();}); this.tooltips = [];
    }

    handleShareAction(event, data, timestamp, tooltip) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {action, authname, username, space, postId} = props;

        switch (action) {
            case 'SHARE_POST':
                event.stopPropagation();

                this.props.asyncSharePost(authname, space.id, postId, {comment: `Some comment. Glad to share..`}, post => {
                    toastr.info(`You have shared a post in ${space.name}`);
                });

                tooltip.destroy();
                return false;

            case 'LINK_TO':
                event.stopPropagation();
                this.props.history.push(`/${username}/space/${space.id}`);

                tooltip.destroy();
                return false;

            case 'CANCEL':
                event.stopPropagation();
                tooltip.destroy();
                return false;

            default:
                return;
        }
    }

    renderShareTooltip(spaces, postId) {

        const data = {};
        return <div className="like-tooltip spaces-tooltip spaces-tooltip-scrollbar">
            <div className="like-tooltip-title">Select a space for sharing
                <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'CANCEL'})}>
                    {/*<i className="fas fa-times"/>*/}Cancel
                </button>
            </div>

            <ul className="like-tooltip-list">
                {this.renderShareEntries(spaces, postId)}
            </ul>
        </div>
    }

    renderShareEntries(spaces, postId) {

        return spaces.map(space => {
            const cover = `${ROOT_STATIC_URL}/${space.cover}`;
            const data = {authname: this.props.authname, username: space.user.username, space: space, postId: postId};

            return <li key={space.id} className="like-tooltip-entry">
                <span className="like-link" data-props={JSON.stringify({...data, action: 'LINK_TO'})}>
                    <img className='cover-thumb' src={cover}/>
                    {space.name}
                </span>
                <div className="like-tooltip-buttons">
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'SHARE_POST'})}>
                        Share
                    </button>
                </div>
            </li>
        })
    }

    render() {
        const {authname, postId, spaces} = this.props;

        return <button title="Share this post" type="button" className="btn btn-darkblue btn-sm"
                onClick={(event) => {
                    event.preventDefault();
                    const tooltip = bindRawTooltip(event.currentTarget, this.renderShareTooltip(spaces, postId),
                        {callback: this.handleShareAction, trigger: 'click',
                            showOnInit: true, scrollbar: '.spaces-tooltip-scrollbar'});
                    this.tooltips.push(tooltip);
                }}
                ref={(elem)=> {
                    if (elem === null) return;
                    showTooltip(elem);
                }}

        ><i className="fas fa-share-alt"/>
        </button>
    }
}

const  ButtonSharePost = withRouter(connect(null, {asyncSharePost})(_ButtonSharePost));


class ButtonEditPost extends Component {

    constructor(props) {
        super(props);
        this.state = {isEditable: false}
    }

    renderUpdateBox(updateBoxId) {
        return this.state.isEditable ? ReactDOM.createPortal(this.props.children,
            document.getElementById(updateBoxId)) : '';
    }

    render() {
        const {authname, updateBoxId} = this.props;

        return <div className="edit-post d-inline"><button title="Edit this post" type="button" className="btn btn-darkblue btn-sm"
                           onClick={(event) => {
                               event.preventDefault();
                               this.setState({isEditable: !this.state.isEditable});
                               setTimeout(() => {
                                   if (document.activeElement !== document.body) document.activeElement.blur();
                               }, 500)
                           }}
                           ref={(elem) => {
                               if (elem === null) return;
                               showTooltip(elem);
                           }}><i className="fas fa-edit"/>
            </button>

            {this.renderUpdateBox(updateBoxId)}

        </div>
        }

}

class _ButtonDeletePost extends Component {

    constructor(props) {
        super(props);
        this.handleDeleteAction = this.handleDeleteAction.bind(this);
        this.tooltips = [];
    }

    componentWillUnmount() {
        this.tooltips.forEach(t => {t.destroy();}); this.tooltips = [];
    }

    renderDeleteTooltip(authname, postId) {
        const data = {authname: authname, postId: postId};

        return <div className="generic-tooltip-entry">
                Are you sure to delete this post ?
                <div className="generic-tooltip-buttons">
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'CANCEL'})}>
                        Cancel
                    </button>
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'DELETE_POST'})}>
                        Delete
                    </button>
                </div>
             </div>
    }

    handleDeleteAction(event, data, timestamp, tooltip) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {action, authname, postId} = props;

        switch (action) {
            case 'DELETE_POST':
                event.stopPropagation();

                this.props.asyncDeletePost(authname, postId, post => {
                    this.props.localDeleteMedia(post.media || []);
                    toastr.info(`You have deleted a post from ${post.user.firstname}`);
                });

                tooltip.destroy();
                return false;

            case 'CANCEL':
                event.stopPropagation();
                tooltip.destroy();
                return false;

            default:
                return;
        }
    }

    render() {
        const {authname, postId} = this.props;

        return <button title="Delete this post" type="button" className="btn btn-darkblue btn-sm"
                onClick={(event) => {
                    event.preventDefault();
                    const tooltip = bindRawTooltip(event.currentTarget, this.renderDeleteTooltip(authname, postId),
                        {callback: this.handleDeleteAction, trigger: 'click', showOnInit: true});
                    this.tooltips.push(tooltip);
                }}
                ref={(elem)=> {
                    if (elem === null) return;
                    showTooltip(elem);
                }}><i className="fas fa-trash-alt"/>
        </button>
    }
}

const  ButtonDeletePost = withRouter(connect(null, {asyncDeletePost, localDeleteMedia})(_ButtonDeletePost));


class PostNavigation extends Component {

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
            set(newstate) {state = {...state, ...newstate}; return state;},
            get() {return state;},
            pushTooltip(tooltip) { tooltips.push(tooltip)},
            removeTooltips() {
                tooltips.forEach(tooltip => {tooltip.destroy();}); tooltips = [];
            }
        }
    }

    componentWillUnmount() {
        this.localstate.removeTooltips();
    }

    buildIndexByReaction(authname, likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};

        likes.forEach(like => {
            if(authname === like.user.username) {
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
            const avatar = `${ROOT_STATIC_URL}/${like.user.avatar}`;
            const data = {authname: this.props.authname, username: like.user.username};

            return <li key={like.id} className="like-tooltip-entry">
                <span className="like-link" data-props={JSON.stringify({...data, action: 'LINK_TO'})} onClick={(elem) => console.log(elem)}>
                    <img className='user-thumb' src={avatar}/>
                    {like.user.firstname} {like.user.lastname}
                </span>
                <div className="like-tooltip-buttons">
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'ADD_FRIENDSHIP'})}>
                        Add friend
                    </button>
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'FOLLOW_USER'})}>
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
                    {disabled && <div className={`icon-${reaction.toLowerCase()} like-emoji-disabled`}/> }

                    {this.renderStatistics(indexedByReaction, reaction)}
                    </div>
            )
        })
    }

    updatePostDataAndImages(authname, postId, spacename, text, files) {
        const media = [];

        /* upload images */
        const uploaders = files.map(file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("text", text);

            return axios.post(`${ROOT_SERVER_URL}/user/${authname}/posts/upload`, formData, authConfig())
                .then(response => media.push(response.data));
        });

        /* update text and media */
        axios.all(uploaders).then(() => {
            this.props.asyncUpdatePost(authname, {text: text,  media: media}, postId, post => {

                // TODO reduce media to entries not contained in original post media list !!

                this.props.localUpdateMedia(post.media);
                toastr.info(`You have updated a post in ${post.space.name}`);
            })
        });
    }

    updatePostEmbeddedVideo(username, spacename, text, embedded) {
        // this.props.asyncCreatePost(username, {title: '', text: text, media: embedded}, spacename);

        /* nothing at the moment */
    }


    handleTextAreaEnter(text, files, embedded) {
        const {authname, postId, spacename} = this.props;

        if (embedded.length > 0) {
            this.updatePostEmbeddedVideo(authname, spacename, text, embedded);
        } else {
            this.updatePostDataAndImages(authname, postId, spacename, text, files);
        }
    }

    render() {
        const {authname, postId, text, likes, spaces, spacename} = this.props;

        likes && this.localstate.removeTooltips();
        likes && this.localstate.set({indexedByReaction: this.buildIndexByReaction(authname, likes)});

        return (
            <div className="like-navigation">
                <div className="like-content">
                    {likes && this.renderLikeEntries()}

                    {(likes && likes.length > 0) &&
                    <div className="like-count">
                        <div className='badge badge-pill badge-light'>{likes.length}</div>
                    </div>}

                    <div className="bottom-entry">
                        <div className="bottom-navigation">
                            <ButtonSharePost authname={authname} postId={postId} spaces={spaces}/>
                            <ButtonEditPost authname={authname} postId={postId} updateBoxId={`update-box-${postId}`}>
                                <MediaUpload id={`post-${postId}`} text={text} username={authname} callback={this.handleTextAreaEnter}/>
                            </ButtonEditPost>
                            <ButtonDeletePost authname={authname} postId={postId} />
                        </div>
                    </div>

                    <div className="billboard-update-box" id={`update-box-${postId}`}/>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {likes: state.likes[ownProps.postId] ? state.likes[ownProps.postId] : [],
        spaces: state.spaces};
}

export default withRouter(connect(mapStateToProps, {asyncCreatePostLike, asyncRemovePostLike,
    asyncAddFollowee, asyncAddFriend, asyncUpdatePost, localUpdateMedia})(PostNavigation));