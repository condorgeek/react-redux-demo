/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [post-content.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.10.18 12:52
 */

import React from 'react';
import PostNavigation from "./post-navigation";
import PostText from "./post-text";

const PostContent = (props) => {

    const {authorization, username, post, spacename, configuration} = props;
    const allowComments = authorization.isAuthorized ||
        (configuration && configuration.public.comments === true);

    return <div className='post-content'>
        <PostText post={post} allowComments={allowComments} authorization={authorization}/>
        <PostNavigation authname={authorization.user.username} post={post} username={username}
                        postId={post.id} spacename={spacename}
                        authorization={authorization}
                        configuration={configuration}/>
    </div>
};

export default PostContent;