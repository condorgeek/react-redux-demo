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

import {bindTooltip, showTooltip} from "../../actions/tippy-config";
import toastr from "../../../node_modules/toastr/toastr";

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {asyncCreatePostLike, asyncRemovePostLike, asyncAddFollowee, asyncAddFriend, asyncDeletePost} from "../../actions/index";

import {ROOT_STATIC_URL} from "../../actions";

class PostNavigation extends Component {

    constructor(props) {
        super(props);
        this.handleFriendshipAction = this.handleFriendshipAction.bind(this);
        this.localstate = this.localstate.bind(this)(
            {indexedByReaction: null, liked: null, likedId: null, username: null});
    }

    localstate(data) {
        let state = data;
        return {
            set(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            get() {return state;}
        }
    }

    buildIndexByReaction(authorization, likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};

        likes.forEach(like => {
            if(authorization.user.username === like.user.username) {
                const localstate = this.localstate.set(
                    {username: authorization.user.username, liked: like.reaction, likedId: like.id});
            }
            index[like.reaction].push(like);
        });
        return index;
    }

    handleFriendshipAction(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {action, authorization, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, event.target, timestamp);
                event.stopPropagation();

                this.props.asyncAddFriend(authorization.user.username, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', props, event.target, timestamp);
                event.stopPropagation();

                this.props.asyncAddFollowee(authorization.user.username, username);
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

        return <div className="like-tooltip">
            <div className="like-tooltip-title">{reaction} {persons}</div>
            <ul className="like-tooltip-list">
                {this.renderTooltipEntries(likes)}
            </ul>
        </div>
    }

    renderTooltipEntries(likes) {

        return likes.map(like => {

            const avatar = `${ROOT_STATIC_URL}/${like.user.avatar}`;
            const data = {authorization: this.props.authorization, username: like.user.username};

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
        const {authorization, username, postId} = this.props;
        this.props.asyncCreatePostLike(authorization.user.username, postId, {
            username: authorization.user.username,
            reaction: reaction
        });
    }

    handleUnlikePost(event, reaction) {
        event.preventDefault();
        const {authorization, postId} = this.props;
        const {likedId} = this.localstate.get();

        this.props.asyncRemovePostLike(authorization.user.username, postId, likedId, () => {
            this.localstate.set({liked: null, likedId: null, username: null});
        });
    }

    renderStatistics(indexedLikes, reaction) {

        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(this.renderTooltip(reaction, indexedLikes[reaction]));

                         // const initialText = document.querySelector(templateId).textContent;
                         // const callback = this.handleFriendshipRequest;
                         //
                         // const tooltip = tippy(elem, {
                         //     html: templateId, interactive: true,
                         //     placement: 'bottom',
                         //     // theme: 'honeybee',
                         //     animation: 'shift-toward', arrow: true,
                         //     reactive: true,
                         //     onShow() {
                         //         const content = this.querySelector('.tippy-content');
                         //         if (tooltip.loading || content.innerHTML !== initialText) return;
                         //         tooltip.loading = true;
                         //         content.innerHTML = html;
                         //         tooltip.loading = false;
                         //         setTimeout(() => {
                         //             OverlayScrollbars(document.querySelector(".like-tooltip"), {});
                         //         }, 1000);
                         //
                         //     },
                         //     onHidden() {
                         //         const content = this.querySelector('.tippy-content');
                         //         content.innerHTML = initialText;
                         //     },
                         //     onClick: callback
                         // });

                         bindTooltip(elem, html, {callback: this.handleFriendshipAction});
                     }}>{indexedLikes[reaction].length}</div>
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

    render() {
        const {authorization, postId, likes} = this.props;
        this.localstate.set({indexedByReaction: this.buildIndexByReaction(authorization, likes)});

        return (
            <div className="like-navigation">
                <div className="like-content">

                    {this.renderLikeEntries()}
                    {likes.length> 0 && <div className="like-count"><div className='badge badge-pill badge-light'>{likes.length}</div></div>}

                    <div className="bottom-entry">
                        <div className="bottom-navigation">
                            <button title="Share in your home place" type="button" className="btn btn-darkblue btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        showTooltip(elem);
                                    }}><i className="fas fa-share-alt"/>
                            </button>
                            <button title="Edit this post" type="button" className="btn btn-darkblue btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Edit');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        showTooltip(elem);
                                    }}><i className="fas fa-edit"/>
                            </button>
                            <button title="Delete this post" type="button" className="btn btn-darkblue btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.props.asyncDeletePost(authorization.user.username, postId, post => {
                                            toastr.info(`You have deleted a post from ${post.user.firstname}`);
                                        });
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        showTooltip(elem);
                                    }}><i className="fas fa-trash-alt"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state.likes[ownProps.postId] !== undefined ? {likes: state.likes[ownProps.postId]} : {};
}

export default withRouter(connect(mapStateToProps, {asyncCreatePostLike, asyncRemovePostLike,
    asyncAddFollowee, asyncAddFriend, asyncDeletePost})(PostNavigation));