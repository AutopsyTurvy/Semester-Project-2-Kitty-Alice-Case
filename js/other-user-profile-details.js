










import { load } from './login-and-register/login-and-register.js';
import { ALL_PROFILES_URL } from './constants.js';

const schoolDefaultImageUrl = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";


function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

async function fetchOtherUserProfileDetails(profileName) {
    const accessToken = load('Token');  
    const apiKey = load('ApiKey');    

    if (!accessToken || !apiKey) {
        console.error('Missing access token or API key');
        return;
    }

    try {
        const response = await fetch(`${ALL_PROFILES_URL}/${profileName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Noroff-API-Key': apiKey,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayProfileDetails(data); 
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch profile details:', errorData);
        }
    } catch (error) {
        console.error('Error fetching profile details:', error);
    }
}


function displayProfileDetails(profile) {
    document.getElementById('profile-name').textContent = profile.name || 'N/A';
    document.getElementById('profile-email').textContent = profile.email || 'N/A';

    const avatarElement = document.getElementById('profile-avatar');
    const avatarUrl = (!profile.avatar?.url || profile.avatar.url === schoolDefaultImageUrl)
        ? '/images/default-avatar.jpg'
        : profile.avatar.url;

    avatarElement.src = avatarUrl;
    avatarElement.alt = profile.avatar?.alt || 'Profile Avatar';
    
    avatarElement.onerror = function() {
        avatarElement.src = '/images/default-avatar.jpg'; 
    };

    document.getElementById('profile-credits').textContent = `Credits: ${profile.credits ?? 0}`;
}


document.addEventListener('DOMContentLoaded', () => {
    const profileName = getQueryParameter('name');
    if (profileName) {
        fetchOtherUserProfileDetails(profileName);
    } else {
        console.error('No profile name specified in URL.');
    }
});
