




// all-profiles.js

import { ALL_PROFILES_URL } from './constants.js';
import { load } from './login-and-register.js'; 

const schoolDefaultImageUrl = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";

async function fetchAllProfiles() {
    const accessToken = load('Token');  
    const apiKey = load('ApiKey');    

    if (!accessToken || !apiKey) {
        console.error('Missing access token or API key');
        return;
    }

    try {
        const response = await fetch(ALL_PROFILES_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Noroff-API-Key': apiKey,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayProfiles(data.data); 
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch profiles:', errorData);
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }
}

function displayProfiles(profiles) {
    const profilesContainer = document.getElementById('profiles-container'); 
    profilesContainer.innerHTML = ''; 

    profiles.forEach(profile => {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile-container'); 

        const profileAvatar = document.createElement('img');
        
        if (!profile.avatar?.url || profile.avatar.url === schoolDefaultImageUrl) {
            profileAvatar.src = '/images/default-avatar.jpg';
        } else {
            profileAvatar.src = profile.avatar.url;
        }
        
        profileAvatar.alt = profile.avatar?.alt || 'Profile Avatar';
        profileAvatar.classList.add('profile-avatar'); 

        profileAvatar.onerror = function() {
            profileAvatar.src = '/images/default-avatar.jpg'; 
        };

        const profileName = document.createElement('h2');
        profileName.textContent = profile.name;
        profileName.classList.add('profile-name');  

        const viewProfileButton = document.createElement('button');
        viewProfileButton.textContent = "View";
        viewProfileButton.classList.add('profile-button'); 
        viewProfileButton.addEventListener('click', () => {
            window.location.href = `/pages/other-user-profile-details.html?name=${profile.name}`;
        });

        profileDiv.appendChild(profileAvatar);
        profileDiv.appendChild(profileName);
        profileDiv.appendChild(viewProfileButton);

        profilesContainer.appendChild(profileDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAllProfiles();
});
