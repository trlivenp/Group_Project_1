const container = document.querySelector(".container");

var genreList = document.getElementById("genre-list");

var selectedGenre;

var advMovieSearchEndpoint = 'https://advanced-movie-search.p.rapidapi.com/discover/movie/?with_genres=';

/*By using event-delegation, when a genre from the dropdown menu is selected, a fetch request will be sent to Advanced Movie Search API 
in order to  find titles of high-rated (score == 7 or higher) english language movies that belong to the chosen genre*/

genreList.addEventListener("click", function (event) {

  container.innerHTML = "";

  var element = event.target;

  var genreListItem = element.parentElement;
  selectedGenre = genreListItem.className;


  searchGenre = advMovieSearchEndpoint + selectedGenre;

  const advMovieSearchOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c474a02743mshb4a9aeef3843b0dp1c5eeajsn7330f2e8aae3',
      'X-RapidAPI-Host': 'advanced-movie-search.p.rapidapi.com'
    }
  };

  var searchURL;

  for (let k = 1; k < 2; k++) { //Iterating through the first 10 pages in order to find "horror" movies in english and with a vote average of at least 8.

    searchURL = searchGenre + '&page=' + k;

    fetch(searchURL, advMovieSearchOptions)
      .then(function (response) {
        if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request

          console.log(response.statusText);

          return Promise.reject(response.statusText);

        }

        return response.json();

      }).then(function (advMovieData) {

        //console.log(advMovieData); //An object with the following properties: page, results, total_pages, total_results
        //console.log(advMovieData.results); //An array with 20 elements, each one of them representing a movie (about 20 movies per page)
        //console.log(data.results.length);//Outputs "20"
        if (advMovieData !== undefined) {
          for (let i = 0; i < advMovieData.results.length; i++) {

            if (advMovieData.results[i].vote_average >= 7 && advMovieData.results[i].original_language == "en") {
              //console.log(data.results[i].original_title);

              //data.results[i].original_title; //The variable temporarily stores the title of a movie from the chosen genre.

              //console.log(data.results[i].id); //Apparently, it is not the imdb.com id

              fetchOmdbInfo(advMovieData.results[i].original_title);//For each movie from the selected genre, with a score of at least 8 and originally in english, we are going to gather data using OMDB in order to create a card for it.

            }
          }
        }
      }).catch(function (err) {
        console.log(err);
      });
  }
})

//Function to handle OMDB fetch request by movie title.


function fetchOmdbInfo(movieTitle) {

  const omdbAPIKey = "c049ffc"; //API key to OMDB

  var omdbURL, omdbData;

  omdbURL = 'https://www.omdbapi.com/?apikey=' + omdbAPIKey + '&t=' + movieTitle + '&type=movie&r=JSON';


  fetch(omdbURL)
    .then(function (response) {
      if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request

        console.log(response.statusText)

        return Promise.reject(response.statusText);
      }

      return response.json();
    })
    .then(function (omdbData) {

      console.log(omdbData);

      container.innerHTML += createCard(omdbData.Poster, omdbData.Genre, movieTitle, omdbData.Plot, omdbData.Rated, omdbData.Runtime, omdbData.imdbID); //Calling the createCard function in order to create another movie card and add it to the <div> with class "".container"
      /*All of the data below could be retrieved if we wanted to*/

      //console.log(oData.Actors);
      //console.log(oData.Country);
      //console.log(oData.Director);
      //console.log(oData.Genre);
      //console.log(oData.Language);
      //console.log(oData.Metascore);
      //console.log(oData.Rated);
      //console.log(oData.Runtime);
      //console.log(oData.Title);
      //console.log(oData.Writer);
      //console.log(oData.Year);
      //console.log(oData.imdbID);
      //console.log(oData.tomatoMeter);
      //console.log(oData.tomatoUserRating);

    });

}

//Declaring the function that will be called by the fetchOmdbInfo function in order to create and display a card for each movie title from the chosen genre

function createCard(imageSrc, tag, title, summary, rating, runtime, imdbID) {
  return `
    <div class="card u-clearfix" data-favorite="false" data-card-id="${imdbID}"> 
      <div class="card-media">
        <img src="${imageSrc}" alt="${title}-poster" class="card-media-img" />
        <div class="card-media-preview u-flex-center favorite-button" data-card-id="${imdbID}">
        </svg>
        </div>
        <span class="card-media-tag card-media-tag">${tag}</span>
      </div>
      <div class="card-body">
        <button type="button" class="get-modal card-body-heading" data-card-id="${imdbID}">${title}</button>
        <span><strong>${rating}</strong></span>
        <span>${runtime}</span>
        <p id="summary" class="text-sm font-normal text-gray-500 dark:text-gray-400">${summary}</p>
      </div>
    </div>
  `;
}



// Function to toggle a movie as a favorite
function toggleFavorite(imdbID) {
  console.log('Toggle Favorite:', imdbID);

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.includes(imdbID)) {
    favorites = favorites.filter(id => id !== imdbID);
  } else {
    favorites.push(imdbID);
  };

  localStorage.setItem('favorites', JSON.stringify(favorites));
}


// Function to generate favorite movie cards
function generateFavoriteCards() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  console.log('Generate Favorite Cards:', favorites);

  // Loop through the favorites and create movie cards
  favorites.forEach(imdbID => {
    // Fetch movie details using IMDb ID and create the card
    fetchOmdbInfoById(imdbID);
  });
};

container.addEventListener('click', function (event) {
  // Check if the clicked element has the class "favorite-button"
  if (event.target.classList.contains('favorite-button')) {
    // Handle favorite button click heres
    const imdbID = event.target.getAttribute('data-card-id');
    toggleFavorite(imdbID);

    // Update UI to reflect the change in favorite status
    const isFavorite = JSON.parse(localStorage.getItem('favorites')).includes(imdbID);
    const card = event.target.closest('.card');
    card.dataset.favorite = isFavorite;

    // Toggle the 'favorite' class for the button
    event.target.classList.toggle('favorite', isFavorite);
  }
});

const favoritesToggle = document.querySelector('.favorites-toggle');
const favoritesCheckbox = favoritesToggle.querySelector('.favorites-toggle-checkbox');
const favoritesSwitch = favoritesToggle.querySelector('.favorites-toggle-switch');

// Function to update the display of movies based on favorites toggle
function updateMovieDisplay() {
  const allCards = document.querySelectorAll('.card');
  const isFavoritesOnly = favoritesCheckbox.checked;

  allCards.forEach(card => {
    if (isFavoritesOnly && card.dataset.favorite !== 'true') {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
    }
  });
}

// Event listener for favorites toggle change
favoritesCheckbox.addEventListener('change', () => {
  updateMovieDisplay();
});

// Initially update movie display based on current favorites toggle state
updateMovieDisplay();

var selectedTitle; //The user will select the title by clicking on the corresponding movie card.
//This arrays will be used to temporarily store the data fetched from Streaming Availability, especially while looping through the raw data.
var movieStreamOpts = [];
var movieStreamOpt = new Array(5);
var movieData = new Array(4);

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal for each one of the movie cards. The text content of the button is the movie's title.
var btnCollection = document.getElementsByClassName("get-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var streamOptsList = document.getElementById("stream-serv-blocks");

/*When the user clicks on the button, this function accomplishes the following: the title is selected and passed as an argument to the fetchStreamAvail function,
so that the streaming options available (if any) are retrieved. At the end of the process, the modal with clickable links to the pages from the distinct streaming services 
will be shown.*/

function getModal(event) {
  console.log("hello");
  selectedTitle = event.target.innerHTML;
  console.log(selectedTitle);
  streamOptsList.innerHTML = "";
  fetchStreamAvail(selectedTitle);
}

// When the user clicks on <span> (x), the modal closes.
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, it will close.
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function fetchStreamingAvailability(movieTitle, movieData) {

  const XRapidAPIKey = '51eb24f287msh9f2cb4653c7af8fp11236fjsne4cdc84cdeab';

  const XRapidAPIHost = "streaming-availability.p.rapidapi.com";



  const streamAvailURL = 'https://streaming-availability.p.rapidapi.com/search/title?title=' + movieTitle + '&country=us&show_type=movie&output_language=en';;
  const streamAvailOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': XRapidAPIKey,
      'X-RapidAPI-Host': XRapidAPIHost
    }
  };


  fetch(streamAvailURL, streamAvailOptions)
    .then(function (response) {
      if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request

        console.log(response.statusText);

        return;
      }

      console.log(response.json());

      return;

    }).then(function (data) {

      if (!data) {
        return;
      }

      console.log(data);
      console.log(data.result);
      console.log(data.result.length);

      console.log(data.result[0]); //The database offers many similar titles with each search. I decided to go with the first one in the array

      movieStreamOpts = data.result[0].streamingInfo.us;// This array will store the different streaming options available in the US for the given title

      console.log(movieData);

      movieData = [data.result[0].title, data.result[0].year, data.result[0].imdbId, data.result[0].directors];

      movieInfo = document.getElementById("movie-title");
      movieInfo.innerHTML = movieData[0] + "   " + movieData[1] + " dir.: " + movieData[3];

      movieExtInfo = document.getElementById("imdb"); //This element will allow the user to get more info from an external source:IMDB
      movieExtInfo.setAttribute("href", "https://www.imdb.com/title/" + movieData[2]);
      movieExtInfo.setAttribute("target", "_blank");
      movieExtInfo.textContent = "Go to the IMDB for more info";

      if (!movieStreamOpts) { //If there are no streaming options available, then the modal appears with a message telling so to the user.

        var noOptsEl = document.createElement("li");
        var noOptsPar = document.createElement("p");
        noOptsEl.appendChild(noOptsPar);
        noOptsPar.textContent = "Sorry! There are no streaming options available right now. You can still search for more info about the selected title by clicking on the above link."
        streamOptsList.appendChild(noOptsEl);
        modal.style.display = "block";

      };

      for (let k = 0; k < movieStreamOpts.length; k++) {//Looping through the streaming info.

        movieStreamOpt[0] = movieStreamOpts[k].availableSince; //Original date since its been available on the service given as a Unix timestamp;
        movieStreamOpt[1] = movieStreamOpts[k].link; //Link to the title's page on the service's website
        movieStreamOpt[2] = movieStreamOpts[k].quality;//Indicates whether it is in standard, high or ultra-high definition
        movieStreamOpt[3] = movieStreamOpts[k].service;//Name of the streaming service
        movieStreamOpt[4] = movieStreamOpts[k].streamingType;//Indicates whether the service is premium, free, etc.


        streamOptsList.innerHTML += createStreamServBlock(movieStreamOpt);// Creates a new block within the modal, displaying the info found on movieStreamOpt for each available service option and appends it to the corresponding <div> within the modal.

        movieStreamOpt = []; // empties the array prior to the next loop iteration

      };
      modal.style.display = "block";

    });

}

//This function creates a block for each of the streaming services that offer the movie title that was clicked. The Unix timestamp is converted into a human-readable format using dayjs() and a link to the movie's page on the service's site is provided.

function createStreamServBlock(movieStreamOpt) {
  return `<li>
                   <a href="${movieStreamOpt[1]}" target ="_blank" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                       <span class="flex-1 ml-3 whitespace-pre"">${String(movieStreamOpt[3]).toUpperCase()}</span>
                       <span class="flex-1 ml-3 whitespace-pre">Availible since: </span>
                       <span class="flex-1 ml-3 whitespace-pre">${dayjs(dayjs.unix(movieStreamOpt[0])).format("ddd, D MMM, YYYY")}</span>"
                       <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">${movieStreamOpt[2]}</span>
                       <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">${movieStreamOpt[4]}</span>
                     </a>
               </li>`;
};