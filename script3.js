//Updating modals by displaying data fetched from Streaming Availability API; added the dayjs widget in order to convert from Unix timestamp into a human-readable date
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
          <button type="button" class="get-modal card-body-heading" >${title}</button>
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

  var selectedTitle;
  
var movieStreamOpts = [];
var movieStreamOpt = new Array (5);
var movieData = new Array(4);


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btnArray = document.getElementsByClassName("get-modal");

console.log(btnArray);

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal, "Hello" is displayed to the console and the title is selected.
for(i=0; i<btnArray.length; i++){
  btnArray[i].onclick = function(event) {
    modal.style.display ="block";
    console.log("Hello");
    selectedTitle = event.target.innerHTML;
    console.log(selectedTitle);
    fetchStreamingAvailability(selectedTitle, movieData);
  }
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


function fetchStreamingAvailability(selectedTiTle, movieData) {

const XRapidAPIKey = 'aed62a6282msh245eac67e8ef1f5p1a61d3jsn48e680928113';

const XRapidAPIHost = "streaming-availability.p.rapidapi.com";



const titleUrl = 'https://streaming-availability.p.rapidapi.com/search/title?title=' + selectedTitle + '&country=us&show_type=movie&output_language=en';;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': XRapidAPIKey,
		'X-RapidAPI-Host': XRapidAPIHost 
	}
};


fetch(titleUrl, options)
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

      movieExtInfo = document.getElementById("imdb");
      movieExtInfo.setAttribute("href", "https://www.imdb.com/title/"+ movieData[2]);
      movieExtInfo.setAttribute("target", "_blank");
      movieExtInfo.textContent = "Go to the IMDB for more info";


      console.log(data.result[0].genres); //It can be classified in more than one genre; this property is an array whose elements are objects with 2 properties .id(a number) and .name
      

      for(let j=0; j<data.result[0].genres.length; j++){//looping through the genres it is cathegorized in
       // movieGenres.push(data.result[0].genres[j].name);
        console.log(data.result[0].genres[j].id);
      }

      movieStreamOpts = data.result[0].streamingInfo.us;
      console.log(movieStreamOpts);
      console.log(movieStreamOpts.length);

      for(let k=0; k < movieStreamOpts.length; k++){//looping through the streaming info

      movieStreamOpt[0] = movieStreamOpts[k].availableSince;
      movieStreamOpt[1] = movieStreamOpts[k].link;
      movieStreamOpt[2] = movieStreamOpts[k].quality;
      movieStreamOpt[3] = movieStreamOpts[k].service;
      movieStreamOpt[4] = movieStreamOpts[k].streamingType;

       console.log(movieStreamOpt);

      document.getElementById("stream-serv-blocks").innerHTML += createStreamServBlock(movieStreamOpt);

      movieStreamOpt = [];
      };
        
    });

  }

  function createStreamServBlock(movieStreamOpt){
    return `<li>
                <a href="${movieStreamOpt[1]}" target ="_blank" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <span class="flex-1 ml-3 whitespace-pre"">${String(movieStreamOpt[3]).toUpperCase()}</span>
                    <span class="flex-1 ml-3 whitespace-pre">Availible since: </span>
                    <span class="flex-1 ml-3 whitespace-pre">${dayjs.unix(movieStreamOpt[0])}</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">${movieStreamOpt[2]}</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">${movieStreamOpt[4]}</span>
                  </a>
            </li>`;
  }