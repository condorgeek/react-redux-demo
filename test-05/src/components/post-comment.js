import $ from 'jquery';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchComments, createComment} from '../actions';
import EmojiBox from './emoji-box';
import EmojiText from './emoji-text';

window.jQuery = $;

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
    }

    componentDidMount() {
        this.props.fetchComments(this.props.id);
    }

    renderComments(id, comments) {

        if (comments == null || comments === undefined) {
            return <div>Loading..</div>
        }

        if (comments.length > 0) {
            return comments.map((entry, idx) => {

                if (entry === undefined) return (<li className='comment-item'>Loading..</li>);
                const username = `${entry.user.firstname} ${entry.user.lastname}`;

                return (<li key={entry.id} className='comment-item'>
                    <div className='header'>
                        <Link to={`/author/${entry.user}/00`}><img className='user-thumb' src={entry.user.thumbnail}/>
                            {username}
                        </Link>
                        <span className='when'>{entry.when}</span>
                    </div>
                    <div className='body'>
                        <EmojiText id={entry.id} comment={entry.text} likes={entry.likes}/>
                    </div>
                </li>)
            });
        }
    }

    handleTextAreaEnter(comment) {

        console.log(comment);

        if (comment.length > 0) {
            this.props.createComment(this.props.id,
                {text: comment, username: 'jack.north'}, () => {
                    this.forceUpdate();
                });
        }
    }

    render() {

        if (this.props.comments == null || this.props.comments === undefined) {
            return <div>Loading..</div>
        }

        return (
            <div className='post-comment'>

                <a data-toggle="collapse" href={`#comment${this.props.id}`}
                   aria-expanded="false" aria-controls={this.props.id}>
                    {this.props.comments.length} Comments
                    <i className="fa fa-commenting-o" aria-hidden="true"/>
                </a>

                <div className="collapse" id={`comment${this.props.id}`}>
                    <ul className='list-group'>
                        {this.renderComments(this.props.id, this.props.comments)}
                        <EmojiBox id={this.props.id} callback={this.handleTextAreaEnter.bind(this)}/>
                    </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {comments: state.comments[ownProps.id]}
}

export default connect(mapStateToProps, {fetchComments, createComment})(PostComment);