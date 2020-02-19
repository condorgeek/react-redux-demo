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

import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {bindRawTooltip, bindTooltip} from "../../actions/tippy-config";
import {getStaticImageUrl} from "../../actions/environment";
import {allowLikes, getAuthorizedUsername, isAuthorized} from "../../selectors";

import {asyncCreateCommentLike, asyncRemoveCommentLike} from "../../actions/index";

const CommentNavigation = (props) => {
    const ownLike = useRef( null);

    const handleLikeComment = (event) => {
        event.preventDefault();
        const {authname, postId, comment} = props;

        console.log('LIKE COMMENT', authname, postId, comment.id);

        props.asyncCreateCommentLike(authname,
            postId,
            comment.id,
            {username: authname, reaction: 'LIKE'}, like => console.log('LIKED', like));
    };

    const handleUnlikeComment = (event) => {
        event.preventDefault();
        const {authname, postId, comment} = props;
        const like = ownLike.current;

        console.log('UNLIKE_COMMENT',authname, postId, comment.id, like.id);

        // props.asyncRemoveCommentLike(authname,
        //     postId,
        //     comment.id,
        //     likedId, () => {
        //         this.localstate.set({username: null, liked: null, likedId: null});
        //     });
    };



    const handleFriendshipRequest = (event, data, timestamp) => {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);

        const {action, authorization, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, timestamp);
                event.preventDefault();

                // this.props.asyncAddFriend(authorization.user.username, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', authorization, username, this.props);
                event.preventDefault();

                // this.props.asyncAddFollowee(authorization.user.username, username);

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

            // if(authname === like.user.username) {
            //     ownLike.current = like;
            // }

            const avatar =  getStaticImageUrl(like.user.avatar);
            // TODO authrorizatiopn
            const data = {authorization: null, username: like.user.username};

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


    // {(isAuthorized || allowLikes) && <div className="d-inline">
//     {!liked && <div onClick={this.handleLikeComment}>
//         <span className='icon-like comment-like'/>
//     </div>}
//
//     {liked && <div className={`icon-like comment-like`}
//                    onClick={this.handleUnlikeComment}>
//         <i className="fas fa-check"/></div>}
//
//     {this.renderStatistics(indexedByReaction, 'LIKE')}
// </div>}

    const {html, comment, allowLikes, isAuthorized, authname, commentLikes} = props;
    const avatar = getStaticImageUrl(comment.user.avatar);
    const fullname = `${comment.user.firstname} ${comment.user.lastname}`;

    isOwnLike(commentLikes);

    console.log('NEW LIKES', commentLikes, ownLike.current);


    return <NavigationRow className='box-yellow'>
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

            <div className='badge badge-pill badge-light' ref={(elem) => {
                if (elem === null) return;
                bindRawTooltip(elem, renderTooltip(commentLikes), {callback: handleFriendshipRequest})
            }}>{commentLikes.length}</div>

            {!ownLike.current && <FlatIcon circle onClick={handleLikeComment}>
                <Icon className='icon-like comment-like'/>
            </FlatIcon>}
            {ownLike.current && <FlatIcon circle onClick={handleUnlikeComment}>
                {/*<Icon className='icon-like comment-like'/>*/}
                {/*<Icon className='fas fa-check'/>*/}
                <Icon className='far fa-check-circle'/>
                {/*<i className="fas fa-check"/>*/}
            </FlatIcon>}

        </NavigationGroup>}
    </NavigationRow>
};

const mapStateToProps = (state, ownProps) => ({
    authname: getAuthorizedUsername(state),
    isAuthorized: isAuthorized(state),
    allowLikes: allowLikes(state),
    commentLikes: state.commentLikes ? state.commentLikes[ownProps.comment.id] : [],
});

export default connect(mapStateToProps, {asyncCreateCommentLike, asyncRemoveCommentLike})(CommentNavigation);