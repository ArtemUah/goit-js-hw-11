// import Notiflix from 'notiflix';

// const url = 'https://pixabay.com/api/?';
// const form = document.getElementById('search-form');
// const input = document.querySelector('input');
// const gallery = document.querySelector('.gallery');
// const btnLoadMore = document.querySelector('.load-more');
// let page = 1;
// btnLoadMore.style.display = 'none';

// form.addEventListener('submit', getPicture);
// function getPicture(e) {
//   e.preventDefault();
//   gallery.innerHTML = '';
//   btnLoadMore.style.display = 'none';
//   const apiKey = '33846839-b5c9af3d8a613bdc4bbe809f4';
//   const q = input.value;
//   return fetch(
//     `${url}key=${apiKey}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=8&page=${page}`
//   )
//     .then(response => response.json())
//     .then(({ hits, totalHits }) => {
//       markup(hits);
//       btnLoadMore.style.display = 'block';
//       console.log(totalHits)
//     });
// };

// btnLoadMore.addEventListener('click', loadMore);
// function loadMore(e) {
//   e.preventDefault();
//   page += 1;
//   getPicture(e);
// }

import axios from 'axios';
import PicturesApiService from './api';
const picturesApiService = new PicturesApiService();
const { default: axios } = require('axios');

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
