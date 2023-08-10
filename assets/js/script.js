const url = 'https://moviesdatabase.p.rapidapi.com/titles';
var topRated = "https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250";
var the_Result;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'af06b5a5d2msh06f994de0bb7900p193487jsne9a0d8d839a9',
		'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
	}
};
try {
	fetch(topRated, options)
      .then(function (response) {
        if (!response.ok) {
          return;
        }
        the_Result = response.json();
        console.log(the_Result);
        console.log(the_Result.length);
        return the_Result;
      });
} catch (error) {
	console.error(error);
}

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

const cardsData = [
  { imageSrc: "https://s18.postimg.cc/v0mympf7t/lmf1.jpg", tag: "Action", title: "Batman" },
  { imageSrc: "https://s12.postimg.cc/t0h9q7999/lmf0.jpg", tag: "Western", title: "Lone Ranger" },
  { imageSrc: "https://s13.postimg.cc/h8spyr37b/lmf2.jpg", tag: "Action", title: "Superman" },
  // ... Add more cards data here ...
];

const container = document.querySelector(".container");
cardsData.forEach(data => {
  container.innerHTML += createCard(data.imageSrc, data.tag, data.title);
});