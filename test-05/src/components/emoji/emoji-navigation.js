import tippy from '../util/tippy.all.patched'
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {asyncCreateLike, asyncAddFollowee, asyncAddFriend} from "../../actions/index";

import '../../../node_modules/tippy.js/dist/tippy.css';
import {ROOT_STATIC_URL} from "../../actions";

class EmojiNavigation extends Component {

    constructor(props) {
        super(props);
        this.handleFriendshipRequest = this.handleFriendshipRequest.bind(this);
    }

    buildIndexByReaction(likes) {
        const index = {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []};
        likes.forEach(like => {
            index[like.reaction].push(like);
        });
        return index;
    }

    handleFriendshipRequest(event, data, timestamp) {
        if (data === undefined || timestamp === undefined) return;
        const props = JSON.parse(data);
        const {action, authorization, username} = props;

        switch (action) {
            case 'ADD_FRIENDSHIP':
                console.log('ADD_FRIENDSHIP', props, event.target, timestamp);
                event.stopPropagation();

                this.props.asyncAddFriend(authorization.user.username, username);
                return false;

            case 'FOLLOW_USER':
                console.log('FOLLOW_USER', props, event.target, timestamp);
                event.stopPropagation();

                this.props.asyncAddFollowee(authorization.user.username, username);
                return false;

            case 'LINK_TO':
                console.log('LINK_TO', username);
                event.stopPropagation();

                this.props.history.push(`/${username}/home`);
                return false;

            default:
                return;
        }
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

            return <li key={like.id} className="like-tooltip-entry">
                <span className="like-link" data-props={JSON.stringify({...data, action: 'LINK_TO'})} onClick={(elem) => console.log(elem)}>
                    <img className='user-thumb' src={avatar}/>
                    {like.user.firstname} {like.user.lastname}
                </span>
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
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(this.renderTooltip(indexedLikes[reaction]));
                         const initialText = document.querySelector(templateId).textContent;
                         const callback = this.handleFriendshipRequest;

                         const tooltip = tippy(elem, {
                             html: templateId, interactive: true,
                             placement: 'bottom',
                             // theme: 'honeybee',
                             animation: 'shift-toward', arrow: true,
                             reactive: true,
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
                             onClick: callback
                         });

                     }}>{indexedLikes[reaction].length}</div>
            </div> : ""
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

                    <div className="bottom-entry">
                        <div className="bottom-navigation">
                            <button title="Share in your home place" type="button" className="btn btn-sidebar btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        tippy(elem, {arrow: true, theme: "sidebar"});
                                    }}><i className="fas fa-share-alt"/>
                            </button>
                            <button title="Edit this post" type="button" className="btn btn-sidebar btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        tippy(elem, {arrow: true, theme: "sidebar"});
                                    }}><i className="fas fa-edit"/>
                            </button>
                            <button title="Delete this post" type="button" className="btn btn-sidebar btn-sm"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        console.log('Share');
                                    }}
                                    ref={(elem)=> {
                                        if (elem === null) return;
                                        tippy(elem, {arrow: true, theme: "sidebar"});
                                    }}><i className="fas fa-trash-alt"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div id={`like-template-${id}`} className="d-none">Loading...</div>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state.likes[ownProps.id] !== undefined ? {likes: state.likes[ownProps.id]} : {};
}

export default withRouter(connect(mapStateToProps, {asyncCreateLike, asyncAddFollowee, asyncAddFriend})(EmojiNavigation));