// Emoji documentation:
// https://github.com/emojione/emojione/blob/master/INSTALLATION.md
// https://www.webpagefx.com/tools/emoji-cheat-sheet/
// https://www.emojicopy.com/

import $ from 'jquery';
import emojione from '../../../node_modules/emojione/lib/js/emojione';

import React, {Component} from 'react';
import EmojiPanel from './emoji-panel';

window.jQuery = $;

$.fn.pasteHtmlAtCaret = function pasteHtmlAtCaret(html) {
    var sel, range;

    $(this).focus();

    if (window.getSelection) {                          // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {                             // Preserve the selection
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        document.selection.createRange().pasteHTML(html); // IE < 9
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

            console.log(event.target.innerHTML);

            const entries = event.target.innerHTML.split(/(?=<span class="emojione.*<\/span>)/g).map(entry => {
                entry = entry.replace(/<span>(&nbsp;)?<\/span>/, "").replace(/&nbsp;/g, "");
                return entry.replace(regex, "$1 $3");
            });

            this.props.callback(emojione.toShort(entries.join('')));
            event.target.innerHTML = "";
        }
    }

    handlePanelClick(e, shortcode) {
        const elem = $(`#emoji-editor${this.props.id}`);
        elem.pasteHtmlAtCaret('&#8203;');
        elem.pasteHtmlAtCaret(emojione.shortnameToImage(`:${shortcode}:`));
        elem.pasteHtmlAtCaret('&nbsp;');
    }

    render() {
        return (
            <div className='emoji-box'>

                <div className='emoji-nav'>
                    <i className="fa fa-smile-o ir-2" aria-hidden="true" onClick={(event) => {
                        event.preventDefault();
                        $(`#emojipanel${this.props.id}`).collapse('toggle');
                    }}/>

                    {this.props.mediaupload && <i className="fa fa-picture-o" onClick={(event) => this.props.mediaupload(event)}/>}
                    {this.props.youtube && <i className="fa fa-youtube" onClick={(event) => this.props.youtube(event)}/>}
                    {this.props.vimeo && <i className="fa fa-vimeo-square" onClick={(event) => this.props.vimeo(event)}/>}
                    {this.props.soundcloud && <i className="fa fa-soundcloud" onClick={(event) => this.props.soundcloud(event)}/>}
                </div>

                <div contentEditable="true" className="emoji-editor" id={`emoji-editor${this.props.id}`}
                     onKeyDown={this.handleEditorEnter.bind(this)}
                    // ref={(el) => {
                    //     if (el != null) {el.focus();}
                    // }}
                />
                <div className="collapse" id={`emojipanel${this.props.id}`}>
                    <EmojiPanel id={this.props.id} callback={this.handlePanelClick.bind(this)}/>
                </div>

            </div>
        )
    }

}

