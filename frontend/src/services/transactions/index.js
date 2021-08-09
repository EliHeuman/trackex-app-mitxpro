import axios from "axios";

const baseURL = "http://localhost:3001";

const token = localStorage.getItem("token");
console.log("access", token);

const service = axios.create({
  baseURL: baseURL,
  headers: { Authorization: `Bearer ${token}` },
});

const transactionsAPI = {
  all: () => service.get(`/transactions`),
  find: (id) => service.get(`/transactions/${id}`),
  create: (data) => service.post(`/transactions`, data),
  update: (data) => service.put(`/transactions/${data.id}`, data),
  delete: (id) => service.delete(`/transactions/${id}`),
};

export { transactionsAPI };
