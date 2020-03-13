/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [delete-friend-dialog.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 03.03.20, 18:21
 */


import React, {useState} from 'react';
import {FlatIcon} from "../../navigation-buttons/nav-buttons";
import MessageBox from "../../dialog-box/message-box";

const DeleteFriendDialog = (props) => {
    const {friend, onDelete} = props;
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    return <div className='delete-friend-dialog'>

        <FlatIcon circle title={`Delete friendship w. ${friend.firstname}`}
                  className='fas fa-user-minus' onClick={(event) => setDeleteOpen(true)}/>

        <MessageBox isOpen={isDeleteOpen}
                        setIsOpen={(event) => setDeleteOpen(false)}
                        title='Delete friend'
                        action='Delete'
                        image={friend.avatar}
                        callback={onDelete}>

            <div className='delete-friend-dialog-content'>
                Are you sure to delete your friendship to  {friend.firstname} ? If you don't know you could
                first try blocking her for a temporarily stop of all communication.
                <div className='delete-post-dialog-warning'>
                    All messages will also be lost. Please notice this operation cannot be undone.
                </div>
            </div>

        </MessageBox>
    </div>
};

export default DeleteFriendDialog;

