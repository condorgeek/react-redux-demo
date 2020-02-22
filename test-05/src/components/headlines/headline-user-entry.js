/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [headline-user-entry.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 01.02.19 23:38
 */
import he from '../../../node_modules/he/he';

import React, {Component} from 'react';

import {HeadlineTitle} from "../navigation-headlines/nav-headlines";
import NavigationMoreLess from "../navigation-headlines/navigation-more-less";

export default class HeadlineUserEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false, isVisible: false};
    }

    // componentDidMount() {
    //     if(this.refElem) this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    // }
    //
    // componentDidUpdate() {
    //     if(this.refElem) this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    // }

    isFullview(text) {
        const regex = /<div.*[class|className]\s*=.*fullview.*?>/ig;
        return this.props.fullview ? true : regex.test(text);
    }

    breakText(text, num) {
        return text.split(" ").splice(0, num).join(" ");
    }

    toggle = (event) => {
        event.preventDefault();
        const isVisible = this.refElem.classList.toggle('active-show');
        this.setState({isVisible: isVisible})
    };

    render() {
        const {title, text, icon, fullview, active} = this.props;
        const {isVisible, open} = this.state;
        if(!text) return '';

        const isOverflow = !this.isFullview(text) && text.length > 800;
        const content = isOverflow && !open ? this.breakText(text, 120) : text;

        return <div className="headline-entry">
            <HeadlineTitle title={title} onClick={this.toggle}/>

            <div className={`headline-text-toggle ${active ? 'active-show' : ''}`} ref={elem => {
                if(!elem) return;
                this.refElem = elem;
                elem.innerHTML = he.decode(elem.innerHTML);
            }}>{content}
            </div>

            {isOverflow && isVisible && <NavigationMoreLess open={open} onClick={(event) =>{
                event.preventDefault();
                this.setState({open: !this.state.open});
            }}/>}

        </div>;
    }
}