// 1. Імпортуємо бібліотеки 
import { fetchPictures } from './js/fetchPictures';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// 2. Знаходими усі посилання 

const searchForm = document.querySelector('#search-form');
const input = document.querySelector('.input-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

// 3. Початкова сторінка
let pageNumber = 1;
let remainingHits = 0;

// 4. Вішаємо слухачів
searchForm.addEventListener('submit', onSubmit);
buttonLoadMore.addEventListener('click', onClick);
buttonLoadMore.style.display = 'none';

// 5.Функції
function onClick() {
  pageNumber += 1;
  searchPictures();
}

function onSubmit(event) {
  event.preventDefault();
  pageNumber = 1;
  gallery.innerHTML = '';

  searchPictures();
}

// 6. Функція пошуку картинок 
function searchPictures() {
  fetchPictures(input.value, pageNumber)
    .then(photo => {
      console.log(photo);
      creationMarkup(photo.hits, photo.totalHits);
      if (remainingHits > 0 && remainingHits < photo.totalHits) {
        buttonLoadMore.style.display = 'flex';
      } else {
        buttonLoadMore.style.display = 'none';
      }
    })
    .catch(error => console.log(error));
}

//7. Функція створення розмітки
function creationMarkup(hits, totalHits) {
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
            <div class="gallery-list">
                <a class="gallery-list__link" href="${largeImageURL}">
                 <img class="gallery-list__image" src="${webformatURL}" 
                 alt="${tags}" loading="lazy" /></a>
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

  remainingHits = totalHits - pageNumber * 40;

  if (remainingHits <= 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (remainingHits > 0 && remainingHits === totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else if (remainingHits > 0 && pageNumber === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
