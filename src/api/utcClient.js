import axios from "axios";

export const utc = axios.create({
  baseURL: "http://localhost:3000"
});
