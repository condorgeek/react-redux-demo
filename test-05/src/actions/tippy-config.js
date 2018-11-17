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

import tippy from "../components/util/tippy.3.1.3.all.patched";

const TIPPY_CONTENT = '<div style="display:none">Loading...</div>';

export function bindTooltip(elem, html, params) {

    const {callback, theme, placement, delay, animation, multiple} = params || {};

   tippy(elem, {
        content: TIPPY_CONTENT,
        interactive: callback ? true : false,
        reactive: callback ? true : false,
        placement: placement || 'bottom',
        delay: delay || [400, 0],
        theme: theme ||'standard',
        animation: animation || 'shift-toward',
        arrow: true,
        arrowType: 'round',
        multiple: multiple === undefined ?  true : multiple,
       // performance: true,

        onShow(tooltip) {
            if (tooltip.loading || tooltip.showing) return;
            tooltip.loading = tooltip.showing = true;
            tooltip.setContent(html);
            tooltip.loading = false;
        },

        onHidden(tooltip) {
            tooltip.showing = false;
            tooltip.setContent(TIPPY_CONTENT);
        },
        onClick: callback
    });

   return elem._tippy;
}


export function showTooltip(elem, params) {
    const {title, theme, multiple} = params || {};

    tippy(elem, {content:  title || elem.getAttribute('title'),
        arrow: true,
        arrowType: 'round',
        multiple: multiple === undefined ?  true : multiple,
        // performance: true,
        theme: theme ||"standard"});

    return elem._tippy;
}


// @Deprecated version 2.5.4
export function bindTooltipToRef254(elem, templateId, html) {
    const initialText = document.querySelector(templateId).textContent;

    const tooltip = tippy(elem, {
        html: templateId, interactive: true, reactive: true,
        placement: 'bottom', delay: [400, 0],
        theme: 'standard',
        animation: 'shift-toward', arrow: true,
        // trigger: 'click',
        onShow() {
            const content = this.querySelector('.tippy-content');
            if (tooltip.loading || content.innerHTML !== initialText) return;
            tooltip.loading = true;
            content.innerHTML = html;
            tooltip.loading = false;
        },
        onHidden() {
            const content = this.querySelector('.tippy-content');
            content.innerHTML = initialText;
        },
        onClick: this.handleTooltipAction
    });
}