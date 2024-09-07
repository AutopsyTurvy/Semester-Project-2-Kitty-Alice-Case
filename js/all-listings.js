









//import { ALL_LISTINGS_URL } from './constants.js'; 


//fetch('https://v2.api.noroff.dev/auction/listings')


// all-listings.js


import { ALL_LISTINGS_URL } from './constants.js'; 

fetch(ALL_LISTINGS_URL) 
  .then(response => response.json())
  .then(data => {
    const listings = data.data;

    listings.forEach(listing => {
      
      const listingContainer = document.createElement("div");
      listingContainer.classList.add("listing-container");

      
      const title = document.createElement("h2");
      title.textContent = listing.title;
      title.classList.add("listing-title");

      
      if (listing.media.length > 0) {
        const firstMedia = listing.media[0];
        const img = document.createElement("img");
        img.src = firstMedia.url;
        img.alt = firstMedia.alt || listing.title;
        img.classList.add("listing-image");
        listingContainer.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.classList.add("image-placeholder");
        listingContainer.appendChild(placeholder);
      }

      
      listingContainer.appendChild(title);

      
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      const button1 = document.createElement("button");
      button1.textContent = "View";
      button1.classList.add("listing-button");

      
      button1.addEventListener("click", () => {
        window.location.href = `/pages/listing-details.html?id=${listing.id}`; 
    });

      const button2 = document.createElement("button");
      button2.textContent = "Bid";
      button2.classList.add("listing-button");

      
      buttonContainer.appendChild(button1);
      buttonContainer.appendChild(button2);

      
      listingContainer.appendChild(buttonContainer);

      
      const container = document.getElementById("image-container");
      container.appendChild(listingContainer);
    });
  })
  .catch(error => {
    console.error('Error fetching the API', error); 
  });


