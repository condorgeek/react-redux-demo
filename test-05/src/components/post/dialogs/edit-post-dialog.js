/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [edit-post-button.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.02.20, 12:03
 */

import React, {Component} from 'react';
import {FlatIcon, Icon} from "../../navigation-buttons/nav-buttons";
import SpaceDialogBox from "../../dialog-box/space-dialog-box";
import MediaRichEditor from "../../media-rich-editor/media-rich-editor";
import {BUBBLE_CLOSE_BUTTON_ID} from "../../../actions";

class EditPostDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {isEditOpen: false}
    }

    closeOnBubbledEvent = (event) => {
        if(event.target.id === BUBBLE_CLOSE_BUTTON_ID) {
            event.preventDefault();
            event.stopPropagation();
            this.setState({isEditOpen: false});
        }
    };

    render() {
        const {authname, post, callback} = this.props;
        const {isEditOpen} = this.state;

        return <div className="edit-post-button" onClick={this.closeOnBubbledEvent}>
            <FlatIcon circle onClick={(event) => this.setState({isEditOpen: !isEditOpen})}>
                <Icon title='Edit this post' className="fas fa-edit"/>
            </FlatIcon>

            <SpaceDialogBox cancelButton={false}
                            isOpen={isEditOpen}
                            setIsOpen={() => this.setState({isEditOpen: false})}
                            title='Edit post'>

                <div className='edit-post-dialog'>
                    <MediaRichEditor rawmode id={`post-${post.id}`}
                                     text={post.text}
                                     username={authname}
                                     callback={callback}/>
                </div>

            </SpaceDialogBox>

        </div>
    }
}

export default EditPostDialog;