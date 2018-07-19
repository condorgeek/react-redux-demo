import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';
import FriendsReducer from './friends-reducer';
import FollowersReducer from './followers-reducer';
import LikesReducer, {CommentLikesReducer} from './likes-reducer';
import AuthorizationReducer from './authorization-reducer';
import CreateUserReducer from './create-user-reducer';

const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    commentlikes: CommentLikesReducer,
    friends: FriendsReducer,
    followers: FollowersReducer,
    authorization: AuthorizationReducer,
    request: CreateUserReducer,
    form: formReducer
});

export default rootReducer;