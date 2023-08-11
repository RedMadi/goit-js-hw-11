import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `38767296-1991ecd9b52250ebe585c7bf2`;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.style.display = 'none';

let currentPage = 1;
const perPage = 40; // Number of images per page
let totalHits = 0;

const fetchImages = async searchQuery => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
      },
    });

    totalHits = response.data.totalHits;
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
      loadMoreButton.style.display = 'none';
      return;
    }

    // if (currentPage === 1) {
    //   gallery.innerHTML = '';
    // }

    images.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('photo-card');
      card.innerHTML = `
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      `;
      gallery.appendChild(card);
    });
    if (gallery.children.length >= totalHits) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreButton.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
};

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const searchInput = searchForm.querySelector('input[name="searchQuery"]');
  const searchQuery = searchInput.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }
  currentPage = 1;
  await fetchImages(searchQuery);
});

loadMoreButton.addEventListener('click', async () => {
  currentPage++;

  const searchInput = searchForm.querySelector('input[name="searchQuery"]');
  const searchQuery = searchInput.value;

  if (searchQuery === '') {
    return;
  }

  await fetchImages(searchQuery);
});
