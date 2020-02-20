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

import React, {useEffect, useRef} from 'react';

const EmojiText = (props) => {
    const componentDidMount = useRef(false);
    const richTextRef = useRef(null);
    const {className, ...otherProps} = props;

    /* componentDidMount */
    useEffect(() => {
        emojione.imageType = 'png';
        emojione.sprites = true;

        console.log('MOUNTED', componentDidMount.current, richTextRef.current);
        componentDidMount.current = true;

    }, []);

    return <div className={`emoji-text ${className ? className : ''}`} ref={(elem) => {
        if (elem === null) return;
        richTextRef.current = elem;
        elem.innerHTML = emojione.shortnameToImage(he.decode(elem.innerHTML));
    }} {...otherProps}>
        {props.children}
    </div>
};

export default EmojiText;