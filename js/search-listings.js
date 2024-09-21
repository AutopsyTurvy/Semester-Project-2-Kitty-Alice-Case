






// search-listings.js



import { ALL_LISTINGS_URL } from './constants.js';


document.getElementById('searchButton').addEventListener('click', (event) => {
    event.preventDefault();
    const searchQuery = document.getElementById('search').value.trim();

    if (searchQuery) {
        searchListings(searchQuery);
    }
});

function searchListings(query) {
    const searchUrl = `${ALL_LISTINGS_URL}?q=${encodeURIComponent(query)}`; 

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.length > 0) {
                allListings = data.data; 
                clearListings(); 
                displayListings(); 
            } else {
                clearListings(); 
                displayNoResultsMessage(); 
            }
        })
        .catch(error => {
            console.error('Error searching the listings:', error);
        });
}

function clearListings() {
    const container = document.getElementById("image-container");
    container.innerHTML = ''; 
}

function displayNoResultsMessage() {
    const container = document.getElementById("image-container");
    const message = document.createElement("p");
    message.textContent = "No listings found for your search.";
    container.appendChild(message);
}
