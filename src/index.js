const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// const axios = require('axios');
// import './css/styles.css';
const MAIN_HTTP = 'https://pixabay.com/api/?key=31405972-7c23c7be60e1289f27e0f1942';
const form = document.querySelector('.search-form');
form.addEventListener('submit', formSubmitHandler);
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
button.addEventListener('click', loadMoreHandler);
button.classList.add('hidden');
let searchWord = '';
let page = 1;
function formSubmitHandler(event) {
    event.preventDefault();
    const { elements: {
        searchQuery
    } } = event.currentTarget;
  searchWord = searchQuery.value;
  page = 1;
  gallery.innerHTML = '';
  button.classList.add('hidden');
  getImage(searchWord).then(hits => {
    Notify.success(`Hooray! We found ${hits} images.`);
      createMarkup(hits);
           if (hits.length < 40) {
        button.classList.add('hidden');
        Notify.info("We're sorry, but you've reached the end of search results.");
  }
    });
 
}
function loadMoreHandler(event) {
  
  page += 1;
  getImage(searchWord).then(hits => {
      createMarkup(hits);
      if (hits.length < 40) {
        button.classList.add('hidden');
        Notify.info("We're sorry, but you've reached the end of search results.");
  }
    });
}


async function getImage(searchWord) {
  try {
    const response = await axios.get(`${MAIN_HTTP}&q=${searchWord}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    console.log(response.data);
    return response.data.hits;
    
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(hits) {
  if (hits.length === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
    const markUp = hits.map((hit) => {
        return `<div class="photo-card">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${hit.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${hit.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${hit.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${hit.downloads}</b>
    </p>
  </div>
</div>`
    }).join('');
  gallery.insertAdjacentHTML('beforeend', markUp);
   button.classList.remove('hidden');
}