/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [tippy-config.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 13.11.18 17:11
 */
// import tippy from "../components/util/tippy.4.0.4.all.patched";
import Tippy5, {roundArrow} from '../../node_modules/tippy.js';

import OverlayScrollbars from '../../node_modules/overlayscrollbars/js/OverlayScrollbars';
import ReactDOMServer from 'react-dom/server';

import {showForceVisibleImages} from "./image-handler";

const TIPPY_CONTENT = '<div style="display:none">Loading...</div>';

export function bindRawTooltip(elem, html, params) {
    const rawhtml = ReactDOMServer.renderToStaticMarkup(html);
    return bindTooltip(elem, rawhtml, params);
}

export function bindTooltip(elem, html, params) {

    const {callback, theme, placement, delay, animation, multiple, scrollbar, trigger, showOnCreate, placeholderId} = params || {};

    Tippy5(elem, {
        content: TIPPY_CONTENT,
        interactive: callback ? true : false,
        placement: placement || 'bottom',
        delay: delay || [400, 0],
        theme: theme || 'standard',
        animation: animation || 'shift-toward',
        arrow: roundArrow,
        trigger: trigger || 'mouseenter focus',
        showOnCreate: showOnCreate || false,
        multiple: multiple === undefined ? true : multiple,
        // popperOptions: {modifiers: {preventOverflow: {boundariesElement: 'window'}}},
        // performance: true,

        onShow(tooltip) {
            if (tooltip.loading || tooltip.showing) return;
            tooltip.loading = tooltip.showing = true;
            tooltip.setContent(html);
            tooltip.loading = false;
            scrollbar && setTimeout(() => {
                OverlayScrollbars(document.querySelector(scrollbar), {});
            }, 1000);
        },

        onShown(tooltip) {
            showForceVisibleImages();
        },

        onHidden(tooltip) {
            tooltip.showing = false;
            tooltip.setContent(TIPPY_CONTENT);
        },
        // onClick: callback
    });

    return elem._tippy;
}


export function showTooltip(elem, params) {
    const {title, theme, multiple, placement, showOnCreate, trigger} = params || {};

    if(!title && !elem.getAttribute('title')) return;

    return Tippy5(elem, {
        touch: 'hold',
        content: title || elem.getAttribute('title'),
        arrow: roundArrow,
        animation: 'shift-toward',
        placement: placement || 'top',
        showOnCreate: showOnCreate || false,
        trigger: trigger || 'mouseenter focus',
        multiple: multiple === undefined ? true : multiple,
        theme: theme || "standard"
    });
}


// // @Deprecated version 2.5.4
// export function bindTooltipToRef254(elem, templateId, html) {
//     const initialText = document.querySelector(templateId).textContent;
//
//     const tooltip = Tippy5(elem, {
//         html: templateId, interactive: true, reactive: true,
//         placement: 'bottom', delay: [400, 0],
//         theme: 'standard',
//         animation: 'shift-toward',
//         arrow: roundArrow,
//         // trigger: 'click',
//         onShow() {
//             const content = this.querySelector('.tippy-content');
//             if (tooltip.loading || content.innerHTML !== initialText) return;
//             tooltip.loading = true;
//             content.innerHTML = html;
//             tooltip.loading = false;
//         },
//         onHidden() {
//             const content = this.querySelector('.tippy-content');
//             content.innerHTML = initialText;
//         },
//         onClick: this.handleTooltipAction
//     });
// }