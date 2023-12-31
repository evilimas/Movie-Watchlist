const rootImg = document.getElementById('root-img');
const inputEl = document.getElementById('input-el');
const btn = document.getElementById('btn');
const root = document.getElementById('root');
const noPoster = `./images/no-poster.jpg`;
let movies = [];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

btn.addEventListener('click', function (e) {
  e.preventDefault();
  renderMovies();
});

function renderMovies() {
  rootImg.style.display = 'none';
  root.innerHTML = '';

  const searchValue = inputEl.value.trim();
  // Trim to remove leading/trailing spaces

  if (!searchValue) {
    root.innerHTML =
      '<p class="search-no">Unable to find what you’re looking for. Please try another search.</p>';
    return;
  }

  fetch(
    `https://www.omdbapi.com/?apikey=1b9d87f6&type=movie&s=${inputEl.value}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.Search) {
        root.innerHTML =
          '<p class="search-no">Unable to find what you’re looking for. Please try another search.</p>';
        return;
      }

      // extract the array of promises for movie details
      const movieDetailPromises = data.Search.map((movie) => {
        return fetch(
          `https://www.omdbapi.com/?apikey=1b9d87f6&type=movie&i=${movie.imdbID}`
        ).then((response) => response.json());
      });

      return Promise.all(movieDetailPromises);
    })
    .then((moviesData) => {
      // now movies is an array of all movie details
      movies = moviesData;
      movies.forEach((data, index) => {
        const isMovieInWatchlist = watchlist.some(
          (movie) => movie.imdbID === data.imdbID
        );
        root.innerHTML += `
                    <div class="movie">
                        <div class="img-container">
                            <img src="${
                              data.Poster === 'N/A' ? noPoster : data.Poster
                            }" alt="movie poster image"/>
                        </div>
                        <div class="des-container">
                            <div class="top">
                                <h2>${data.Title}</h2>
                                <img src="images/star.png" alt="star icon"/>
                                <p>${data.imdbRating}</p>
                            </div>
                            <div class="middle">
                                <p>${data.Runtime}</p>
                                <p>${data.Genre}</p>
                                <div class="watchlist-con">
                                    <p class="added">Added</p>
                                    <button class="watchlist-btn" data-imdbid="${
                                      data.imdbID
                                    }"><img src="images/plus.png"/ alt="plus icon to add movie to watchlist"></button>
                                    <p class="watchlist-text">Watchlist</p>
                                </div>
                            </div>
                            <p class="plot">${data.Plot}</p>
                        </div>
                        </div>
                        <div>
                          ${index !== movies.length - 1 ? '<hr/>' : ''}
                        </div>
                    `;
      });

      const watchlistButtons = document.querySelectorAll('.watchlist-btn');
      watchlistButtons.forEach((button) => {
        button.addEventListener('click', addToWatchlist);
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function addToWatchlist(e) {
  const imdbID = e.currentTarget.getAttribute('data-imdbid');

  // check if the movie is already in the watchlist
  const isMovieInWatchlist = watchlist.some((movie) => movie.imdbID === imdbID);

  if (!isMovieInWatchlist) {
    // find the selected movie from the array of all movies
    const movieToAdd = movies.find((movie) => movie.imdbID === imdbID);

    if (movieToAdd) {
      // add movie to the watchlist
      watchlist.push(movieToAdd);

      localStorage.setItem('watchlist', JSON.stringify(watchlist));

      // add "Added" class to the corresponding h6 element
      const addedElement =
        e.currentTarget.parentElement.querySelector('.added');
      if (addedElement) {
        addedElement.style.display = 'block';
        addedElement.innerText = 'Added'; // Update text to "Added"
      }

      // hide the clicked "watchlist-btn" and "watchlist-text" elements
      e.currentTarget.style.display = 'none';
      const watchlistText =
        e.currentTarget.parentElement.querySelector('.watchlist-text');
      if (watchlistText) {
        watchlistText.style.display = 'none';
      }
    }
  } else {
    console.log('Movie is already in the watchlist!');
  }
}
