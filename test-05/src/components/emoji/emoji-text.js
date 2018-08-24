import axios from 'axios';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import tippy from '../util/tippy.all.patched'
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {asyncCreateCommentLike, asyncAddFollowee, ROOT_STATIC_URL, ROOT_USER_URL} from "../../actions/index";
import {authConfig} from "../../actions/bearer-config";

import '../../../node_modules/tippy.js/dist/tippy.css';


class EmojiText extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        this.setState({});
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

            const avatar =  `${ROOT_STATIC_URL}/${like.user.avatar}`;
            const data = {authorization: this.props.authorization, username: like.user.username};

            return <li className="like-tooltip-entry">
                <a href={`/${like.user.username}/home`}><img className='user-thumb' src={avatar}/>
                    {like.user.firstname} {like.user.lastname}
                </a>
                <div className="like-tooltip-buttons">
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'ADD_FRIENDSHIP'})}>
                        Add friend
                    </button>
                    <button className="btn btn-tooltip btn-sm" data-props={JSON.stringify({...data, action: 'FOLLOW_USER'})}>
                        Follow
                    </button>
                </div>

            </li>
        })
    }

    buildIndexByReaction(likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};
        likes.forEach(like => {
            index[like.reaction].push(like);
        });
        return index;
    }

    renderStatistics(indexedLikes, reaction) {
        const templateId = `#comment-tooltip-${this.props.id}`;


        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(this.renderTooltip(indexedLikes[reaction]));
                         const initialText = document.querySelector(templateId).textContent;

                         const tooltip = tippy(elem, {
                             html: templateId, interactive: true,
                             placement: 'bottom', reactive: true,
                             // theme: 'honeybee',
                             animation: 'shift-toward', arrow: true,
                             onShow() {
                                 const content = this.querySelector('.tippy-content');
                                 if (tooltip.loading || content.innerHTML !== initialText) return;
                                 tooltip.loading = true;
                                 content.innerHTML = html;
                                 tooltip.loading = false;
                                 setTimeout(() => {
                                     OverlayScrollbars(document.querySelector(".like-tooltip"), {});
                                 }, 1000);

                             },
                             onHidden() {
                                 const content = this.querySelector('.tippy-content');
                                 content.innerHTML = initialText;
                             },
                             onClick: handleFriendshipRequest

                         });
                     }}>{indexedLikes[reaction].length}</div>
            </div> : ""
    }

    handleClick(event) {
        const {authorization, id} = this.props;
        this.props.asyncCreateCommentLike(authorization.user.username, id, {username: authorization.user.username, reaction: 'LIKE'});
    }

    render() {
        const indexedByReaction = this.buildIndexByReaction(this.props.likes);
        const {id} = this.props;

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

                {this.renderStatistics(indexedByReaction, 'LIKE')}

                <div id={`comment-tooltip-${id}`} className="d-none">Loading...</div>
            </div>
        );
    }
}

function handleFriendshipRequest(event, data, timestamp) {
    if (data === undefined || timestamp === undefined) return;
    const props = JSON.parse(data);

    const {action, authorization, username} = props;

    switch (action) {
        case 'ADD_FRIENDSHIP':
            console.log('ADD_FRIENDSHIP', props, timestamp);
            event.preventDefault();
            return false;

        case 'FOLLOW_USER':
            console.log('FOLLOW_USER', authorization, username, this.props);
            event.preventDefault();

            // TODO refactor to call within react context with asyncAddFollowee
            axios.put(`${ROOT_USER_URL}/${authorization.user.username}/followee/add`, {followee: username}, authConfig())
                .then(response => {
                    console.log('Success adding follower', response);
                })
                .catch(error => {
                   console.log('Error adding follower', error);
                });

            return false;

        default:
            return;
    }
}

function mapStateToProps(state, ownProps) {
    return state.commentlikes[ownProps.id] !== undefined ? {likes: state.commentlikes[ownProps.id]} : {};
}

export default connect(mapStateToProps, {asyncCreateCommentLike, asyncAddFollowee})(EmojiText);