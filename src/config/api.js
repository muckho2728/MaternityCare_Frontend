import axios from "axios";
const baseURl = "https://maternitycare.azurewebsites.net/api/";
// const baseUrl = "http://137.184.153.35:8080";
//
const config = {
  baseURl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseURl;
const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};
const handleError = (error) => {
  console.log(error);
  return;
};
api.interceptors.request.use(handleBefore, handleError);
// api.interceptors.response.use(null, handleError);

export default api;