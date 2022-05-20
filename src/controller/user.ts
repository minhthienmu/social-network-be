import User from "../model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constanst/constanst";

const getUser = (id: string) => {
    return {
            id: "1",
            username: "thientm",
            fullName: "Thiện",
            isDelete: false,
    };
}

const validateUser = async (username: String) => {
    try {
        const user = await User.findOne({username: username});
        if (user) {
            //TODO: handle exist user
            return false;
        } 
        return true;
    } catch (error) {
        //TODO: handle error
        throw new Error("error");
    }
}

const register = async (_: any, arg: any) => {
    const { request } = arg; 
    const validUser = await validateUser(request.username);
    if (validUser) {
        try {
            const user = new User({
                username: request.username,
                password: bcrypt.hashSync(request.password, 8),
                fullName: request.fullName,
                isDeleted: false,
            });
            await user.save();

            return "success";
        } catch (error) {
            //TODO: handle error
            return "error";
        }
    } else {
        //TODO: handle error
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
                return;
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
                },
            }

            return data;
        } else {
           //TODO: handle !passwordIsValid
        }
    } catch (error) {
        //TODO: handle !passwordIsValid
    }
}

export { validateUser, getUser, login, register };