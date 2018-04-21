export const GOOSE = require('./pics/goose.svg');
export const GOOSE_2 = require('./pics/goose-2.svg');
export const GOCKEL = require('./pics/gockel-logo.png');
export const YOUTUBE = require('./pics/youtube-red.svg');

export function randompic() {
    const i = Math.floor((Math.random() * 24) + 1);
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

const urls = ['https://www.youtube.com/embed/zpOULjyy-n8?rel=0',
    'https://www.youtube.com/watch?v=2HH4CiAjjvM',
    'https://soundcloud.com/thomasjackmusic/gabriel-rios-gold-thomas-jack-remix',
    'https://vimeo.com/65428790',
    'https://www.youtube.com/watch?v=35ChA32HUiI',
    'https://vimeo.com/148246925',
    'https://www.youtube.com/watch?v=U2lZIUZ_ZwU',
    'https://vimeo.com/12032183',
    'https://www.youtube.com/watch?v=EjVyAHFYrUQ',
    'https://vimeo.com/26847728',
    'https://vimeo.com/99557169',
    'https://vimeo.com/198032459',
    'https://soundcloud.com/salsard/chiquito-team-band-tengo-que-colgar-salsardcom2017?in=salsard/sets/chiquito-team-band',
    'https://www.youtube.com/watch?v=GqCXG9a2qi8',
    'https://vimeo.com/7519184',
    'https://soundcloud.com/salsard/davis-daniel-la-historiadora-salsardcom2018',
    'https://vimeo.com/209457922',
    'https://www.youtube.com/watch?v=GqCXG9a2qi8&list=RDGqCXG9a2qi8&t=4',
    'https://vimeo.com/9376183',
    'https://soundcloud.com/dananggg/overwerk-daybreak-gopro-hero3-edit',
    'https://vimeo.com/45211334',
    'https://soundcloud.com/jovas-drumms-sc/sets/reggae',
    'https://www.youtube.com/watch?v=SC7Tli683GE&list=RDGqCXG9a2qi8&index=23',
    'https://www.youtube.com/watch?v=9KgAyC6gxKI',
    'https://vimeo.com/114924438',
    'https://www.youtube.com/watch?v=TIwv3eh4Mq4',
    'https://vimeo.com/223872691',
    'https://vimeo.com/111356679',
    'https://soundcloud.com/thomasjackmusic/little-talks-of-monsters-and',
    'https://www.youtube.com/watch?time_continue=1&v=QL6C9LwWC30',
    'https://vimeo.com/196236491',
    'https://soundcloud.com/evelyndiederich/sets/gopro-vid-music',
    'https://vimeo.com/56918907',
    'https://soundcloud.com/javiercabanillas/conga-jam-salsa-dura-dj-good',
    'https://www.youtube.com/watch?time_continue=11&v=TR9nEjlVBLw',
    'https://vimeo.com/14381111',
    'https://soundcloud.com/salsard/chiquito-team-band-los-creadores-del-sonido-salsardcom?in=salsard/sets/chiquito-team-band',
    'https://soundcloud.com/risedownmusic/daybreak-gopro-hero3-edit-with'
];

export function randomvideo() {
    const i = Math.floor((Math.random() * urls.length) + 1) - 1;
    return urls[i];
}

export function userthumb() {
    const i = Math.floor((Math.random() * 8) + 1) + 1;
    return `/static/users/user-0${i}-200x200.jpg`;
}