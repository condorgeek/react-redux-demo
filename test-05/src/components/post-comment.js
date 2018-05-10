// Emoji documentation:
// https://github.com/emojione/emojione/blob/master/INSTALLATION.md
// https://www.webpagefx.com/tools/emoji-cheat-sheet/
// https://www.emojicopy.com/

import $ from 'jquery';
import emojione from '../../node_modules/emojione/lib/js/emojione';
// import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchComments, createComment} from '../actions';
import EmojiPanel from './emoji-panel';

window.jQuery = $;

$.fn.insertAtCaret = function (text) {
    return this.each(function () {
        var sel, startPos, endPos, scrollTop;
        if (document.selection && this.tagName == 'TEXTAREA') {
            //IE textarea support
            this.focus();
            sel = document.selection.createRange();
            sel.text = text;
            this.focus();
        } else if (this.selectionStart || this.selectionStart == '0') {
            //MOZILLA/NETSCAPE support
            startPos = this.selectionStart;
            endPos = this.selectionEnd;
            scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length);
            this.focus();
            this.selectionStart = startPos + text.length;
            this.selectionEnd = startPos + text.length;
            this.scrollTop = scrollTop;
        } else {
            // IE input[type=text] and other browsers
            this.value += text;
            this.focus();
            this.value = this.value; // forces cursor to end
        }
    });
};


$.fn.pasteHtmlAtCaret = function pasteHtmlAtCaret(html) {
    var sel, range;

    $(this).focus();
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
};

class EmojiText extends Component {

    componentDidMount() {
        this.setState({});
    }

    render() {
        return (
            <div className='emoji-comment-item' ref={(el) => {
                if (el != null) {
                    el.innerHTML = emojione.shortnameToImage(el.innerHTML);
                }
            }}>
                {this.props.comment}
            </div>
        );
    }
}

const regex = new RegExp("<span[^>]+class=\"emojione.*\".*title=\"(:.*:)\"[^>]*>.*?<\\/span>(&nbsp;(.*)*(<\\/span>)*)*");

class EmojiBox extends Component {

    componentDidMount() {
        this.setState({});
    }

    handleRichBoxEnter(event) {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();

            const entries = event.target.innerHTML.split(/(?=<span class="emojione.*<\/span>)/g).map(entry => {
                entry = entry.replace(/<span>(&nbsp;)?<\/span>/, "").replace(/&nbsp;/, "");
                return entry.replace(regex, "$1 $3");
            });

            this.props.callback(emojione.toShort(entries.join('')));
            event.target.innerHTML = "";
        }
    }

    handleEmojiClick(e, shortcode) {
        console.log(shortcode);
        const elem = $(`#emojibox${this.props.id}`);
        elem.pasteHtmlAtCaret("&nbsp;");
        elem.pasteHtmlAtCaret(emojione.shortnameToImage(`:${shortcode}:`));
    }

    render() {
        return (
            <div>
                <div contentEditable="true" className="emojibox" id={`emojibox${this.props.id}`}
                     placeholder="You.."
                     onKeyDown={this.handleRichBoxEnter.bind(this)}
                     ref={(el) => {
                         if (el != null) {
                             // el.innerHTML = emojione.shortnameToImage(el.innerHTML);
                             console.log('Within emojibox ref', el.innerHTML);
                         }
                     }}
                />
                <div className="collapse" id={`emojipanel${this.props.id}`}>
                    <EmojiPanel id={this.props.id} callback={this.handleEmojiClick.bind(this)}/>
                </div>

            </div>
        )
    }
}

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        this.props.fetchComments(this.props.id);
        // const textarea = `textarea${this.props.id}`;
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
                        <EmojiText idx={`${id}-${idx}`} comment={entry.text}/>
                    </div>
                </li>)
            });
        }
    }

    handleTextAreaEnter(comment) {

        // if (event.keyCode === 13 && event.shiftKey === false) {
        //     event.preventDefault();
        //     if (comment.length > 0) {
        //         this.props.createComment(this.props.id,
        //             {text: comment, username: 'jack.north'}, () => {
        //                 this.forceUpdate();
        //             });
        //     }
        //     event.target.value = '';
        // }

        console.log(comment);

    }

    // handleEmojiClick(e, shortcode) {
    //     console.log(shortcode);
    //     $(`#textarea${this.props.id}`).insertAtCaret3(`:${shortcode}:`);
    // }

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
                        <div className='new-comment'>
                            <i className="fa fa-smile-o ir-2" aria-hidden="true" onClick={(event) => {
                                event.preventDefault();
                                $(`#emojipanel${this.props.id}`).collapse('toggle');
                            }}/>
                            <i className="fa fa-commenting-o" aria-hidden="true"/>
                            {/*<textarea id={`textarea${this.props.id}`}*/}
                            {/*onKeyDown={this.handleTextAreaEnter.bind(this)}*/}
                            {/*placeholder="You.."/>*/}

                            {/*<div contentEditable="true" className="richbox" id={`textarea${this.props.id}`}*/}
                            {/*onKeyDown={this.handleTextAreaEnter.bind(this)}*/}
                            {/*placeholder="You.."*/}
                            {/*ref={(el)=> {if (el != null) {*/}
                            {/*// el.innerHTML = emojione.shortnameToImage(el.innerHTML);*/}
                            {/*console.log('Inser emoji', el.innerHTML);*/}
                            {/*}}}*/}
                            {/*/>*/}

                            <EmojiBox id={this.props.id} callback={this.handleTextAreaEnter.bind(this)}/>

                            {/*<div className="collapse" id={`emojipanel${this.props.id}`}>*/}
                            {/*<EmojiPanel id={this.props.id} callback={this.handleEmojiClick.bind(this)}/>*/}
                            {/*</div>*/}
                        </div>
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