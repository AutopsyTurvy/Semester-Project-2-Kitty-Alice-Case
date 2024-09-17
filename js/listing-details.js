



// listing-details.js


const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get('id');

if (listingId) {
    const url = `https://v2.api.noroff.dev/auction/listings/${listingId}?_seller=true&_bids=true`;

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

         
            const bidsElement = document.querySelector('.bids-info');
            const bidsContainer = document.querySelector('.bids-info-container');
            const toggleBidHistoryButton = document.querySelector('.toggle-bid-history-button');

            if (bidsElement && bidsContainer && toggleBidHistoryButton) {
                
                if (listing.bids && listing.bids.length > 0) {
                    const bidsInfo = listing.bids.map(bid => {
                        return `Bid by ${bid.bidder.name}: ${bid.amount} at ${new Date(bid.created).toLocaleString()}`;
                    }).join('\n');
                    bidsElement.textContent = bidsInfo;
                } else {
                    bidsElement.textContent = 'No bids available.';
                }

                
                toggleBidHistoryButton.addEventListener('click', () => {
                    if (bidsContainer.style.display === 'none') {
                        bidsContainer.style.display = 'block';
                        toggleBidHistoryButton.textContent = 'Hide Bidding History';
                    } else {
                        bidsContainer.style.display = 'none';
                        toggleBidHistoryButton.textContent = 'Show Bidding History';
                    }
                });
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
