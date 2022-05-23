import User from "../model/user";
import Follow from "../model/follow";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constanst/constanst";
import { ApolloError } from "apollo-server-core";

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
            follow.save();
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
           //TODO: handle !passwordIsValid
        }
    } catch (error) {
        //TODO: handle !passwordIsValid
        return error;
    }
}

export { validateUser, getUser, login, register };