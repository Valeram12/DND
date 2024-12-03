// import axios from "axios";
//
// export default axios.create({
//   withCredentials: true,
// });
import axios from "axios";

const httpClient = axios.create({
    baseURL: "https://flask-dnd.onrender.com",
});

// Додавання токену в заголовки для кожного запиту
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpClient;
