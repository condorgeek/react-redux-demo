import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createLike} from "../actions";

class EmojiNavigation extends Component {

    constructor(props) {
        super(props);
    }

    buildIndexedLikes(likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};
        likes.forEach(like => {
            index[like.type].push(like);
        });
        return index;
    }

    handleClick(event, like) {
        this.props.createLike(this.props.id, {username: 'amaru.london', type: like});
    }

    renderStatistics(indexedLikes, like) {
        return (indexedLikes[like].length > 0) ?
            <span className='badge badge-pill badge-light'>{indexedLikes[like].length}</span> : ""
    }

    renderLikeEntries() {

        const indexedLikes = this.buildIndexedLikes(this.props.likes);

        return ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'].map(like => {
            return (
                <div key={like} className="like-entry">
                    <span className={`${like.toLowerCase()} like-emoji`}
                          onClick={event => this.handleClick(event, like)}/>
                    {this.renderStatistics(indexedLikes, like)}
                </div>
            )
        })
    }

    render() {
        return (
            <div className="like-navigation">
                <div className="like-content">
                    {this.renderLikeEntries()}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state.likes[ownProps.id] !== undefined ? {likes: state.likes[ownProps.id]} : {};
}

export default connect(mapStateToProps, {createLike})(EmojiNavigation);