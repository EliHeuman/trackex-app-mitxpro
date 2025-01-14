import axios from "axios";

const baseURL = "http://localhost:3001";

const service = axios.create({ baseURL: baseURL });

const authAPI = {
  login: (values) => service.post("/login", values),
};

export { authAPI };
