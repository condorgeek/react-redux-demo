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
 * Last modified: 07.02.19 10:44
 */
import he from '../../../node_modules/he/he';
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {showTooltip} from "../../actions/tippy-config";

import {ROOT_STATIC_URL} from "../../actions";
import {asyncDeleteWidget} from "../../actions/spaces";

class __Widget extends Component  {

    constructor(props) {
        super(props);
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

    onEdit = event => {
        console.log('EDIT')
    };

    render() {
        const {widget} = this.props;
        const cover = widget.cover ? `${ROOT_STATIC_URL}/${widget.cover}` : null;
        const text = this.isFullview(text) ? text : widget.text.slice(0,240);

        return <div className="widget">
            <div className="card">
                {cover && <img className="card-img-top" src={cover}/>}
                <div className="card-body">

                    <div className="widget-nav">

                        <div title="Delete widget" className="widget-nav-item" ref={(elem)=> {
                            elem && showTooltip(elem);
                        }}><button className="btn btn-darkblue btn-sm" onClick={this.onDelete}>
                            <i className="fas fa-trash-alt"/></button></div>

                        <div title="Edit widget" className="widget-nav-item" ref={(elem)=> {
                            elem && showTooltip(elem);
                        }}><button className="btn btn-darkblue btn-sm" onClick={this.onEdit}>
                             <i className="fas fa-edit"/></button></div>

                    </div>

                    <h5 className="card-title">{widget.title}</h5>
                    <div className="card-text">
                        <div className="mr-1" ref={elem => {
                            if (!elem) return;
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

export const Widget = connect(null, {asyncDeleteWidget})(__Widget);

export const SpaceWidget = ({space}) => {
    const cover = `${ROOT_STATIC_URL}/${space.cover}`;
    const activespace = `/${space.user.username}/space/${space.id}`;

    return <div className="card">
        <img className="card-img-top" src={cover}/>
        <div className="card-body">
            <h5 className="card-title">{space.name}</h5>
            <div className="card-text">
                {space.description.slice(0,120)}
                {/*<Link to={activespace}><span className="widget-text">{space.description.slice(0,60)}</span></Link>*/}
            </div>
        </div>
    </div>
};