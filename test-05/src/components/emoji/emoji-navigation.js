import tippy from 'tippy.js'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {asyncCreateLike} from "../../actions/index";

import '../../../node_modules/tippy.js/dist/tippy.css';


class EmojiNavigation extends Component {

    constructor(props) {
        super(props);
    }

    buildIndexByReaction(likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};
        likes.forEach(like => {
            index[like.reaction].push(like);
        });
        return index;
    }

    handleClick(event, reaction) {
        const {username, id} = this.props;
        this.props.asyncCreateLike(username, id, {username: username, reaction: reaction});
    }

    renderLikesTooltip(likes) {
        return likes.map(like => {
            return <li>{like.user.firstname} {like.user.lastname}</li>
        })
    }

    renderStatistics(indexedLikes, reaction) {
        const id = `${reaction}_tooltip_${this.props.id}`;
        console.log(id);

        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div title="Hello world" className='badge badge-pill badge-light'
                    ref={(elem) => {
                        if (elem === null) return;
                        console.log(elem, reaction, indexedLikes);
                        tippy(elem, {html: `#${id}`});
                    }}>{indexedLikes[reaction].length}</div>
                <div id={id} className="tooltip">
                    Hello from tippy
                    <ul>{this.renderLikesTooltip(indexedLikes[reaction])}</ul>
                </div>
            </div>: ""
    }


    renderLikeEntries() {

        const indexedByReaction = this.buildIndexByReaction(this.props.likes);

        return ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'].map(reaction => {
            return (
                <div key={reaction} className="like-entry">
                    <span className={`${reaction.toLowerCase()} like-emoji`}
                          onClick={event => this.handleClick(event, reaction)}/>
                    {this.renderStatistics(indexedByReaction, reaction)}
                </div>
            )
        })
    }

    render() {
        return (
            <div className="like-navigation">
                <div className="like-content">
                    {this.renderLikeEntries()}
                    <div className='right-align'>
                        <a href={"#"}><i className="fa fa-share" aria-hidden="true"/>Share</a>
                    </div>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state.likes[ownProps.id] !== undefined ? {likes: state.likes[ownProps.id]} : {};
}

export default connect(mapStateToProps, {asyncCreateLike})(EmojiNavigation);