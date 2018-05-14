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
        return <div className={`emoji-content${this.props.idx}`}>{this.props.content}</div>
    }
}

// class EmojiNavigation extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {likes: {'LIKE': [], 'LOVE': [], 'HAHA': [], 'WOW': [], 'SAD': [], 'ANGRY': []}};
//         props.likes.map(like => {
//             this.state.likes[like.type].push(like);
//         });
//     }
//
//     componentDidMount() {
//         // this.setState({});
//     }
//
//     handleClick(event) {
//         console.log(event);
//     }
//
//     renderLikeEntries() {
//         return ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'].map(like => {
//             return (
//                 <div className="like-entry">
//                     <span className={`${like.toLowerCase()} like-emoji`} onClick={this.handleClick.bind(this)}/>
//                     <span className='badge badge-pill badge-light'>{this.state.likes[like].length}</span>
//                 </div>
//             )
//         })
//     }
//
//     render() {
//
//         return (
//             <div className="like-navigation">
//                 <div className="like-content">
//                     {this.renderLikeEntries()}
//                 </div>
//             </div>
//         )
//     }
// }

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

                {content.slice(0, 200)}

                <span className="collapse" id={id}>
                    {content.slice(200)}
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