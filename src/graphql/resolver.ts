import { getUser, login, register } from "../controller/user";
import { createPost, getAllPost, getPost, commentPost, likePost, getCommentPost } from "../controller/post";
import { createProvider, getAllProvider, getProviderInfo } from '../controller/provider';
import { createService, getAllService } from '../controller/service';
import { follow, getFollower, getFollowing, isFollowing, unfollow } from "../controller/follow";
import { search } from "../controller/search";

const resolvers = {
    Query: {
        user: getUser,
        allPost: getAllPost,
        post: getPost,
        allProvider: getAllProvider,
        allService: getAllService,
        providerInfo: getProviderInfo,
        commentPost: getCommentPost,
        follower: getFollower,
        following: getFollowing,
        isFollowing: isFollowing,
        search: search,
    },
    Mutation: {
        register: register,
        login: login,
        createPost: createPost,
        comment: commentPost,
        like: likePost,
        createProvider: createProvider,
        createService: createService,
        follow: follow,
        unfollow: unfollow,
    }
}

export default [resolvers];
