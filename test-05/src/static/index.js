export const LOGO = require('./pics/text120-4.png');
export const GOOSE = require('./pics/goose.svg');
export const GOOSE_2 = require('./pics/goose-2.svg');
export const ONE = require('./pics/one.png');
export const TWO = require('./pics/two.png');
export const THREE = require('./pics/three.png');
export const FOUR = require('./pics/four.png');
export const FIVE = require('./pics/five.png');
export const SIX = require('./pics/six.png');
export const SEVEN = require('./pics/seven.png');

const images = [ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN];

export function randomstatic() {
    const i = Math.floor((Math.random() * 7) + 1);
    return images[i-1];
}

export function randompic() {
    const i = Math.floor((Math.random() * 10) + 1);
    return `/static/pics/pic-${i < 10 ? "0"+i : i}.jpg`;
}

export function picthumb() {
    const i = Math.floor((Math.random() * 10) + 1);
    return `/static/pics/pic-${i < 10 ? "0"+i : i}-400x400.jpg`;
}

export function randomuser() {
    const i = Math.floor((Math.random() * 8) + 1) + 1;
    return `/static/users/user-0${i}.jpg`;
}

export function userthumb() {
    const i = Math.floor((Math.random() * 8) + 1) + 1;
    return `/static/users/user-0${i}-200x200.jpg`;
}