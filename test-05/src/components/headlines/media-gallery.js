/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - European Union 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [media-gallery.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 27.05.18 14:16
 */

import React, {Component} from 'react';

import Lightbox from '../../vendor/image-lightbox/index';

export default class MediaGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {media: this.props.media, index: 0, open: false};
    }

    renderLightbox(index) {
        this.setState({open: true, index: index});
    }

    render() {
        const {media, index, open} = this.state;
        if (open) {
            return (
                <Lightbox
                    mainSrc={media[index]}
                    nextSrc={media[(index + 1) % media.length]}
                    prevSrc={media[(index + media.length - 1) % media.length]}
                    onCloseRequest={() => this.setState({open: false})}
                    onMovePrevRequest={() => {
                        const previous = (index + media.length - 1) % media.length;
                        this.setState({index: previous})
                    }
                    }
                    onMoveNextRequest={() => {
                        const next = (index + 1) % media.length;
                        this.setState({index: next})
                    }
                    }/>
            );
        }
        return '';
    }
}