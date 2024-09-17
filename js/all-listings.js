




//import { ALL_LISTINGS_URL } from './constants.js'; 


//fetch('https://v2.api.noroff.dev/auction/listings')


// all-listings.js


import { ALL_LISTINGS_URL } from './constants.js';

let currentIndex = 0;
const listingsPerPage = 10;
let allListings = [];

fetch(ALL_LISTINGS_URL)
  .then(response => response.json())
  .then(data => {
    allListings = data.data;
    displayListings();

    if (allListings.length > listingsPerPage) {
      document.getElementById("show-more").style.display = "block";
    }
  })
  .catch(error => {
    console.error('Error fetching the API', error);
  });

function displayListings() {
  const container = document.getElementById("image-container");
  const end = Math.min(currentIndex + listingsPerPage, allListings.length);

  for (let i = currentIndex; i < end; i++) {
    const listing = allListings[i];
    const listingContainer = document.createElement("div");
    listingContainer.classList.add("listing-container");

    const title = document.createElement("h2");
    title.textContent = listing.title;
    title.classList.add("listing-title");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("listing-image-container");

    if (listing.media && listing.media.length > 0) {
      const img = document.createElement("img");
      img.src = listing.media[0].url;
      img.alt = listing.media[0].alt || listing.title;
      img.classList.add("listing-image");
      imageContainer.appendChild(img);
    } else {
      const placeholderDiv = document.createElement("div");
      placeholderDiv.classList.add("image-placeholder");
      imageContainer.appendChild(placeholderDiv);
    }

    listingContainer.appendChild(imageContainer);
    listingContainer.appendChild(title);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("listing-button-container");

    const button1 = document.createElement("button");
    button1.textContent = "View";
    button1.classList.add("listing-button");
    button1.addEventListener("click", () => {
      window.location.href = `/pages/listing-details.html?id=${listing.id}`;
    });

    buttonContainer.appendChild(button1);
    listingContainer.appendChild(buttonContainer);

    container.appendChild(listingContainer);
  }

  currentIndex = end;
  toggleButtons();
}

function hideListings() {
  const container = document.getElementById("image-container");

  for (let i = 0; i < listingsPerPage; i++) {
    if (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  }

  currentIndex = Math.max(currentIndex - listingsPerPage, listingsPerPage);
  toggleButtons();
}

function toggleButtons() {
  const showMoreBtn = document.getElementById("show-more");
  const showLessBtn = document.getElementById("show-less");

  if (currentIndex < allListings.length) {
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
  displayListings();
});

document.getElementById("show-less").addEventListener("click", () => {
  hideListings();
});


