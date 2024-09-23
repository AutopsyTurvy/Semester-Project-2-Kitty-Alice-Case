










// unregistered-listing-details.js


document.addEventListener('DOMContentLoaded', () => {
    

    const API_BASE = "https://v2.api.noroff.dev"; 

    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');

    if (listingId) {
        const url = `${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`;  

        fetch(url)
            .then(response => response.json())
            .then(result => {
                const listing = result.data;

              
                const titleElement = document.querySelector('.listing-title');
                if (titleElement) {
                    titleElement.textContent = listing.title;
                }

               
                const imgElement = document.querySelector('.listing-image');
                const imageContainer = document.querySelector('.listing-image-container');

                if (imageContainer) {
                    const existingPlaceholder = imageContainer.querySelector('.image-placeholder');
                    if (existingPlaceholder) {
                        existingPlaceholder.remove();
                    }

                    if (listing.media && listing.media.length > 0) {
                        if (imgElement) {
                            imgElement.src = listing.media[0].url;
                            imgElement.alt = listing.media[0].alt || listing.title;
                            imgElement.style.display = 'block';
                        }
                    } else {
                        if (imgElement) {
                            imgElement.style.display = 'none';
                        }

                        const placeholderDiv = document.createElement('div');
                        placeholderDiv.classList.add('image-placeholder');
                        imageContainer.appendChild(placeholderDiv);
                    }
                }

          
                const descriptionElement = document.querySelector('.listing-description');
                if (descriptionElement) {
                    descriptionElement.textContent = listing.description || 'No description available.';
                }

           
                const endsAtElement = document.querySelector('.listing-ends-at');
                if (endsAtElement) {
                    const endsAt = new Date(listing.endsAt).getTime();

                    const countdownTimer = setInterval(() => {
                        const now = new Date().getTime();
                        const timeRemaining = endsAt - now;

                        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                        if (timeRemaining > 0) {
                            endsAtElement.textContent = `Time Remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
                        } else {
                            clearInterval(countdownTimer);
                            endsAtElement.textContent = "Auction has ended!";
                        }
                    }, 1000);
                }

                
                const bidForm = document.querySelector('.bid-form');
                const bidHistoryButton = document.querySelector('.toggle-bid-history-button');
                const bidsContainer = document.querySelector('.bids-info-container');

                if (bidForm) bidForm.style.display = 'none';
                if (bidHistoryButton) bidHistoryButton.style.display = 'none';
                if (bidsContainer) bidsContainer.style.display = 'none';

                
                const deleteButtonContainer = document.querySelector('.delete-listing-container');
                if (deleteButtonContainer) {
                    deleteButtonContainer.style.display = 'none';
                }

            })
            .catch(error => {
                console.error('There was an error fetching the listing details:', error);
            });
    } else {
        const titleElement = document.querySelector('.listing-title');
        const descriptionElement = document.querySelector('.listing-description');

        if (titleElement) {
            titleElement.textContent = 'Listing was not found';
        }

        if (descriptionElement) {
            descriptionElement.textContent = 'Oops! An invalid listing ID.';
        }
    }

});

