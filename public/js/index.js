/* eslint-disable */
import { login } from './login';
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { logout } from './login';
import { updateSettings } from './updateSetting';
import { bookTour } from './stripe';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector(
  '.nav_el--logout'
);
const updateForm = document.querySelector(
  '.form-user-data'
);
const passwordForm = document.querySelector(
  '.form-user-settings'
);
const bookBtn = document.getElementById('book-tour');
//Delication
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password')
      .value;
    login(email, password);
  });
}

if (logOutButton) {
  logOutButton.addEventListener('click', logout);
}

if (updateForm) {
  updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append(
      'name',
      document.getElementById('name').value
    );
    form.append(
      'email',
      document.getElementById('email').value
    );
    form.append(
      'photo',
      document.getElementById('photo').files[0]
    );
    console.log(form);

    updateSettings(form, 'data');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector(
      '.btn--save-password'
    ).textContent = 'UPDATING...';

    const passwordCurrent = document.getElementById(
      'password-current'
    ).value;
    const password = document.getElementById('password')
      .value;
    const passwordConfirm = document.getElementById(
      'password-confirm'
    ).value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector(
      '.btn--save-password'
    ).textContent = 'SAVE PASSWORD';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    passwordConfirm = document.getElementById(
      'password-confirm'
    ).value = '';
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
