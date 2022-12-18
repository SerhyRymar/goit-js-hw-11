// 1. Імпортуємо бібліотеки 
import { fetchPhotos } from './js/fetchPictures';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// 2. Знаходими усі посилання 

const searchForm = document.querySelector('#search-form');
const input = document.querySelector('.search-form__input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let remainingHits = 0;

searchForm.addEventListener('submit', search);
loadMoreBtn.addEventListener('click', loadMore);
loadMoreBtn.classList.add('is-not-visible');

function loadMore() {
  page += 1;
  searchPhotos();
}

function search(event) {
  event.preventDefault();
  page = 1;
  gallery.innerHTML = '';

  searchPhotos();
}

function searchPhotos() {
  fetchPhotos(input.value, page)
    .then(photo => {
      console.log(photo);
      renderPhotos(photo.hits, photo.totalHits);
      if (remainingHits > 0 && remainingHits < photo.totalHits) {
        loadMoreBtn.classList.remove('is-not-visible');
      } else {
        loadMoreBtn.classList.add('is-not-visible');
      }
    })
    .catch(error => console.log(error));
}

function renderPhotos(hits, totalHits) {
  console.log(hits);
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
            <div class="gallery__photo-card">
                <a class="gallery-link" href="${largeImageURL}"> <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
             <div class="info">
                <p class="info-item">
                    <b>Likes</b>${likes}
                </p>
                <p class="info-item">
                    <b>Views</b>${views}
                </p>
                <p class="info-item">
                    <b>Comments</b>${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>${downloads}
                </p>
            </div>
        </div>
          `;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  let lightbox;
  lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
  });

  remainingHits = totalHits - page * 40;

  if (remainingHits <= 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (remainingHits > 0 && remainingHits === totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else if (remainingHits > 0 && page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
