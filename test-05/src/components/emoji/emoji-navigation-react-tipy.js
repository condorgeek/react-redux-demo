// import tippy from '../util/tippy.all.patched'
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {Tooltip} from 'react-tippy';
import {asyncCreateLike} from "../../actions/index";

import '../../../node_modules/tippy.js/dist/tippy.css';
import {ROOT_STATIC_URL} from "../../actions";

class EmojiNavigationReactTipy extends Component {

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

    renderTooltip(likes) {
        return <div className="like-tooltip">
            <ul className="like-tooltip-list">
                {this.renderTooltipEntries(likes)}
            </ul>
        </div>
    }

    renderTooltipEntries(likes) {

        return likes.map(like => {

            const avatar = `${ROOT_STATIC_URL}/${like.user.avatar}`;
            const data = {authorization: this.props.authorization, username: like.user.username};

            return <li className="like-tooltip-entry">
                <a href={`/${like.user.username}/home`}><img className='user-thumb' src={avatar}/>
                    {like.user.firstname} {like.user.lastname}
                </a>
                <div className="like-tooltip-buttons">
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'ADD_FRIENDSHIP'})}
                        onClick={event => this.handleAddFriend(event, data)}>
                        Add friend
                    </button>
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'FOLLOW_USER'})}
                        onClick={event => this.handleAddFollow(event, data)}>
                        Follow
                    </button>
                </div>
            </li>
        })
    }

    handleAddFriend(event, data) {
        console.log('ADD FRIEND', event, data);
    }

    handleAddFollow(event, data) {
        console.log('ADD FOLLOW', event, data);

    }

    handleClick(event, reaction) {
        const {authorization, username, id} = this.props;
        this.props.asyncCreateLike(authorization.user.username, id, {
            username: authorization.user.username,
            reaction: reaction
        });
    }

    renderStatistics(indexedLikes, reaction) {
        const templateId = `#like-template-${this.props.id}`;

        return (indexedLikes[reaction].length > 0) ?
                <Tooltip position="bottom"  interactive useContext distance="30"
                         arrow = "true"
                         animateFill = "false"
                         unmountHTMLWhenHide = "true"
                         multiple = "false"
                         transitionFlip = "false"
                         html = {this.renderTooltip(indexedLikes[reaction])}
                         // onShow = {() => {
                         //        setTimeout(() => {
                         //         OverlayScrollbars(document.querySelector(".like-tooltip"), {});
                         //         }, 1000)
                         // }}
                         // onHidden={ () => {
                         //     const content = this.querySelector('.tippy-content');
                         //     content.innerHTML = "";
                         //     }
                         // }
                >
                    <div className='badge badge-pill badge-light'>
                        {indexedLikes[reaction].length}
                    </div>
                </Tooltip>
            : ""
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
        const {id} = this.props;

        return (

            <div className="like-navigation">
                <div className="like-content">
                    {this.renderLikeEntries()}
                    <div className='right-align'>
                        <a href={"#"}><i className="fa fa-share" aria-hidden="true"/>Share</a>
                    </div>
                </div>

                <div id={`like-template-${id}`} className="d-none">Loading...</div>

            </div>
        )
    }
}

// function handleFriendshipRequest(event, data, timestamp) {
//     if (data === undefined || timestamp === undefined) return;
//     const props = JSON.parse(data);
//
//     switch (props.action) {
//         case 'ADD_FRIENDSHIP':
//             console.log('ADD_FRIENDSHIP', props, event.target, timestamp);
//             event.stopPropagation();
//             return false;
//
//         case 'FOLLOW_USER':
//             console.log('FOLLOW_USER', props, event.target, timestamp);
//             event.stopPropagation();
//             return false;
//
//         default:
//             return;
//     }
// }

function mapStateToProps(state, ownProps) {
    return state.likes[ownProps.id] !== undefined ? {likes: state.likes[ownProps.id]} : {};
}

export default connect(mapStateToProps, {asyncCreateLike})(EmojiNavigationReactTipy);