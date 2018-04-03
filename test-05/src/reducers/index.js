import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';

const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    form: formReducer
});

export default rootReducer;