import axios from "axios";

const baseURL = "http://localhost:3001";

const service = axios.create({ baseURL: baseURL });

const transactionsAPI = {
  all: () => service.get(`/transactions`),
  find: (id) => service.get(`/transactions/${id}`),
  create: (data) => service.post(`/transactions`, data),
  update: (data) => service.put(`/transactions/${data.id}`, data),
  delete: (id) => service.delete(`/transactions/${id}`),
};

export { transactionsAPI };
