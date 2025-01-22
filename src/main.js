import { fetchImages } from './js/pixabay-api';
import { createGalleryMarkup, renderGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;

const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');

const onSearchSubmit = async (event) => {
  event.preventDefault();
  query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
      position: 'topRight',
      backgroundColor: '#FF0000',
    });
    return;
  }

  gallery.innerHTML = '';
  loadMoreBtn.classList.add('hidden');
  page = 1;

  await loadImages();
};

const loadImages = async () => {
  showLoader();

  try {
    const data = await fetchImages(query, page);

    hideLoader();

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
        backgroundColor: '#FF0000',
      });
      return;
    }

    const markup = createGalleryMarkup(data.hits);
    renderGallery(gallery, markup);

    if (data.totalHits > page * 15) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        backgroundColor: '#FF0000',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
      backgroundColor: '#FF0000',
    });
  }
};

const onLoadMore = async () => {
  page += 1;
  await loadImages();

  const cardHeight = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchForm.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

