import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/records",
    headers: {
        "Content-type": "application/json",
    },
});

export {client};