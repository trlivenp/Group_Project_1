/*In this experiment I am trying to filter the results by genre (initially choosing "horror" id=80) so that only movies that are in english and with a score of at least 8 are shown. There are issues with pagination,
so I decided to iterate through the pages by employing a loop*/
//Declaring the function that will be called in order to display a card for each movie title
function createCard(imageSrc, tag, title, summary, rating, runtime) {
    return `
      <div class="card u-clearfix">
        <div class="card-media">
          <img src="${imageSrc}" alt="${title}-poster" class="card-media-img" />
          <div class="card-media-preview u-flex-center">
            <svg fill="#ffffff" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </div>
          <span class="card-media-tag card-media-tag-${tag.toLowerCase()}">${tag}</span>
        </div>
        <div class="card-body">
          <button type="btn" class="get-modal card-body-heading" >${title}</button>
          <span><strong> ${rating}</strong> </span>
          <span> ${runtime} </span>
          <p id="summary" class="text-sm font-normal text-gray-500 dark:text-gray-400">${summary}</p> 
      </div>
    `;
  }
  
  
  var cardsData = [ //An array whose elements are movie-data objects whose properties we have to gather from the response
    { imageSrc: "https://s18.postimg.cc/v0mympf7t/lmf1.jpg", tag: "Action", title: "Batman", summary:"etc.", rating:"G", runtime: "100 min" }, 
    { imageSrc: "https://s12.postimg.cc/t0h9q7999/lmf0.jpg", tag: "Western", title: "Lone Ranger", summary:"etc.", rating:"G", runtime: "100 min"},
    { imageSrc: "https://s13.postimg.cc/h8spyr37b/lmf2.jpg", tag: "Action", title: "Superman", summary:"etc.", rating:"G", runtime: "100 min" },
    // ... Add more cards data here ...
  ];
  
  const container = document.querySelector(".container");
  //Iterates through the movie-data array; for each "data" object, the createCard function is called and the result is appended to the conatiner as innerHTML
  cardsData.forEach(data => { 
    container.innerHTML += createCard(data.imageSrc, data.tag, data.title, data.summary, data.rating, data.runtime);
  });

var genreList = document.getElementById("genre-list");

var selectedGenre; 

var genreMovie;

var advMovieSearchEndpoint = 'https://advanced-movie-search.p.rapidapi.com/discover/movie/?with_genres=';

genreList.addEventListener("click", function(event){
  var element = event.target;

var genreListItem = element.parentElement;
selectedGenre = genreListItem.className;

searchGenre= advMovieSearchEndpoint + selectedGenre;

const advMovieSearchOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'aed62a6282msh245eac67e8ef1f5p1a61d3jsn48e680928113',
		'X-RapidAPI-Host': 'advanced-movie-search.p.rapidapi.com'
	}
};

var searchURL ;

for(let k=0; k<10; k++){ //Iterating through the first 10 pages in order to find "horror" movies in english and with a vote average of at least 8.

   searchURL = searchGenre +'&page='+ k;
  
  fetch(searchURL, advMovieSearchOptions)
  .then(function (response) {
    if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
      return;
    }
  
    var result = response.json();
    console.log(result);
  
    return result;
  }).then(function (data){
   
    console.log(data); //An object with the following properties: page, results, total_pages, total_results
    console.log(data.results); //An array with 20 elements, each one of them representing a movie (about 20 movies per page)
    console.log(data.results.length);//Outputs "20"
  
    for(i=0; i<data.results.length; i++){
  
      if(data.results[i].vote_average >= 8 && data.results[i].original_language =="en"){
      console.log(data.results[i].original_title);

      genreMovie = data.results[i].original_title; //The variable temporarily stores the title of a movie from the chosen genre.

      console.log(data.results[i].id); //Apparently, it is not the imdb.com id
      
      fetchOmdbInfo(genreMovie);//For each movie from the selected genre, with a score of at least 8 and originally in english, we are going to gather data using OMDB in order to create a card for it.

      }
    }
  });
  }

})

 //Function to handle OMDB fetch request by movie title.

  
 function fetchOmdbInfo(movieTitle){
 
 const omdbAPIKey =  "55778eb2"; //API key to OMDB
 
 var omdbURL, omdbData;
 
 omdbURL = 'https://www.omdbapi.com/?apikey=' + omdbAPIKey + '&t='+ genreMovie + '&type=movie&r=JSON';
 
 
  fetch(omdbURL)
   .then(function (response) {
     if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
       return;
     }
     var result= response.json();
     console.log(result);
     return result;
     }).then(function (omdbData){
 
     console.log(omdbData);
     console.log(omdbData.Plot);
     //oData.Plot;
     console.log(omdbData.Poster)

     //var moviePosterUrl = omdbData.Poster;
   
     
     container.innerHTML += createCard(omdbData.Poster, omdbData.Genre, genreMovie, omdbData.Plot, omdbData.Rated, omdbData.Runtime);
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
 
 
 
 /* This has 
 var selectedTitle;
 var movieStreamOpts = [];
 var movieStreamOpt = new Array (5);
 var movieData = new Array(4);
 
 
 // Get the modal
 var modal = document.getElementById("myModal");
 
 // Get the button that opens the modal
 var btnArray = document.getElementsByClassName("get-modal");
 console.log(btnArray);
 console.log(btnArray.length);
 
 // Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];
 
 // When the user clicks on the button, open the modal

 for(let i=0; i< btnArray.length; i++){
   btnArray[i].addEventListener('click', function() {
     modal.style.display = "block";
   })
 }
 
 
 // When the user clicks on <span> (x), close the modal
 span.onclick = function() {
   modal.style.display = "none";
 }
 
 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
   if (event.target == modal) {
     modal.style.display = "none";
   }
 } */
/* This are all the genres available, but the classification is really bad
{
  "genres": [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
}*/