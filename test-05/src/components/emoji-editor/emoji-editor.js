/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [emoji-editor.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.10.18 17:00
 */

import $ from 'jquery';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import {emojifilters} from './emoji-filter';
import React, {Component} from 'react';
import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";

window.jQuery = $;

class EmojiFamily extends Component {
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
        setTimeout(() => {
            OverlayScrollbars(document.querySelectorAll('.emoji-content'), {
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
            return <button key={shortName}  className={`emoji-family-icon emoji-family-icon-${id}`}
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
            <div className="emoji-family">{this.renderEmojiFamily(id, family)}</div>
        );
    }
}

export default class EmojiEditor extends Component {

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
            return <EmojiFamily id={id} family={family} callback={this.props.callback}/>
        }
        return <div>Loading..</div>
    }

    renderNavigation(id) {
        const tabs = this.tabs.map(tab => {
            return <FlatIcon circle key={tab.family}
                             data-target={tab.family}
                             onClick={this.toggleEmojiPanel}>
                <Icon className={tab.icon}/>
            </FlatIcon>
        });

        return <NavigationRow className='emoji-navigation'>
            <NavigationGroup>
                {tabs}
            </NavigationGroup>
            <NavigationGroup>
                <FlatIcon circle bigger >
                    <Icon className="fas fa-cloud-upload-alt" title='Save post' onClick={this.props.enter}/>
                </FlatIcon>
            </NavigationGroup>
        </NavigationRow>
    }

    renderContent(id) {
        const tabs = this.tabs.map(tab => {
            return <div className="collapse fade" id={`${tab.family}${id}`}>
                    {this.renderEmojiFamily(tab.family, id)}
                </div>
            });

        return <div className="emoji-content">{tabs}</div>
    }

    render() {
        const {id} = this.props;
        return (
            <div className='emoji-editor'>
                {this.renderNavigation(id)}
                {this.renderContent(id)}
            </div>
        );
    }
}
