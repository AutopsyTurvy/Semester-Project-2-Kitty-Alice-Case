








// credits.js


export async function updateUserCredits(username, credits) {
    console.log(`Attempting to update credits for user: ${username} with ${credits} credits.`);  

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`,  
                "X-Noroff-API-Key": load("ApiKey"), 
            },
            body: JSON.stringify({ credits }),  
        });

        if (!response.ok) {
            console.error(`Failed to update credits. Status: ${response.status}`); 
            throw new Error(`Failed to update credits: ${response.status}`);  
        }

        const result = await response.json();
        console.log("Credits updated successfully:", result);  
        return result; 
    } catch (error) {
        console.error("Error updating credits:", error);
        return null; 
    }
}


export async function fetchUserCredits(username) {
    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${username}/credits`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${load("Token")}`,  
                "X-Noroff-API-Key": load("ApiKey"),  
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch credits: ${response.status}`);  
        }

        const result = await response.json();
        console.log("Fetched credits from API:", result.data.credits);
        return result.data.credits;  
    } catch (error) {
        console.error("Error fetching credits:", error);
        return null;  
    }
}

