export const LOGO = require('./pics/text120-4.png');
export const GOOSE = require('./pics/goose.svg');
export const GOOSE_2 = require('./pics/goose-2.svg');
export const GOCKEL = require('./pics/gockel-logo.png');
export const ONE = require('./pics/one.png');
export const TWO = require('./pics/two.png');
export const THREE = require('./pics/three.png');
export const FOUR = require('./pics/four.png');
export const FIVE = require('./pics/five.png');
export const SIX = require('./pics/six.png');
export const SEVEN = require('./pics/seven.png');
export const YOUTUBE = require('./pics/youtube-red.svg');

const images = [ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN];

export function randomstatic() {
    const i = Math.floor((Math.random() * 7) + 1);
    return images[i-1];
}

export function randompic() {
    const i = Math.floor((Math.random() * 23) + 1);
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

export function randomvideo() {
    const urls = ['https://www.youtube.com/embed/zpOULjyy-n8?rel=0',
        'https://www.youtube.com/watch?v=2HH4CiAjjvM',
        'https://www.youtube.com/watch?v=35ChA32HUiI',
        'https://www.youtube.com/watch?v=U2lZIUZ_ZwU',
        'https://www.youtube.com/watch?v=EjVyAHFYrUQ',
        'https://www.youtube.com/watch?v=GqCXG9a2qi8',
        'https://www.youtube.com/watch?v=GqCXG9a2qi8&list=RDGqCXG9a2qi8&t=4',
        'https://www.youtube.com/watch?v=SC7Tli683GE&list=RDGqCXG9a2qi8&index=23',
        'https://www.youtube.com/watch?v=9KgAyC6gxKI',
        'https://www.youtube.com/watch?v=TIwv3eh4Mq4',
        'https://vimeo.com/223872691',
        'https://vimeo.com/111356679',
        'https://vimeo.com/196236491',
        'https://vimeo.com/7519184',
        'https://vimeo.com/209457922',
        'https://vimeo.com/99557169',
        'https://vimeo.com/198032459',
        'https://vimeo.com/9376183',
        'https://vimeo.com/45211334',
        'https://vimeo.com/56918907',
        'https://vimeo.com/12032183',
        'https://vimeo.com/26847728',
        'https://vimeo.com/14381111'
    ];

    const i = Math.floor((Math.random() * urls.length) + 1) - 1;
    return urls[i];
}

export function userthumb() {
    const i = Math.floor((Math.random() * 8) + 1) + 1;
    return `/static/users/user-0${i}-200x200.jpg`;
}