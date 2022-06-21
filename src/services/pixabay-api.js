import axios from 'axios';
const API_KEY = '25390408-53b7bb1c96a9fce8a4b4d95ac';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchImg = (searchQuery, page) => {
  return axios
    .get(
      `?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
    )
    .then(response => response.data.hits);
}


