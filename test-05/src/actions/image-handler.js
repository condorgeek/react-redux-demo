/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [image-handler.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 26.12.18 08:00
 */

/* call only within scroll handler - replaces all img data-src with src for lazy image loading */

let isTicking = false;

function isVisible(elem) {
    let coords = elem.getBoundingClientRect();
    let windowHeight = document.documentElement.clientHeight;
    let topVisible = coords.top > 0 && coords.top < windowHeight;
    let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

    return topVisible || bottomVisible;
}

export function showVisibleImages(container) {

    if (!isTicking) {
        window.requestAnimationFrame(function() {
            const images = container ? container.querySelectorAll('img') : document.querySelectorAll('img');
            images.forEach(img => {
                const realSrc = img.dataset.src;
                const ignore = img.dataset.ignore;
                if (!ignore && realSrc && isVisible(img)) {
                    img.src = realSrc;
                    img.dataset.src = '';
                }
            });
            isTicking = false;
        });
        isTicking = true;
    }

}

export function showForceVisibleImages(container) {
    if (!isTicking) {
        window.requestAnimationFrame(function() {
            const images = container ? container.querySelectorAll('img') : document.querySelectorAll('img');
            images.forEach(img => {
                const realSrc = img.dataset.src;
                const ignore = img.dataset.ignore;

                if (!ignore && realSrc) {
                    img.src = realSrc;
                    img.dataset.src = '';
                }
            });
            isTicking = false;
        });
        isTicking = true;
    }
}

