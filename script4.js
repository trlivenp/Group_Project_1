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

var selectedGenre = 80; 

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'aed62a6282msh245eac67e8ef1f5p1a61d3jsn48e680928113',
		'X-RapidAPI-Host': 'advanced-movie-search.p.rapidapi.com'
	}
};

for(let k=0; k<10; k++){ //Iterating through the first 10 pages in order to find "horror" movies in english and with a vote average of at least 8.

var url = 'https://advanced-movie-search.p.rapidapi.com/discover/movie/?with_genres='+selectedGenre +'&page='+ k;

fetch(url, options)
.then(function (response) {
  if (!response.ok) { //If the response status is not within the 200s range, then halt the execution of the fetch request
    return;
  }

  var result = response.json();
  console.log(result);
  console.log(response);
  return result;
}).then(function (data){
 
  console.log(data);
  console.log(data.results);
  console.log(data.results.length);

  for(i=0; i<data.results.length; i++){

    if(data.results[i].vote_average >= 8 && data.results[i].original_language =="en"){
    console.log(data.results[i].original_title);
    }
  }
});
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