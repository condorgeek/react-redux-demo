import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {LOGO} from './static/index';
import './index.css';

import PostsIndex from './containers/posts-index';
import PostsNew from './containers/posts-new';
import PostsShow from './containers/posts-show';
import AuthorShow from './containers/author-show';
import Navigation from './components/navigation';
import App from './App';

import Holder from './components/util/holder';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';


const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div>
                <div className='container-fluid'>
                    <Navigation/>

                    <div className='row mt-3'>
                        <div className='col-9'>
                        <Switch>
                            <Route path="/posts/new" component={PostsNew}/>
                            <Route path="/posts/:id" component={PostsShow}/>
                            <Route path={"/author/:author/:id"} component={AuthorShow}/>
                            <Route path="/app" component={App}/>
                            <Route path="/" component={PostsIndex}/>
                        </Switch>
                        </div>
                        <div className='m-0 col-3 sidebar sidebar-separator'>
                            <div className=''>
                                {/*<h2>Sidebar</h2>*/}
                                {/*<img className='card-img' src={LOGO}/>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
