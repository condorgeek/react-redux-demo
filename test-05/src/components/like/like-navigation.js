/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [like-navigation.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 21.02.20, 15:32
 */

import React, {useRef} from 'react';
import {connect} from 'react-redux';

import {Emoji} from "../navigation-buttons/nav-buttons";
import {bindRawTooltip} from "../../actions/tippy-config";
import {getStaticImageUrl} from "../../actions/environment";
import { asyncCreatePostLike, asyncRemovePostLike,} from "../../actions";
import {getAuthorizedUsername} from "../../selectors";

const personAsLiteral = (count) => {
    return `${count} ${(count > 1) ? ' Persons' : ' Person'}`;
};


const LikeNavigation = (props) => {
    const indexedReactions = useRef({});
    const ownReaction = useRef( {liked: null, likedId: null, username: null});

    const handleLikePost = (event, reaction) => {
        event.preventDefault();
        const {authname, postId} = props;

        props.asyncCreatePostLike(authname, postId, {username: authname, reaction: reaction});
    };

    const handleUnlikePost = (event, reaction) => {
        event.preventDefault();
        const {authname, postId} = props;
        const {likedId} = ownReaction.current;

        props.asyncRemovePostLike(authname, postId, likedId, () => {
            ownReaction.current = {liked: null, likedId: null, username: null};
        });
    };

    const handleFriendshipAction = (event, data, timestamp) => {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {action, authname, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, event.target, timestamp);
                event.stopPropagation();

                // this.props.asyncAddFriend(authname, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', props, event.target, timestamp);
                event.stopPropagation();

                // this.props.asyncAddFollowee(authname, username);
                return false;

            case 'LINK_TO':
                console.log('LINK_TO', username);
                event.stopPropagation();

                // this.props.history.push(`/${username}/home`);
                return false;

            default:
                return;
        }
    };

    const renderTooltip = (reaction, likes) => {
        const persons = (reaction === ownReaction.current.liked)
            ? (likes.length > 1) ? "You and " + personAsLiteral(likes.length - 1) : "You"
            : personAsLiteral(likes.length);

        return <div className="like-tooltip like-tooltip-scrollbar">
            <div className="like-tooltip-title">{reaction} {persons}</div>
            <ul className="like-tooltip-list">
                {renderTooltipEntries(likes)}
            </ul>
        </div>
    };

    const buildIndexedReactions = (authname, likes) => {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};

        likes.forEach(like => {
            if (authname === like.user.username) {
                ownReaction.current = {username: authname, liked: like.reaction, likedId: like.id};
            }
            index[like.reaction].push(like);
        });

        indexedReactions.current = index;
    };

    const renderTooltipEntries= (likes) => {
        const {authname} = props;

        return likes.map(like => {
            const avatar = getStaticImageUrl(like.user.avatar);
            const data = {authname: authname, username: like.user.username};

            return <li key={like.id} className="like-tooltip-entry">
                <span className="like-link" data-props={JSON.stringify({...data, action: 'LINK_TO'})}
                      onClick={(elem) => console.log(elem)}>
                    <img className='user-thumb' src={avatar}/>
                    {like.user.firstname} {like.user.lastname}
                </span>
                {/*<div className="like-tooltip-buttons">*/}
                {/*    <button className="btn btn-tooltip btn-sm"*/}
                {/*            data-props={JSON.stringify({...data, action: 'ADD_FRIENDSHIP'})}>*/}
                {/*        Add friend*/}
                {/*    </button>*/}
                {/*    <button className="btn btn-tooltip btn-sm"*/}
                {/*            data-props={JSON.stringify({...data, action: 'FOLLOW_USER'})}>*/}
                {/*        Follow*/}
                {/*    </button>*/}
                {/*</div>*/}
            </li>
        })
    };

    const renderStatistics = (indexedLikes, reaction) => {
        const length = indexedLikes[reaction].length;

        return (length > 0) ?
            <div className='like-entry-static like-entry-badge'
                 ref={(elem) => {
                     if (elem === null) return;
                     const tooltip = bindRawTooltip(elem, renderTooltip(reaction, indexedLikes[reaction]),
                         {callback: handleFriendshipAction, scrollbar: '.like-tooltip-scrollbar'});
                     // TODO
                     // this.localstate.pushTooltip(tooltip);
                 }}>
                {length}</div>
            : "";
    };

    const renderLikeEntries = () => {
        const reactions = indexedReactions.current;
        const {liked} = ownReaction.current;

        return ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'].map(reaction => {
            const selected = liked && reaction === liked;
            const disabled = liked && reaction !== liked;

            if(liked && reactions[reaction].length === 0) return "";

            return <div key={reaction} className="like-entry">
                {!liked && <Emoji reaction={reaction}
                                  onClick={event => handleLikePost(event, reaction)}/>}
                {selected && <Emoji selected reaction={reaction}
                                    onClick={event => handleUnlikePost(event, reaction)}/>}
                {disabled && <Emoji disabled reaction={reaction} />}

                {renderStatistics(reactions, reaction)}
            </div>
        })
    };

    const {postId, likes, authname} = props;
    buildIndexedReactions(authname, likes);

    return <div className='like-navigation'>
        {renderLikeEntries()}
        {/*{likes.length > 0 && <div className='like-navigation-text'>*/}
        {/*    {likes.length}*/}
        {/*</div>}*/}
    </div>
};

const mapStateToPros = (state, ownProps) => ({
    likes: state.likes[ownProps.postId] ? state.likes[ownProps.postId] : [],
    authname: getAuthorizedUsername(state),
});

export default connect(mapStateToPros, {asyncCreatePostLike, asyncRemovePostLike})(LikeNavigation);

