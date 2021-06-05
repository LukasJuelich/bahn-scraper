import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_URL,
    headers: {
        "Content-type": "application/json",
    },
});

export {client};