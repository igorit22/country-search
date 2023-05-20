export function fetchCountries(name) {
  const url = `https://restcountries.com/v3/name/${encodeURIComponent(name)}?fields=name.official,capital,population,flags.svg,languages`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Не вдалося отримати дані про країни');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        return data;
      } else if (data instanceof Object) {
        // Преобразуємо об'єкт у масив об'єктів
        return [data];
      } else {
        return [];
      }
    });
}
