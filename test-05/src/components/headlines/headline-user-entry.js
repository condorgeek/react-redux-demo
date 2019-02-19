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

import {showTooltip} from "../../actions/tippy-config";

export default class HeadlineUserEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.tooltips = [];
    }

    componentDidMount() {
        if(this.refElem) this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    }

    componentDidUpdate() {
        if(this.refElem) this.refElem.innerHTML = he.decode(this.refElem.innerHTML);
    }

    getIcon() {
        return this.state.open ? <span><i className="far fa-minus-square"/> Less..</span>:
            <span><i className="far fa-plus-square"/> More..</span>;
    }

    getTitle() {
        return this.state.open ? 'Less content': 'More content'
    }

    breakText(text, num) {
        return text.split(" ").splice(0, num).join(" ");
    }

    render() {
        const {title, text, icon} = this.props;
        if(!text) return '';
        const isOverflow = text.length > 400;
        const content = isOverflow && !this.state.open ? this.breakText(text, 40) : text;

        return <div className="headline-entry">
            {title && <div className='headline-entry-title'><i className={icon}/> {title} </div>}
            <div className="headline-entry-text" ref={elem => {
                if(!elem) return;
                this.refElem = elem;
                elem.innerHTML = he.decode(elem.innerHTML);
            }}>{content}</div>

            {isOverflow && <button className="btn btn-more btn-sm" title={this.getTitle()}
                                   onClick={event => {
                                       event.preventDefault();
                                       this.setState({open: !this.state.open});
                                       setTimeout(() => {
                                           if (document.activeElement !== document.body) document.activeElement.blur();
                                       }, 500)
                                   }} ref={elem => {
                if (elem === null) return;
                this.tooltips.push(showTooltip(elem));
            }}>{this.getIcon()}</button>}

        </div>;
    }
}