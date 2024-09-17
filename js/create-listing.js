




// create-listing.js



import { load } from './login-and-register.js';

const API_BASE = "https://v2.api.noroff.dev";
export const CREATE_LISTING = `${API_BASE}/auction/listings`;

export async function createListing(title, endsAt, description = "", tags = [], media = []) {
    try {
        
        let token = load('Token');
        let apiKey = load('ApiKey');
        
       
        token = token.replace(/^"|"$/g, '');

        
        console.log("Token:", token);
        console.log("API Key:", apiKey);

    
        if (!token || !apiKey) {
            alert("You must be logged in, and an API key is required.");
            throw new Error("No token or API key found.");
        }

       
        const requestBody = {
            title: title,
            endsAt: new Date(endsAt).toISOString(), 
            description: description,
            tags: tags,
            media: media,
        };

    
        const response = await fetch(CREATE_LISTING, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,   
                'X-Noroff-API-Key': apiKey,           
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

     
        if (!response.ok) {
            const errorText = await response.text();
            alert(`Failed to create listing: ${errorText}`);
            throw new Error(`Failed to create listing: ${errorText}`);
        }

        const responseData = await response.json();
        console.log("Listing created successfully:", responseData);

        alert('Listing created successfully!');

       
        const listingId = responseData.data.id;
        window.location.href = `/pages/listing-details.html?id=${listingId}`;

        return responseData;
    } catch (error) {
        console.error("Error creating listing:", error);
    }
}


document.querySelector("#createListingButton").addEventListener("click", async () => {
 
    const title = document.querySelector("#listingTitle").value;
    const endsAt = document.querySelector("#listingEndsAt").value;
    const description = document.querySelector("#listingDescription").value;
    const tags = document.querySelector("#listingTags").value.split(',').map(tag => tag.trim());
    const mediaUrl = document.querySelector("#listingMedia").value;
    const mediaAlt = document.querySelector("#listingMediaAlt").value;

    
    const media = mediaUrl ? [{ url: mediaUrl, alt: mediaAlt }] : [];

    
    await createListing(title, endsAt, description, tags, media);
});
