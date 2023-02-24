import axios from 'axios';
import PicturesApiService from './api';
const picturesApiService = new PicturesApiService();

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
btnLoadMore.style.display = 'none';

form.addEventListener('submit', getSearchedPictures);

function getSearchedPictures(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  picturesApiService.resetPage();
  picturesApiService.searchQuery = e.currentTarget[0].value.trim();
  picturesApiService
    .getPictures()
    .then(({ hits }) => {
      if (hits === undefined) throw new Error();
      return createMarkup(hits);
    })
    .then(markup => insertMarkup(markup))
    .catch(e =>
      console.log(
        'Error: Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

btnLoadMore.addEventListener('click', loadMore);

function loadMore(e) {
  picturesApiService
    .getPictures()
    .then(({ hits, totalHits }) => {
      console.log(totalHits);
      return createMarkup(hits);
    })
    .then(markup => addMarkup(markup));
}

function createMarkup(hits) {
  return hits.reduce(
    (acc, { webformatURL, tags, likes, views, comments, downloads }) => {
      return (acc += `
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`);
    },
    ''
  );
}

function insertMarkup(markup) {
  gallery.innerHTML = `${markup}`;
}

function addMarkup(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}
