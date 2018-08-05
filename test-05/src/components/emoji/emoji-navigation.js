// import $ from 'jquery';
// import '../../../node_modules/tooltipster/dist/js/tooltipster.bundle';

import tippy from 'tippy.js'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {asyncCreateLike} from "../../actions/index";

// import '../../../node_modules/tooltipster/dist/css/tooltipster.bundle.css';
// import '../../../node_modules/tooltipster/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-light.min.css';
import '../../../node_modules/tippy.js/dist/tippy.css';


// window.jQuery = $;

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

    // renderStatistics(indexedLikes, reaction) {
    //     return (indexedLikes[reaction].length > 0) ?
    //         <div title="Hello world" className='badge badge-pill badge-light'
    //             ref={(elem) => {
    //                 if (elem === null) return;
    //                 console.log(elem, reaction, indexedLikes);
    //                $(elem).tooltipster({theme: 'tooltipster-light'});
    //             }}
    //         >{indexedLikes[reaction].length}</div> : ""
    // }

    renderStatistics(indexedLikes, reaction) {
        return (indexedLikes[reaction].length > 0) ?
            <div title="Hello world" className='badge badge-pill badge-light'
                 ref={(elem) => {
                     if (elem === null) return;
                     console.log(elem, reaction, indexedLikes);
                     // $(elem).tooltipster({theme: 'tooltipster-light'});
                     tippy(elem);
                 }}
            >{indexedLikes[reaction].length}</div> : ""
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