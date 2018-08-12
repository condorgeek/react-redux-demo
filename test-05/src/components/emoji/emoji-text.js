import emojione from '../../../node_modules/emojione/lib/js/emojione';
// import tippy from 'tippy.js'
import tippy from '../util/tippy.all.patched'
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
import {asyncCreateCommentLike} from "../../actions/index";

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

    renderStatistics(indexedLikes, reaction) {
        const templateId = `#comment-tooltip-${this.props.id}`;


        return (indexedLikes[reaction].length > 0) ?
            <div>
                <div className='badge badge-pill badge-light'
                     ref={(elem) => {
                         if (elem === null) return;
                         const html = ReactDOMServer.renderToStaticMarkup(renderTooltip(indexedLikes[reaction]));
                         const initialText = document.querySelector(templateId).textContent;

                         const tooltip = tippy(elem, {
                             html: templateId, interactive: true,
                             placement: 'bottom', theme: 'honeybee',
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
                             }

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

function mapStateToProps(state, ownProps) {
    return state.commentlikes[ownProps.id] !== undefined ? {likes: state.commentlikes[ownProps.id]} : {};
}

export default connect(mapStateToProps, {asyncCreateCommentLike})(EmojiText);