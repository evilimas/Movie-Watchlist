const noPoster = `./images/no-poster.jpg`;
const root = document.getElementById('movies-container');

// Load watchlist from local storage if it exists
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function renderWatchlist() {
  // Checks if washlist array is empty or not and renders div with class empty
  if (watchlist.length === 0) {
    document.getElementById('empty').style.display = 'block';
  } else {
    document.getElementById('empty').style.display = 'none';
  }
  root.innerHTML = '';

  watchlist.forEach((data, index) => {
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
                                    <button id="watchlist-btn" class="watchlist-btn remove-btn" data-imdbid="${
                                      data.imdbID
                                    }"><img src="images/minus.png" alt="minus icon to remove from watchlist"/></button>
                                    <p>Watchlist</p>
                                </div>
                            </div>
                            <p class="plot">${data.Plot}</p>
                        </div>
                    </div>
                    <div>
                    ${index !== watchlist.length - 1 ? '<hr/>' : ''}
                    </div>`;
  });

  // event listeners to the remove buttons
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeFromWatchlist);
  });
}
renderWatchlist();

function removeFromWatchlist(e) {
  const imdbID = e.currentTarget.getAttribute('data-imdbid');

  // Find the index of the movie in the watchlist array
  const index = watchlist.findIndex((movie) => movie.imdbID === imdbID);

  if (index !== -1) {
    // Remove the item from the watchlist array
    watchlist.splice(index, 1);

    // Save the updated watchlist to local storage
    localStorage.setItem('watchlist', JSON.stringify(watchlist));

    // Re-render the watchlist
    renderWatchlist();
  }
}
