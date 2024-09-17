




// user-listings.js


import { authorizedFetch } from './place-bid.js';
import { load } from './login-and-register.js';

const API_BASE = "https://v2.api.noroff.dev";

async function fetchUserListings() {
    const profile = load('Profile');
    const username = profile?.name;

    if (!username) {
        console.error("No username found.");
        return;
    }

    try {
        const response = await authorizedFetch(`${API_BASE}/auction/profiles/${username}/listings`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user listings: ${response.status}`);
        }
        const result = await response.json();
        const listings = result.data;
        displayUserListings(listings);
    } catch (error) {
        console.error("Error fetching user listings:", error);
    }
}

function displayUserListings(listings) {
    const container = document.getElementById("user-listings-container");

    container.innerHTML = '';

    listings.forEach(listing => {
        const listingContainer = document.createElement("div");
        listingContainer.classList.add("user-listing-container");

        const title = document.createElement("h2");
        title.textContent = listing.title;
        title.classList.add("user-listing-title");

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("user-listing-image-container");

        if (listing.media && listing.media.length > 0) {
            const img = document.createElement("img");
            img.src = listing.media[0].url;
            img.alt = listing.media[0].alt || listing.title;
            img.classList.add("user-listing-image");
            imageContainer.appendChild(img);
        } else {
            const placeholderDiv = document.createElement("div");
            placeholderDiv.classList.add("user-listing-image-placeholder");
            placeholderDiv.textContent = "No Image Available";
            imageContainer.appendChild(placeholderDiv);
        }

        listingContainer.appendChild(imageContainer);
        listingContainer.appendChild(title);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("user-listing-button-container");

        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("user-listing-button");
        viewButton.addEventListener("click", () => {
            window.location.href = `/pages/listing-details.html?id=${listing.id}`;
        });

        buttonContainer.appendChild(viewButton);
        listingContainer.appendChild(buttonContainer);

        container.appendChild(listingContainer);
    });
}

document.addEventListener("DOMContentLoaded", fetchUserListings);
