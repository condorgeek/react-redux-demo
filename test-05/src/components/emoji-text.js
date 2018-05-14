import emojione from '../../node_modules/emojione/lib/js/emojione';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createCommentLike} from "../actions";

class EmojiText extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        this.setState({});
    }

    buildIndexByReaction(likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};
        likes.forEach(like => {
            index[like.reaction].push(like);
        });
        return index;
    }


    renderStatistics(indexedLikes) {
        return (indexedLikes['LIKE'].length > 0) ?
            <span className='badge badge-pill badge-light'>{indexedLikes['LIKE'].length}</span> : ""
    }

    handleClick(event) {
        this.props.createCommentLike(this.props.id, {username: 'amaru.london', reaction: 'LIKE'});
    }

    render() {
        const indexedByReaction = this.buildIndexByReaction(this.props.likes);

        return (
            <div className="emoji-text">
                <div className='emoji-comment-item' ref={(el) => {
                    if (el != null) {
                        el.innerHTML = emojione.shortnameToImage(el.innerHTML);
                    }
                }}>{this.props.comment}</div>

                <div onClick={this.handleClick.bind(this)}>
                    <span className='like like-emoji'/>
                </div>

                {this.renderStatistics(indexedByReaction)}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return state.commentlikes[ownProps.id] !== undefined ? {likes: state.commentlikes[ownProps.id]} : {};
}

export default connect(mapStateToProps, {createCommentLike})(EmojiText);