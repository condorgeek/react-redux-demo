/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [leave-space-dialog.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 05.04.20, 18:41
 */
import toastr from "toastr";

import React from 'react';
import {connect} from 'react-redux';
import SpaceDialogBox from "../../dialog-box/space-dialog-box";

import {
    asyncLeaveSpaceByUsername,
    updateDeleteSpace,
} from "../../../actions/spaces";

const leaveSpace = props => event => {
    const {space, authname} = props;

    event.preventDefault();
    props.asyncLeaveSpaceByUsername(authname, space.id, member => {
        props.updateDeleteSpace(space);
        toastr.info(`You have left ${space.name}`);
    });
};

const LeaveSpaceDialog = (props) => {
    const {isOpen, onOpen, space, authname} = props;
    const image = space.media && space.media.length > 0 ? space.media[0].url : null;

    return <SpaceDialogBox isOpen={isOpen} setIsOpen={onOpen}
                           image={image || space.user.avatar}
                           title='Leave Space' action='Leave'
                           callback={leaveSpace(props)}>
        <div>
            <p>You have selected to leave the space <span className='space-name'>{space.name}</span>.</p>
            <p>Are you sure of this operation ?</p>
            <small>You can join again at a later time if you wish.</small>
        </div>
    </SpaceDialogBox>
};

export default connect(null, {asyncLeaveSpaceByUsername, updateDeleteSpace})(LeaveSpaceDialog);
