import User from "../model/user";
import Follow from "../model/follow";
import Notification from "../model/notification";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constanst/constanst";
import { ApolloError } from "apollo-server-core";

const getAllUser = async (_: any, arg: any) => {
    try {
        const users = await User.find({});
        const res = [];
        for (let user of users) {
            if (user.role === "2") {
                res.push({
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    birthday: user.birthday,
                    phoneNumber: user.phoneNumber,
                });
            }
        }
      
        return res;
    } catch (error) {
        return error;
    }
}

const getUser = async (_: any, arg: any) => {
    const { id } = arg;

    try {
        const user = await User.findById(id);
        return {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            birthday: user.birthday,
            avatar: user.avatar,
            coverImage: user.coverImage,
            phoneNumber: user.phoneNumber,
        }
    } catch (error) {
        return error;
    }
}

const validateUser = async (username: String) => {
    try {
        const user = await User.findOne({username: username});
        if (user) {
            return false;
        } 
        return true;
    } catch (error) {
        throw new Error("error");
    }
}

const register = async (_: any, arg: any) => {
    const { request } = arg; 
    const validUser = await validateUser(request.username);
    if (validUser) {
        try {
            const follow = new Follow({
                follower: [],
                following: [],
            })
            const notification = new Notification({
                notification: [],
            });
            await follow.save();
            await notification.save();
            const user = new User({
                email: request.email,
                username: request.username,
                password: bcrypt.hashSync(request.password, 8),
                fullName: request.fullName,
                birthday: "",
                phoneNumber: "",
                isDeleted: false,
                avatar: "",
                coverImage: "",
                chatRoom: [],
                follow: follow._id,
                notification: notification._id,
                role: "2",
            });
            await user.save();

            return "success";
        } catch (error) {
            return error;
        }
    } else {
        return "failed";
    }
}

const login = async (_: any, arg: any) => { 
    const { username, password } = arg;
    try {
        const user: any = await User.findOne({ username: username });
        if (user) {
            if (user.role !== "2") {
                throw new ApolloError("Invalid User!");
            }

            const passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                throw new ApolloError("Invalid Password!");
            }
            const token = jwt.sign(
                { id: user._id },
                ACCESS_TOKEN_SECRET || "",
                {
                    expiresIn: 86400
                }
            );
            const data = {
                token: token,
                user: {
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                },
            }

            return data;
        } else {
            throw new ApolloError("Invalid User!");
        }
    } catch (error) {
        return error;
    }
}

const loginAdmin = async (_: any, arg: any) => {
    const { username, password } = arg;

    try {
        const user: any = await User.findOne({ username: username });
        
        if (user) {
            if (user.role !== "1") {
                throw new ApolloError("Invalid User!");
            }

            const passwordIsValid = password === user.password;

            if (!passwordIsValid) {
                throw new ApolloError("Invalid Password!");
            }

            return "success";
        } else {
            throw new ApolloError("Invalid User!");
        }
    } catch (error) {
        return error;
    }
};

export { validateUser, getUser, login, register, loginAdmin, getAllUser };