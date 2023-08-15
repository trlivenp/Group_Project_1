/*MoviesDatabase fetch request*/

const moviesDatabaseUrl = 'https://moviesdatabase.p.rapidapi.com/titles';//The endpoint for the moviesdatabase API
var topRated = "https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250";
var the_Result;
const MDoptions = { //Second argument of the fetch request
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'af06b5a5d2msh06f994de0bb7900p193487jsne9a0d8d839a9',
		'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
	}
};
try {  //Try the piece of code below
	fetch(topRated, MDoptions)
      .then(function (response) {
        if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
          return;
        }
        the_Result = response.json();
        // console.log(the_Result);
        return the_Result;
      }).then(function (data){
        if(!data){
          return;
        }
      })
} catch (error) { //If something goes wrong, then do this to alert the user
	console.error(error);
}

/*Streaming Availability fetch request for all available genres*/

const genreUrl ='https://streaming-availability.p.rapidapi.com/genres';
try{
fetch(genreUrl, options)
.then(function (response) {
  if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
    return;
  }

  var result =response.json();
  return result;
}).then(function (data){
  if(!data){
    return;
  }
 

})
} catch (error) { 
console.error(error);
}

/*Streaming Availability fetch request for all available services*/

const serviceUrl ='https://streaming-availability.p.rapidapi.com/services';
try{
fetch(serviceUrl, options)
.then(function (response) {
  if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
    return;
  }

  var result =response.json();
  
  return result;
}).then(function (data){
  if(!data){
    return;
  }
  
})
} catch (error) { //If something goes wrong, then do this to alert the user
console.error(error);
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

var btnArray = document.getElementsByClassName("get-modal");

for (let i = 0; i < btnArray.length; i++) {
  btnArray[i].addEventListener("click", function () {
    openModal(i);
  });
}

function openModal(cardId) {
  modal.style.display = "block";
  
  // Fetch data for the selected movie and update the modal content here
  
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//Declaring the function that will be called in order to display a card for each movie title
function createCard(imageSrc, tag, title, cardId) {
  return `
    <div class="card u-clearfix" data-favorite="false"> 
    <div class="card-media-preview u-flex-center">
  <svg fill="red" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 21.35l-1.45-1.32C5.4 16.36 2 13.04 2 9.5 2 6.42 4.42 4 7.5 4c1.74 0 3.41.81 4.5 2.09C15.09 4.81 16.76 4 18.5 4 21.58 4 24 6.42 24 9.5c0 3.54-3.4 6.86-8.55 10.54L12 21.35z"/>
  </svg>
  </div>
      <div class="card-media">
        <img src="${imageSrc}" alt="${title}-poster" class="card-media-img" />
        <div class="card-media-preview u-flex-center favorite-button" data-card-id="${cardId}">
          <!-- Add your favorite button icon here -->
        </div>
        <span class="card-media-tag card-media-tag-${tag.toLowerCase()}">${tag}</span>
      </div>
      <div class="card-body">
        <button type="button" class="get-modal card-body-heading" data-card-id="${cardId}">${title}</button>
        <!-- ... Other card body elements ... -->
      </div>
    </div>
  `;
}

cardsData.forEach((data, index) => {
  container.innerHTML += createCard(data.imageSrc, data.tag, data.title, index);
});

// Function to render the movie cards
function renderMovieCards() {
  container.innerHTML = "";
  cardsData.forEach((data, index) => {
    container.innerHTML += createCard(data.imageSrc, data.tag, data.title, index);
  });
}

// Function to toggle the favorite status and update local storage
function toggleFavorite(cardId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.indexOf(cardId);
  if (index === -1) {
    favorites.push(cardId);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update the favorite button styling
  const favoriteButton = document.querySelector(`[data-card-id="${cardId}"] .card-media-preview`);
  const isFavorite = favorites.includes(cardId);
  if (isFavorite) {
    favoriteButton.classList.add("favorite");
  } else {
    favoriteButton.classList.remove("favorite");
  }
}

// Event listener for favorite button clicks
container.addEventListener("click", function (event) {
  const favoriteButton = event.target.closest(".card-media-preview");
  if (favoriteButton) {
    const cardId = favoriteButton.getAttribute("data-card-id");
    toggleFavorite(cardId);
  }
});

// Render the movie cards and update favorite button styling
renderMovieCards();
cardsData.forEach((_, index) => {
  updateFavoriteButton(index);
});



