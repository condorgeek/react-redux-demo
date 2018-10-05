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

import tippy from '../util/tippy.all.patched'
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {asyncCreateLike, asyncAddFollowee, asyncAddFriend} from "../../actions/index";

import '../../../node_modules/tippy.js/dist/tippy.css';
import {ROOT_STATIC_URL} from "../../actions";

class EmojiNavigation extends Component {

    constructor(props) {
        super(props);
        this.handleFriendshipRequest = this.handleFriendshipRequest.bind(this);
        this.localstate = this.localstate.bind(this)({indexedByReaction: null, liked: null, username: null});
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
                const localstate = this.localstate.set({username: authorization.user.username, liked: like.reaction});
            }
            index[like.reaction].push(like);
        });
        return index;
    }

    handleFriendshipRequest(event, data, timestamp) {
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

    renderTooltip(reaction, likes) {

        const persons = (reaction === this.localstate.get().liked)
            ? (likes.length > 1) ? "You and " + (likes.length - 1)  + " Persons" : "You"
            : (likes.length > 1) ? likes.length + " Persons" : "1 Person";

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

    handleLike(event, reaction) {
        const {authorization, username, id} = this.props;
        this.props.asyncCreateLike(authorization.user.username, id, {
            username: authorization.user.username,
            reaction: reaction
        });
    }

    handleUnlike(event, reaction) {
        const {authorization, username, id} = this.props;
        console.log('UNLIKE', reaction);
        // this.props.asyncUnlikePost(authorization.user.username, id, {
        //     username: authorization.user.username,
        //     reaction: reaction
        // });
    }

    renderStatistics(indexedLikes, reaction) {
        const templateId = `#like-template-${this.props.id}`;

        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(this.renderTooltip(reaction, indexedLikes[reaction]));
                         const initialText = document.querySelector(templateId).textContent;
                         const callback = this.handleFriendshipRequest;

                         const tooltip = tippy(elem, {
                             html: templateId, interactive: true,
                             placement: 'bottom',
                             // theme: 'honeybee',
                             animation: 'shift-toward', arrow: true,
                             reactive: true,
                             onShow() {
                                 const content = this.querySelector('.tippy-content');
                                 if (tooltip.loading || content.innerHTML !== initialText) return;
                                 tooltip.loading = true;
                                 content.innerHTML = html;
                                 tooltip.loading = false;
                                 setTimeout(() => {
                                     OverlayScrollbars(document.querySelector(".like-tooltip"), {});
                                 }, 1000);

                             },
                             onHidden() {
                                 const content = this.querySelector('.tippy-content');
                                 content.innerHTML = initialText;
                             },
                             onClick: callback
                         });

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
                          onClick={event => this.handleLike(event, reaction)}/>}
                    {selected && <div className={`icon-${reaction.toLowerCase()} like-emoji like-emoji-selected`}
                                     onClick={event => this.handleUnlike(event, reaction)}>
                        <i className="fas fa-check"/></div>}
                    {disabled && <div className={`icon-${reaction.toLowerCase()} like-emoji-disabled`}/> }
                    {this.renderStatistics(indexedByReaction, reaction)}
                </div>
            )
        })
    }

    render() {
        const {authorization, id, likes} = this.props;
        this.localstate.set({indexedByReaction: this.buildIndexByReaction(authorization, likes)});

        return (
            <div className="like-navigation">
                <div className="like-content">

                    {this.renderLikeEntries()}
                    {likes.length> 0 && <div className="like-count"><div className='badge badge-pill badge-light'>{likes.length}</div></div>}

                    <div className="bottom-entry">
                        <div className="bottom-navigation">
                            <button title="Share in your home place" type="button" className="btn btn-sidebar btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        tippy(elem, {arrow: true, theme: "sidebar"});
                                    }}><i className="fas fa-share-alt"/>
                            </button>
                            <button title="Edit this post" type="button" className="btn btn-sidebar btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        tippy(elem, {arrow: true, theme: "sidebar"});
                                    }}><i className="fas fa-edit"/>
                            </button>
                            <button title="Delete this post" type="button" className="btn btn-sidebar btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        tippy(elem, {arrow: true, theme: "sidebar"});
                                    }}><i className="fas fa-trash-alt"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div id={`like-template-${id}`} className="d-none">Loading...</div>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state.likes[ownProps.id] !== undefined ? {likes: state.likes[ownProps.id]} : {};
}

export default withRouter(connect(mapStateToProps, {asyncCreateLike, asyncAddFollowee, asyncAddFriend})(EmojiNavigation));