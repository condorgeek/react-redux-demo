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
    }

    componentDidMount() {
        const emojis = document.getElementsByClassName(`emoji-family-icon-${this.props.id}`);
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
            return <button key={shortName} className={`emoji-family-icon btn emoji-family-icon-${id}`}
                        onClick={(event) => {event.preventDefault(); callback(shortName)}}>
                {`:${shortName}:`}
                </button>;
        });
    }

    render() {
        const {id, family, callback} = this.props;
        return (
            <div className="emoji-family-panel">{this.renderEmojiFamily(id, family, callback)}</div>
        );
    }
}

export default class EmojiNavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {current: null, updated: false, smileys: null};
        emojione.imageType = 'png';
        emojione.sprites = true;

        this.tabs = [{family: 'smileys_people', icon: 'far fa-smile'},
            {family: 'animals_nature', icon:'fas fa-paw'},
            {family: 'food_drink', icon: 'fas fa-utensils'}, {family: 'activity', icon: 'fas fa-futbol'},
            {family: 'travel_places', icon: 'fas fa-plane'}, {family: 'objects', icon:'fas fa-umbrella'},
            {family: 'symbols', icon: 'fas fa-heart'}, {family: 'flags', icon: 'fas fa-flag-checkered'}];
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
        }
        return <div>Loading..</div>
    }

    renderTabNavigation(id) {
        const tabs = this.tabs.map(tab => {
            return <li className="emoji-navigation-item">
                <div className="emoji-navigation-link" data-target={tab.family} onClick={
                    event => this.toggleEmojiPanel(event)
                }><i className={tab.icon} aria-hidden="true"/></div>
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
