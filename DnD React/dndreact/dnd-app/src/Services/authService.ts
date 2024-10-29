import httpClient from "../Helpers/httpClient";
import {User} from "../Models/User";

export const setUserToLocalStorage = (user: User | null) => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        localStorage.removeItem("user");
    }
};

export const getUserFromLocalStorage = (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

export const loginUser = async (email: string, password: string) => {
    const resp = await httpClient.post("//localhost:5000/auth/api/login", { email, password });
    const user = resp.data; // передбачається, що респонсе містить інформацію про користувача
    setUserToLocalStorage(user);
    return user;
};

export const registerUser = async (email: string, password: string, username:string) => {
    await httpClient.post("//localhost:5000/auth/api/registration", { email, password, username });
    const resLog = await httpClient.post("//localhost:5000/auth/api/login", { email, password });
    const user = resLog.data;
    setUserToLocalStorage(user);
    return user;
};

export const logoutUser = async () => {
    await httpClient.post("//localhost:5000/auth/api/logout");
    setUserToLocalStorage(null);
};

export const fetchCurrentUser = async () => {
    try {
        if (!getUserFromLocalStorage()){
            return  null;
        }
        const resp = await httpClient.get("//localhost:5000/auth/api/@me");
        const user = resp.data;
        setUserToLocalStorage(user);
        return user;
    } catch (error) {
        console.log("User not authenticated");
        setUserToLocalStorage(null);
        throw error;
    }
};