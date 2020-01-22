/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [slideout-provider-hook.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 25.11.19, 14:20
 */
import React, {useState, useEffect} from 'react';

import Slideout from '../../vendor/slideout/slideout';
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import Waves from '../../../node_modules/node-waves';

import '../../vendor/slideout/slideout.css';
import {showForceVisibleImages} from "../../actions/image-handler";
import SlideoutNavigation from "./slideout-navigation";

export const SlideoutContext = React.createContext();
Waves.init();
console.log('INIT???????????');

const SlideoutProviderHook = (props) => {

    let slideout;
    const [overlayScrollbars, setOverlayScrollbars] = useState(() => {


        return OverlayScrollbars(document.querySelectorAll('body'), {
            callbacks: {
                onScrollStop: event => {
                    showForceVisibleImages();
                }
            }
        });
    });

    const [isIOSDevice, setIOSDevice] = useState(()=> {
        return !!navigator.platform.match(/iPhone|iPod|iPad/);
    });

    useEffect(() => {
        const menu = document.getElementById('slide-menu-id');
        const panel = document.getElementById('slide-panel-id');
        slideout = new Slideout({
            'panel': panel,
            'menu': menu,
            'padding': 256,
            'tolerance': 70,
            side: 'left',
            touch: false
        });

        slideout.on('open', () => {
            const navigation = document.querySelector(".slideout-navigation-menu");
            navigation.classList.add(".slideout-navigation-menu-open");

            if (isIOSDevice) {
                const panel = document.querySelector(".slideout-panel");
                navigation.classList.add(".slideout-panel-transform");
            }

        });

        slideout.on('close', () => {
            const navigation = document.querySelector(".slideout-navigation-menu");
            navigation.classList.remove(".slideout-navigation-menu-open");

            if (isIOSDevice) {
                const panel = document.querySelector(".slideout-panel");
                navigation.classList.remove(".slideout-panel-transform");
            }
        });
    }, []);


    return (
        <SlideoutContext.Provider value={{
            isOpen: slideout && slideout.isOpen(),
            overlayScrollbars: overlayScrollbars,
            isIOSDevice: isIOSDevice,
            toggle: () => slideout.toggle(),
            open: () => slideout.open(),
            close: () => slideout.close()
        }}>
            <SlideoutNavigation/>
            <div id="slide-panel-id">
                <div className='container-fluid'>
                    {props.children}
                </div>
            </div>
        </SlideoutContext.Provider>
    )
};

export default SlideoutProviderHook;