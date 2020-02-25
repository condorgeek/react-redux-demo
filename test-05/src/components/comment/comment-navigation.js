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
import {bindTooltip} from "../../actions/tippy-config";
import {getStaticImageUrl} from "../../actions/environment";
import {allowLikes, getAuthorizedUsername, isAuthorized} from "../../selectors";

import {asyncCreateCommentLike, asyncRemoveCommentLike} from "../../actions/index";
import TooltipBadge from "../like/tooltip-badge";

const CommentNavigation = (props) => {
    const ownLike = useRef( null);

    const handleLike = (event) => {
        event.preventDefault();
        const {authname, postId, comment} = props;
        const like = ownLike.current;

        if(ownLike.current) {
            props.asyncRemoveCommentLike(authname,
                postId,
                comment.id,
                like.id, () => { ownLike.current = null });

        } else {
            props.asyncCreateCommentLike(authname,
                postId,
                comment.id,
                {username: authname, reaction: 'LIKE'}, like => console.log('LIKED', like));
        }
    };


    const isOwnLike = (likes) => {
        likes.map(like => {
            if (authname === like.user.username) {
                ownLike.current = like;
            }
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
            <TooltipBadge reaction={'LIKE'} likes={commentLikes}/>
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