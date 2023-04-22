export function fetchCountries(name) {
    const BASE_URL = 'https://restcountries.com/v3.1/name/';
    return fetch(
      `${BASE_URL}${name}?fields=name,capital,flags,population,languages`
    ).then(resp => {
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      return resp.json();
    });
  }