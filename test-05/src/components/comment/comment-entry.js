/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [comment-entry.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.10.18 13:17
 */

import emojione from '../../../node_modules/emojione/lib/js/emojione';
import {bindTooltip} from "../../actions/tippy-config";

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import moment from 'moment';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    asyncCreateCommentLike,
    asyncRemoveCommentLike,
    asyncAddFollowee,
    asyncAddFriend,
    ROOT_STATIC_URL,
    LOGIN_STATUS_SUCCESS
} from "../../actions/index";

// import '../../../node_modules/tippy.js/dist/tippy.css';


class CommentEntry extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
        emojione.ascii = true;
        // emojione.sprites = false;
        // emojione.imagePathPNG = '/static/emojione/png/32';

        this.handleFriendshipRequest = this.handleFriendshipRequest.bind(this);
        this.localstate = this.localstate.bind(this)(
            {indexedByReaction: null, liked: null, username: null, likedId: null});
    }

    componentDidMount() {
        this.setState({});
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

    handleFriendshipRequest(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        const {action, authorization, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, timestamp);
                event.preventDefault();

                this.props.asyncAddFriend(authorization.user.username, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', authorization, username, this.props);
                event.preventDefault();

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

    renderTooltip(likes) {
        return <div className="like-tooltip">
            <ul className="like-tooltip-list">
                {this.renderTooltipEntries(likes)}
            </ul>
        </div>
    }

    renderTooltipEntries(likes) {
        return likes.map(like => {

            const avatar =  `${ROOT_STATIC_URL}/${like.user.avatar}`;
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

    buildIndexByReaction(authorization, likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};
        likes.forEach(like => {
            if(authorization.user.username === like.user.username) {
                this.localstate.set(
                    {username: authorization.user.username, liked: like.reaction, likedId: like.id});
            }
            index[like.reaction].push(like);
        });
        return index;
    }

    renderStatistics(indexedLikes, reaction) {
        // const templateId = `#comment-tooltip-${this.props.id}`;


        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(this.renderTooltip(indexedLikes[reaction]));
                         // const initialText = document.querySelector(templateId).textContent;
                         // const callback = this.handleFriendshipRequest;

                         // const tooltip = tippy(elem, {
                         //     html: templateId, interactive: true,
                         //     placement: 'bottom', reactive: true,
                         //     // theme: 'honeybee',
                         //     animation: 'shift-toward', arrow: true,
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
                         //
                         // });
                         bindTooltip(elem, html, {callback: this.handleFriendshipRequest})

                     }}>{indexedLikes[reaction].length}</div>
            </div> : ""
    }

    handleLikeComment(event) {
        event.preventDefault();
        const {authorization, id} = this.props;
        this.props.asyncCreateCommentLike(authorization.user.username, id,
            {username: authorization.user.username, reaction: 'LIKE'});
    }

    handleUnlikeComment(event) {
        event.preventDefault();
        const {authorization, id} = this.props;
        const {likedId} = this.localstate.get();

        console.log('UNLIKE_COMMENT',authorization.user.username, id, likedId);

        this.props.asyncRemoveCommentLike(authorization.user.username, id, likedId, () => {
            this.localstate.set({username: null, liked: null, likedId: null});
        });
    }

    render() {
        const {authorization, id, comment, likes, created, configuration} = this.props;
        const isAuthorized = authorization && authorization.status === LOGIN_STATUS_SUCCESS;
        const allowLikes = configuration && configuration.public.likes === true;
        const {indexedByReaction, liked} = this.localstate.set(
            {indexedByReaction: this.buildIndexByReaction(authorization, likes)});

        return (

            <div className="comment-entry">
                <div className='comment-entry-text' ref={(elem) => {
                    if (elem != null) {
                        // emojione.sprites = false;
                        elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
                    }
                }}>{comment}
                    <span className="comment-created">{moment(created).fromNow()}</span>

                </div>
                {(isAuthorized || allowLikes) && <div className="d-inline">
                    {!liked && <div onClick={(event) => this.handleLikeComment(event)}>
                        <span className='icon-like comment-like'/>
                        </div>}

                        {liked && <div className={`icon-like comment-like`}
                               onClick={event => this.handleUnlikeComment(event)}>
                            <i className="fas fa-check"/></div>}

                        {this.renderStatistics(indexedByReaction, 'LIKE')}
                    </div>}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return state.commentlikes[ownProps.id] !== undefined ? {likes: state.commentlikes[ownProps.id]} : {};
}

export default withRouter(connect(mapStateToProps, {asyncCreateCommentLike, asyncRemoveCommentLike, asyncAddFollowee, asyncAddFriend})(CommentEntry));