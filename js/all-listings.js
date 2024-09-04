
fetch('https://v2.api.noroff.dev/auction/listings')
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
      }

      
      listingContainer.appendChild(title);

      
      const container = document.getElementById("image-container");
      container.appendChild(listingContainer);
    });
  })
  .catch(error => {
    console.error('Error fetching the API', error); 
  });

