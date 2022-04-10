import User from "../model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const access_token_secret =
  "c7ee923a448307b4d03f86721244f7f7439de25b68f47d59121a05d004495eb48ee5bacf89fd881157bbdc06d7db57dbb2066b0ab059c679969bc843205fb6df";

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
                //TODO: handle !passwordIsValid
                return;
            }
            const token = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN_SECRET || access_token_secret,
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
            //TODO: handle !user
        }
    } catch (error) {
        //TODO: handle error
    }
}

export { validateUser, getUser, login, register };