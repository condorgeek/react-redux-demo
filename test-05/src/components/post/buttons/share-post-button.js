/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [share-post-button.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 10.02.20, 17:16
 */
import toastr from "toastr";

import React, {Component} from 'react';
// import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {
    FlatButton,
    FlatIcon,
    FlatLink,
    Icon,
    NavigationGroup,
    NavigationRow
} from "../../navigation-buttons/nav-buttons";
import {asyncSharePost} from "../../../actions";
import SpaceDialogBox from "../../dialog-box/space-dialog-box";
import {ImageBoxSmall} from "../../sidebar/boxes/image-box-small";

class SharePostButton extends Component {

    constructor(props) {
        super(props);
        this.state = {isShareOpen: false};
    }

    renderShareEntries(spaces, postId) {
        return spaces.map(space => {
            const {authname} = this.props.authname;
            const {user, media} = space;
            const cover = media.length > 0 ? media[0].url : null;

            return <NavigationRow className='mt-2'>
                    <NavigationGroup>
                        <FlatLink to={`/${user.username}/space/${space.id}`}>
                            <ImageBoxSmall image={cover}/>
                            {space.name}
                        </FlatLink>

                    </NavigationGroup>
                    <NavigationGroup className='ml-2'>
                        <FlatButton btn small className='btn-light' onClick={(event) => {
                            event.preventDefault();
                            this.props.asyncSharePost(authname, space.id, postId, {comment: `Some comment. Glad to share..`}, post => {
                                toastr.info(`You have shared a post in ${space.name}`);
                            });
                        }}>
                            <Icon className="fas fa-share-alt mr-1"/> Share
                        </FlatButton>
                    </NavigationGroup>
                </NavigationRow>
        })
    }

    render() {
        const {authname, postId, spaces} = this.props;
        const {isShareOpen} = this.state;

        return <div className='post-button'>
            <FlatIcon circle onClick={(event) => this.setState({isShareOpen: true})}>
                <Icon title='Share this post' className="fas fa-share-alt"/>
            </FlatIcon>

            <SpaceDialogBox isOpen={isShareOpen} setIsOpen={() => this.setState({isShareOpen: false})}
                            image={null}
                            title='Share post'>
                <div className='post-button-content'>
                    <p>Select the spaces to share this post with:</p>
                    <div className="like-tooltip11 spaces-tooltip22 spaces-tooltip-scrollbar">
                        {this.renderShareEntries(spaces, postId)}
                    </div>
                </div>
            </SpaceDialogBox>
        </div>
    }
}

// export default withRouter(connect(null, {asyncSharePost})(SharePostButton));
export default connect(null, {asyncSharePost})(SharePostButton);
