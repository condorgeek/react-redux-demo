/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [widget-create-nav.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.03.19 19:22
 */

import React, {Component} from 'react';
import {showTooltip} from "../../actions/tippy-config";
import WidgetCreateForm from "./widget-create-form";

export default class WidgetCreateNav  extends Component {

    render() {
        const {authname} = this.props;

        return <div className="active-space-frame">
            <div className="title-navigation title-widget">
                <button title="Create new widget" type="button" className="btn btn-darkblue btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            this.widgetRef && this.widgetRef.toggle();
                        }}
                        ref={(elem) => {
                            if (elem === null) return;
                            showTooltip(elem);
                        }}><i className="fas fa-cog"/>
                </button>
            </div>
            {/*must check on this ref setting ... the client sets itself in this version - refactor eventually */}
            <WidgetCreateForm authname={authname} onRef={elem => this.widgetRef = elem} mode='RIGHT'/>
        </div>
    }
}