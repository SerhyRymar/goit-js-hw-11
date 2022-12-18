import axios from 'axios';

export async function fetchPhotos(name, page) {
  const params = new URLSearchParams({
    key: '32160285-f1ddcc5bb333b538ce7462252',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  try {
    const response = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?${params}`,
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
