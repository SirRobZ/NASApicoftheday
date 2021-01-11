

//NASA API
const count = 10
const apiKey = 'DEMO_KEY'
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

//Get 10 images from NASA API
async function getNasaApod() {
    try {
        const response = await fetch(apiURL);
        resultsArray = await response.json();
        console.log(resultsArray);
    } catch (error) {
        //catch error here
    }
}

//On Load
getNasaApod();