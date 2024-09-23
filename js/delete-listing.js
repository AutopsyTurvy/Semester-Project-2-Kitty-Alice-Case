



// Delete listing


import { load } from './login-and-register.js'; 

export async function deleteListing(listingId) {
    const profile = load('Profile');
    const yourAPIToken = load('Token'); 
    const apiKey = load('ApiKey'); 

    if (!yourAPIToken) {
        alert('Authorization token not found. Rectify by logging in again.');
        return;
    }

    if (!apiKey) {
        alert('API key not found. Please log in again.');
        return;
    }

    const confirmation = confirm('Are you sure you want to delete this listing? This action cannot be undone.');

    if (confirmation) {
        try {
            const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${yourAPIToken}`,
                    'X-Noroff-API-Key': apiKey, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Listing deleted successfully!');
                window.location.href = '/pages/home.html'; 
            } else {
                const error = await response.json();
                console.error('Delete failed:', error);
                alert(`Failed to delete listing. Reason: ${error.errors[0].message}`);
            }
        } catch (error) {
            console.error('Error deleting the listing:', error);
            alert('An error occurred while trying to delete the listing.');
        }
    }
}

