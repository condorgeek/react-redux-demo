/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [emoji-panel.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 19.07.18 14:41
 */

import $ from 'jquery';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import {emojifilters} from './emoji-filter';
import React, {Component} from 'react';

window.jQuery = $;

// function pasteHtmlAtCaret(html) {
//     var sel, range;
//     if (window.getSelection) {
//         // IE9 and non-IE
//         sel = window.getSelection();
//         if (sel.getRangeAt && sel.rangeCount) {
//             range = sel.getRangeAt(0);
//             range.deleteContents();
//
//             // Range.createContextualFragment() would be useful here but is
//             // non-standard and not supported in all browsers (IE9, for one)
//             var el = document.createElement("div");
//             el.innerHTML = html;
//             var frag = document.createDocumentFragment(), node, lastNode;
//             while ( (node = el.firstChild) ) {
//                 lastNode = frag.appendChild(node);
//             }
//             range.insertNode(frag);
//
//             // Preserve the selection
//             if (lastNode) {
//                 range = range.cloneRange();
//                 range.setStartAfter(lastNode);
//                 range.collapse(true);
//                 sel.removeAllRanges();
//                 sel.addRange(range);
//             }
//         }
//     } else if (document.selection && document.selection.type != "Control") {
//         // IE < 9
//         document.selection.createRange().pasteHTML(html);
//     }
// }


class EmojiFamilyPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, items: null};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        const emojis = document.getElementsByClassName(`panel-data-icon${this.props.id}`);
        [...emojis].forEach(elem => {
            elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        });

        setTimeout(() => {
            OverlayScrollbars(document.querySelectorAll('.emoji-tab-content'), {
                scrollbars: {
                    visibility: "visible"
                }
            });
        }, 3000);

    }

    renderEmojiFamily(id, family, callback) {

        return emojifilters[family].emoji.split(" ").map(shortName => {
            return <button key={shortName} className={`panel-data-icon${id} panel-data-icon`}
                        onClick={(event) => {
                            event.preventDefault(); callback(shortName)
                            // event.preventDefault();
                            // document.getElementById(`demo-box-${id}`).focus();
                            // pasteHtmlAtCaret(`&#8203;${emojione.shortnameToImage(`:${shortName}:`)}&#8203;`);
                        }}>
                {`:${shortName}:`}
                </button>;
        });
    }

    render() {
        const {id, family, callback} = this.props;

        return (
            <div className="emoji-family">{this.renderEmojiFamily(id, family, callback)}</div>
        );
    }
}

export default class EmojiNavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {current: null, updated: false, smileys: null};
        emojione.imageType = 'png';
        emojione.sprites = true;

        this.toggleEmojiPanel = this.toggleEmojiPanel.bind(this);
        this.tabs = [{family: 'smileys_people', icon: 'fa-smile-o'},
            {family: 'animals_nature', icon:'fa-paw'},
            {family: 'food_drink', icon: 'fa-cutlery'}, {family: 'activity', icon: 'fa-futbol-o'},
            {family: 'travel_places', icon: 'fa-plane'}, {family: 'objects', icon:'fa-umbrella'},
            {family: 'symbols', icon: 'fa-heart-o'}, {family: 'flags', icon: 'fa-flag-checkered'}];
    }

    componentDidMount() {
        const emojis = document.getElementsByClassName(`panel-header-icon${this.props.id}`);
        [...emojis].forEach(elem => {
            elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        });
    }

    toggleEmojiPanel(event) {
        const target = `#${event.currentTarget.dataset.target}${this.props.id}`;

        event.preventDefault();
        this.setState({current: target});

        if (this.state.current != null) {
            $(this.state.current).collapse('hide');
        }
        $(target).collapse('toggle');
    }

    renderEmojiFamily(family, id) {
        if (this.state.current === `#${family}${id}`) {
            return <EmojiFamilyPanel id={id} family={family} callback={this.props.callback}/>

            // return emojifilters[family].emoji.split(" ").map(shortName => {
            //     return <button key={shortName} className={`panel-data-icon${id} panel-data-icon`}
            //                 onClick={(event) => {
            //                     // e.preventDefault(); callback(e, shortName)
            //                     event.preventDefault();
            //                     document.getElementById(`demo-box-${id}`).focus();
            //                     pasteHtmlAtCaret(`&#8203;${emojione.shortnameToImage(`:${shortName}:`)}&#8203;`);
            //
            //                 }} ref={(elem) => {
            //                     if(elem === null) return;
            //                     elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
            //                 }}>
            //         {`:${shortName}:`}
            //     </button>;
            // });

        }
        return <div>Loading..</div>
    }

    renderTabNavigation(id) {
        const tabs = this.tabs.map(tab => {
            return <li className="emoji-nav-item">
                <div className="emoji-nav-link" data-target={tab.family} onClick={this.toggleEmojiPanel}>
                    <i className={`fa ${tab.icon}`} aria-hidden="true"/>
                </div>
            </li>
        });

        return  <ul className="nav nav-tabs" role="tablist">{tabs}</ul>
    }

    renderTabContent(id) {
        const tabs = this.tabs.map(tab => {
            return <div className="collapse fade" id={`${tab.family}${id}`}>
                    {this.renderEmojiFamily(tab.family, id)}
                </div>
            });

        return <div className="emoji-tab-content">{tabs}</div>
    }

    render() {
        const {id} = this.props;
        return (
            <div className='emoji-navigation-panel'>

                {this.renderTabNavigation(id)}
                {this.renderTabContent(id)}

            </div>
        );
    }
}
