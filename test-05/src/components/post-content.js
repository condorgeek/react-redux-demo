import $ from 'jquery';
import emojione from '../../node_modules/emojione/lib/js/emojione';

import React, {Component} from 'react';
import EmojiNavigation from './emoji-navigation';

class EmojiContent extends Component {

    componentDidMount() {
        const comments = document.getElementsByClassName(`emoji-content${this.props.idx}`);
        [...comments].forEach(elem => {
            elem.innerHTML = emojione.shortnameToImage(elem.innerHTML);
        });
    }

    render() {

        return this.props.content.length > 0 ? <div className={`emoji-content emoji-content${this.props.idx}`}>{this.props.content}</div> : ''
    }
}

export default class PostContent extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        emojione.imageType = 'png';
        emojione.sprites = true;
    }

    componentDidMount() {
        const toggler = '#' + this.props.id;

        this.handleHidden = this.handleHidden.bind(this);
        this.handleOpen = this.handleOpen.bind(this);

        $(toggler).on('hidden.bs.collapse', this.handleHidden);
        $(toggler).on('shown.bs.collapse', this.handleOpen);
    }

    handleHidden() {
        this.setState({open: false});
    }

    handleOpen() {
        this.setState({open: true});
    }

    toggler(content, id) {
        return (
            <div className='post-toggler'>

                {content.slice(0, 640)}

                <span className="collapse" id={id}>
                    {content.slice(640)}
                </span>

                <a className="ml-1" data-toggle="collapse" href={`#${id}`}
                   aria-expanded="false" aria-controls={id}>
                    {this.state.open ? <i className="fa fa-minus-square-o" aria-hidden="true"/> :
                        <i className="fa fa-plus-square-o" aria-hidden="true"/>}
                </a>
            </div>
        );
    }

    render() {
        const content = this.props.content.length > 200 ? this.toggler(this.props.content, this.props.id) : this.props.content;

        return (
            <div className='post-content'>
                <EmojiContent id={this.props.id} content={content}/>
                <EmojiNavigation id={this.props.id} likes={this.props.likes}/>
            </div>
        );
    }
}