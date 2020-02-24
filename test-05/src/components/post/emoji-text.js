/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [emoji-text.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 20.02.20, 13:12
 */
import he from '../../../node_modules/he/he';
import emojione from '../../../node_modules/emojione/lib/js/emojione';
import DOMPurify from '../../../node_modules/dompurify/dist/purify'
import React, {useEffect, useRef} from 'react';


const isDangerous = (html) => {
    return he.decode(html);
};

const isSanitized = (html) => {
    return DOMPurify.sanitize(he.decode(html), {
        ALLOWED_TAGS: ['a', 'button', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'div', 'p', 'b', 'span', 'img'],
        FORBID_ATTR: ['style'],
    });
};

const EmojiText = (props) => {
    const componentDidMount = useRef(false);
    const richTextRef = useRef(null);
    const {className, sanitize = true, ...otherProps} = props;

    /* componentDidMount */
    useEffect(() => {
        emojione.imageType = 'png';
        emojione.sprites = true;
        componentDidMount.current = true;

    }, []);


    return <div className={`emoji-text ${className ? className : ''}`} ref={(elem) => {
        if (elem === null) return;
        richTextRef.current = elem;

        const sanitized = sanitize ? isSanitized(elem.innerHTML) : isDangerous(elem.innerHTML);
        elem.innerHTML = emojione.shortnameToImage(sanitized);

    }} {...otherProps}>
        {props.children}
    </div>
};

export default EmojiText;