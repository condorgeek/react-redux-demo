import axios from 'axios';

export const FETCH_POSTS = 'fetch_posts';
export const FETCH_POST = 'fetch_post';
export const CREATE_POST = 'create_post';
export const DELETE_POST = 'delete_post';
export const FETCH_COMMENTS = 'fetch_comments';

const ROOT_URL = 'http://reduxblog.herokuapp.com/api';
const API_KEY = '?key=amaru01';

export function fetchPosts() {

    // const request = axios.get(`${ROOT_URL}/posts${API_KEY}`);
    // console.log(request);

    const request = [
        {id: '1', title:'Hello from Helgoland', categories: 'Computer', content: 'Die zuletzt für 9 Euro angebotene iOS-App zum Erstellen auflösungsunabhängiger Vektorgrafiken ist nun gratis – und soll es auch bleiben. Man wolle "jeden dazu inspirieren", auf Mobilgeräten zu arbeiten, schreibt der Hersteller.\n' +
            '29. März 2018, 11:50 Uhr'},
        {id: '2', title:'The fascinating world of Maria', categories: 'Text', content: 'This is a stroy about Maria, ..'},
        {id: '3', title:'Title 03', categories: '', content: ''},
        {id: '4', title:'From Roberto - The Killer', categories: '', content: 'Not what you think'},
        {id: '5', title:'Waserbruchrok -Was nun ?', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '6', title:'The meaning of life', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '7', title:'London by night..', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '8', title:'Warum Groko sch.. ist', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '9', title:'Mar para Bolivia', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '10', title:'Hello from Helgoland', categories: 'Computer', content: 'Die zuletzt für 9 Euro angebotene iOS-App zum Erstellen auflösungsunabhängiger Vektorgrafiken ist nun gratis – und soll es auch bleiben. Man wolle "jeden dazu inspirieren", auf Mobilgeräten zu arbeiten, schreibt der Hersteller.\n' +
            '29. März 2018, 11:50 Uhr'},
        {id: '12', title:'The fascinating world of Maria', categories: 'Text', content: 'This is a stroy about Maria, ..'},
        {id: '13', title:'Title 03', categories: '', content: ''},
        {id: '14', title:'From Roberto - The Killer', categories: '', content: 'Not what you think'},
        {id: '15', title:'Waserbruchrok -Was nun ?', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '16', title:'The meaning of life', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '17', title:'London by night..', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '18', title:'Warum Groko sch.. ist', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '19', title:'Mar para Bolivia', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'},
        {id: '20', title:'Eine unglaubliche Geschichte', categories: '', content: 'Heute abend liebe Freunde, just als ich mich zu meiner nächtlichen Netflix Session begeben woll, wurde mir ganz Schwarz..'}
    ];

    return {
        type: FETCH_POSTS,
        payload: request
    }

}

export function createPost(values, callback) {

    const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values)
        .then(() => callback());

    return {
        type: CREATE_POST,
        payload: request
    }
}

export function fetchPost(id, callback) {
    const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`);

    console.log('@request', request);

    return {
        type: FETCH_POST,
        payload: request
    }
}

export function deletePost(id, callback) {
    const request = axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
        .then(() => {
            callback()
        });

    console.log('@request', request);

    return {
        type: DELETE_POST,
        payload: id
    }
}

const comments = [
    {user: 'Thomas Earl', thumb: `/static/users/user-01-200x200.jpg`, comment: 'This is a beatiful interface', when: '1 min'},
    {user: 'Ana Kern', thumb: `/static/users/user-02-200x200.jpg`, comment: 'New Kid on the block', when: '2 hrs'},
    {user: 'Beate Schulz', thumb: `/static/users/user-03-200x200.jpg`, comment: 'Wann wird die app freigegeben ?. Eigentlich würde ich gerne prüfen wie es sich mit der Performance verhält..', when: '9 days'},
    {user: 'Jack North', thumb: `/static/users/user-04-200x200.jpg`, comment: 'Brilliant app.', when: '45 min'},
    {user: 'Beate Uhrl', thumb: `/static/users/user-05-200x200.jpg`, comment: 'What is this. Dont understand.', when: '9 min'},
    {user: 'Beatrice Jobs', thumb: `/static/users/user-06-200x200.jpg`, comment: 'Is there a limit for the comment text ?', when: '2 mon'}
];

export function fetchComments(id) {

    const cnt = Math.floor(Math.random() * 6);
    const request = [];

    for(let i=0; i < cnt; i++) {
        const k = Math.floor(Math.random() * 6) -1;
        request.push(comments[k]);
    }


    return {
        type: FETCH_COMMENTS,
        payload: request
    }
}