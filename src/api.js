import axios from 'axios';

const { default: axios } = require('axios');
import Notiflix from 'notiflix';

const apiKey = '33846839-b5c9af3d8a613bdc4bbe809f4';
const URL = `https://pixabay.com/api/?key=${apiKey}`;
const perPage = 40;
const btnLoadMore = document.querySelector('.load-more');

export default class PicturesApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  async getPictures() {
    if (this.searchQuery === '') {
      btnLoadMore.style.display = 'none';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const response = await axios.get(
      `${URL}&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    this.increasePage();
    if (response.data.totalHits === 0) {
      btnLoadMore.style.display = 'none';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (this.page === 2) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images`
      );
      btnLoadMore.style.display = 'block';
      return response.data;
    }
    if (this.page - 1 > response.data.totalHits / perPage) {
      console.log(response.data.totalHits);
      btnLoadMore.style.display = 'none';
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      return response.data;
    } else {
      btnLoadMore.style.display = 'block';
      return response.data;
    }
  }
  resetPage() {
    return (this.page = 1);
  }
  increasePage() {
    return (this.page += 1);
  }
}
