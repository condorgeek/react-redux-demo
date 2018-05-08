import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';
import ContactsReducer from './contacts-reducer';
import FriendsReducer from './friends-reducer';
import FollowersReducer from './followers-reducer';


const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    contacts: ContactsReducer,
    friends: FriendsReducer,
    followers: FollowersReducer,
    form: formReducer
});

export default rootReducer;