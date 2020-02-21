/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [post-comment.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 12.10.18 13:17
 */

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {asyncFetchComments, asyncCreateComment} from '../../actions/index';
import EmojiEditor from '../emoji-editor/emoji-editor';
import CommentText from './comment-text';
import {getStaticImageUrl} from "../../actions/environment";
import {isAuthorized} from "../../selectors";
import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {NavigationToggler} from "../navigation-headlines/nav-headlines";
import {ConfigurationContext} from "../configuration/configuration";
import CommentNavigation from "./comment-navigation";


class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
    }

    componentDidMount() {
        const {username, id} = this.props;
        this.props.asyncFetchComments(username, id);
    }

    renderAvatar (avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    renderCommentEntries(authorization, username, postId, comments, configuration) {
        if (!comments || comments.length === 0) return null;

        return comments.map((comment, idx) => {
            const avatar = getStaticImageUrl(comment.user.avatar);
            const fullname = `${comment.user.firstname} ${comment.user.lastname}`;
            const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));

            return <li key={comment.id} className='comment-item'>
                <CommentNavigation comment={comment} html={html} postId={postId}/>

                <div className='comment-item-body'>
                    <CommentText comment={comment}/>
                </div>
            </li>
        });
    }

    handleEditableBoxEnter(comment) {
        console.log(comment);

        const {authorization, id} = this.props;

        if (comment.length > 0) {
            this.props.asyncCreateComment(authorization.user.username, id,
                {text: comment, username: authorization.user.username}, () => {
                    this.forceUpdate();
                });
        }
    }

    render() {
        const {authorization, username, id, comments, configuration, isAuthorized, Lang} = this.props;
        if(!comments || (!isAuthorized && comments.length === 0)) return null;

        return <div className='post-comment'>
            <NavigationRow>
                <NavigationGroup>
                    <FlatIcon onClick={(event) => this.commentsRef.toggle()}>
                        <span className='post-comment-text'>{comments.length} Comments</span>
                    </FlatIcon>
                </NavigationGroup>

                {/*{isAuthorized && <NavigationGroup>*/}
                {/*    <FlatIcon circle onClick={(event) => this.commentsRef.toggle()}>*/}
                {/*        <Icon title={Lang.placeholder.comment} className='fa fa-commenting-o'/>*/}
                {/*    </FlatIcon>*/}
                {/*</NavigationGroup>}*/}
            </NavigationRow>

            <NavigationToggler onRef={(ref) => this.commentsRef = ref}>
                <ul className='list-group'>
                    {this.renderCommentEntries(authorization, username, id, comments, configuration)}
                    {isAuthorized && <EmojiEditor
                        navigation={false} id={id}
                        placeholder = {Lang.placeholder.comment}
                        callback={this.handleEditableBoxEnter.bind(this)}/>}
                </ul>
            </NavigationToggler>
        </div>

    }
}

const mapStateToProps = (state, ownProps) => ({
    comments: state.comments[ownProps.id],
    isAuthorized: isAuthorized(state),
});

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<Comment {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default connect(mapStateToProps, {asyncFetchComments, asyncCreateComment})(withConfigurationContext);