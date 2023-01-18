import { createPictureElement } from './picture.js';
import { filterPictures } from './filters.js';
import { activateForm } from './form.js';
import { getPictures } from './backend.js';
import { debounce } from './debounce.js';

const imageFilters = document.querySelector('.img-filters');
const filtersCollection = imageFilters.querySelectorAll('.img-filters__button');
let serverData = [];
let filterType;

const filterClickHandler = (evt) => {
  filtersCollection.forEach((element) => {
    element.classList.remove('img-filters__button--active');
  });
  evt.target.classList.add('img-filters__button--active');
  filterType = evt.target.id;
  updatePicturesWithDebounce();
};

const showFilters = () => {
  imageFilters.classList.remove('img-filters--inactive');
};

const activateFilters = () => {
  filtersCollection.forEach((element) => {
    element.addEventListener('click', filterClickHandler);
  });
  showFilters();
};

const renderPictures = (data) => {
  const picturesListElement = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();
  data.forEach((element) => {
    fragment.appendChild(createPictureElement(element));
  });

  picturesListElement.appendChild(fragment);
};

const removePictures = () => {
  document.querySelectorAll('.picture').forEach((element) => element.remove());
};

const updatePictures = () => {
  const filteredPictures = filterPictures(filterType, serverData);
  removePictures();
  renderPictures(filteredPictures);
};

const updatePicturesWithDebounce = debounce(updatePictures);

const successHandler = (data) => {
  serverData = data;
  renderPictures(data);
  activateFilters();
};

const errorHandler = (errorMessage) => {
  const errorContainerElement = document.createElement('div');
  errorContainerElement.style = `
    z-index: 100;
    margin: 0 auto;
    padding: 10px;
    text-align: center;
    background-color: red;
    position: absolute;
    left: 0;
    right: 0;
    font-size: 30px;
    `;
  errorContainerElement.textContent = errorMessage;
  document.body.insertAdjacentElement('afterbegin', errorContainerElement);
};

getPictures(successHandler, errorHandler);

const uploadFileInput = document.querySelector('#upload-file');

const uploadFileInputClickHandler = () => {
  activateForm();
};

uploadFileInput.addEventListener('change', uploadFileInputClickHandler);
