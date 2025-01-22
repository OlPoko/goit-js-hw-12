
import axios from 'axios';

const API_KEY = '48224339-eb859193739eff8149475b5bf';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page = 1, perPage = 15) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const { data } = await axios.get(BASE_URL, { params });
  return data;
};
