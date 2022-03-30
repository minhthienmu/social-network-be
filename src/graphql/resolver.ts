import { getUser, login } from "../controller/user";

const resolvers = {
    Query: {
        user: getUser,
    },
    Mutation: {
        login: login,
    }
}

export default [resolvers];
