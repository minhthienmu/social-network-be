import { Request } from 'express';
import { getUser, login, register } from "../controller/user";
import { createPost, getAllPost } from "../controller/post";

const resolvers = {
    Query: {
        user: getUser,
        allPost: getAllPost
    },
    Mutation: {
        register: register,
        login: login,
        createPost: createPost,
    }
}

export default [resolvers];
