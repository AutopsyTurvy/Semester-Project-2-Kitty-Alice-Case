


// Bid functionality
// place-bid.js


import { load, save } from './login-and-register.js'; 
import { updateNavCredits } from './credit-count.js';  

const API_BASE = "https://v2.api.noroff.dev";  

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

export async function authorizedFetch(url, options = {}) {
    let token = load('Token');
    let apiKey = load('ApiKey');

    token = token.replace(/^"|"$/g, '');

    console.log("Token from localStorage:", token);
    if (token) {
        const decodedToken = parseJwt(token);
        console.log("Decoded Token:", decodedToken);  
    } else {
        console.error("No token found in localStorage. Please log in again.");
        throw new Error("No token found in localStorage.");
    }

    if (!apiKey) {
        apiKey = await createApiKey();
    }

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,  
        'X-Noroff-API-Key': apiKey,
        'Content-Type': 'application/json',
    };

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    };

    const response = await fetch(url, mergedOptions);

    if (response.status === 401) {
        console.error("Unauthorized. Token or API key might be invalid.");
        throw new Error('Unauthorized. Please log in again.');
    }

    return response;
}

async function createApiKey() {
    let token = load('Token');
    
    token = token.replace(/^"|"$/g, '');
    
    console.log("Creating API key with token:", token);

    const response = await fetch(`${API_BASE}/auth/create-api-key`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'My API Key name'
        })
    });

    if (response.status === 201) {
        const data = await response.json();
        console.log("API key created successfully:", data.data.key);
        save('ApiKey', data.data.key);
        return data.data.key;
    } else {
        console.error("Failed to create API key. Response:", response);
        throw new Error('Failed to create API key');
    }
}

export async function fetchUserCredits(username) {
    try {
        const response = await authorizedFetch(`${API_BASE}/auction/profiles/${username}/credits`);
        if (!response.ok) {
            throw new Error(`Failed to fetch credits: ${response.status}`);
        }
        const result = await response.json();
        return result.data.credits;
    } catch (error) {
        console.error("Error fetching credits:", error);
    }
}

export async function placeBid(listingId, bidAmount) {
    try {
        let token = load('Token');
        let apiKey = load('ApiKey');

        token = token.replace(/^"|"$/g, '');

        if (!token) {
            console.error("No token found. Please log in again.");
            throw new Error("No token found, unable to place bid.");
        }

        if (!apiKey) {
            console.log("API key missing, attempting to create one...");
            apiKey = await createApiKey();
        }

        const url = `${API_BASE}/auction/listings/${listingId}/bids`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  
                'X-Noroff-API-Key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: bidAmount }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.errors && errorData.errors[0].message;

            if (errorMessage === "Your bid must be higher than the current highest bid") {
                alert("Your bid must be higher than the current highest bid.");
            } else {
                alert(`Failed to place bid: ${errorMessage || response.statusText}`);
            }

            console.error(`Failed to place bid: ${errorMessage || response.statusText}`);
            throw new Error(`Failed to place bid: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Bid placed successfully:", data);

        const profile = load('Profile');
        const updatedCredits = await fetchUserCredits(profile.name);

        const updatedProfile = {
            ...profile,  
            credits: updatedCredits !== undefined ? updatedCredits : profile.credits  
        };

        console.log("Updated profile after bid:", updatedProfile);

        save('Profile', updatedProfile);
        updateNavCredits();

        return data;
    } catch (error) {
        console.error("Error placing bid:", error);
        throw error;
    }
}


async function handleAuctionEnd(listingId) {
    try {
        const response = await authorizedFetch(`${API_BASE}/auction/listings/${listingId}/bids`);
        if (!response.ok) {
            throw new Error('Failed to fetch bid history');
        }
        const bidHistory = await response.json();

        const highestBid = bidHistory.reduce((max, bid) => (bid.amount > max.amount ? bid : max), bidHistory[0]);

        for (const bid of bidHistory) {
            if (bid.userId !== highestBid.userId) {
                if (bid.userId === load('Profile').id) {
                    alert('You did not win the item, and your credits will be refunded.');
                }
                await refundUser(bid.userId, bid.amount);
            }
        }

        console.log('Auction end handled successfully');
    } catch (error) {
        console.error('Error handling auction end:', error);
    }
}


async function refundUser(userId, amount) {
    try {
        const userProfileResponse = await authorizedFetch(`${API_BASE}/auction/profiles/${userId}`);
        if (!userProfileResponse.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userProfile = await userProfileResponse.json();

        const updatedCredits = userProfile.data.credits + amount;
        userProfile.data.credits = updatedCredits;

        await authorizedFetch(`${API_BASE}/auction/profiles/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credits: updatedCredits })
        });

        console.log(`Refunded ${amount} credits to user ${userId}`);
    } catch (error) {
        console.error('Error refunding credits:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const bidButton = document.querySelector('.bid-button');

    if (!bidButton) {
        console.log('Bid button not found on this page. Skipping bid functionality.');
        return;
    }

    const profile = load('Profile');
    const username = profile.name;

    const userCredits = await fetchUserCredits(username);
    const userCreditsElement = document.querySelector('.user-credits');
    if (userCreditsElement) {
        userCreditsElement.textContent = `Credits: ${userCredits}`;
    }

    if (userCredits <= 0) {
        alert("You do not have enough credits to place a bid.");
        return;
    }

    bidButton.addEventListener('click', async () => {
        const bidInput = document.querySelector('.bid-input');
        const bidAmount = parseInt(bidInput.value, 10);

        const urlParams = new URLSearchParams(window.location.search);
        const listingId = urlParams.get('id');

        if (!isValidUUID(listingId)) {
            alert('Invalid listing ID.');
            return;
        }

        if (isNaN(bidAmount) || bidAmount <= 0) {
            alert('Please enter a valid bid amount.');
            return;
        }

        const currentHighBidElement = document.querySelector('.high-bid-amount');
        const currentHighBid = currentHighBidElement ? parseInt(currentHighBidElement.textContent.replace(/\D/g, '')) : 0;

        console.log(`Bid Amount: ${bidAmount}, Current High Bid: ${currentHighBid}`);

        if (bidAmount <= currentHighBid) {
            alert('Your bid needs to be higher than the current highest bid.');
            return;
        }

        if (bidAmount > userCredits) {
            alert('You do not have enough credits to place this bid.');
            return;
        }

        const newCredits = userCredits - bidAmount;
        profile.credits = newCredits;
        save('Profile', profile);

        if (userCreditsElement) {
            userCreditsElement.textContent = `Credits: ${newCredits}`;
        }

        try {
            const bidResponse = await placeBid(listingId, bidAmount);
            alert('Bid placed successfully!');
            console.log('Bid response:', bidResponse);
            location.reload(); 
        } catch (error) {
            alert('There was an error placing your bid.');
            console.error('Error placing bid:', error);
        }
    });
});

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}
