//Creating a movie card by retrieving data from OMDB API
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
  
  //OMDB fetch request: by movie title
  
  
  var sMovie="Man of Steel";
  
  function fetchOmdbInfo(sMovie){
  
  const omdbAPIKey =  "55778eb2"; //API key to OMDB
  
  var sUrl, oData;
  
  sUrl = 'https://www.omdbapi.com/?apikey=' + omdbAPIKey + '&t='+ sMovie + '&type=movie&r=JSON';
  
  
      fetch(sUrl)
    .then(function (response) {
      if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
        return;
      }
      var result= response.json();
      console.log(result);
      return result;
      }).then(function (oData){
  
      console.log(oData);
      console.log(oData.Plot);
     oData.Plot;
      console.log(oData.Poster)
      var moviePosterUrl = oData.Poster;
    
      
      container.innerHTML += createCard(oData.Poster, oData.Genre, sMovie, oData.Plot, oData.Rated, oData.Runtime);
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
  
  fetchOmdbInfo(sMovie);
  
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
  } 