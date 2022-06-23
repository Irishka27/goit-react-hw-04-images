import axios from 'axios';

const example = axios.create({
  baseURL: 'https://pixabay.com/api/',
  method: 'get', 
  params: {
    key: '24778312-18f63a423fbed9787418fdc16',
    image_type: 'photo',
  },
});

export async function fetchImages(name, page) {
  try {
    const {
      data: {hits},
    } = await example('', {params: {q: name, page }});
    return hits;
  } catch (error) {
    console.error(error);
  }
}



