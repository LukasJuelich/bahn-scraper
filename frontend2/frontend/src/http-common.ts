// import axios, { AxiosInstance } from "axios";

// const client: AxiosInstance = axios.create({
//     // baseURL: process.env.VUE_APP_BACKEND_URL,
//     baseURL: "http://localhost:8080/",
//     headers: {
//         "Content-type": "application/json",
//     },
// });

class Client {
    baseURL = "http://localhost:8080/";
    headers = {
        "Content-type": "application/json",
    }

    constructor(){}

    function get(url: string) {
        
    }
}

export {client};