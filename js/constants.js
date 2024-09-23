





// https://docs.noroff.dev/docs/v2/auction-house/listings#all-listings
// https://v2.api.noroff.dev/


// export const API_BASE = '/api/v2';

export const API_HOST_URL = 'https://v2.api.noroff.dev/';
export const AUCTION_HOUSE = 'auction-house';
export const AUCTION = 'auction';
export const API_LISTINGS_BASE = '/listings';
export const API_PROFILES_BASE = '/profiles';
export const API_ALL_LISTINGS = '#all-listings';
export const BIDS = '/<id>/bids';


// https://v2.api.noroff.dev/auction/listings

export const ALL_LISTINGS_URL = `${API_HOST_URL}${AUCTION}${API_LISTINGS_BASE}`;


// ..................Bids...................

//POST
// /auction/listings/<id>/bids

export const BASE_BID_URL = (id) => `${API_HOST_URL}${AUCTION}${API_LISTINGS_BASE}/${id}/bids`;


// Create Listings:
// /auction/listings

export const CREATE_LISTING = `${API_HOST_URL}${AUCTION}${API_LISTINGS_BASE}`;


// ..................Profiles...................



// /auction/profiles

export const ALL_PROFILES_URL = `${API_HOST_URL}${AUCTION}${API_PROFILES_BASE}`;