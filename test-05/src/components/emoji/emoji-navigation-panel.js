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

class EmojiFamilyPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, items: null};
        emojione.imageType = 'png';
        emojione.sprites = true;

        this.handleEmojiClick = this.handleEmojiClick.bind(this);
        this.localstate = this.localstate.bind(this)({loaded: false, items: null});
    }

    localstate(data) {
        let state = data;
        return {
            set(newstate) {
                state = {...state, ...newstate};
                return state;
            },
            get() {return state;}
        }
    }

    componentDidMount() {
        // const emojis = document.getElementsByClassName(`emoji-family-icon-${this.props.id}`);
        // [...emojis].forEach(elem => {
        //     elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        // });

        setTimeout(() => {
            OverlayScrollbars(document.querySelectorAll('.emoji-tab-content'), {
                scrollbars: {
                    visibility: "visible"
                }
            });
        }, 3000);

    }

    handleEmojiClick(event) {
        const {callback} = this.props;

        event.preventDefault();
        callback(event.target.getAttribute("title"));
    }

    renderEmojiFamily(id, family) {

        $(`#emoji-editable-${this.props.id}`).focus();

        if (this.localstate.get().loaded === true) {
            this.localstate.set({loaded: false});
            return;
        }
        this.localstate.set({loaded: true});

        return emojifilters[family].emoji.split(" ").map(shortName => {
            return <button key={shortName}  className={`emoji-family-icon btn emoji-family-icon-${id}`}
                           ref={(elem) => {
                               if(elem === null) return;
                               elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
                           }}
                           onClick={this.handleEmojiClick}>
                        {`:${shortName}:`}
                    </button>;
        });
    }

    render() {
        const {id, family, callback} = this.props;
        return (
            <div className="emoji-family-panel">{this.renderEmojiFamily(id, family)}</div>
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

        this.tabs = [{family: 'smileys_people', icon: 'far fa-smile'},
            {family: 'animals_nature', icon:'fas fa-paw'},
            {family: 'food_drink', icon: 'fas fa-utensils'}, {family: 'activity', icon: 'fas fa-futbol'},
            {family: 'travel_places', icon: 'fas fa-plane'}, {family: 'objects', icon:'fas fa-umbrella'},
            {family: 'symbols', icon: 'fas fa-heart'}, {family: 'flags', icon: 'fas fa-flag-checkered'}];
    }

    toggleEmojiPanel(event) {
        const elem = `#${event.currentTarget.dataset.target}${this.props.id}`;

        event.preventDefault();
        this.setState({current: elem});

        if (this.state.current != null) {
            $(this.state.current).collapse('hide');
        }
        $(elem).collapse('toggle');
    }

    renderEmojiFamily(family, id) {
        if (this.state.current === `#${family}${id}`) {
            return <EmojiFamilyPanel id={id} family={family} callback={this.props.callback}/>
        }
        return <div>Loading..</div>
    }

    renderTabNavigation(id) {
        const tabs = this.tabs.map(tab => {
            return <li className="emoji-tab-item">
                <button className="btn btn-sidebar emoji-tab-btn" data-target={tab.family} aria-expanded="false"
                     onClick={this.toggleEmojiPanel}>
                    <i className={tab.icon} aria-hidden="true"/></button>
            </li>
        });

        return  <ul className="nav nav-tabs emoji-tab-nav" role="tablist">{tabs}</ul>
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
