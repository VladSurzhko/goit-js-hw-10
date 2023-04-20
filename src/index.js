import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li class="country-list-item">
          <img class="country-list-item__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
          <p class="country-list-item__name">${country.name.official}</p>
        </li>
      `;
    })
    .join('');

  list.innerHTML = markup;
  
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ flags: { svg }, name: { official }, capital, population, languages }) => { 
      return `
        <div class="country-info__card">
          <img class="country-info__flag" src="${svg}" alt="Flag of ${official}">
          <div class="country-info__details">
            <h2 class="country-info__name">${official}</h2>
            <p><span>Capital:</span> ${capital}</p>
            <p><span>Population:</span> ${population}</p>
            <p><span>Languages:</span> ${languages}</p>
          </div>
        </div>
      `;
    })
    .join('')
  info.innerHTML = markup;
}


search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function onSearch(event) {
  const searchQuery = event.target.value.trim();
  if (searchQuery.length < 1) {
    list.innerHTML = '';
    info.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      } else if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
      } else {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific query!');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, something went wrong!');
    });
}