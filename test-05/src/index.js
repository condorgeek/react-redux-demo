import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import OverlayScrollbars from '../node_modules/overlayscrollbars/js/OverlayScrollbars';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './index.css';

import PostsNew from './containers/posts-new';
import PostsShow from './containers/posts-show';
import AuthorShow from './containers/author-show';
import Navigation from './components/navigation';
import PublicSpace from './public-space';
import HomeSpace from './home-space';


import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div className='orange-sheme'>
                <div className='container-fluid'>
                    <Navigation/>
                        <Switch>
                            <Route path="/posts/new" component={PostsNew}/>
                            <Route path="/posts/:id" component={PostsShow}/>
                            <Route path={"/author/:author/:id"} component={AuthorShow}/>
                            <Route path="/:username/home" component={HomeSpace}/>
                            <Route path="/:username/public" component={PublicSpace}/>
                            <Route path="/" component={PublicSpace}/>
                        </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'), ()=> {
        OverlayScrollbars(document.querySelectorAll('body'), {});
    });
