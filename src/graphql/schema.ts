import { gql } from "apollo-server-express";

const schema = gql`
    input RegisterRequest {
        email: String!
        username: String!
        password: String!
        fullName: String!
    } 

    input CreatePostRequest {
        userId: ID!
        providerId: ID!
        serviceId: ID!
        image: String!
        description: String!
        rate: Float!
    }

    input LikeRequest {
        postId: ID!
        userId: ID!
        like: Boolean!
    }

    input CommentRequest {
        userId: ID!
        postId: ID!
        description: String!
    }

    input CreateProviderRequest {
        name: String!
        address: String!
        serviceId: String
    }

    input CreateServiceRequest {
        name: String!
    }

    input queryAllPostRequest {
        last: Int!
        currentUserId: String!
        providerId: String
        userId: String
    }

    type LoginResponse {
        token: String
        user: User
    }

    type User {
        id: ID
        username: String
        fullName: String
        email: String
        birthday: String
        avatar: String
        coverImage: String
        phoneNumber: String
    }

    type Likes {
        userId: ID!
        userFullName: String!
    }

    type Comment {
        id: ID!
        userId: ID!
        userFullName: String!
        description: String!
        createdAt: String!
    }

    type Post {
        id: ID
        userId: ID
        userFullName: String
        avatar: String
        providerId: ID
        providerName: String
        serviceId: ID
        serviceName: String
        image: String
        date: String
        rate: Float
        description: String
        numLikes: Int
        numComments: Int
        isLikeByUser: Boolean
    }

    type Provider {
        id: ID
        name: String
        address: String
        serviceRate: [ServiceRate]
    }

    type ServiceRate {
        serviceId: String
        serviceName: String
        sumRating: Float
        totalRating: Int
    }

    type Service {
        id: ID!
        name: String!
    }

    type Search {
        user: [User]
        provider: [Provider]
        post: [Post]
    }

    type Query {
        user(id: ID!): User
        allPost(request: queryAllPostRequest): [Post]
        post(id: ID!): Post
        allProvider(last: Int): [Provider]
        allService: [Service]
        providerInfo(id: ID!): Provider
        commentPost(postId: ID!): [Comment]
        follower(userId: ID!, last: Int): [User]
        following(userId: ID!, last: Int): [User]
        isFollowing(followerId: ID!, followingId: ID!): String
        search(keyword: String!): Search
    }

    type Mutation {
        login(username: String!, password: String!): LoginResponse
        register(request: RegisterRequest): String
        createPost(request: CreatePostRequest): String
        comment(request: CommentRequest): String
        like(request: LikeRequest): String
        createProvider(request: CreateProviderRequest): String
        createService(request: CreateServiceRequest): String
        follow(followerId: ID!, followingId: ID!): String
        unfollow(unfollowerId: ID!, followingId: ID!): String
    }
`;

export default schema;