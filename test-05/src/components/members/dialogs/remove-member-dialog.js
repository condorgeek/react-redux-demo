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
import toastr from "../../../../node_modules/toastr/toastr";

import React, {useState} from 'react';
import {connect} from 'react-redux';

import SpaceDialogBox from "../../dialog-box/space-dialog-box";
import {FlatIcon, Icon} from "../../navigation-buttons/nav-buttons";
import {asyncDeleteMember} from "../../../actions/spaces";

const RemoveMemberDialog = (props) => {
    const {authname, member, space} = props;
    const [isRemoveOpen, setRemoveOpen] = useState(false);
    const fullname = `${member.user.firstname} ${member.user.lastname}`;

    const removeMember = (event) => {
        event.preventDefault();

        props.asyncDeleteMember(authname, member.space.id, member.id, member => {
            // TODO IMPLEMNET TEMP UPDATE OF VISIBLE MEMBER LIST in reducer
            // props.localRemoveMember(post.media || []);
            toastr.info(`You have removed ${fullname}`);
        });
    };

    return <div className='delete-post-dialog'>
        <FlatIcon circle onClick={(event) => setRemoveOpen(true)}>
            <Icon title={`Remove ${member.user.firstname} from ${space.name}`}
                  className="fas fa-user-minus"/>
        </FlatIcon>

        <SpaceDialogBox isOpen={isRemoveOpen}
                        setIsOpen={() => setRemoveOpen(false)}
                        title='Remove member from space'
                        action='Remove'
                        callback={removeMember}>

            <div className='delete-post-dialog-content'>
                Are you sure to remove member {fullname} from the space {space.name}?
                <div className='delete-post-dialog-warning'>
                    You can add this member to the space later again.
                </div>
            </div>

        </SpaceDialogBox>

    </div>
};


export default connect(null, {asyncDeleteMember})(RemoveMemberDialog);