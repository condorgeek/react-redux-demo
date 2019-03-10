/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [widget-create-form.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 06.03.19 17:34
 */
import toastr from "../../../node_modules/toastr/toastr";

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {asyncCreateWidget} from "../../actions/spaces";

class WidgetCreateForm extends Component {

    constructor(props) {
        super(props);
        this.state= {type: 'TEXT', pos: props.mode === 'LEFT' ? 'LTOP' : 'RTOP', isFormInvalid: ''}; /* form data */
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    handleChange(event) {
        const form = event.target;
        this.setState({[form.name]: form.value});
    }

    handleSubmit(authname, event) {
        event.preventDefault();
        event.stopPropagation();
        this.refTitle.focus();

        if (!event.target.checkValidity()) {
            this.setState({ isFormInvalid: 'form-invalid'});
            return;
        }
        this.setState({ isFormInvalid: '' });
        event.target.reset();

        const formdata = {...this.state};

        this.props.asyncCreateWidget(authname, formdata.type.toLowerCase(), formdata, widget => {
            toastr.info(`${widget.title} created successfully.`);
        });
    }

    toggle = () => {
        this.refForm.classList.toggle('active-show');

        setTimeout(() => {
            this.refTitle.focus();
        }, 500);
    };

    // renderTopCheckbox = (pos, mode) => {
    //     return <div className="form-check form-check-inline mt-2">
    //         <input className="form-check-input" type="radio" name="pos"
    //                checked={pos === mode}
    //                onChange={(event) => this.handleChange(event)}
    //                id="rtopId" value=top required/>
    //         <label className="form-check-label"
    //                htmlFor="rtopId">Top</label>
    //     </div>
    // };

    render() {
        const {authname, mode} = this.props;
        const {type, pos, isFormInvalid} = this.state;
        const top = mode === 'LEFT' ? 'LTOP' : 'RTOP';
        const bottom = mode === 'LEFT' ? 'LBOTTOM' : 'RBOTTOM';

        return (<div className="active-space-frame">
            <div className="active-space-toggle" ref={elem => this.refForm = elem}>
                <form noValidate className={isFormInvalid}
                      onSubmit={event => this.handleSubmit(authname, event)}>
                    <div className='active-space'>
                        <input type="text" name="title" placeholder={`Enter widget title..`}
                               onChange={event => this.handleChange(event)} required ref={ref => this.refTitle = ref}/>

                        <div className="form-check form-check-inline mt-2">
                            <input className="form-check-input" type="radio" name="type"
                                   checked={type==='TEXT'}
                                   onChange={(event) => {
                                       this.urlRef.classList.remove("d-none");
                                       this.handleChange(event);
                                   }}
                                   id="textId" value='TEXT' required/>
                            <label className="form-check-label"
                                   htmlFor="textId">Text</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="type"
                                   checked={type==='SPACE'}
                                   onChange={(event) => {
                                       this.urlRef.classList.add("d-none");
                                       this.handleChange(event);
                                   }}
                                   id="spaceId" value='SPACE'/>
                            <label className="form-check-label"
                                   htmlFor="spaceId">Space</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="type"
                                   checked={type==='USER'}
                                   onChange={(event) => {
                                       this.urlRef.classList.add("d-none");
                                       this.handleChange(event);
                                   }}
                                   id="userId" value='USER'/>
                            <label className="form-check-label"
                                   htmlFor="userId">User</label>
                        </div>

                        <textarea name="text" placeholder="Text, spacename or username"
                                  onChange={event => this.handleChange(event)} required/>

                        <input type="text" id="widget-url-id" name="url" placeholder={`Enter content url..`}
                               onChange={event => this.handleChange(event)} ref={elem => this.urlRef = elem}/>

                        <div className="form-check form-check-inline mt-2">
                            <input className="form-check-input" type="radio" name="pos"
                                   checked={pos === top}
                                   onChange={(event) => this.handleChange(event)}
                                   id="rtopId" value={top} required/>
                            <label className="form-check-label"
                                   htmlFor="rtopId">Top</label>
                        </div>

                        {/*{this.renderTopCheckbox(pos, top)}*/}

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="pos"
                                   checked={pos === bottom}
                                   onChange={(event) => this.handleChange(event)}
                                   id="rbottomId" value={bottom}/>
                            <label className="form-check-label"
                                   htmlFor="rbottomId">Bottom</label>
                        </div>

                        <button type="submit" className="btn btn-darkblue btn-sm btn-active-space">
                            <i className="fas fa-cloud-upload-alt mr-1"/>Create Widget
                        </button>
                    </div>
                </form>
            </div>

        </div>)
    }
}

export default connect(null, {asyncCreateWidget})(WidgetCreateForm);
