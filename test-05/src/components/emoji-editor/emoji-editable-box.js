/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [editable-box.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.10.18 17:44
 */

// Emoji documentation:
// https://github.com/emojione/emojione/blob/master/INSTALLATION.md
// https://www.webpagefx.com/tools/emoji-cheat-sheet/
// https://www.emojicopy.com/
// https://stackoverflow.com/questions/9284117/inserting-arbitrary-html-into-a-documentfragment
// http://help.dottoro.com/ljnjoumd.php
// https://html5-editor.net/
// https://ourcodeworld.com/articles/read/282/how-to-get-the-current-cursor-position-and-selection-within-a-text-input-or-textarea-in-javascript
// https://hackernoon.com/easily-create-an-html-editor-with-designmode-and-contenteditable-7ed1c465d39b
// http://jsfiddle.net/jwvha/1/
// ***! https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div

import $ from 'jquery';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import {showTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';
import EmojiNavigationPanel from './emoji-navigation-panel';

window.jQuery = $;

// $.fn.pasteHtmlAtCaret = function pasteHtmlAtCaret(html) {
//     var sel, range;
//
//     $(this).focus();
//
//     if (window.getSelection) {                          // IE9 and non-IE
//         sel = window.getSelection();
//
//         console.log('SEL', sel);
//
//         if (sel.getRangeAt && sel.rangeCount) {
//             range = sel.getRangeAt(0);
//             range.deleteContents();
//
//             var el = document.createElement("div");
//             el.innerHTML = html;
//             var frag = document.createDocumentFragment(), node, lastNode;
//             while ((node = el.firstChild)) {
//                 lastNode = frag.appendChild(node);
//             }
//             range.insertNode(frag);
//
//             if (lastNode) {                             // Preserve the selection
//                 range = range.cloneRange();
//                 range.setStartAfter(lastNode);
//                 range.collapse(true);
//                 sel.removeAllRanges();
//                 sel.addRange(range);
//             }
//         }
//     } else if (document.selection && document.selection.type != "Control") {
//         document.selection.createRange().pasteHTML(html); // IE < 9
//     }
//
// };

function pasteHtmlAtCaret(html) {
        var sel, range;
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
                while ( (node = el.firstChild) ) {
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
        } else if (document.selection && document.selection.type !== "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
}


const regex = new RegExp("<span[^>]+class=\"emojione.*\".*title=\"(:.*:)\"[^>]*>.*?<\\/span>(&nbsp;(.*)*(<\\/span>)*)*");

export default class EmojiEditableBox extends Component {

    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;
        emojione.ascii = true;

        this.handleEditorEnter = this.handleEditorEnter.bind(this);
        this.handleEmojiShortName = this.handleEmojiShortName.bind(this);
    }

    componentDidMount() {
        this.setState({});
    }

    handleEditorEnter(event) {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();

            console.log('EMOJI_EDITOR', event.target.innerHTML);

            const entries = event.target.innerHTML.split(/(?=<span class="emojione.*<\/span>)/g).map(entry => {
                entry = entry.replace(/<span>(&nbsp;)?<\/span>/, "").replace(/&nbsp;/g, "");
                return entry.replace(regex, "$1 $3");
            });

            this.props.callback(emojione.toShort(entries.join('')));
            event.target.innerHTML = "";
        }
    }

    handleEmojiShortName(shortName) {
        $(`#emoji-editable-${this.props.id}`).focus();
        if(!shortName) return;

        // pasteHtmlAtCaret(`&#8203;${emojione.shortnameToImage(shortName)}&#8203;`);
        pasteHtmlAtCaret(`&nbsp;${emojione.shortnameToImage(shortName)}&nbsp;`);
    }

    renderBoxNavigation() {
        const {mediaupload, youtube, vimeo, soundcloud} = this.props;
        const hasNavigation = mediaupload || youtube || vimeo || soundcloud;

        if(!hasNavigation) return "";

        return  <div className="editable-box-navigation"><div className='editable-box-nav'>
            <button title="Upload image files" className="btn btn-sm btn-darkblue" onClick={(event) => mediaupload(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="far fa-images"/></button>
            <button title="Link to youtube" className="btn btn-sm btn-darkblue" onClick={(event) => youtube(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="fab fa-youtube-square" /></button>
            <button title="Link to vimeo" className="btn btn-sm btn-darkblue" onClick={(event) => vimeo(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="fab fa-vimeo-square" /></button>
            <button title="Link to soundcloud" className="btn btn-sm btn-darkblue" onClick={(event) => soundcloud(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="fab fa-soundcloud" /></button>
        </div></div>
    }

    render() {
        const {id, text} = this.props;

        return (
            <div className='emoji-editable-box'>
               {this.renderBoxNavigation()}

               <div contentEditable="true" className="editable-box-content" id={`emoji-editable-${id}`}
                     placeholder='Enter your comment' onKeyDown={this.handleEditorEnter} ref={elem => {
                         if(!elem || !text) return;
                         elem.innerHTML = text;
               }}/>
                <EmojiNavigationPanel id={id} callback={this.handleEmojiShortName}/>

            </div>
        )
    }

}

