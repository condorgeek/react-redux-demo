/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [cover-slider.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 11.12.19, 12:54
 */
import Swiper from "swiper"
import "swiper/css/swiper.css"

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getStaticImageUrl} from "../../actions/environment";

class CoverSlider extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.swiper.destroy();
    }

    renderSlides(space) {
        return space.media.map(mediaspace => {
            return <div key={mediaspace.id} className="swiper-slide">
                <img data-src={getStaticImageUrl(mediaspace.url)} className="swiper-lazy"/>
                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"/>
            </div>
        });
    }

    render() {
        const {space, localconfig} = this.props;

        if(!space) return (<div className="fa-2x billboard-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);

        localconfig && this.swiper && this.swiper.destroy();

        return <div className="swiper-container" ref={elem => {
            this.swiper = new Swiper (elem, {
                spaceBetween: 3,
                lazy: true,
                grabCursor: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: true},
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }}>

            <div className="swiper-wrapper">
                {this.renderSlides(space)}
                {this.swiper && this.swiper.update()}
            </div>
            <div className="swiper-pagination"/>
        </div>
    }
}

function mapStateToProps(state) {
    return {localconfig: state.localconfig}
}

export default connect(mapStateToProps, {})(CoverSlider)