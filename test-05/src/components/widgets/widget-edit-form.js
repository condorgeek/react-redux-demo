/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [widget-edit-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.03.19 17:28
 */
import OverlayScrollbars from '../../../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React, {Component} from 'react';

export default class WidgetEditForm extends Component  {

    constructor(props) {
        super(props);
        this.state= {isFormInvalid: '', formdata: {}}; /* form data */
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.widget) this.populateWidget(nextProps.widget);
    }

    populateWidget(widget) {
        this.setState({formdata: {title: widget.title, type: widget.type, text: widget.text,
                url: widget.url, pos: widget.pos, ranking: widget.ranking, cover: widget.cover}});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.callback(this.state.formdata);
    };

    toggle = () => {
        const {widget} = this.props;
        this.populateWidget(widget);
        this.formRef && this.formRef.classList.toggle('active-show');
        setTimeout(() => {
            this.textRef && this.textRef.focus();
        }, 500);
    };

    handleChange = (event) => {
        const form = event.target;
        const formdata = Object.assign(this.state.formdata, {[form.name]: form.value});
        this.setState({formdata: formdata});
    };

    render() {
        const {widget, callback} = this.props;
        const {isFormInvalid, formdata} = this.state;

        return <div className="active-space-frame">
            <div className="active-space-toggle" ref={elem => {
                this.formRef = elem;
                elem && OverlayScrollbars(elem, {
                    // clipAlways: false,
                    // paddingAbsolute: true,
                    // autoHide: "leave"
                    scrollbars : {visibility: "hidden"}
                });
            }}>
                <form noValidate className={isFormInvalid}
                      onSubmit={this.handleSubmit}>
                    <div className='active-space'>
                        <input type="text"  name="title" placeholder={`Enter widget title..`}
                               value={formdata.title || ''}
                               onChange={event => this.handleChange(event)} required/>

                        <input type="text" id="widget-url-id" name="cover" placeholder={`Enter image url..`}
                               value={formdata.cover || ''}
                               onChange={event => this.handleChange(event)}/>

                        <input type="number" name="ranking" placeholder={`Enter ranking..`}
                               size="2"
                               value={formdata.ranking || ''}
                               onChange={event => this.handleChange(event)}/>

                        <div className="form-check form-check-inline mt-2">
                            <input className="form-check-input" type="radio" name="type"
                                   checked={formdata.type==='TEXT'}
                                   onChange={(event) => {
                                       this.handleChange(event);
                                   }}
                                   id="textId" value='TEXT' required/>
                            <label className="form-check-label"
                                   htmlFor="textId">Text</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="type"
                                   checked={formdata.type==='SPACE'}
                                   onChange={(event) => {
                                       this.handleChange(event);
                                   }}
                                   id="spaceId" value='SPACE'/>
                            <label className="form-check-label"
                                   htmlFor="spaceId">Space</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="type"
                                   checked={formdata.type==='USER'}
                                   onChange={(event) => {
                                       this.handleChange(event);
                                   }}
                                   id="userId" value='USER'/>
                            <label className="form-check-label"
                                   htmlFor="userId">User</label>
                        </div>

                        <textarea name="text" placeholder={`Enter widget text..`}
                                  value={formdata.text || ''}
                                  onChange={event => this.handleChange(event)} required ref={elem => {
                                      this.textRef = elem;
                                      OverlayScrollbars(elem, {
                                          resize: "vertical",
                                          // sizeAutoCapable: true,
                                          paddingAbsolute: true,
                                          // scrollbars : {visibility: "hidden"}
                                      });
                                  }}/>

                        <input type="text" id="widget-url-id" name="url" placeholder={`Enter content url..`}
                               value={formdata.url || ''}
                               onChange={event => this.handleChange(event)}/>

                        <div className="form-check form-check-inline mt-2">
                            <input className="form-check-input" type="radio" name="pos"
                                   checked={formdata.pos==='RTOP'}
                                   onChange={(event) => this.handleChange(event)}
                                   id="rtopId" value='RTOP' required/>
                            <label className="form-check-label"
                                   htmlFor="rtopId">Top</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="pos"
                                   checked={formdata.pos==='RBOTTOM'}
                                   onChange={(event) => this.handleChange(event)}
                                   id="rbottomId" value='RBOTTOM'/>
                            <label className="form-check-label"
                                   htmlFor="rbottomId">Bottom</label>
                        </div>

                        <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                            <i className="fas fa-cloud-upload-alt mr-1"/>Save
                        </button>
                    </div>
                </form>
            </div></div>
    }

}