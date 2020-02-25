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

import React, {Component} from 'react';
import {FlatIcon, Icon, NavigationGroup, NavigationRow} from "../navigation-buttons/nav-buttons";
import {BUBBLE_CLOSE_BUTTON_ID} from '../../actions/index';

// TODO rename to RawEditor
export default class DialogEditor extends Component {

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

    render() {
        const {mediaupload, youtube, vimeo, soundcloud} = this.props;
        const hasNavigation = mediaupload || youtube || vimeo || soundcloud;
        if(this.state.close) return '';

        return (
            <div className='dialog-editor'>
                {hasNavigation && <NavigationRow>
                    <NavigationGroup/>
                    <NavigationGroup>
                        <FlatIcon circle bigger >
                            <Icon className="far fa-images" title="Upload image files" onClick={mediaupload}/>
                        </FlatIcon>
                        <FlatIcon circle bigger>
                            <Icon className="fab fa-youtube-square" title="Link to youtube" onClick={youtube}/>
                        </FlatIcon>
                        <FlatIcon circle bigger>
                            <Icon className="fab fa-vimeo-square" title="Link to vimeo" onClick={vimeo}/>
                        </FlatIcon>
                        <FlatIcon circle bigger>
                            <Icon className="fab fa-soundcloud" title="Link to soundcloud" onClick={soundcloud}/>
                        </FlatIcon>
                    </NavigationGroup>
                </NavigationRow>}

                <textarea name="editablebox" className="editable-box-content editable-edit-mode"
                          placeholder={`Edit your post..`}
                          value={this.state.text || ''}
                          onChange={event => this.handleChange(event)} required/>

                <NavigationRow className='dialog-box-footer pt-4'>
                    <button className='btn btn-primary' id={BUBBLE_CLOSE_BUTTON_ID}>Cancel</button>
                    <button className='btn btn-primary' onClick={this.handleEditorEnter}>Save</button>
                </NavigationRow>

            </div>
        )
    }

}

