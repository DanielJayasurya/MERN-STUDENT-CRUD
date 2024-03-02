import axios from 'axios';

const apiController = axios.create({
  baseURL: 'http://localhost:8083',
});

export default apiController;
