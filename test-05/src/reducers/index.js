import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './posts-reducer';
import CommentsReducer from './comments-reducer';
import FriendsReducer, {FriendsPending} from './friends-reducer';
import FollowersReducer from './followers-reducer';
import FolloweesReducer from './followees-reducer';
import LikesReducer, {CommentLikesReducer} from './likes-reducer';
import AuthorizationReducer from './authorization-reducer';
import CreateUserReducer from './create-user-reducer';
import UserDataReducer from './userdata-reducer';
import SpaceDataReducer from './spacedata-reducer';

const rootReducer = combineReducers({
    posts: PostsReducer,
    comments: CommentsReducer,
    likes: LikesReducer,
    commentlikes: CommentLikesReducer,
    friends: FriendsReducer,
    pending: FriendsPending,
    followers: FollowersReducer,
    followees: FolloweesReducer,
    authorization: AuthorizationReducer,
    request: CreateUserReducer,
    userdata: UserDataReducer,
    spacedata: SpaceDataReducer,
    form: formReducer
});

export default rootReducer;