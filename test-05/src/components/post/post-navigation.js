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

import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {
    asyncAddFollowee, asyncAddFriend,
    asyncUpdatePost,
} from "../../actions/index";

import axios from 'axios';
import {authConfig} from "../../actions/local-storage";
import {localUpdateMedia} from "../../actions/spaces";
// import StarRating from "./star-rating";
import {getPostsUploadUrl} from "../../actions/environment";
import {isAuthorized, isSuperUser} from "../../selectors";
import SharePostDialog from "./buttons/share-post-dialog";
import DeletePostButton from "./buttons/delete-post-button";
import {NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import LikeNavigation from "../like/like-navigation";
import EditPostDialog from "./buttons/edit-post-dialog";
import DeletePostDialog from "./buttons/delete-post-dialog";

class PostNavigation extends Component {

    constructor(props) {
        super(props);
        this.handleTextAreaEnter = this.handleTextAreaEnter.bind(this);
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

        const isEditable = authname === post.user.username;
        const isAdmin = authname === post.space.user.username;
        const allowLikes = isAuthorized || (configuration && configuration.public.likes === true);

        return <div className="post-navigation">

            <NavigationRow className='box-light-gray'>
                {isAuthorized && allowLikes ? <NavigationGroup>
                    <LikeNavigation postId={postId}/>
                </NavigationGroup>: <NavigationGroup/>}

                {isAuthorized && <NavigationGroup>
                    <SharePostDialog authname={authname} postId={postId} spaces={spaces}/>

                    {(isEditable || isSuperUser) &&
                        <EditPostDialog authname={authname}
                                        post={post}
                                        callback={this.handleTextAreaEnter}/>
                    }

                    {(isEditable || isAdmin || isSuperUser) &&
                        // <DeletePostButton authname={authname} postId={postId}/>
                        <DeletePostDialog authname={authname} post={post}/>
                    }

                </NavigationGroup>}
            </NavigationRow>

                <div className="update-box-marker" id={`update-box-${postId}`}/>

            </div>
    }
}

const mapStateToProps = (state) => ({
    spaces: state.spaces,
    isAuthorized: isAuthorized(state),
    isSuperUser: isSuperUser(state),
});

export default withRouter(connect(mapStateToProps, {
    asyncAddFollowee, asyncAddFriend, asyncUpdatePost, localUpdateMedia
})(PostNavigation));