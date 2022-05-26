import { pubsub } from './../../index';
import { getUser, login, register } from "../controller/user";
import { createPost, getAllPost, getPost, commentPost, likePost, getCommentPost } from "../controller/post";
import { createProvider, getAllProvider, getProviderInfo } from '../controller/provider';
import { createService, getAllService } from '../controller/service';
import { follow, getFollower, getFollowing, isFollowing, unfollow } from "../controller/follow";
import { search } from "../controller/search";
import { sendMessage } from '../controller/message';
import { withFilter } from 'graphql-subscriptions';
import { getAllNotification } from '../controller/notification';

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
        notification: getAllNotification,
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
        sendMessage: sendMessage,
    },
    Subscription: {
        notification: {
            subscribe: withFilter(() => pubsub.asyncIterator(['NOTIFICATION']), (payload: any, variables: any) => {
                if (
                  payload.notification.toUserId === variables.userId &&
                  payload.notification.fromUserId !== variables.userId
                ) {
                  return true;
                }
                return false;
            }),
        }
    }
}

export default [resolvers];
