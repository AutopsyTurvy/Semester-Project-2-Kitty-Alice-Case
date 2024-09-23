






// unregistered-user-listings.js



import { ALL_LISTINGS_URL } from './constants.js';

let currentIndex = 0;
const listingsPerPage = 10;
let allListings = [];
let filteredListings = [];


function fetchListings() {
    fetch(ALL_LISTINGS_URL)
        .then(response => response.json())
        .then(data => {
            console.log('API Response for All Listings:', data);
            allListings = data.data || data;
            filteredListings = allListings;
            displayUnregisteredListings();

            if (allListings.length > listingsPerPage) {
                const showMoreBtn = document.getElementById("show-more");
                if (showMoreBtn) {
                    showMoreBtn.style.display = "block";
                }
            }
        })
        .catch(error => {
            console.error('Error fetching the API', error);
        });
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
            console.log(`Navigating to /pages/unregistered-listing-detail.html?id=${listing.id}`);
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

    if (currentIndex < filteredListings.length && showMoreBtn) {
        showMoreBtn.style.display = "block";
    } else if (showMoreBtn) {
        showMoreBtn.style.display = "none";
    }

    if (currentIndex > listingsPerPage && showLessBtn) {
        showLessBtn.style.display = "block";
    } else if (showLessBtn) {
        showLessBtn.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchListings();

    const showMoreBtn = document.getElementById("show-more");
    const showLessBtn = document.getElementById("show-less");

    if (showMoreBtn) {
        showMoreBtn.addEventListener("click", displayUnregisteredListings);
    }

    if (showLessBtn) {
        showLessBtn.addEventListener("click", hideListings);
    }
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
