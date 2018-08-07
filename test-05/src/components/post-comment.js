import $ from 'jquery';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchComments, asyncCreateComment, ROOT_STATIC_URL} from '../actions';
import EmojiBox from './emoji/emoji-box';
import EmojiText from './emoji/emoji-text';

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

    renderComments(authorization, username, id, comments) {

        if (comments == null || comments === undefined) {
            return <div>Loading..</div>
        }

        if (comments.length > 0) {
            return comments.map((entry, idx) => {
                const avatar =  `${ROOT_STATIC_URL}/${entry.user.avatar}`;

                if (entry === undefined) return (<li className='comment-item'>Loading..</li>);
                const fullname = `${entry.user.firstname} ${entry.user.lastname}`;

                return (<li key={entry.id} className='comment-item'>
                    <div className='header'>
                        <Link to={`/${entry.user.username}/home`}><img className='user-thumb' src={avatar}/>
                            {fullname}
                        </Link>
                        <span className='when'>{entry.when}</span>
                    </div>
                    <div className='body'>
                        <EmojiText authorization={authorization} username={username} id={entry.id} comment={entry.text} likes={entry.likes}/>
                    </div>
                </li>)
            });
        }
    }

    handleTextAreaEnter(comment) {
        console.log(comment);

        const {authorization, id} = this.props;

        if (comment.length > 0) {
            this.props.asyncCreateComment(authorization.user.username, id, {text: comment, username: authorization.user.username},
                () => {
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
                        {this.renderComments(authorization, username, id, comments)}
                        <EmojiBox id={id} callback={this.handleTextAreaEnter.bind(this)}/>
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