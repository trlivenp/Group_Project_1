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
