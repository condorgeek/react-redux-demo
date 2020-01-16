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

import {bindTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {asyncFetchComments, asyncCreateComment} from '../../actions/index';
import EmojiEditableBox from '../emoji-editor/emoji-editable-box';
import CommentEntry from './comment-entry';
import {getStaticImageUrl} from "../../actions/environment";
import {isAuthorized} from "../../selectors";


class PostComment extends Component {

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

            // if (comment === undefined) return (<li className='comment-item'>Loading..</li>);

            const fullname = `${comment.user.firstname} ${comment.user.lastname}`;
            const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));

            return (<li key={comment.id} className='comment-item'>
                <div className='comment-item-header'>
                    <Link to={`/${comment.user.username}/home`}>
                        <div className="d-inline" ref={(elem) => {
                            if (elem === null) return;
                            bindTooltip(elem, html, {theme: 'avatar'});

                        }}><img className='comment-item-avatar' src={avatar}/>{fullname}</div>
                    </Link>
                    <span className='when'>{comment.when}</span>
                </div>
                <div className='comment-item-body'>
                    <CommentEntry authorization={authorization} username={username}
                                  postId={postId}
                                  comment={comment}
                                  configuration={configuration}
                    />
                </div>
            </li>)
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
        const {authorization, username, id, comments, configuration, isAuthorized} = this.props;
        if(!comments) return null;

        return (
            <div className='post-comment'>

                <a data-toggle="collapse" href={`#comment${id}`}
                   aria-expanded="false" aria-controls={id}>
                    {comments.length} Comments
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </a>

                <div className="collapse" id={`comment${id}`}>
                    <ul className='list-group'>
                        {this.renderCommentEntries(authorization, username, id, comments, configuration)}
                        {isAuthorized && <EmojiEditableBox id={id} callback={this.handleEditableBoxEnter.bind(this)}/>}
                    </ul>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    comments: state.comments[ownProps.id],
    isAuthorized: isAuthorized(state),
});

export default connect(mapStateToProps, {asyncFetchComments, asyncCreateComment})(PostComment);