/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [widget.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.03.19 17:01
 */
import he from '../../../node_modules/he/he';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {showTooltip} from "../../actions/tippy-config";
import {LOGIN_STATUS_SUCCESS, ROOT_STATIC_URL} from "../../actions";
import {asyncDeleteWidget, asyncUpdateWidget} from "../../actions/spaces";

import WidgetEditForm from "./widget-edit-form";


class Widget extends Component  {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.displayRef) this.displayRef.innerHTML = he.decode(this.displayRef.innerHTML);
    }

    componentDidUpdate() {
        if(this.displayRef) this.displayRef.innerHTML = he.decode(this.displayRef.innerHTML);
    }

    isFullview (text) {
        const regex = /<div.*[class|className]\s*=.*fullview.*?>/ig;
        return this.props.fullview ? true : regex.test(text);
    }

    onDelete = event => {
        const {authname, widget} = this.props;
        this.props.asyncDeleteWidget(authname, widget.id, widget => {
            toastr.info(`Widget ${widget.title} deleted successfully`);
        })
    };

    onEdit = (formdata) => {
        const {authname, widget} = this.props;

        this.props.asyncUpdateWidget(authname, widget.id, formdata, widget => {
            toastr.info(`${widget.title} updated successfully.`)
        });
    };

    render() {
        const {widget, authorization} = this.props;
        const cover = widget.cover ? `${ROOT_STATIC_URL}/${widget.cover}` : null;
        const text = this.isFullview(widget.text) ? widget.text : widget.text.slice(0,240);

        const isAuthorized = authorization.status === LOGIN_STATUS_SUCCESS;

        return <div className="widget">
            <div className="card">
                {cover && <img className="card-img-top" src={cover}/>}
                <div className="card-body">

                    {isAuthorized && <div className="widget-nav">
                        <div title="Delete widget" className="widget-nav-item" ref={(elem) => {
                            elem && showTooltip(elem);
                        }}><button className="btn btn-darkblue btn-sm" onClick={this.onDelete}>
                                <i className="fas fa-trash-alt"/></button>
                        </div>

                        <div title="Edit widget" className="widget-nav-item" ref={(elem) => {
                            elem && showTooltip(elem);}}>
                            <button className="btn btn-darkblue btn-sm" onClick={event => {
                                event.preventDefault();
                                this.editFormRef && this.editFormRef.toggle();
                            }}><i className="fas fa-edit"/></button>
                        </div>
                    </div>}

                    <WidgetEditForm widget={widget} callback={this.onEdit} ref={
                        elem => this.editFormRef = elem}/>

                    {widget.title && <h5 className="card-title">{widget.title}</h5>}
                    <div className="card-texty">
                        <div className="mr-5s d-inlines" ref={elem => {
                            if (!elem) return;
                            this.displayRef = elem;
                            elem.innerHTML = he.decode(elem.innerHTML);
                        }}>{text}
                        </div>
                        {widget.url && <Link to={`/${widget.url}`}>More..</Link>}
                    </div>
                </div>
            </div>
        </div>
    }

}

export default connect(null, {asyncDeleteWidget, asyncUpdateWidget})(Widget);

