import { fetchCountries } from './fetchCountries.js';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.getElementById('search-box');
const countryList = document.getElementById('country-list');
const countryInfo = document.getElementById('country-info');

searchBox.addEventListener('input', _debounce(searchCountries, 300));

async function searchCountries() {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === '') {
    clearResults();
    return;
  }

  try {
    const countries = await fetchCountries(searchTerm);

    if (countries.length > 10) {
      showNotification('Too many matches found. Please enter a more specific name.');
      clearResults();
    } else if (countries.length >= 2 && countries.length <= 10) {
      displayCountryList(countries);
      clearCountryInfo();
    } else if (countries.length === 1) {
      displayCountryInfo(countries[0]);
      clearCountryList();
    } else {
      showNotification('No countries found.');
      clearResults();
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    showNotification('Failed to fetch countries. Please try again later.');
    clearResults();
  }
}

function clearResults() {
  clearCountryList();
  clearCountryInfo();
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

function showNotification(message) {
  Notiflix.Notify.info(message);
}

function displayCountryList(countries) {
  clearCountryList();

  countries.forEach(country => {
    const listItem = document.createElement('li');
    listItem.classList.add('country-list-item');

    const flagUrl = country.flags?.svg;

    listItem.innerHTML = `
      <img src="${country.flag}" alt="${country.name}" class="country-flag">
      <span class="country-name">${country.name?.official || ''}</span>
    `;
    countryList.appendChild(listItem);
  });

  countryInfo.textContent = '';
}

function displayCountryInfo(country) {
  clearCountryInfo();

  const countryCard = document.createElement('div');
  countryCard.classList.add('country-card');

  const flagUrl = country.flags?.svg || '';
  
  let languages = 'N/A';
  if (Array.isArray(country.languages) && country.languages.length > 0) {
    const languageNames = country.languages
      .filter(language => language.name)
      .map(language => language.name);
    if (languageNames.length > 0) {
      languages = languageNames.join(', ');
    }
  }

  countryCard.innerHTML = `
    <img class="country-flag" src="${flagUrl}" alt="${country.name}">
    <h2 class="country-name">${country.name?.official || ''}</h2>
    <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
    <p><strong>Population:</strong> ${country.population || 'N/A'}</p>
    <p><strong>Languages:</strong> ${languages}</p>
  `;

  countryInfo.appendChild(countryCard);
}

