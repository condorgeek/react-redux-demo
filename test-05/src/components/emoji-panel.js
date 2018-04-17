import $ from 'jquery';
import emojione from '../../node_modules/emojione/lib/js/emojione';
import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import {emojifilters} from './emoji-filter';
import React, {Component} from 'react';

window.jQuery = $;

class PanelData extends Component {
    constructor(props) {
        super(props);
        this.state = {loaded: false, items: null}
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        const emojis = document.getElementsByClassName(`panel-data-icon${this.props.id}`);
        [...emojis].forEach(elem => {
            elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        });

        setTimeout(()=>{
            OverlayScrollbars(document.querySelectorAll('.emoji-tab-content'), {
                scrollbars : {
                    visibility: "visible"}
            });
        }, 3000);

    }

    panelDataIcon(shortname) {
        return <div className={`panel-data-icon${this.props.id} panel-data-icon`}>
            {`:${shortname}:`}
            </div>;
    }

    loadEmoji(family) {

        const emojis = emojifilters[family].emoji.split(" ").map(shortname => {
            return this.panelDataIcon(shortname);
        });
        return emojis;
    }

    render () {
        return (
            <div>{this.loadEmoji(this.props.family)}</div>
        );
    }
}

export default class EmojiPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {current: null, updated: false, smileys: null};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {

        const emojis = document.getElementsByClassName(`panel-header-icon${this.props.id}`);
        [...emojis].forEach(elem => {
            elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        });
    }

    emojiIcon(text) {
        return <div className={`panel-header-icon${this.props.id} panel-header-icon`}>{`:${text}:`}</div>;
    }

    onClick(event) {
        const target = `#${event.currentTarget.dataset.target}${this.props.id}`;

        event.preventDefault();
        this.setState({current: target})

        if (this.state.current != null) {
            $(this.state.current).collapse('hide');
        }
        $(target).collapse('toggle');
    }

    renderPanelData(emojiFamily) {
        if( this.state.current == `#${emojiFamily}${this.props.id}`) {
            return <PanelData id={this.props.id} family={emojiFamily}/>
        }
        return <div>Loading..</div>
    }

    render() {
        return (
            <div className='emoji-panel'>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="smileys_people" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('yum')}*/}
                            <i className="fa fa-smile-o" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="animals_nature" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('hamster')}*/}
                            <i className="fa fa-paw" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="food_drink" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('pizza')}*/}
                            <i className="fa fa-cutlery" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="activity" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('basketball')}*/}
                            <i className="fa fa-futbol-o" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emiji-nav-item">
                        <div className="emoji-nav-link" data-target="travel_places" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('rocket')}*/}
                            <i className="fa fa-plane" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="objects" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('bulb')}*/}
                            <i className="fa fa-umbrella" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="symbols" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('heartpulse')}*/}
                            <i className="fa fa-heart-o" aria-hidden="true"/>

                        </div>
                    </li>
                    <li className="emoji-nav-item">
                        <div className="emoji-nav-link" data-target="flags" onClick={this.onClick.bind(this)}>
                            {/*{this.emojiIcon('flag_bo')}*/}
                            <i className="fa fa-flag-checkered" aria-hidden="true"/>

                        </div>
                    </li>
                </ul>
                <div className="emoji-tab-content">
                    <div className="collapse fade" id={`smileys_people${this.props.id}`}>
                        {this.renderPanelData('smileys_people')}
                    </div>
                    <div className="collapse fade" id={`animals_nature${this.props.id}`}>
                        {this.renderPanelData('animals_nature')}
                    </div>
                    <div className="collapse fade" id={`food_drink${this.props.id}`}>
                        {this.renderPanelData('food_drink')}
                    </div>
                    <div className="collapse fade" id={`activity${this.props.id}`}>
                        {this.renderPanelData('activity')}
                    </div>
                    <div className="collapse fade" id={`travel_places${this.props.id}`}>
                        {this.renderPanelData('travel_places')}
                    </div>
                    <div className="collapse fade" id={`objects${this.props.id}`}>
                        {this.renderPanelData('objects')}
                    </div>
                    <div className="collapse fade" id={`symbols${this.props.id}`}>
                        {this.renderPanelData('symbols')}
                    </div>
                    <div className="collapse fade" id={`flags${this.props.id}`}>
                        {this.renderPanelData('flags')}
                    </div>
                </div>
            </div>
        );
    }
}
