import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './index.css';

import PostsIndex from './containers/posts-index';
import PostsNew from './containers/posts-new';
import PostsShow from './containers/posts-show';
import AuthorShow from './containers/author-show';
import Navigation from './components/navigation';
import Sidebar from './containers/sidebar';
import App from './App';

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

                    <div className='row mt-3'>
                        <div className='body-container col-9'>
                        <Switch>
                            <Route path="/posts/new" component={PostsNew}/>
                            <Route path="/posts/:id" component={PostsShow}/>
                            <Route path={"/author/:author/:id"} component={AuthorShow}/>
                            <Route path="/app" component={App}/>
                            <Route path="/" component={PostsIndex}/>
                        </Switch>
                        </div>
                        <div className='col-3 sidebar-container'>
                            <Sidebar/>
                        </div>
                    </div>

                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
