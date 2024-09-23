






// unregistered-user-listings.js


import { ALL_LISTINGS_URL } from './constants.js';

let currentIndex = 0;
const listingsPerPage = 10;
let allListings = [];
let filteredListings = [];
let showActiveOnly = false;

function filterListings(allListings, showActiveOnly) {
    const currentTime = new Date().getTime();

    return showActiveOnly
        ? allListings.filter(listing => {
            const timeRemaining = new Date(listing.endsAt).getTime() - currentTime;
            return timeRemaining > 0; 
        })
        : allListings;
}

fetch(ALL_LISTINGS_URL)
    .then(response => response.json())
    .then(data => {
        console.log('API Response for All Listings:', data); 
        allListings = data.data || data; 
        filteredListings = allListings; 
        displayUnregisteredListings();

        if (allListings.length > listingsPerPage) {
            document.getElementById("show-more").style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error fetching the API', error);
    });


document.getElementById("unregistered-toggle-active-listings").addEventListener("click", () => {
    showActiveOnly = !showActiveOnly; 
    filteredListings = filterListings(allListings, showActiveOnly); 
    clearListings();
    displayUnregisteredListings();
    
    
    if (!showActiveOnly) {
        window.location.reload();
    }

    document.getElementById("unregistered-toggle-active-listings").textContent = showActiveOnly ? "Show All Listings" : "Show Active Listings";
});


document.getElementById('unregistered-searchButton').addEventListener('click', (event) => {
    event.preventDefault();
    handleSearch();
});

document.getElementById('unregistered-search').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});

document.getElementById('unregistered-search').addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    handleSearch(searchTerm);
});

function handleSearch(searchQuery) {
    searchQuery = searchQuery || document.getElementById('unregistered-search').value.trim();
    console.log('Search query:', searchQuery);

    if (searchQuery) {
        searchListings(searchQuery); 
    } else {
        filteredListings = filterListings(allListings, showActiveOnly); 
        clearListings();
        displayUnregisteredListings();
        toggleButtons();
    }
}

function searchListings(query) {
    console.log('Search Query:', query);

    filteredListings = allListings.filter(listing => {
        console.log('Evaluating Listing:', listing.title);

        const titleMatch = listing.title && listing.title.toLowerCase().includes(query.toLowerCase());
        const tagsMatch = listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

        console.log(`Title: ${listing.title}, Title Match: ${titleMatch}, Tags Match: ${tagsMatch}`);

        return titleMatch || tagsMatch;
    });

    console.log('Filtered Listings After Search (by Title or Tags):', filteredListings);

    clearListings();
    displayUnregisteredListings();
    toggleButtons();
}

function displayUnregisteredListings() {
    const container = document.getElementById("unregistered-image-container");
    const end = Math.min(currentIndex + listingsPerPage, filteredListings.length);

    for (let i = currentIndex; i < end; i++) {
        const listing = filteredListings[i];
        if (!listing) continue;

        const listingContainer = document.createElement("div");
        listingContainer.classList.add("unregistered-listing-container");

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("unregistered-listing-image-container");

        if (listing.media && listing.media.length > 0) {
            const img = document.createElement("img");
            img.src = listing.media[0].url;
            img.alt = listing.media[0].alt || listing.title;
            img.classList.add("unregistered-listing-image");
            imageContainer.appendChild(img);
        } else {
            const placeholderDiv = document.createElement("div");
            placeholderDiv.classList.add("unregistered-image-placeholder");
            imageContainer.appendChild(placeholderDiv);
        }

        listingContainer.appendChild(imageContainer);

        const title = document.createElement("h2");
        title.textContent = listing.title;
        title.classList.add("unregistered-listing-title");
        listingContainer.appendChild(title);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("unregistered-listing-button-container");

        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("unregistered-listing-button");
        viewButton.addEventListener("click", () => {
            window.location.href = `/pages/unregistered-listing-detail.html?id=${listing.id}`;
        });

        buttonContainer.appendChild(viewButton);
        listingContainer.appendChild(buttonContainer);

        container.appendChild(listingContainer);
    }

    currentIndex = end;
    toggleButtons();
}

function clearListings() {
    const container = document.getElementById("unregistered-image-container");
    container.innerHTML = '';
    console.log('Listings cleared for Unregistered Users');
}

function toggleButtons() {
    const showMoreBtn = document.getElementById("show-more");
    const showLessBtn = document.getElementById("show-less");

    if (currentIndex < filteredListings.length) {
        showMoreBtn.style.display = "block";
    } else {
        showMoreBtn.style.display = "none";
    }

    if (currentIndex > listingsPerPage) {
        showLessBtn.style.display = "block";
    } else {
        showLessBtn.style.display = "none";
    }
}

document.getElementById("show-more").addEventListener("click", () => {
    displayUnregisteredListings(); 
});

document.getElementById("show-less").addEventListener("click", () => {
    hideListings();
});

function hideListings() {
    const container = document.getElementById("unregistered-image-container");

    for (let i = 0; i < listingsPerPage; i++) {
        if (container.lastChild) {
            container.removeChild(container.lastChild);
        }
    }

    currentIndex = Math.max(currentIndex - listingsPerPage, listingsPerPage);
    toggleButtons();
}

document.addEventListener('DOMContentLoaded', fetchListings);
