






// edit-listing.js


import { load } from './login-and-register.js'; 


async function updateListing(updatedData) {
    const API_BASE = "https://v2.api.noroff.dev";
    const listingId = new URLSearchParams(window.location.search).get('id');
    const url = `${API_BASE}/auction/listings/${listingId}`;
    
    let token = load('Token');
    let apiKey = load('ApiKey');
    token = token.replace(/^"|"$/g, '');  

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to update listing: ${errorText}`);
        throw new Error(`Failed to update listing: ${errorText}`);
    }

    const responseData = await response.json();
    alert('Listing updated successfully!');
    
  
    location.reload();
    return responseData;
}


document.querySelector('.edit-image').addEventListener('click', async () => {
    const imgElement = document.querySelector('.listing-image');
    const currentAltText = imgElement.alt || 'Image for the listing';

    const newImageUrl = prompt("Enter a new image URL:", imgElement.src);
    const newAltText = prompt("Enter a new alt text for the image:", currentAltText);

    if (newImageUrl) {
        try {
            await updateListing({
                media: [{ url: newImageUrl, alt: newAltText }]
            });

            imgElement.src = newImageUrl;
            imgElement.alt = newAltText;

            alert('Image updated successfully!');
        } catch (error) {
            console.error('Failed to update the image:', error);
            alert('Failed to update the image. Please try again.');
        }
    }
});


document.querySelector('.edit-title').addEventListener('click', () => {
    const titleElement = document.querySelector('.listing-title');
    titleElement.setAttribute('contenteditable', true);
    titleElement.focus();

    titleElement.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            titleElement.setAttribute('contenteditable', false);
            const newTitle = titleElement.textContent;
            await updateListing({ title: newTitle });
        }
    });

    titleElement.addEventListener('blur', async () => {
        titleElement.setAttribute('contenteditable', false);
        const newTitle = titleElement.textContent;
        await updateListing({ title: newTitle });
    });
});


document.querySelector('.edit-description').addEventListener('click', () => {
    const descriptionElement = document.querySelector('.listing-description');
    descriptionElement.setAttribute('contenteditable', true);
    descriptionElement.focus();

    descriptionElement.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            descriptionElement.setAttribute('contenteditable', false);
            const newDescription = descriptionElement.textContent;
            await updateListing({ description: newDescription });
        }
    });

    descriptionElement.addEventListener('blur', async () => {
        descriptionElement.setAttribute('contenteditable', false);
        const newDescription = descriptionElement.textContent;
        await updateListing({ description: newDescription });
    });
});
