import axios from 'axios';

import { Settings } from '../models';

const apiClient = axios.create();

export function updateAPISettings({ token, url }: Partial<Settings>) {
  if (url) {
    if (url.includes("localhost"))
      apiClient.defaults.baseURL = url.replace("localhost", "127.0.0.1");
    else
      apiClient.defaults.baseURL = url;
  }
  if (token) apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export default apiClient;
