import tippy from 'tippy.js'
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {asyncCreateLike} from "../../actions/index";

import '../../../node_modules/tippy.js/dist/tippy.css';
import {ROOT_STATIC_URL} from "../../actions";

function renderTooltip(likes) {
    return <div className="like-tooltip">
        <ul className="like-tooltip-list">
            {renderTooltipEntries(likes)}
        </ul>
    </div>
}

function renderTooltipEntries(likes) {
    return likes.map(like => {

        const avatar =  `${ROOT_STATIC_URL}/${like.user.avatar}`;

        return <li className="like-tooltip-entry">
            <a href={`/${like.user.username}/home`}><img className='user-thumb' src={avatar}/>
                {like.user.firstname} {like.user.lastname}
            </a>
            </li>
    })
}

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
        const {authorization, username, id} = this.props;
        this.props.asyncCreateLike(authorization.user.username, id, {username: authorization.user.username, reaction: reaction});
    }

    renderStatistics(indexedLikes, reaction) {
        const templateId = `#like-template-${this.props.id}`;

        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(renderTooltip(indexedLikes[reaction]));
                         const initialText = document.querySelector(templateId).textContent;

                         const tooltip = tippy(elem, {html: templateId, interactive: true,
                             placement: 'bottom', theme: 'honeybee',
                             animation: 'shift-toward', arrow: true,
                             onShow() {
                                 const content = this.querySelector('.tippy-content');
                                 if (tooltip.loading || content.innerHTML !== initialText) return;
                                 tooltip.loading = true;
                                 content.innerHTML = html;
                                 tooltip.loading = false;
                                 setTimeout(()=>{
                                     OverlayScrollbars(document.querySelector(".like-tooltip"), {});
                                 }, 1000);

                             },
                             onHidden() {
                                 const content = this.querySelector('.tippy-content');
                                 content.innerHTML = initialText;
                             }

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
                    <div className='right-align'>
                        <a href={"#"}><i className="fa fa-share" aria-hidden="true"/>Share</a>
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

export default connect(mapStateToProps, {asyncCreateLike})(EmojiNavigation);