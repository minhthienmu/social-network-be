import { gql } from "apollo-server-express";

const schema = gql`
    type LoginResponse {
        token: String!
        user: User
    }

    type User {
        id: ID!
        username: String!
        fullName: String!
        isDelete: Boolean!
    }

    type Query {
        user(id: ID!): [User]
    }

    type Mutation {
        login(username: String!, password: String!): LoginResponse
    }
`;

export default schema;