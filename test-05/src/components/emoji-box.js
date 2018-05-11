// Emoji documentation:
// https://github.com/emojione/emojione/blob/master/INSTALLATION.md
// https://www.webpagefx.com/tools/emoji-cheat-sheet/
// https://www.emojicopy.com/

import $ from 'jquery';
import emojione from '../../node_modules/emojione/lib/js/emojione';

import React, {Component} from 'react';
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

const regex = new RegExp("<span[^>]+class=\"emojione.*\".*title=\"(:.*:)\"[^>]*>.*?<\\/span>(&nbsp;(.*)*(<\\/span>)*)*");

export default class EmojiBox extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        this.setState({});
    }

    handleEditorEnter(event) {
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

    handlePanelClick(e, shortcode) {
        console.log(shortcode);
        const elem = $(`#emoji-editor${this.props.id}`);
        elem.pasteHtmlAtCaret("&nbsp;");
        elem.pasteHtmlAtCaret(emojione.shortnameToImage(`:${shortcode}:`));
    }

    render() {
        return (
            <div className='emoji-box'>

                <i className="fa fa-smile-o ir-2" aria-hidden="true" onClick={(event) => {
                    event.preventDefault();
                    $(`#emojipanel${this.props.id}`).collapse('toggle');
                }}/>
                <i className="fa fa-commenting-o" aria-hidden="true"/>

                <div contentEditable="true" className="emoji-editor" id={`emoji-editor${this.props.id}`}
                     onKeyDown={this.handleEditorEnter.bind(this)}
                     ref={(el) => {if (el != null) {
                         console.log('Within emojibox ref', el.innerHTML);
                     }
                     }}
                />
                <div className="collapse" id={`emojipanel${this.props.id}`}>
                    <EmojiPanel id={this.props.id} callback={this.handlePanelClick.bind(this)}/>
                </div>

            </div>
        )
    }

}

