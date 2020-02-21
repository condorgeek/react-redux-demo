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

import React, {Component, Fragment} from 'react';
import EmojiText from "./emoji-text";
import {FlatLink, Icon} from "../navigation-buttons/nav-buttons";
import {ConfigurationContext} from "../configuration/configuration";

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
        const {authorization, post, allowComments, Lang} = this.props;
        const {text = ''} = post;
        const {open} = this.state;

        const isOverflow = !this.isFullview(text) && text.length > 1024;
        const content = isOverflow && !this.state.open ? this.breakText(text, 80) : text;

        return <div className="post-text">
            <EmojiText>
                {content}
            </EmojiText>

            {isOverflow && <FlatLink onClick={(event) =>{
                event.preventDefault();
                this.setState({open: !this.state.open});
            }}>
                {open && <Fragment><Icon title={Lang.tooltip.lessContent} className='fas fa-minus-square'>
                </Icon><span className='post-text-link'>{Lang.button.readLess}</span></Fragment>}
                {!open && <Fragment><Icon title={Lang.tooltip.moreContent} className='fas fa-plus-square'>
                </Icon><span className='post-text-link'>{Lang.button.readMore}</span></Fragment>}
            </FlatLink>}

            {/*{allowComments && <div className="content-created" >*/}
            {/*    /!*{isAuthorized && <StarRating post={this.props.post} authorization={authorization}/>}*!/*/}
            {/*    <span className="ml-2">{shared} {moment(created).fromNow()}</span></div>}*/}
        </div>
    }

}

const withConfigurationContext = (props) => {
    return <ConfigurationContext.Consumer>
        {(values) => (<PostText {...props} {...values}/>)}
    </ConfigurationContext.Consumer>
};

export default withConfigurationContext;