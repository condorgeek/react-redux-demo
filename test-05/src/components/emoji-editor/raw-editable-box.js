/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [simple-editable-box.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 28.02.19 13:23
 */

import {showTooltip} from "../../actions/tippy-config";

import React, {Component} from 'react';

export default class RawEditableBox extends Component {

    constructor(props) {
        super(props);
        this.state = {text: this.props.text, close: false};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({text: nextProps.text})
    }

    handleEditorEnter = event => {
        event.preventDefault();
        this.props.callback(this.state.text);
    };

    handleChange = event => {
        this.setState({text: event.target.value})
    };

    renderBoxNavigation() {
        const {mediaupload, youtube, vimeo, soundcloud} = this.props;
        const hasNavigation = mediaupload || youtube || vimeo || soundcloud;

        if(!hasNavigation) return "";

        return  <div className="editable-box-navigation"><div className='editable-box-nav'>
            <button title="Upload image files" className="btn btn-sm btn-darkblue" onClick={(event) => mediaupload(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="far fa-images"/></button>
            <button title="Link to youtube" className="btn btn-sm btn-darkblue" onClick={(event) => youtube(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="fab fa-youtube-square" /></button>
            <button title="Link to vimeo" className="btn btn-sm btn-darkblue" onClick={(event) => vimeo(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="fab fa-vimeo-square" /></button>
            <button title="Link to soundcloud" className="btn btn-sm btn-darkblue" onClick={(event) => soundcloud(event)}
                    ref={(elem)=> {
                        if (elem === null) return;
                        showTooltip(elem);
                    }}
            ><i className="fab fa-soundcloud" /></button>
        </div></div>
    }

    render() {
        const {id, text} = this.props;

        if(this.state.close) return '';

        return (
            <div className='emoji-editable-box'>
               {this.renderBoxNavigation()}

                <textarea name="editablebox" className="editable-box-content" placeholder={`Edit your post..`}
                          value={this.state.text || ''}
                          onChange={event => this.handleChange(event)} required/>

                <button className="btn btn-darkblue btn-sm emoji-tab-enter float-right" onClick={this.handleEditorEnter}>
                    <i className="fas fa-cloud-upload-alt mr-1"/>Save</button>

                <button className="btn btn-darkblue btn-sm emoji-tab-enter float-right mr-1" onClick={event =>{
                    console.log('Close');
                    this.setState({close: true});
                }}>
                    <i className="fas fa-times mr-1"/>Close</button>

            </div>
        )
    }

}

