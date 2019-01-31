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
 * Last modified: 31.01.19 11:59
 */
import Swiper from "../../../node_modules/swiper/dist/js/swiper"
import "../../../node_modules/swiper/dist/css/swiper.css"

import React, {Component} from 'react';

import {ROOT_STATIC_URL} from "../../actions";

export default class CoverSlider extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.swiper.destroy();
    }

    renderSlides(space) {
        return space.media.map(mediaspace => {
            return <div className="swiper-slide">
                <img src={`${ROOT_STATIC_URL}/${mediaspace.url}`}/>
            </div>
        });
    }

    render() {
        const {homedata} = this.props;

        if(!homedata) return (<div className="fa-2x billboard-spinner">
            <i className="fas fa-spinner fa-spin"/>
        </div>);


        return <div className="swiper-container" ref={elem => {
            this.swiper = new Swiper (elem, {
                spaceBetween: 30,
                grabCursor: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: true},
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    // dynamicBullets: true,
                },
                // navigation: {
                //     nextEl: '.swiper-button-next',
                //     prevEl: '.swiper-button-prev'},
            });
        }}>

            <div className="swiper-wrapper">
                {this.renderSlides(homedata.space)}
                {this.swiper && this.swiper.update()}
            </div>
            <div className="swiper-pagination"></div>
            {/*<div className="swiper-button-prev"/>*/}
            {/*<div className="swiper-button-next"/>*/}
        </div>
    }
}