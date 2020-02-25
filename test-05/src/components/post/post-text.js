/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [post-text.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 13.02.20, 16:54
 */

import React, {Component} from 'react';
import EmojiText from "../emoji/emoji-text";
import NavigationMoreLess from '../navigation-headlines/navigation-more-less';

class PostText extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    isFullview(text) {
        const regex = /<div.*[class|className]\s*=.*fullview.*?>/ig;
        return this.props.fullview ? true : regex.test(text);
    }

    breakText(text, num) {
        return text.split(" ").splice(0, num).join(" ");
    }

    render() {
        const {post, allowComments} = this.props;
        const {text = ''} = post;
        const {open} = this.state;

        const isOverflow = !this.isFullview(text) && text.length > 1024;
        const content = isOverflow && !this.state.open ? this.breakText(text, 80) : text;

        return <div className="post-text">
            <EmojiText>
                {content}
            </EmojiText>

            {isOverflow && <NavigationMoreLess open={open} onClick={(event) =>{
                event.preventDefault();
                this.setState({open: !this.state.open});
            }}/>}

            {/*{allowComments && <div className="content-created" >*/}
            {/*    /!*{isAuthorized && <StarRating post={this.props.post} authorization={authorization}/>}*!/*/}
            {/*    <span className="ml-2">{shared} {moment(created).fromNow()}</span></div>}*/}
        </div>
    }
}

export default PostText;