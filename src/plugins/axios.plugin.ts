import { APP_CONFIG } from "@/configs/app.config";
import axios from "axios";

const http = axios.create({
  baseURL: APP_CONFIG.apiUrl,
});

export { http };
