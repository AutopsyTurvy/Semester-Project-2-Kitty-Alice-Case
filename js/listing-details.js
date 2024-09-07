



// listing-details.js


const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get('id'); 

if (listingId) {
    
    const url = `https://v2.api.noroff.dev/auction/listings/${listingId}?_seller=true&_bids=true`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            const listing = result.data;
            console.log(result); 
            document.querySelector('.listing-title').textContent = listing.title;
           
            if (listing.media.length > 0) {
                document.querySelector('.listing-image').src = listing.media[0].url;
                document.querySelector('.listing-image').alt = listing.media[0].alt || listing.title;
            } else {
                document.querySelector('.listing-image').src = '/images/placeholder.jpg';
                document.querySelector('.listing-image').alt = 'No image available';
            }

            document.querySelector('.listing-description').textContent = listing.description || 'No description available.';

            if (listing.tags.length > 0) {
                document.querySelector('.listing-tags').textContent = listing.tags.join(', ');
            } else {
                document.querySelector('.listing-tags').textContent = 'No tags available.';
            }

           



            document.querySelector('.listing-created').textContent = new Date(listing.created).toLocaleString();

            
            document.querySelector('.listing-updated').textContent = new Date(listing.updated).toLocaleString();

            
            document.querySelector('.listing-ends-at').textContent = new Date(listing.endsAt).toLocaleString();

            
            document.querySelector('.listing-bid-count').textContent = listing._count.bids || 0;

            
            


           
            if (listing.seller) {
                const sellerInfo = `Seller: ${listing.seller.name}`;
                document.querySelector('.seller-info').textContent = sellerInfo;
            }

            if (listing.bids && listing.bids.length > 0) {
                const bidsInfo = listing.bids.map(bid => {
                    return `Bid by ${bid.bidder.name}: ${bid.amount} at ${new Date(bid.created).toLocaleString()}`;
                }).join('\n');
                document.querySelector('.bids-info').textContent = bidsInfo;
            } else {
                document.querySelector('.bids-info').textContent = 'No bids available.';
            }
        })
        .catch(error => {
            console.error('There was an error fetching the listing details:', error);
        });
} else {
    document.querySelector('.listing-title').textContent = 'Listing was not found';
    document.querySelector('.listing-description').textContent = 'Oops! An Invalid listing ID.';
}


