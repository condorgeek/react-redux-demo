/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [slideout-provider.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 27/05/19 11:01
 */
import React, {Component} from 'react';
import Slideout from '../../../node_modules/slideout/dist/slideout';

export const SlideoutContext = React.createContext();

export default class SlideoutProvider extends Component {
    constructor(props) {
        super(props);
        // const [menuOpenState, setMenuOpenState] = useState(false);
    }

    componentDidMount() {
        const menu = document.getElementById('slide-menu-id');
        const panel = document.getElementById('slide-panel-id');
        console.log('SLIDEOUT', panel, menu);
        this.slideout = new Slideout({
            'panel': panel,
            'menu': menu,
            'padding': 256,
            'tolerance': 70
        });

        // const fixed = document.querySelector('.fixed-header');

        // this.slideout.on('beforeopen', function () {
        //     const top = fixed.getBoundingClientRect().top;
        //     const bottom = fixed.getBoundingClientRect().bottom;
        //     const isVisible = (top >= 0) && (bottom <= window.innerHeight);
        //
        //     menu.style.top = isVisible ? fixed.clientHeight + 'px' : 0;
        // });
        //
        // this.slideout.on('close', function () {
        //     menu.style.top = fixed.clientHeight + 'px';
        // });

        //
        // this.slideout.on('translate', function(translated) {
        //     fixed.style.transform = 'translateX(' + translated + 'px)';
        // });
        //
        // this.slideout.on('beforeopen', function () {
        //     fixed.style.transition = 'transform 300ms ease';
        //     fixed.style.transform = 'translateX(256px)';
        // });
        //
        // this.slideout.on('beforeclose', function () {
        //     fixed.style.transition = 'transform 300ms ease';
        //     fixed.style.transform = 'translateX(0px)';
        // });
        //
        // this.slideout.on('open', function () {
        //     fixed.style.transition = '';
        // });
        //
        // this.slideout.on('close', function () {
        //     fixed.style.transition = '';
        // });
    }

    render() {
        return (
            <SlideoutContext.Provider value={{
                isOpen: this.slideout && this.slideout.isOpen(),
                toggle: () => this.slideout.toggle(),
                open: () => this.slideout.open(),
                close: () => this.slideout.close()
            }}>
                {this.props.children}
            </SlideoutContext.Provider>
        )
    }
}