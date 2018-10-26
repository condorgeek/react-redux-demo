/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headlines-generic.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.10.18 15:48
 */

import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';
import {randompic} from "../../static/index";
import MediaGallery from './media-gallery';

export default class HeadlinesGeneric extends Component {

    constructor(props) {
        super(props);
        this.state = {images: this.createPics()};
    }

    componentDidMount() {
        OverlayScrollbars(document.getElementById('pictures-container-id'), {});
    }

    createPics() {
        return Array(20).fill(0).map((idx) => {
            return randompic();
        })
    }

    renderPics() {
        const {images} = this.state;

        return images.map((image, idx) => {
            return (<div key={idx} className="card">
                <img className="card-img-top" src={image}
                     onClick={() => this.refs.imagegallery.renderLightbox(idx)}/>
            </div>)
        })
    }

    render() {

        return (
            <div className='headlines-container'>

                <div className='headline'>
                <h5>About this Space</h5>
                {/*<span onClick={() => this.refs.videogallery.renderLightbox(0)}>*/}
                {/*<i className="fa fa-youtube-play" aria-hidden="true"/>Video Gallery</span>*/}
                </div>

                <div className='headline'>
                    <h5>Pictures</h5>
                    <span onClick={() => this.refs.imagegallery.renderLightbox(0)}>
                        <i className="fa fa-th-large" aria-hidden="true"/>Picture Gallery</span>
                </div>
                <div id='pictures-container-id' className='pictures-container'>
                    <div className='card-columns'>
                        {this.renderPics()}
                    </div>
                </div>

                <MediaGallery media={this.state.images} ref='imagegallery'/>
            </div>
        );
    }
}