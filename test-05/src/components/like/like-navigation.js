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
import {asyncCreatePostLike, asyncRemovePostLike,} from "../../actions";
import {getAuthorizedUsername} from "../../selectors";
import TooltipBadge from "./tooltip-badge";


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

                <TooltipBadge reaction={reaction} likes={reactions[reaction]}/>
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

