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

import $ from 'jquery';
import {bindTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchComments, asyncCreateComment, ROOT_STATIC_URL} from '../../actions/index';
import EmojiEditableBox from '../emoji-editor/emoji-editable-box';
import CommentEntry from './comment-entry';

window.jQuery = $;

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
    }

    componentDidMount() {
        const {username, id} = this.props;
        this.props.fetchComments(username, id);
    }

    renderAvatar (avatar, fullname) {
        return <div className="avatar-tooltip"><span title={fullname}><img src={avatar}/></span></div>
    }

    renderCommentEntries(authorization, username, id, comments) {

        if (comments == null || comments === undefined) {
            return <div>Loading..</div>
        }

        if (comments.length > 0) {
            return comments.map((entry, idx) => {
                const avatar =  `${ROOT_STATIC_URL}/${entry.user.avatar}`;

                if (entry === undefined) return (<li className='comment-item'>Loading..</li>);
                const fullname = `${entry.user.firstname} ${entry.user.lastname}`;
                const html = ReactDOMServer.renderToStaticMarkup(this.renderAvatar(avatar, fullname));

                return (<li key={entry.id} className='comment-item'>
                    <div className='comment-item-header'>
                        <Link to={`/${entry.user.username}/home`}>
                            <div className="d-inline" ref={(elem) => {
                                if (elem === null) return;
                                bindTooltip(elem, html, {theme: 'avatar'});

                            }}><img className='comment-item-avatar' src={avatar}/>{fullname}</div>
                        </Link>
                        <span className='when'>{entry.when}</span>
                    </div>
                    <div className='comment-item-body'>
                        <CommentEntry authorization={authorization} username={username} id={entry.id}
                                   comment={entry.text} likes={entry.likes} created={entry.created}/>
                    </div>
                </li>)
            });
        }
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

        const {authorization, username, id, comments} = this.props;

        if (comments == null || comments === undefined) {
            return <div>Loading..</div>
        }

        return (
            <div className='post-comment'>

                <a data-toggle="collapse" href={`#comment${id}`}
                   aria-expanded="false" aria-controls={id}>
                    {comments.length} Comments
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </a>

                <div className="collapse" id={`comment${id}`}>
                    <ul className='list-group'>
                        {this.renderCommentEntries(authorization, username, id, comments)}
                        <EmojiEditableBox id={id} callback={this.handleEditableBoxEnter.bind(this)}/>
                    </ul>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {comments: state.comments[ownProps.id]}
}

export default connect(mapStateToProps, {fetchComments, asyncCreateComment})(PostComment);