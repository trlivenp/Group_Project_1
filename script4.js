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
          <span class="card-media-tag card-media-tag-${tag}">${tag}</span>
        </div>
        <div class="card-body">
          <button type="btn" class="get-modal card-body-heading" >${title}</button>
          <span><strong> ${rating}</strong> </span>
          <span> ${runtime} </span>
          <p id="summary" class="text-sm font-normal text-gray-500 dark:text-gray-400">${summary}</p> 
      </div>
    `;
  }
  const container = document.querySelector(".container");
 

var genreList = document.getElementById("genre-list");

var selectedGenre; 

var advMovieSearchEndpoint = 'https://advanced-movie-search.p.rapidapi.com/discover/movie/?with_genres=';

genreList.addEventListener("click", function(event){
  
  container.innerHTML = "";

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
  
      if(data.results[i].vote_average >= 7 && data.results[i].original_language =="en"){
      console.log(data.results[i].original_title);

      //data.results[i].original_title; //The variable temporarily stores the title of a movie from the chosen genre.

      console.log(data.results[i].id); //Apparently, it is not the imdb.com id
      
      fetchOmdbInfo(data.results[i].original_title);//For each movie from the selected genre, with a score of at least 8 and originally in english, we are going to gather data using OMDB in order to create a card for it.
      

      }
    }
  });
  }

})

 //Function to handle OMDB fetch request by movie title.

  
 function fetchOmdbInfo(movieTitle){
 
 const omdbAPIKey =  "55778eb2"; //API key to OMDB
 
 var omdbURL, omdbData;
 
 omdbURL = 'https://www.omdbapi.com/?apikey=' + omdbAPIKey + '&t='+ movieTitle + '&type=movie&r=JSON';
 
 
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
   
     
     container.innerHTML += createCard(omdbData.Poster, omdbData.Genre, movieTitle, omdbData.Plot, omdbData.Rated, omdbData.Runtime); //Calling the createCard function in order to create another movie card and add it to the <div> with class "".container"
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
   var selectedTitle; //The user will select the title by clicking on the corresponding movie card.
   //This arrays will be used to temporarily store the data fetched from Streaming Availability, especially while looping through the raw data.
   var movieStreamOpts = [];
   var movieStreamOpt = new Array (5);
   var movieData = new Array(4);
   
   
   // Get the modal
   var modal = document.getElementById("myModal");
   
   // Get the button that opens the modal for each one of the movie cards. The text content of the button is the movie's title.
   var btnCollection = document.getElementsByClassName("get-modal");
   
   console.log(btnCollection);
   
   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];
   
   /* When the user clicks on the button, open the modal, "Hello" is displayed to the console(for testing purposes) and the title is selected*/
  
   for(i=0; i<btnCollection.length; i++){
    btnCollection[i].onclick = function(event) {
      modal.style.display ="block";
      console.log("Hello");
      selectedTitle = event.target.innerHTML;
      console.log(selectedTitle);
      fetchStreamingAvailability(selectedTitle, movieData);
    }
  }
   
   
   // When the user clicks on <span> (x), the modal closes.
   span.onclick = function() {
     modal.style.display = "none";
   }
   
   // When the user clicks anywhere outside of the modal, it will close.
   window.onclick = function(event) {
     if (event.target !== modal) {
       modal.style.display = "none";
     }
   } 
   
   
   function fetchStreamingAvailability(movieTitle, movieData) {
   
   const XRapidAPIKey = 'aed62a6282msh245eac67e8ef1f5p1a61d3jsn48e680928113';
   
   const XRapidAPIHost = "streaming-availability.p.rapidapi.com";
   
   
   
   const streamAvailURL = 'https://streaming-availability.p.rapidapi.com/search/title?title=' + movieTitle+ '&country=us&show_type=movie&output_language=en';;
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
         return;
       }
       var result= response.json();
       console.log(result);
       return result;
     }).then(function (data){
   
       if(!data){
         return;
       }
     
       console.log(data);
       console.log(data.result);
       console.log(data.result.length);
   
         console.log(data.result[0]); //The database offers many similar titles with each search. I decided to go with the first one in the array
   
         
         movieData = [data.result[0].title, data.result[0].year, data.result[0].imdbId, data.result[0].directors];
   
         console.log(movieData);
   
         movieInfo = document.getElementById("movie-title");
         movieInfo.innerHTML = movieData[0] + "   "+ movieData[1] + " dir.: "+ movieData[3];
   
         movieExtInfo = document.getElementById("imdb"); //This element will allow the user to get more info from an external source:IMDB
         movieExtInfo.setAttribute("href", "https://www.imdb.com/title/"+ movieData[2]);
         movieExtInfo.setAttribute("target", "_blank");
         movieExtInfo.textContent = "Go to the IMDB for more info";
   
   
         console.log(data.result[0].genres); //It can be classified in more than one genre; this property is an array whose elements are objects with 2 properties .id(a number) and .name
         
   
         for(let j=0; j<data.result[0].genres.length; j++){//Looping through the genres the movie  is cathegorized in and logging to the console
          
           console.log(data.result[0].genres[j].id);
         }
   
         movieStreamOpts = data.result[0].streamingInfo.us;// This array will store the different streaming options available in the US for the given title
         console.log(movieStreamOpts);
         console.log(movieStreamOpts.length);
   
         for(let k=0; k < movieStreamOpts.length; k++){//Looping through the streaming info.
   
         movieStreamOpt[0] = movieStreamOpts[k].availableSince; //Original date since its been available on the service given as a Unix timestamp;
         movieStreamOpt[1] = movieStreamOpts[k].link; //Link to the title's page on the service's website
         movieStreamOpt[2] = movieStreamOpts[k].quality;//Indicates whether it is in standard, high or ultra-high definition
         movieStreamOpt[3] = movieStreamOpts[k].service;//Name of the streaming service
         movieStreamOpt[4] = movieStreamOpts[k].streamingType;//Indicates whether the service is premium, free, etc.
   
          console.log(movieStreamOpt);
   
         document.getElementById("stream-serv-blocks").innerHTML += createStreamServBlock(movieStreamOpt);// Creates a new block within the modal, displaying the info found on movieStreamOpt for each available service option and appends it to the corresponding <div> within the modal.
   
         movieStreamOpt = []; // empties the array prior to the next loop iteration

         };
           
       });
   
     }

     //This function creates a block for each of the streaming services that offer the movie title that was clicked. The Unix timestamp is converted into a human-readable format using dayjs() and a link to the movie's page on the service's site is provided.
   
     function createStreamServBlock(movieStreamOpt){ 
       return `<li>
                   <a href="${movieStreamOpt[1]}" target ="_blank" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                       <span class="flex-1 ml-3 whitespace-pre"">${String(movieStreamOpt[3]).toUpperCase()}</span>
                       <span class="flex-1 ml-3 whitespace-pre">Availible since: </span>
                       <span class="flex-1 ml-3 whitespace-pre">${dayjs.unix(movieStreamOpt[0])}</span>"
                       <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">${movieStreamOpt[2]}</span>
                       <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">${movieStreamOpt[4]}</span>
                     </a>
               </li>`;
     }
    
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