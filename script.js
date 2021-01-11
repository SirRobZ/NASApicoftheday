const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


//NASA API
const count = 10
const apiKey = 'DEMO_KEY'
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};


//Create DOM nodes
function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        //create card container
        const card = document.createElement('div');
        card.classList.add('card');
        //Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Add to favorite
        const addFav = document.createElement('p');
        addFav.classList.add('clickable');
        if (page === 'results') {
            addFav.textContent = 'Add to Favorites';
        addFav.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            addFav.textContent = 'Remove from Favorites';
        addFav.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        //Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        //footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        //Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, addFav, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

//Update DOM
function updateDOM (page) {
    //Get favorite from local storage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
}

//Get 10 images from NASA API
async function getNasaApod() {
    try {
        const response = await fetch(apiURL);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        //catch error here
    }
}


//Add result to Favorites
function saveFavorite(itemURL) {
    //Loop through results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemURL) && !favorites[itemURL]) {
            favorites[itemURL] = item;
            //Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
        }
        //Set favorites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    });
}

//Remove from Favorites
function removeFavorite(itemURL) {
    if (favorites[itemURL]) {
        delete favorites[itemURL];
        //Set favorites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

//On Load
getNasaApod();