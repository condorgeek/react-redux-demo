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
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import {emojifilters} from './emoji-filter';
import React, {Component} from 'react';
import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {NavigationToggler} from "../navigation-headlines/nav-headlines";

class EmojiFamily extends Component {
    constructor(props) {
        super(props);
        emojione.imageType = 'png';
        emojione.sprites = true;

        this.handleEmojiClick = this.handleEmojiClick.bind(this);
    }

    handleEmojiClick(event) {
        const {callback} = this.props;

        event.preventDefault();
        callback(event.target.getAttribute("title"));
    }

    renderEmojiFamily(id, family) {
        return emojifilters[family].emoji.split(" ").map(shortName => {
            return <button key={shortName}  className='emoji-family-icon'
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
        const {id, family} = this.props;

        return <div className="emoji-content" ref={(ref) => {
            if(!ref) return;
            setTimeout(() => {
                OverlayScrollbars(ref, {scrollbars: {visibility: "visible"}});
            }, 3000);
        }}>
            <div className="emoji-family" >{this.renderEmojiFamily(id, family)}</div>
        </div>
    }
}

export default class EmojiToggler extends Component {
    constructor(props) {
        super(props);
        this.state = {family: null};
        emojione.imageType = 'png';
        emojione.sprites = true;

        this.tabs = [{family: 'smileys_people', icon: 'far fa-smile'},
            {family: 'animals_nature', icon:'fas fa-paw'},
            {family: 'food_drink', icon: 'fas fa-utensils'}, {family: 'activity', icon: 'fas fa-futbol'},
            {family: 'travel_places', icon: 'fas fa-plane'}, {family: 'objects', icon:'fas fa-umbrella'},
            {family: 'symbols', icon: 'fas fa-heart'}, {family: 'flags', icon: 'fas fa-flag-checkered'}];
    }

    toggleFamily = (event) => {
        const family = event.currentTarget.dataset.target;
        event.preventDefault();

        if(this.state.family !== family) {
            this.setState({family: family});
            this.emojiRef && this.emojiRef.show();
            return;
        }
        this.emojiRef && this.emojiRef.toggle();
    };

    renderNavigation(id) {
        const tabs = this.tabs.map(tab => {
            return <FlatIcon circle key={tab.family}
                             data-target={tab.family}
                             onClick={this.toggleFamily}>
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

    render() {
        const {id} = this.props;
        const {family} = this.state;

        return <div className='emoji-toggler'>
            {this.renderNavigation(id)}

            {family && <NavigationToggler show onRef={(ref) => this.emojiRef = ref}>
                    <EmojiFamily id={id} family={family} callback={this.props.callback}/>
                </NavigationToggler>}
        </div>
    }
}
