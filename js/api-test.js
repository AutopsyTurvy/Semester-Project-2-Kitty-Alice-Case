

// API test

fetch('https://v2.api.noroff.dev/auction/listings')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Oh crap ${response.status}`);
    }
    return response.json();  
  })
  .then(data => {
   
    const listings = data.data; 

    listings.forEach(listing => {
      listing.media.forEach(media => {
        const img = document.createElement("img");
        img.src = media.url;
        img.alt = media.alt || listing.title;

        const container = document.getElementById("image-container");
        container.appendChild(img);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching the API', error); 
  });