import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';
import FriendsReducer from './friends-reducer';
import FollowersReducer from './followers-reducer';
import LikesReducer from './likes-reducer';


const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    friends: FriendsReducer,
    followers: FollowersReducer,
    form: formReducer
});

export default rootReducer;