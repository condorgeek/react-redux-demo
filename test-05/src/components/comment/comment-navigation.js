/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [comment-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 17.02.20, 16:42
 */

import React, {useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {Emoji, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {bindRawTooltip, bindTooltip} from "../../actions/tippy-config";
import {getStaticImageUrl} from "../../actions/environment";
import {allowLikes, getAuthorizedUsername, isAuthorized} from "../../selectors";

import {asyncCreateCommentLike, asyncRemoveCommentLike} from "../../actions/index";

const CommentNavigation = (props) => {
    const ownLike = useRef( null);

    const handleLike = (event) => {
        event.preventDefault();
        const {authname, postId, comment} = props;
        const like = ownLike.current;

        if(ownLike.current) {
            console.log('UNLIKE COMMENT', authname, postId, comment.id, like.id);
            props.asyncRemoveCommentLike(authname,
                postId,
                comment.id,
                like.id, () => { ownLike.current = null });

        } else {
            console.log('LIKE COMMENT', authname, postId, comment.id);
            props.asyncCreateCommentLike(authname,
                postId,
                comment.id,
                {username: authname, reaction: 'LIKE'}, like => console.log('LIKED', like));
        }
    };


    const handleFriendshipRequest = (event, data, timestamp) => {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        const {action, authname, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, timestamp);
                event.preventDefault();

                // this.props.asyncAddFriend(authname, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', authname, username, this.props);
                event.preventDefault();

                // this.props.asyncAddFollowee(authname, username);

                return false;

            case 'LINK_TO':
                console.log('LINK_TO', username);
                event.stopPropagation();

                // props.history.push(`/${username}/home`);
                return false;

            default:
                return;
        }
    };

    const isOwnLike = (likes) => {
        likes.map(like => {
            if (authname === like.user.username) {
                ownLike.current = like;
            }
        })
    };

    const renderTooltip = (likes) => {
        return <div className="like-tooltip">
            <ul className="like-tooltip-list">
                {renderTooltipEntries(likes)}
            </ul>
        </div>
    };

    const renderTooltipEntries = (likes) => {

        const {authname} = props;
        return likes.map(like => {

            const avatar =  getStaticImageUrl(like.user.avatar);
            const data = {authname: authname, username: like.user.username};

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
    };

    const {html, comment, allowLikes, isAuthorized, authname, commentLikes} = props;
    const avatar = getStaticImageUrl(comment.user.avatar);
    const fullname = `${comment.user.firstname} ${comment.user.lastname}`;

    isOwnLike(commentLikes);

    return <NavigationRow className='comment-navigation'>
        <NavigationGroup>
            <Link to={`/${comment.user.username}/home`}>
                <div className="d-inline" ref={(elem) => {
                    if (elem === null) return;
                    bindTooltip(elem, html, {theme: 'avatar'});

                }}><img className='comment-item-avatar' src={avatar}/>{fullname}</div>
            </Link>
            <span className='when'>{comment.when}</span>
        </NavigationGroup>

        {allowLikes && <NavigationGroup>
            <div><div className='like-entry-static like-entry-badge' ref={(elem) => {
                if (elem === null) return;
                bindRawTooltip(elem, renderTooltip(commentLikes), {callback: handleFriendshipRequest})
            }}>{commentLikes.length}</div></div>

            <Emoji className='comment-navigation-entry' reaction={'LIKE'} selected={ownLike.current}
                   onClick={handleLike}/>

        </NavigationGroup>}
    </NavigationRow>
};

const mapStateToProps = (state, ownProps) => ({
    authname: getAuthorizedUsername(state),
    isAuthorized: isAuthorized(state),
    allowLikes: allowLikes(state),
    commentLikes: state.commentLikes ? state.commentLikes[ownProps.comment.id] : [],
    //     return state.commentlikes[ownProps.id] !== undefined ? {likes: state.commentlikes[ownProps.id]} : {};

});

export default connect(mapStateToProps, {asyncCreateCommentLike, asyncRemoveCommentLike})(CommentNavigation);