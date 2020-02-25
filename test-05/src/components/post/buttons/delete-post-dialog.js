/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [delete-post-dialog.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 24.02.20, 17:01
 */

import React, {useState} from 'react';
import SpaceDialogBox from "../../dialog-box/space-dialog-box";
import {FlatIcon, Icon} from "../../navigation-buttons/nav-buttons";

const DeletePostDialog = (props) => {
    const {authname, post} = props;
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    const deletePost = (event) => {
      console.log('DELETED', event);
    };

    console.log('DELETE', post);

    return <div className='delete-post-dialog'>
        <FlatIcon circle onClick={(event) => setDeleteOpen(true)}>
            <Icon title='Share this post' className="fas fa-trash-alt"/>
        </FlatIcon>

        <SpaceDialogBox isOpen={isDeleteOpen}
                        setIsOpen={() => setDeleteOpen(false)}
                        title='Delete post'
                        action='Delete'
                        callback={deletePost}>

            <div className='delete-post-dialog-content'>
                Are you sure to delete this post by {post.user.fullname} from {post.created}?
                <div className='delete-post-dialog-warning'>
                    Please notice this operation cannot be undone.
                </div>
            </div>

        </SpaceDialogBox>

    </div>
};

export default DeletePostDialog;