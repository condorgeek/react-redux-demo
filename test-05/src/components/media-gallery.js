import React, {Component} from 'react';

import Lightbox from '../vendor/image-lightbox';

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