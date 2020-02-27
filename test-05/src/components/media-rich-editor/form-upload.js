/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [form-upload.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.02.20, 15:27
 */

import React, {Component} from 'react';

class FormUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {invalid: false};
        this.className = this.className.bind(this)();
    }

    className() {
        const classes = {'YOUTUBE': 'fa-youtube', 'VIMEO': 'fa-vimeo-square', 'SOUNDCLOUD': 'fa-soundcloud'};
        return {
            get(type) {
                return classes[type];
            }
        }
    }

    handleForm(event) {
        event.preventDefault();
        if (!event.target.checkValidity()) {
            this.setState({invalid: true});
            return;
        }
        const data = new FormData(event.target);
        this.setState({invalid: false});
        this.props.callback(data.get('url'), this.props.type);
        event.target.reset();
    }

    render() {
        const {invalid} = this.state;
        const className = this.className.get(this.props.type);

        return (
            <form noValidate onSubmit={(event) => this.handleForm(event)}
                  className={invalid ? 'form-invalid' : ''}>
                <div className="input-group media-upload-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className={`fa ${className}`}/></span>
                    </div>
                    <input type="text" name="url" className="form-control" autoComplete="off" required
                           placeholder={this.props.placeholder}
                           pattern={this.props.pattern}
                    />
                </div>
            </form>
        );
    }
}

export default FormUpload;