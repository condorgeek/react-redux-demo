/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [simple-slider.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 20.02.19 21:00
 */
import Swiper from "../../../node_modules/swiper/dist/js/swiper"
import "../../../node_modules/swiper/dist/css/swiper.css"

import React, {Component} from 'react';

export default class SimpleSlider extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.swiper.destroy();
    }

    renderSlides(slides) {
        return slides.map((slide, idx) => {
            return <div key={idx} className="swiper-slide">
                {/*<img src={`${ROOT_STATIC_URL}/${mediaspace.url}`}/>*/}
                {slide.text}
            </div>
        });
    }

    render() {
        const {slides} = this.props;
        return <div className="swiper-container" ref={elem => {
            this.swiper = new Swiper (elem, {
                autoplay: {delay: 6000, disableOnInteraction: false},
            });
        }}>
            <div className="swiper-wrapper">
                {this.renderSlides(slides)}
            </div>
        </div>
    }
}
