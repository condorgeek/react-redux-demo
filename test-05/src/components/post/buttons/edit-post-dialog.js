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
import ReactDOM from 'react-dom';

import {FlatIcon, Icon} from "../../navigation-buttons/nav-buttons";
import SpaceDialogBox from "../../dialog-box/space-dialog-box";
// import {NavigationScrollbar} from "../../navigation-headlines/nav-headlines";
import MediaRichEditor from "../../billboard/media-rich-editor";
// import EditPostButton from "./edit-post-button";

class EditPostDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {isEditOpen: false}
    }

    // createPortalEditor(updateBoxId) {
    //     return ReactDOM.createPortal(
    //         <div className='portal-edit-box'>
    //             {this.props.children}
    //         </div>,
    //         document.getElementById(updateBoxId));
    // }

    // /* called from a child down in portal dom tree thru event bubbling  -should be 'editable-close-button' */
    // close(id) {
    //     id === 'editable-close-button' && this.setState({isEditOpen: false});
    // }

    render() {
        const {authname, post, updateBoxId} = this.props;
        const {isEditOpen} = this.state;

        return <div className="edit-post-button">
            <FlatIcon circle onClick={(event) => this.setState({isEditOpen: !isEditOpen})}>
                <Icon title='Edit this post' className="fas fa-edit"/>
            </FlatIcon>

            {/*{isEditOpen && this.createPortalEditor(updateBoxId)}*/}

            <SpaceDialogBox isOpen={isEditOpen} setIsOpen={() => this.setState({isEditOpen: false})}
                            image={null}
                            title='Edit post'>
                <div className='edit-post-dialog'>
                    <MediaRichEditor id={`post-${post.id}`} text={post.text} username={authname}
                                     callback={this.handleTextAreaEnter} rawmode={true}/>
                </div>
            </SpaceDialogBox>



        </div>
    }
}

export default EditPostDialog;