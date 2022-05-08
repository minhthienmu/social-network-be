import { getUser, login, register } from "../controller/user";
import { createPost, getAllPost, getPost, commentPost, likePost } from "../controller/post";
import { createProvider, getAllProvider, isUserOrProvider, getProviderInfo } from '../controller/provider';
import { createService, getAllService } from '../controller/service';

const resolvers = {
    Query: {
        user: getUser,
        allPost: getAllPost,
        post: getPost,
        allProvider: getAllProvider,
        allService: getAllService,
        isUserOrProvider: isUserOrProvider,
        providerInfo: getProviderInfo,
    },
    Mutation: {
        register: register,
        login: login,
        createPost: createPost,
        comment: commentPost,
        like: likePost,
        createProvider: createProvider,
        createService: createService,
    }
}

export default [resolvers];
