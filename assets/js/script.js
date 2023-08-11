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
        console.log(the_Result);
        return the_Result;
      }).then(function (data){
        if(!data){
          return;
        }
        console.log(data);
        console.log(data.entries);
        console.log(data.next);
        console.log(data.page);
        console.log(data.results);
      })
} catch (error) { //If something goes wrong, then do this to alert the user
	console.error(error);
}
//Declaring the function that will be called in order to display a card for each movie title
function createCard(imageSrc, tag, title) {
  return `
    <div class="card u-clearfix">
      <div class="card-media">
        <img src="${imageSrc}" alt="" class="card-media-img" />
        <div class="card-media-preview u-flex-center">
          <svg fill="#ffffff" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <span class="card-media-tag card-media-tag-${tag.toLowerCase()}">${tag}</span>
      </div>
      <div class="card-body">
        <h2 class="card-body-heading">${title}</h2>
        <!-- ... Other card body elements ... -->
      </div>
    </div>
  `;
}

const cardsData = [ //An array whose elements are movie-data objects whose properties we have to gather from the response
  { imageSrc: "https://s18.postimg.cc/v0mympf7t/lmf1.jpg", tag: "Action", title: "Batman" }, 
  { imageSrc: "https://s12.postimg.cc/t0h9q7999/lmf0.jpg", tag: "Western", title: "Lone Ranger" },
  { imageSrc: "https://s13.postimg.cc/h8spyr37b/lmf2.jpg", tag: "Action", title: "Superman" },
  // ... Add more cards data here ...
];

const container = document.querySelector(".container");
//Iterates through the movie-data array; for each "data" object, the createCard function is called and the result is appended to the conatiner as innerHTML
cardsData.forEach(data => { 
  container.innerHTML += createCard(data.imageSrc, data.tag, data.title);
});

/*OMDB fetch request: by movie title*/

const omdbAPIKey =  "55778eb2"; //API key to OMDB

var sUrl, sMovie, oData;

sMovie = "Citizen Kane";

sUrl = 'https://www.omdbapi.com/?apikey=' + omdbAPIKey +'&t=' + sMovie + '&type=movie&tomatoes=true&r=JSON';


try {	fetch(sUrl)
  .then(function (response) {
    if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
      return;
    }
    var result= response.json();
    console.log(result);
    return result;
	}).then(function (oData){

    console.log(oData.Actors);
    console.log(oData.Country);
    console.log(oData.Director);
    console.log(oData.Genre);
    console.log(oData.Language);
    console.log(oData.Metascore);
    console.log(oData.Rated);
    console.log(oData.Runtime);
    console.log(oData.Title);
    console.log(oData.Writer);
    console.log(oData.Year);
    console.log(oData.imdbID);
    console.log(oData.tomatoMeter);
    console.log(oData.tomatoUserRating);

  })
}catch (error) {
	console.error(error);
}

/*Streaming Availability fetch request for movie title*/

const rapidAPIApp = "default-application_8093471";

const XRapidAPIKey = 'aed62a6282msh245eac67e8ef1f5p1a61d3jsn48e680928113';

const XRapidAPIHost = "streaming-availability.p.rapidapi.com";

var selectedTitle = "Citizen Kane";

const titleUrl = 'https://streaming-availability.p.rapidapi.com/search/title?title=' + selectedTitle + '&country=US&show_type=movie&output_language=en';;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': XRapidAPIKey,
		'X-RapidAPI-Host': XRapidAPIHost 
	}
};


try {	fetch(titleUrl, options)
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
    for(let i=0; i<data.result.length; i++){

      console.log(data.result[i]);

      console.log(data.result[i].directors);

      console.log(data.result[i].genres); //It can be classified in more than one genre; this property is an array whose elements are objects with 2 properties .id(a number) and .name
      
      for(let j=0; j<data.result[i].genres.length; j++){//looping through the genres it is cathegorized in
        console.log(data.result[i].genres[j].name);
        console.log(data.result[i].genres[j].id);
      }
      console.log(data.result[i].imdbId);
      console.log(data.result[i].originalTitle);
      console.log(data.result[i].streamingInfo); 
      console.log(data.result[i].streamingInfo.us);
      console.log(data.result[i].streamingInfo.us.length);
      /* Relative "streamingInfo.us": This property is an array whose elements are objects with the following properties:
      audios(array whose elements are objects with properties "language" and "region"), 
      availableSince(Unix timestamp),
      link (Hypertext link to find it in whatever service it is available), 
      price(object: "amount", "currency", "formatted"), 
      quality(Values include: 'sd', 'hd', 'uhd', etc.), 
      service, 
      streamingType, 
      subtitles(array whose elements are objects with properties: "closedCaptions" (Boolean-valued) and "locale"(object with 'language' and 'region' properties)*/
      for(let k=0; k<data.result[i].streamingInfo.us.length; k++){//looping through the streaming info
      console.log(data.result[i].streamingInfo.us[k].audios);
      console.log(data.result[i].streamingInfo.us[k].availableSince);
      console.log(data.result[i].streamingInfo.us[k].link);
      console.log(data.result[i].streamingInfo.us[k].price);
      console.log(data.result[i].streamingInfo.us[k].quality);
      console.log(data.result[i].streamingInfo.us[k].service);
      console.log(data.result[i].streamingInfo.us[k].streamingType);
      console.log(data.result[i].streamingInfo.us[k].subtitles);
      };
      console.log(data.result[i].title);
      console.log(data.result[i].tmdbId);
      console.log(data.result[i].type);
      console.log(data.result[i].year);

        
    }
  })
}catch (error) {
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
  console.log(result);
  console.log(response);
  return result;
}).then(function (data){
  if(!data){
    return;
  }
  console.log(data);
  console.log(data.result);

})
} catch (error) { //If something goes wrong, then do this to alert the user
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
  console.log(result);
  console.log(response);
  return result;
}).then(function (data){
  if(!data){
    return;
  }
  console.log(data);
  console.log(data.result);
})
} catch (error) { //If something goes wrong, then do this to alert the user
console.error(error);
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
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
}