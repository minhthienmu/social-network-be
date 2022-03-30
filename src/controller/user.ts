const getUser = (id: string) => {
    return [
        {
            id: "1",
            username: "thientm",
            fullName: "Thiện",
            isDelete: false,
        }
    ]
}

const login = (username: string, password: string) => {
    const data = {
        token: "OK",
        user: {
            id: 1,
            username: "thientm",
            fullName: "Thiện",
            isDelete: false,
        },
    }
    return data;
}

export { getUser, login };