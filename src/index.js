
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';
import FetchAPI from './fetch-API';

var throttle = require('lodash.throttle');
const fetchAPI = new FetchAPI();
let galleryItem = new SimpleLightbox('.gallery a');

const form = document.querySelector('.search-form');
const searchButton = document.querySelector('.search');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
const loader = document.querySelector('#loader');

form.addEventListener('submit', formSubmitHandler);
form.addEventListener('input', formInputHandler);
// button.addEventListener('click', loadMoreHandler);
button.classList.add('hidden');
loader.classList.add('hidden');

//------------------------------ scroll loading implementation ------------------------

const handleInfiniteScroll = throttle(async () => {
  
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
      fetchAPI.incrementPage();
      const quantity = fetchAPI.incrementQuantity();
      const { data: { hits }} = await fetchAPI.getImage();
      createMarkup(hits);
       
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
          });
        
       
    if (hits.length < 40 || quantity > 500) {      
      removeInfiniteScroll();
      Notify.info("We're sorry, but you've reached the end of search results.");
      return
    }
    }
  }, 2000)

function removeInfiniteScroll() {
  loader.classList.add('hidden'); 
  window.removeEventListener("scroll", handleInfiniteScroll);
  
}

//------------------ button loading implementation ----------------------------------

// async function loadMoreHandler() {
//   fetchAPI.incrementPage();
//   const quantity = fetchAPI.incrementQuantity();
//   const { data: { hits } } = await fetchAPI.getImage();
//     createMarkup(hits);
//   const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
//   window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
//       if (hits.length < 40 || quantity > 500) {
//         button.classList.add('hidden');
//         Notify.info("We're sorry, but you've reached the end of search results.");
//         return
//   }
    
// }


async function formSubmitHandler(event) {
  event.preventDefault();
  removeInfiniteScroll();
  button.classList.add('hidden');
  searchButton.setAttribute('disabled', true);
  
  fetchAPI.resetQuantity();
  fetchAPI.resetPage();
  clearMarkUp();
  fetchAPI.word = event.currentTarget.elements.searchQuery.value;
  if (!fetchAPI.word) {
    clearMarkUp();
    Notify.info('Please enter the word');
    searchButton.removeAttribute('disabled');
    loader.classList.add('hidden');
    return;
  }
  const { data: { hits, totalHits } } = await fetchAPI.getImage();
   if (hits.length === 0) {
     Notify.failure("Sorry, there are no images matching your search query. Please try again.");
     searchButton.removeAttribute('disabled');
     loader.classList.add('hidden');
     return;
  }
  
  Notify.success(`Hooray! We found ${totalHits} images.`);
  createMarkup(hits);
 
  window.addEventListener("scroll", handleInfiniteScroll);
  if (hits.length < 40) {
    button.classList.add('hidden');
    loader.classList.add('hidden'); 
    return
  }

}

function clearMarkUp() {
  gallery.innerHTML = '';
  loader.classList.add('hidden');
}
function formInputHandler(event) {
  if (event.currentTarget.value !== '') searchButton.removeAttribute('disabled');
   
}
function createMarkup(hits) {
 
    const markUp = hits.map((hit) => {
      return `<div class="photo-card">
        <div class="photo">
        <a href="${hit.largeImageURL}">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
  </a>
  </div>
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
  // button.classList.remove('hidden');
  loader.classList.remove('hidden');
  galleryItem.refresh();
}











